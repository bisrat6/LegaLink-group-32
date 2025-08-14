const Joi = require('joi');

const caseQuerySchema = Joi.object({
  priority: Joi.string()
    .valid('low', 'medium', 'high') // you can change allowed values
    .optional(),

  case_type: Joi.string()
    .valid(
      'Criminal Law',
      'Family Law',
      'Corporate Law',
      'Civil Litigation',
      'Immigration Law',
    ) // change list as needed
    .optional(),

  status: Joi.string()
    .valid('open', 'closed', 'pending', 'in_progress') // change as needed
    .optional(),
}).unknown(true); // allow other query params like pagination

exports.validateCaseQuery = (req, res, next) => {
  const { error } = caseQuerySchema.validate(req.query);

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details[0].message,
    });
  }

  next();
};

const postCaseSchema = Joi.object({
  title: Joi.string().min(3).max(255).required(),
  description: Joi.string().min(10).required(),
  caseType: Joi.string()
    .valid(
      'Criminal Law',
      'Family Law',
      'Corporate Law',
      'Civil Litigation',
      'Immigration Law',
    )
    .required(),
  priority: Joi.string().valid('low', 'medium', 'high').required(),
  estimatedDuration: Joi.string().min(1).max(50).required(),
  budgetRange: Joi.string().min(1).max(50).required(),
  deadlineDate: Joi.date().iso().required(),
});

exports.validatePostCase = (req, res, next) => {
  const { error } = postCaseSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};

const UpdateCaseSchema = Joi.object({
  title: Joi.string().min(3).max(255),
  description: Joi.string().min(10),
  caseType: Joi.string().valid(
    'Criminal Law',
    'Family Law',
    'Corporate Law',
    'Civil Litigation',
    'Immigration Law',
  ),
  priority: Joi.string().valid('low', 'medium', 'high'),
  estimatedDuration: Joi.string().min(1).max(50),
  budgetRange: Joi.string().min(1).max(50),
  deadlineDate: Joi.date().iso(),
});

exports.validateUpdateCase = (req, res, next) => {
  const { error } = UpdateCaseSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      errors: error.details.map((detail) => detail.message),
    });
  }

  next();
};
