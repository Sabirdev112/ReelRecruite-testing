import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import dns from 'dns';

// Force use of Google DNS if local SRV lookup fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find .env in the testing package root
const envPath = path.resolve(__dirname, '../../.env');
if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
} else {
  dotenv.config(); // Fallback to process.cwd()
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not defined in .env file');
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
  socketTimeoutMS: 45000,
});

let db;

async function connectToMongo() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db('reelrecruite_automation');
    return db;
  } catch (err) {
    console.error('[MONGODB-SERVER] Connection failed:', err.message);
    throw err;
  }
}

/**
 * Local storage fallback for screenshots since Supabase is being removed
 */
export async function uploadScreenshot(localPath, fileName) {
  try {
    // Dashboard serves these from its public folder. 
    return `/screenshots/${fileName}`;
  } catch (err) {
    console.error('[STORAGE] Fake upload failed:', err.message);
    return null;
  }
}

async function insertRun(collectionName, runData) {
  const database = await connectToMongo();
  const collection = database.collection(collectionName);
  try {
    const doc = {
      _id: runData.id.toString(),
      run_id: runData.id,
      started_at: runData.startedAt,
      ended_at: runData.endedAt,
      duration: runData.duration,
      summary: runData.summary,
      run_name: runData.name || null,
      created_at: new Date()
    };
    
    await collection.updateOne(
      { _id: doc._id }, 
      { $set: doc }, 
      { upsert: true }
    );

    // Keep only last 200 runs
    const total = await collection.countDocuments();
    if (total > 200) {
      const oldest = await collection.find().sort({ created_at: 1 }).limit(total - 200).toArray();
      await collection.deleteMany({ _id: { $in: oldest.map(d => d._id) } });
    }

    return doc;
  } catch (err) {
    console.error(`[MONGO-SERVER] insertRun fail:`, err.message);
    throw err;
  }
}

export const insertTestRun = (runData) => insertRun('test_runs', runData);
export const insertApiRun = (runData) => insertRun('api_runs', runData);
export const insertLoadRun = (runData) => insertRun('load_runs', runData);

async function insertCase(collectionName, testName, status, result, runId) {
  const database = await connectToMongo();
  const collection = database.collection(collectionName);
  try {
    const doc = {
      test_name: testName,
      status: status,
      result: result,
      run_id: runId.toString(),
      created_at: new Date()
    };
    await collection.insertOne(doc);
    
    // Prune logic
    const total = await collection.countDocuments();
    if (total > 1000) {
      const oldest = await collection.find().sort({ created_at: 1 }).limit(total - 1000).toArray();
      await collection.deleteMany({ _id: { $in: oldest.map(d => d._id) } });
    }
  } catch (err) {
    console.error(`[MONGO-SERVER] insertCase fail:`, err.message);
  }
}

export const insertTestCase = (n, s, r, rid) => insertCase('test_cases', n, s, r, rid);
export const insertApiTestCase = (n, s, r, rid) => insertCase('api_test_cases', n, s, r, rid);
export const insertLoadTestCase = (n, s, r, rid) => insertCase('load_test_cases', n, s, r, rid);

// Read methods mirror dashboard lib/db/index.js for consistency
export async function getRuns(collectionName) {
  const database = await connectToMongo();
  const results = await database.collection(collectionName).find().sort({ created_at: -1 }).limit(200).toArray();
  return results.map(row => ({
    id: row.run_id || row._id,
    startedAt: row.started_at,
    endedAt: row.ended_at,
    duration: parseInt(row.duration, 10) || 0,
    summary: row.summary,
    name: row.run_name
  }));
}

export async function getDetailedReport(runColl, testColl, runId) {
  const database = await connectToMongo();
  const run = await database.collection(runColl).findOne({ _id: runId.toString() });
  if (!run) return null;

  const tests = await database.collection(testColl).find({ run_id: runId.toString() }).sort({ _id: 1 }).toArray();
  
  return {
    id: run.run_id || run._id,
    startedAt: run.started_at,
    endedAt: run.ended_at,
    duration: parseInt(run.duration, 10) || 0,
    summary: run.summary,
    name: run.run_name,
    tests: tests.map(t => ({
      title: t.test_name,
      status: t.status,
      browser: t.result?.browser || 'unknown',
      ...t.result
    }))
  };
}

export const getTestRuns = () => getRuns('test_runs');
export const getRunDetails = (id) => getDetailedReport('test_runs', 'test_cases', id);
export const getLatestTests = () => getLatestSpecimens('test_cases');
async function getLatestSpecimens(collectionName) {
    const database = await connectToMongo();
    const results = await database.collection(collectionName).find().sort({ created_at: -1 }).limit(200).toArray();
    return results.map(row => ({
      id: row._id,
      test_name: row.test_name,
      status: row.status,
      run_id: row.run_id,
      created_at: row.created_at,
      result: row.result
    }));
}
