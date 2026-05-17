export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err);

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({ message: 'Invalid token' });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({ message: 'Token expired' });
  }

  // Validation errors
  if (err.statusCode === 400) {
    return res.status(400).json({ message: err.message });
  }

  // Not found errors
  if (err.statusCode === 404) {
    return res.status(404).json({ message: err.message });
  }

  // Unauthorized
  if (err.statusCode === 401) {
    return res.status(401).json({ message: err.message });
  }

  // Forbidden
  if (err.statusCode === 403) {
    return res.status(403).json({ message: err.message });
  }

  // Default error
  res.status(err.statusCode || 500).json({
    message: err.message || 'Internal Server Error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
  });
};

export class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
    Error.captureStackTrace(this, this.constructor);
  }
}
