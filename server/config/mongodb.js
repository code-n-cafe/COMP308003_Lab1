// server\config\mongodb.js

const { MongoClient, ServerApiVersion } = require('mongodb');
const config = require('./config');

let client;

async function connectDB() {
  if (client) return client;

  client = new MongoClient(config.mongodb.uri, {
    serverApi: {
      version: ServerApiVersion.v1,
      strict: true,
      deprecationErrors: true
    }
  });

  await client.connect();
  console.log('MongoDB connected');

  return client;
}

async function disconnectDB() {
  if (!client) return;
  await client.close();
  client = null;
}

module.exports = {
  connectDB,
  disconnectDB
};
