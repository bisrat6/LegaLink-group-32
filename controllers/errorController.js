const AppError = require('../utils/appError');

const handleCastErrDB = () => {
  const message = `Invalid path`;
  return new AppError(message, 400);
};

const handleDuplicateFieldsDB = (err) => {
  // err.detail example: 'Key (email)=(test@example.com) already exists.'
  let field = 'field';
  let value = '';

  if (err.detail) {
    const match = err.detail.match(/\((.*?)\)=\((.*?)\)/);
    if (match) {
      field = match[1];
      value = match[2];
    }
  }

  const message = `Duplicate value "${value}" for field "${field}". Please use another value!`;
  return new AppError(message, 400);
};

const handleJWTError = () =>
  new AppError('Invalid token. Please log in again!', 401);

const handleJWTExpiredError = () =>
  new AppError('token expired. Please log in again!', 401);

const sendErrDev = (err, res) => {
  res.status(err.statusCode).json({
    status: err.status,
    error: err,
    message: err.message,
    stack: err.stack,
  });
};
const sendErrProd = (err, res) => {
  if (err.isOperational) {
    res.status(err.statusCode).json({
      status: err.status,
      message: err.message,
    });
  } else {
    console.error('Error:', err);
    res.status(500).json({
      status: 'error',
      message: 'Something went wrong!',
    });
  }
};

module.exports = (err, req, res, next) => {
  // Set default error status code
  err.status = err.status || 'error';
  err.statusCode = err.statusCode || 500;

  // Log the error for debugging

  if (process.env.NODE_ENV === 'development') {
    sendErrDev(err, res);
  } else if (process.env.NODE_ENV === 'production') {
    let error = {
      ...err,
      message: err.message,
      isOperational: err.isOperational,
      statusCode: err.statusCode,
      status: err.status,
    };

    if (error.code === '22P02') error = handleCastErrDB();
    if (error.code === '23505') error = handleDuplicateFieldsDB(error);
    if (error.name === 'JsonWebTokenError') {
      error = handleJWTError();
    }
    if (error.name === 'TokenExpiredError') error = handleJWTExpiredError();
    sendErrProd(error, res);
  }

  // Send error response
};
