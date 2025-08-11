// const fs = require('fs');
const query = require('../models/caseModel');

//this routes is hit by the lawyer so it gives all open cases with his specialization, Not all cases in the data base.
exports.getAllCases = async (req, res) => {
  const id = 2;
  const result = await query.getAllCases(id);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

//this route is hit by the client to post his case
exports.postCase = async (req, res) => {
  const id = 6;
  const result = await query.postCase(id, req.body);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
    message: 'successfully created',
  });
};

// this also hit by the client to update his case.
exports.updateCase = async (req, res) => {
  // case id need not to be secured and sendt through url params
  const id = Number(req.params.id);

  // Mapping of body keys to DB columns
  const fieldMap = {
    title: 'title',
    description: 'description',
    caseType: 'case_type',
    priority: 'priority',
    estimatedDuration: 'estimated_duration',
    budgetRange: 'budget_range',
    deadlineDate: 'deadline_date',
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

  res.status(201).json({
    status: 'success',
    data: { result },
  });
};

// this route is used by the lawyer to get specific case on the list
exports.getCase = async (req, res) => {
  const id = req.params.id * 1;
  const result = await query.getCase(id);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

// this route is used by the client to delete.
exports.deleteCase = async (req, res) => {
  const id = req.params.id * 1;
  await query.deleteCase(id);
  res.status(202).json({
    status: 'success',
    message: 'successfully deleted',
  });
};
