function errorHandler(err, req, res, next) {
  const status = err.statusCode || err.status || 500;
  const message =
    err.message ||
    (typeof err === 'string' ? err : 'An unexpected error occurred');

  if (res.headersSent) {
    return next(err);
  }

  res.status(status).json({
    error: message,
    ...(process.env.NODE_ENV !== 'production' && err.stack
      ? { details: err.stack }
      : {}),
  });
}

module.exports = { errorHandler };
