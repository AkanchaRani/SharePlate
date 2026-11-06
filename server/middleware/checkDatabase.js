// middleware/checkDatabase.js
// Stops the request early with a clear message if MongoDB is not connected.
// (We never fall back to mock data or another database.)
const mongoose = require('mongoose');

function checkDatabase(req, res, next) {
  const isConnected = mongoose.connection.readyState === 1; // 1 means "connected"

  if (!isConnected) {
    return res.status(503).json({
      success: false,
      message:
        'Database is not connected. Make sure the local MongoDB service is running, then restart the SharePlate server.',
    });
  }

  next();
}

module.exports = checkDatabase;
