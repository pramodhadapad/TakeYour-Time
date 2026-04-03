module.exports = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.isOperational
    ? err.message
    : (err.message || 'An unexpected error occurred');

  if (status >= 500) {
    console.error('[SERVER ERROR]', err);
  }

  res.status(status).json({
    success: false,
    error: message,
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};
