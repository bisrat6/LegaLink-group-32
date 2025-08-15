const Joi = require('joi');

exports.validateUserRequired = (req, res, next) => {
  const schema = Joi.object({
    country: Joi.string().trim().min(2).max(100).required(),
    zipCode: Joi.string().trim().min(2).max(20).required(),
    role: Joi.string().valid('client', 'lawyer', 'admin').required(),
    firstName: Joi.string().trim().min(2).max(50).required(),
    lastName: Joi.string().trim().min(2).max(50).required(),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{7,15}$/)
      .message('Phone number must be valid')
      .required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(8).max(128).required(),
    dateOfBirth: Joi.date().less('now').iso().required(),
    city: Joi.string().trim().max(100).required(),
    state: Joi.string().trim().max(100).required(),
    address: Joi.string().trim().max(255).required(),
  });

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details.map((err) => err.message).join('; '),
    });
  }

  next();
};

// Generic path param validator for numeric IDs
exports.validateIdParam =
  (paramName = 'id') =>
  (req, res, next) => {
    const raw = req.params[paramName];
    const value = Number(raw);

    if (!Number.isInteger(value) || value <= 0) {
      return res.status(400).json({
        status: 'fail',
        message: `Invalid ${paramName} provided`,
      });
    }

    req.params[paramName] = value;
    next();
  };
