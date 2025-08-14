const Joi = require('joi');

const postlawyerSchema = Joi.object({
  licenseNumber: Joi.string().min(5).max(15).required(),
  barAssociation: Joi.string().min(2).max(100).required(),
  yearOfExperience: Joi.number().min(0).required(),
  consultationFee: Joi.number().min(0).required(),
  bio: Joi.string().min(10).max(500).required(),
  education: Joi.string().min(2).max(100).required(),
  languageSpoken: Joi.string().min(2).max(100).required(),
});

exports.validateLawyerProfile = (req, res, next) => {
  const { error } = postlawyerSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};

exports.validateUserUpdate = (req, res, next) => {
  const schema = Joi.object({
    country: Joi.string().trim().min(2).max(100),
    firstName: Joi.string().trim().min(2).max(50),
    lastName: Joi.string().trim().min(2).max(50),
    phone: Joi.string()
      .pattern(/^\+?[0-9]{7,15}$/)
      .message('Phone number must be valid'),
    email: Joi.string().email(),
    password: Joi.string().min(8).max(128),
    dateOfBirth: Joi.date().less('now').iso(),
    city: Joi.string().trim().max(100),
    state: Joi.string().trim().max(100),
    address: Joi.string().trim().max(255),
    licenseNumber: Joi.string().min(5).max(15),
    barAssociation: Joi.string().min(2).max(100),
    yearOfExperience: Joi.number().min(0),
    consultationFee: Joi.number().min(0),
    bio: Joi.string().min(10).max(500),
    education: Joi.string().min(2).max(100),
    languageSpoken: Joi.string().min(2).max(100),
  }).min(1); // Require at least one field for update

  const { error } = schema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};

exports.validateLawyerSearch = (req, res, next) => {
  const schema = Joi.object({
    location: Joi.string().trim().min(2).max(100),
    specialization: Joi.string().trim().min(2).max(100),
    rating: Joi.number().min(0).max(5),
    name: Joi.string().trim().min(2).max(100),
    page: Joi.number().min(1),
    limit: Joi.number().min(1).default(10),
  });

  const { error } = schema.validate(req.query, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      errors: error.details.map((err) => err.message),
    });
  }

  next();
};
