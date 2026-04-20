import 'dotenv/config';
import { MongoClient, ServerApiVersion } from 'mongodb';
import dns from 'dns';

dns.setServers(['8.8.8.8', '8.8.4.4']);

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

let db;

async function getDb() {
  if (db) return db;
  await client.connect();
  // Name of your core application database
  db = client.db('reelrecruite_db'); 
  return db;
}

/**
 * findDocs mirrors runQuery behavior for NoSQL
 */
export async function findDocs(collectionName, filter = {}) {
  const database = await getDb();
  const collection = database.collection(collectionName);
  const results = await collection.find(filter).toArray();
  return results;
}

/**
 * Generic query function for flexibility
 */
export async function runMongo(callback) {
  const database = await getDb();
  return await callback(database);
}
