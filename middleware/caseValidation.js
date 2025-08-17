const Joi = require('joi');

// Valid case statuses and their allowed transitions
const CASE_STATUSES = {
  open: ['in_progress', 'cancelled'],
  in_progress: ['pending_review', 'cancelled'],
  pending_review: ['closed', 'in_progress'],
  closed: [], // Terminal state
  cancelled: [], // Terminal state
};

// Valid priority levels
const VALID_PRIORITIES = ['low', 'medium', 'high', 'urgent'];

// Valid case types
const VALID_CASE_TYPES = [
  'civil',
  'criminal',
  'family',
  'corporate',
  'real_estate',
  'intellectual_property',
  'employment',
  'immigration',
  'tax',
  'other',
];

// Valid budget ranges
const VALID_BUDGET_RANGES = [
  'under_1000',
  '1000_5000',
  '5000_10000',
  '10000_25000',
  '25000_50000',
  'over_50000',
];

// Helper function to validate case status transition
const isValidStatusTransition = (currentStatus, newStatus) => {
  return CASE_STATUSES[currentStatus]?.includes(newStatus) || false;
};

// Case query validation schema
const caseQuerySchema = Joi.object({
  priority: Joi.string()
    .valid(...VALID_PRIORITIES)
    .optional(),
  case_type: Joi.string()
    .valid(...VALID_CASE_TYPES)
    .optional(),
  status: Joi.string()
    .valid('open', 'in_progress', 'pending_review', 'closed', 'cancelled')
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

// Post case validation schema
const postCaseSchema = Joi.object({
  title: Joi.string().min(3).max(255).trim().required().messages({
    'string.min': 'Case title must be at least 3 characters long',
    'string.max': 'Case title cannot exceed 255 characters',
    'any.required': 'Case title is required',
  }),
  description: Joi.string().min(10).max(2000).trim().required().messages({
    'string.min': 'Case description must be at least 10 characters long',
    'string.max': 'Case description cannot exceed 2000 characters',
    'any.required': 'Case description is required',
  }),
  caseType: Joi.string()
    .valid(...VALID_CASE_TYPES)
    .required()
    .messages({
      'any.only': 'Invalid case type provided',
      'any.required': 'Case type is required',
    }),
  priority: Joi.string()
    .valid(...VALID_PRIORITIES)
    .required()
    .messages({
      'any.only':
        'Invalid priority level. Must be: low, medium, high, or urgent',
      'any.required': 'Priority is required',
    }),
  estimatedDuration: Joi.string().min(1).max(100).trim().optional().messages({
    'string.min': 'Estimated duration must be at least 1 character',
    'string.max': 'Estimated duration cannot exceed 100 characters',
  }),
  budgetRange: Joi.string()
    .valid(...VALID_BUDGET_RANGES)
    .optional()
    .messages({
      'any.only': 'Invalid budget range provided',
    }),
  deadlineDate: Joi.date().iso().greater('now').optional().messages({
    'date.greater': 'Deadline date must be in the future',
    'date.format': 'Deadline date must be in ISO format',
  }),
});

exports.validatePostCase = (req, res, next) => {
  const { error } = postCaseSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details.map((detail) => detail.message).join('; '),
    });
  }

  next();
};

