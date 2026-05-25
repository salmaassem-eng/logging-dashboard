const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log server error for debugging
  if (process.env.NODE_ENV !== 'production') {
    console.error(err);
  }

  // Mongoose Bad ObjectId (CastError)
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = new Error(message);
    error.statusCode = 404;
  }

  // Mongoose Duplicate Key Error (Code 11000)
  if (err.code === 11000) {
    let message = 'Duplicate field value entered';
    
    // Customize error messages for specific unique constraints
    if (err.keyValue) {
      const keys = Object.keys(err.keyValue);
      if (keys.includes('email')) {
        message = 'Email address is already registered';
      } else if (keys.includes('username')) {
        message = 'Username is already taken';
      } else if (keys.includes('name')) {
        message = 'An application with this name already exists';
      }
    }
    error = new Error(message);
    error.statusCode = 400;
  }

  // Mongoose Validation Error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map((val) => val.message).join(', ');
    error = new Error(message);
    error.statusCode = 400;
  }

  res.status(error.statusCode || 500).json({
    success: false,
    error: error.message || 'Server Error: Something went wrong',
  });
};

export default errorHandler;
