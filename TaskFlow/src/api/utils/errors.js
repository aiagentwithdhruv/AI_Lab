class AppError extends Error {
  constructor(statusCode, code, message, details = []) {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.details = details;
  }
}

function validationError(message, details = []) {
  return new AppError(400, 'VALIDATION_ERROR', message, details);
}

function unauthorizedError(message = 'Authentication required') {
  return new AppError(401, 'UNAUTHORIZED', message);
}

function forbiddenError(message = 'Access denied') {
  return new AppError(403, 'FORBIDDEN', message);
}

function notFoundError(message = 'Resource not found') {
  return new AppError(404, 'NOT_FOUND', message);
}

function conflictError(message = 'Resource already exists') {
  return new AppError(409, 'CONFLICT', message);
}

module.exports = {
  AppError,
  validationError,
  unauthorizedError,
  forbiddenError,
  notFoundError,
  conflictError,
};
