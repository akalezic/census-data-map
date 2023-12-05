/* db.js
  Instantiate connection to MongoDB, which contains a mapping table of FIPS codes to state names 
  and a geojson table of geojson data for each state and county
*/

import { MongoClient } from 'mongodb';

const client = new MongoClient(process.env.MongoDBConnectionString || '');

async function connectToDatabase() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');
    return client.db('censusdata');
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    throw error;
  }
}

export { connectToDatabase };
