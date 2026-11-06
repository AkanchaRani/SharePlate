// middleware/errorHandler.js
// MIDDLEWARE 4 - Central error handling.
// Express knows this is an error handler because it has FOUR parameters (err, req, res, next).
// Any error passed with next(error), or thrown by Multer, ends up here.
const multer = require('multer');

// Runs when no route matched (placed after all routes).
function notFound(req, res) {
  res.status(404).json({ success: false, message: 'Route not found: ' + req.method + ' ' + req.originalUrl });
}

function errorHandler(err, req, res, next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || 'Something went wrong on the server.';

  // Multer errors (for example: file too large)
  if (err instanceof multer.MulterError) {
    statusCode = 400;
    if (err.code === 'LIMIT_FILE_SIZE') {
      message = 'Image is too large. The maximum size is 5 MB.';
    } else if (err.code === 'LIMIT_UNEXPECTED_FILE') {
      message = 'Upload only one image, using the field name "image".';
    }
  }

  // Mongoose: an id like "abc" is not a valid MongoDB id
  if (err.name === 'CastError') {
    statusCode = 400;
    message = 'Invalid donation id.';
  }

  // Mongoose: data did not match the schema
  if (err.name === 'ValidationError') {
    statusCode = 400;
  }

  if (statusCode === 500) {
    console.error('[ERROR]', err);
    message = 'Something went wrong on the server.'; // do not leak details to the browser
  }

  res.status(statusCode).json({ success: false, message: message });
}

module.exports = { notFound, errorHandler };
