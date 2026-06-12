/**
 * Error Handler Middleware
 * Global error handling with structured responses.
 */

function errorHandler(err, req, res, _next) {
  console.error('[ErrorHandler]', err.stack || err.message);

  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  res.status(statusCode).json({
    error: {
      message: process.env.NODE_ENV === 'production'
        ? 'Something went wrong. Please try again.'
        : message,
      ...(process.env.NODE_ENV !== 'production' && { stack: err.stack }),
    },
  });
}

/**
 * Not Found handler for undefined routes.
 */
function notFound(req, res) {
  res.status(404).json({
    error: {
      message: `Route not found: ${req.method} ${req.originalUrl}`,
    },
  });
}

module.exports = { errorHandler, notFound };