// Update case validation schema
const updateCaseSchema = Joi.object({
  title: Joi.string().min(3).max(255).trim().optional().messages({
    'string.min': 'Case title must be at least 3 characters long',
    'string.max': 'Case title cannot exceed 255 characters',
  }),
  description: Joi.string().min(10).max(2000).trim().optional().messages({
    'string.min': 'Case description must be at least 10 characters long',
    'string.max': 'Case description cannot exceed 2000 characters',
  }),
  caseType: Joi.string()
    .valid(...VALID_CASE_TYPES)
    .optional()
    .messages({
      'any.only': 'Invalid case type provided',
    }),
  priority: Joi.string()
    .valid(...VALID_PRIORITIES)
    .optional()
    .messages({
      'any.only':
        'Invalid priority level. Must be: low, medium, high, or urgent',
    }),
  estimatedDuration: Joi.string().min(1).max(100).trim().optional().messages({
    'string.min': 'Estimated duration must be at least 1 character',
    'string.max': 'Estimated duration cannot exceed 100 characters',
  }),
  budgetRange: Joi.string()
    .valid(...VALID_BUDGET_RANGES)
    .optional()
    .messages({
      'any.only': 'Invalid budget range provided',
    }),
  deadlineDate: Joi.date().iso().greater('now').optional().messages({
    'date.greater': 'Deadline date must be in the future',
    'date.format': 'Deadline date must be in ISO format',
  }),
  status: Joi.string()
    .valid('open', 'in_progress', 'pending_review', 'closed', 'cancelled')
    .optional()
    .messages({
      'any.only': 'Invalid status value',
    }),
  notes: Joi.string().max(1000).trim().optional().messages({
    'string.max': 'Notes cannot exceed 1000 characters',
  }),
}).min(1); // Require at least one field for update

exports.validateUpdateCase = (req, res, next) => {
  const { error } = updateCaseSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details.map((detail) => detail.message).join('; '),
    });
  }

  next();
};

// Review validation schema
const reviewSchema = Joi.object({
  rating: Joi.number().integer().min(1).max(5).required().messages({
    'number.base': 'Rating must be a number',
    'number.integer': 'Rating must be an integer',
    'number.min': 'Rating must be at least 1',
    'number.max': 'Rating cannot exceed 5',
    'any.required': 'Rating is required',
  }),
  comment: Joi.string().min(10).max(1000).trim().required().messages({
    'string.min': 'Review comment must be at least 10 characters long',
    'string.max': 'Review comment cannot exceed 1000 characters',
    'any.required': 'Review comment is required',
  }),
});

exports.validateReview = (req, res, next) => {
  const { error } = reviewSchema.validate(req.body, { abortEarly: false });

  if (error) {
    return res.status(400).json({
      status: 'fail',
      message: error.details.map((detail) => detail.message).join('; '),
    });
  }

  next();
};

// Status transition validation middleware
exports.validateStatusTransition = (req, res, next) => {
  const { status } = req.body;
  const { caseId } = req.params;

  if (!status) {
    return next(); // No status update, skip validation
  }

  // Get current case status from database
  // This should be implemented in the controller or model
  // For now, we'll validate the status value itself
  const validStatuses = [
    'open',
    'in_progress',
    'pending_review',
    'closed',
    'cancelled',
  ];

  if (!validStatuses.includes(status)) {
    return res.status(400).json({
      status: 'fail',
      message: `Invalid status value. Must be one of: ${validStatuses.join(', ')}`,
    });
  }

  next();
};

// Case ID validation middleware
exports.validateCaseId = (req, res, next) => {
  const { caseId } = req.params;

  if (!caseId || isNaN(caseId) || parseInt(caseId) <= 0) {
    return res.status(400).json({
      status: 'fail',
      message: 'Invalid case ID provided',
    });
  }

  // Convert to integer for consistency
  req.params.caseId = parseInt(caseId);
  next();
};

// Authorization middleware for case operations
exports.authorizeCaseAccess = (operation) => {
  return (req, res, next) => {
    const { userId, userRole } = req.user; // Assuming user info is attached by auth middleware

    if (!userId || !userRole) {
      return res.status(401).json({
        status: 'fail',
        message: 'Authentication required',
      });
    }

    // Admin can do everything
    if (userRole === 'admin') {
      return next();
    }

    // For case creation, only clients are allowed
    if (operation === 'create' && userRole !== 'client') {
      return res.status(403).json({
        status: 'fail',
        message: 'Only clients can create cases',
      });
    }

    next();
  };
};

// Export constants for use in other parts of the application
exports.CASE_STATUSES = CASE_STATUSES;
exports.VALID_PRIORITIES = VALID_PRIORITIES;
exports.VALID_CASE_TYPES = VALID_CASE_TYPES;
exports.VALID_BUDGET_RANGES = VALID_BUDGET_RANGES;
exports.isValidStatusTransition = isValidStatusTransition;
