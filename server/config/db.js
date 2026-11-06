// config/db.js
// Connects Mongoose to the LOCAL MongoDB that is already running on this computer.
// This project only ever uses the "shareplate_ca3" database.
const mongoose = require('mongoose');

async function connectDB() {
  const uri = process.env.MONGODB_URI;

  if (!uri) {
    console.error('[DB] MONGODB_URI is missing. Copy server/.env.example to server/.env first.');
    return false;
  }

  // Safety check: refuse to touch the old CA2 database called "shareplate".
  const databaseName = new URL(uri).pathname.replace('/', '');
  if (databaseName === 'shareplate') {
    console.error('[DB] Refusing to connect to the old "shareplate" database. Use shareplate_ca3.');
    return false;
  }

  try {
    await mongoose.connect(uri, { serverSelectionTimeoutMS: 4000 });
    console.log('[DB] MongoDB connected. Database: ' + mongoose.connection.name);
    return true;
  } catch (error) {
    console.error('[DB] Could not connect to MongoDB at ' + uri);
    console.error('[DB] Open Windows "Services" and check that the "MongoDB Server" service is Running,');
    console.error('[DB] then restart this server. The app will not use mock data or another database.');
    return false;
  }
}

module.exports = connectDB;
