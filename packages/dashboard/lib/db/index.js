import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

// Force use of Google DNS if local SRV lookup fails
dns.setServers(['8.8.8.8', '8.8.4.4']);

const envPath = fs.existsSync(path.resolve(process.cwd(), '.env')) 
  ? path.resolve(process.cwd(), '.env') 
  : path.resolve(process.cwd(), 'packages/dashboard/.env');

if (fs.existsSync(envPath)) {
  dotenv.config({ path: envPath });
}

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn('[MONGODB] Warning: MONGODB_URI not found in environment.');
}

const client = new MongoClient(uri || '', {
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
    console.log('[MONGODB] Connected successfully');
    return db;
  } catch (err) {
    console.error('[MONGODB] Connection failed:', err.message);
    throw err;
  }
}

// Saves a local file to the dashboard's public folder for local serving
export async function uploadScreenshot(localPath, fileName) {
  try {
    const publicDir = path.join(process.cwd(), 'public', 'screenshots');
    if (!fs.existsSync(publicDir)) {
      fs.mkdirSync(publicDir, { recursive: true });
    }

    const targetPath = path.join(publicDir, fileName);
    fs.copyFileSync(localPath, targetPath);
    
    return `/screenshots/${fileName}`;
  } catch (err) {
    console.error('[LOCAL STORAGE] Save failed:', err.message);
    return null;
  }
}

// Generic run insertion
async function insertRun(collectionName, runData) {
  const database = await connectToMongo();
  const collection = database.collection(collectionName);
  try {
    const doc = {
      _id: runData.id.toString(), // MongoDB _id as string
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

    // Keep only last 100 runs
    const total = await collection.countDocuments();
    if (total > 100) {
      const oldest = await collection.find()
        .sort({ created_at: 1 })
        .limit(total - 100)
        .toArray();
      const idsToDelete = oldest.map(d => d._id);
      await collection.deleteMany({ _id: { $in: idsToDelete } });
    }

    return doc;
  } catch (err) {
    console.error(`[MONGO] insertRun fail for ${collectionName}:`, err.message);
    throw err;
  }
}

export const insertTestRun = (runData) => insertRun('test_runs', runData);
export const insertApiRun = (runData) => insertRun('api_runs', runData);
export const insertLoadRun = (runData) => insertRun('load_runs', runData);

// get runs max 100
export async function getRuns(collectionName) {
  try {
    const database = await connectToMongo();
    const collection = database.collection(collectionName);
    const results = await collection.find()
      .sort({ created_at: -1 })
      .limit(100)
      .toArray();

    return results.map(row => ({
      id: row.run_id || row._id,
      startedAt: row.started_at,
      endedAt: row.ended_at,
      duration: parseInt(row.duration, 10) || 0,
      summary: row.summary,
      name: row.run_name
    }));
  } catch (err) {
    console.error(`[DB] Error fetching ${collectionName}:`, err.message);
    return [];
  }
}

export async function getDetailedReport(runColl, testColl, runId) {
  try {
    const database = await connectToMongo();
    const runCollection = database.collection(runColl);
    const testCollection = database.collection(testColl);

    const run = await runCollection.findOne({ _id: runId.toString() });
    if (!run) return null;

    const tests = await testCollection.find({ run_id: runId.toString() })
      .sort({ _id: 1 })
      .toArray();
    
    return {
      id: run.run_id || run._id,
      startedAt: run.started_at,
      endedAt: run.ended_at,
      duration: parseInt(run.duration, 10) || 0,
      summary: run.summary,
      name: run.run_name,
      tests: tests.map(t => {
        return {
          title: t.test_name,
          status: t.status,
          browser: t.result?.browser || 'unknown',
          ...t.result
        };
      })
    };
  } catch (err) {
    console.error(`[DB] Trace Failure for ${runId}:`, err.message);
    return null;
  }
}

export const getRunDetails = (id) => getDetailedReport('test_runs', 'test_cases', id);
export const getApiRunDetails = (id) => getDetailedReport('api_runs', 'api_test_cases', id);
export const getLoadRunDetails = (id) => getDetailedReport('load_runs', 'load_test_cases', id);

// Test Case Insertion
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
    if (total > 500) { // Keep more tests than runs
       const oldest = await collection.find()
        .sort({ created_at: 1 })
        .limit(total - 500)
        .toArray();
      
      // Cleanup local screenshots if they exist
      const filesToDelete = oldest
        .map(r => r.result?.screenshot ? r.result.screenshot.split('/').pop() : null)
        .filter(Boolean);

      if (filesToDelete.length > 0) {
        const publicDir = path.join(process.cwd(), 'public', 'screenshots');
        filesToDelete.forEach(file => {
          const filePath = path.join(publicDir, file);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        });
      }

      const idsToDelete = oldest.map(d => d._id);
      await collection.deleteMany({ _id: { $in: idsToDelete } });
    }

    return doc;
  } catch (err) {
    console.error(`[MONGO] insertCase fail for ${collectionName}:`, err.message);
    throw err;
  }
}

export const insertTestCase = (n, s, r, rid) => insertCase('test_cases', n, s, r, rid);
export const insertApiTestCase = (n, s, r, rid) => insertCase('api_test_cases', n, s, r, rid);
export const insertLoadTestCase = (n, s, r, rid) => insertCase('load_test_cases', n, s, r, rid);

export async function getLatestSpecimens(collectionName) {
  try {
    const database = await connectToMongo();
    const collection = database.collection(collectionName);
    const results = await collection.find()
      .sort({ created_at: -1 })
      .limit(100)
      .toArray();

    return results.map(row => ({
      id: row._id,
      test_name: row.test_name,
      status: row.status,
      run_id: row.run_id,
      created_at: row.created_at,
      result: row.result,
      browser: row.result?.browser
    }));
  } catch (err) {
    console.error(`[DB] Error fetching ${collectionName}:`, err.message);
    return [];
  }
}

export const getLatestTests = () => getLatestSpecimens('test_cases');
export const getLatestApiTests = () => getLatestSpecimens('api_test_cases');
export const getLatestLoadTests = () => getLatestSpecimens('load_test_cases');
export const getTestRuns = () => getRuns('test_runs');
export const getApiRuns = () => getRuns('api_runs');
export const getLoadRuns = () => getRuns('load_runs');
