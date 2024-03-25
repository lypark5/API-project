
const { validationResult } = require('express-validator');

/* 
middleware for formatting errors from express-validator middleware ↓↓
calls validationResult from the express-validator package passing in the request. 
If there are no validation errors returned from the validationResult function, 
  invoke the next middleware.
If there are validation errors, create an error with all the validation error messages 
  and invoke the next error-handling middleware.
*/
const handleValidationErrors = (req, _res, next) => {       // the underscore is placeholder for res but not planning to use it.
  const validationErrors = validationResult(req);

  if (!validationErrors.isEmpty()) { 
    const errors = {};
    validationErrors
      .array()
      .forEach(error => errors[error.param] = error.msg);

    const err = Error("Bad request.");
    err.errors = errors;
    err.status = 400;
    err.title = "Bad request.";
    next(err);
  }
  next();
};

module.exports = {
  handleValidationErrors
};