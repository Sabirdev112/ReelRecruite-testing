import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

// Try to find .env in various locations
const findEnv = () => {
    const paths = [
        path.resolve(process.cwd(), '.env'),
        path.resolve(process.cwd(), '../../.env'), // From packages/testing
        path.resolve(process.cwd(), '../../../.env'), // From packages/testing/server
    ];
    for (const p of paths) {
        if (fs.existsSync(p)) return p;
    }
    return null;
};

const envPath = findEnv();
if (envPath) {
    dotenv.config({ path: envPath });
} else {
    dotenv.config();
}

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri || '', {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
  connectTimeoutMS: 10000,
});

let db;

async function connectToMongo() {
  if (db) return db;
  try {
    await client.connect();
    db = client.db('reelrecruite_automation');
    return db;
  } catch (err) {
    console.error('[REPORTER-MONGO] Connection failed:', err.message);
    throw err;
  }
}

// Map the old Supabase helper functions to MongoDB
export async function uploadScreenshot(localPath, fileName) {
    // Local storage only now
    try {
        return `/screenshots/${fileName}`;
    } catch (err) {
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
    await collection.updateOne({ _id: doc._id }, { $set: doc }, { upsert: true });
    return doc;
  } catch (err) {
    console.error(`[REPORTER-MONGO] insertRun fail:`, err.message);
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
  } catch (err) {
    console.error(`[REPORTER-MONGO] insertCase fail:`, err.message);
  }
}

export const insertTestCase = (n, s, r, rid) => insertCase('test_cases', n, s, r, rid);
export const insertApiTestCase = (n, s, r, rid) => insertCase('api_test_cases', n, s, r, rid);
export const insertLoadTestCase = (n, s, r, rid) => insertCase('load_test_cases', n, s, r, rid);
