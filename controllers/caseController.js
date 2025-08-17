const query = require('../models/caseModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//this routes is hit by the lawyer so it gives all open cases with his specialization, Not all cases in the data base.
exports.getAllCases = catchAsync(async (req, res) => {
  const result = await query.getAllCases(req.query);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

//this route is hit by the client to post his case
exports.postCase = catchAsync(async (req, res) => {
  const id = req.user.user_id;
  const result = await query.postCase(id, req.body);
  res.status(200).json({
    status: 'success',
    data: result,
    message: 'successfully created',
  });
});

// this route is used by the lawyer to get specific case on the list
exports.getCase = catchAsync(async (req, res, next) => {
  const id = req.params.caseId * 1;
  const result = await query.getCase(id);
  if (!result) {
    return next(new AppError('No case found with that ID', 404));
  }
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// this also hit by the client to update his case.
exports.updateCase = catchAsync(async (req, res, next) => {
  // case id need not to be secured and sendt through url params
  const id = Number(req.params.caseId);

  // Mapping of body keys to DB columns
  const fieldMap = {
    title: 'title',
    description: 'description',
    caseType: 'case_type',
    priority: 'priority',
    estimatedDuration: 'estimated_duration',
    budgetRange: 'budget_range',
    deadlineDate: 'deadline_date',
    status: 'status',
    notes: 'notes',
  };

  const updates = [];
  const values = [];
  let i = 1;

  for (const [key, column] of Object.entries(fieldMap)) {
    if (req.body[key] !== undefined) {
      // allows false/0 values too
      updates.push(`${column}=$${i++}`);
      values.push(req.body[key]);
    }
  }

  const result = await query.updateCase(updates, values, id);

  if (!result) {
    return next(new AppError('No case found with that ID', 404));
  }

  res.status(201).json({
    status: 'success',
    data: result,
  });
});

// this route is used by the client to delete.
exports.deleteCase = catchAsync(async (req, res, next) => {
  const id = req.params.caseId * 1;
  // Ensure deletable state using model-level guard
  await query.canDeleteCase(id);
  const result = await query.deleteCase(id);
  if (!result) {
    return next(new AppError('No case found with that ID', 404));
  }
  res.status(204).json({
    status: 'success',
    message: 'successfully deleted',
  });
});

exports.postReview = catchAsync(async (req, res) => {
  const caseId = req.params.caseId * 1;
  const reviewerId = req.user.user_id;
  
  const result = await query.postReview(
    caseId,
    {
      ...req.body,
    },
    reviewerId,
  );
  res.status(201).json({
    status: 'success',
    data: result,
  });
});
