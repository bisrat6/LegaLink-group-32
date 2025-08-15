const AppError = require('../utils/appError');

// Middleware to check if user can access a specific case
exports.canAccessCase = (req, res, next) => {
  const { userId, userRole } = req.user;
  const caseData = req.case; // This should be set by previous middleware

  if (!caseData) {
    return next(new AppError('Case not found', 404));
  }

  // Admin can access everything
  if (userRole === 'admin') {
    return next();
  }

  // Check if user is the case owner (client)
  if (caseData.client_id === userId) {
    return next();
  }

  // Check if user is the assigned lawyer
  if (caseData.lawyer_id === userId) {
    return next();
  }

  // User has no access to this case
  return next(new AppError('You are not authorized to access this case', 403));
};

// Middleware to check if user can update a specific case
exports.canUpdateCase = (req, res, next) => {
  const { userId, userRole } = req.user;
  const caseData = req.case;

  if (!caseData) {
    return next(new AppError('Case not found', 404));
  }

  // Admin can update everything
  if (userRole === 'admin') {
    return next();
  }

  // Case owner (client) can update their own case
  if (caseData.client_id === userId) {
    return next();
  }

  // Assigned lawyer can update case details (but not status to closed)
  if (caseData.lawyer_id === userId) {
    const { status } = req.body;
    if (status === 'closed') {
      return next(new AppError('Lawyers cannot close cases', 403));
    }
    return next();
  }

  return next(new AppError('You are not authorized to update this case', 403));
};

// Middleware to check if user can delete a specific case
exports.canDeleteCase = (req, res, next) => {
  const { userId, userRole } = req.user;
  const caseData = req.case;

  if (!caseData) {
    return next(new AppError('Case not found', 404));
  }

  // Admin can delete everything
  if (userRole === 'admin') {
    return next();
  }

  // Only case owner (client) can delete their case
  if (caseData.client_id === userId) {
    // Check if case can be deleted
    if (caseData.status === 'in_progress' || caseData.lawyer_id) {
      return next(
        new AppError(
          'Cannot delete case that is in progress or assigned to a lawyer',
          400,
        ),
      );
    }
    return next();
  }

  return next(new AppError('You are not authorized to delete this case', 403));
};

// Middleware to check if user can review a specific case
exports.canReviewCase = (req, res, next) => {
  const { userId, userRole } = req.user;
  const caseData = req.case;

  if (!caseData) {
    return next(new AppError('Case not found', 404));
  }

  // Only case owner (client) can review
  if (caseData.client_id !== userId) {
    return next(new AppError('Only case owner can review this case', 403));
  }

  // Check if case can be reviewed
  if (!caseData.lawyer_id) {
    return next(
      new AppError('Cannot review case without assigned lawyer', 400),
    );
  }

  if (
    caseData.status !== 'in_progress' &&
    caseData.status !== 'pending_review'
  ) {
    return next(
      new AppError(
        'Case must be in progress or pending review to be reviewed',
        400,
      ),
    );
  }

  return next();
};

// Middleware to check if user can apply to a case
exports.canApplyToCase = (req, res, next) => {
  const { userId, userRole } = req.user;
  const caseData = req.case;

  if (!caseData) {
    return next(new AppError('Case not found', 404));
  }

  // Only lawyers can apply to cases
  if (userRole !== 'lawyer') {
    return next(new AppError('Only lawyers can apply to cases', 403));
  }

  // Check if case is open for applications
  if (caseData.status !== 'open') {
    return next(new AppError('Case is not open for applications', 400));
  }

  if (caseData.lawyer_id) {
    return next(new AppError('Case is already assigned to a lawyer', 400));
  }

  // Check if lawyer already applied
  // This will be checked in the application model

  return next();
};

// Middleware to check if user can manage case applications
exports.canManageApplications = (req, res, next) => {
  const { userId, userRole } = req.user;
  const caseData = req.case;

  if (!caseData) {
    return next(new AppError('Case not found', 404));
  }

  // Admin can manage everything
  if (userRole === 'admin') {
    return next();
  }

  // Case owner (client) can manage applications for their case
  if (caseData.client_id === userId) {
    return next();
  }

  return next(
    new AppError(
      'You are not authorized to manage applications for this case',
      403,
    ),
  );
};

// Middleware to check case status transitions
exports.validateStatusTransition = (req, res, next) => {
  const { status } = req.body;
  const caseData = req.case;

  if (!status || !caseData) {
    return next(); // No status update or no case data
  }

  // Import the validation function from caseValidation middleware
  const { isValidStatusTransition } = require('./caseValidation');

  if (!isValidStatusTransition(caseData.status, status)) {
    return next(
      new AppError(
        `Invalid status transition from ${caseData.status} to ${status}`,
        400,
      ),
    );
  }

  return next();
};

// Middleware to check if case is in deletable state
exports.isCaseDeletable = (req, res, next) => {
  const caseData = req.case;

  if (!caseData) {
    return next(new AppError('Case not found', 404));
  }

  // Check if case can be deleted
  if (caseData.status === 'in_progress' || caseData.lawyer_id) {
    return next(
      new AppError(
        'Cannot delete case that is in progress or assigned to a lawyer',
        400,
      ),
    );
  }

  // Check for related records (this should be done in the model)
  // For now, we'll let the model handle this

  return next();
};
