import { MongoClient, ServerApiVersion } from 'mongodb';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';

dotenv.config({ path: path.resolve(process.cwd(), '.env') });

const uri = process.env.MONGODB_URI;

if (!uri) {
  console.error('Error: MONGODB_URI is not defined in .env');
  process.exit(1);
}

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});

async function migrate() {
  try {
    console.log('--- MONGODB INITIALIZATION ---');
        
    await client.connect();
    const db = client.db('reelrecruite_automation');
    
    // In MongoDB, collections are created on first insert. 
    // We'll just list them to confirm connection.
    console.log('Connection successful!');
    
    const collections = [
      'test_runs', 'test_cases', 
      'api_runs', 'api_test_cases', 
      'load_runs', 'load_test_cases'
    ];

    console.log('Ensuring collections are initialized...');
    for (const col of collections) {
      // Just a no-op to ensure they exist
      await db.createCollection(col).catch(() => {
        // Ignore if already exists
      });
      console.log(`  [OK] ${col}`);
    }

    console.log('\nMigration/Initialization finished successfully.');
    console.log('Your MongoDB database "reelrecruite_automation" is ready.');

  } catch (err) {
    console.error('Initialization failed:', err.message);
    process.exitCode = 1;
  } finally {
    await client.close();
    process.exit();
  }
}

migrate();
