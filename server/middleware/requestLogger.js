// middleware/requestLogger.js
// MIDDLEWARE 1 - Logging.
// Runs for every request. It waits until the response is finished,
// then prints:  METHOD  URL  STATUS  time taken.
function requestLogger(req, res, next) {
  const startTime = Date.now();

  res.on('finish', () => {
    const timeTaken = Date.now() - startTime;
    console.log(req.method + ' ' + req.originalUrl + ' -> ' + res.statusCode + ' (' + timeTaken + 'ms)');
  });

  next(); // pass control to the next middleware
}

module.exports = requestLogger;
