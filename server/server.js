// server.js - starts the Express app.
//
// ORDER OF MIDDLEWARE (Express runs them top to bottom for every request):
//   1. requestLogger        - logs the request
//   2. cors                 - lets the React app (another port) call this API
//   3. express.json         - reads JSON request bodies
//   4. /uploads static      - serves saved images
//   5. checkDatabase        - stops early if MongoDB is down (API routes only)
//   6. donationRoutes       - route-level middleware: Multer -> validation -> controller
//   7. notFound             - no route matched -> 404 JSON
//   8. errorHandler         - LAST: catches every error passed with next(error)
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const connectDB = require('./config/db');
const requestLogger = require('./middleware/requestLogger');
const checkDatabase = require('./middleware/checkDatabase');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const donationRoutes = require('./routes/donationRoutes');

const app = express();
const PORT = process.env.PORT || 5000;
const CLIENT_URL = process.env.CLIENT_URL || 'http://localhost:5173';

app.use(requestLogger);
// Allowed browser addresses. localhost and 127.0.0.1 are different "origins" for the browser,
// so both are listed, plus the CLIENT_URL from .env.
const allowedOrigins = [CLIENT_URL, 'http://localhost:5173', 'http://127.0.0.1:5173'];
app.use(cors({ origin: allowedOrigins }));
app.use(express.json());

// Static route: http://localhost:5000/uploads/<filename> shows a saved image.
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Donation API (Express Router mounted at /api/donations)
app.use('/api/donations', checkDatabase, donationRoutes);

app.use(notFound);
app.use(errorHandler);

// Start the server first, then try the database, so the setup message is clear either way.
app.listen(PORT, () => {
  console.log('SharePlate server running at http://localhost:' + PORT);
  connectDB();
});
