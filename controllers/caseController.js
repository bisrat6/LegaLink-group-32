// const fs = require('fs');
const query = require('../models/caseModel');

// const cases = JSON.parse(
//   fs.readFileSync(`${__dirname}/../dev-data/cases.json`),
// );

// exports.checkId = (req, res, next, val) => {
//   console.log(`the case id is ${val}`);
//   if (val * 1 > cases.length) {
//     return res.status(404).json({
//       status: 'error',
//       message: 'Invalid Id',
//     });
//   }
//   next();
// };

// exports.checkBody = (req, res, next) => {
//   if (!req.body.title) {
//     return res.status(400).json({
//       status: 'fail',
//       message: 'missing title',
//     });
//   }
//   next();
// };

exports.getAllCases = async (req, res) => {
  const id = 2;
  const result = await query.getAllCases(id);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
  // console.log(req.requestTime);
  // res.status(200).json({
  //   time: req.requestTime,
  //   status: 'success',
  //   results: cases.length,
  //   data: {
  //     cases,
  //   },
  // });
};

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
  // const newCase = {
  //   id: cases[cases.length - 1].id + 1,
  //   ...req.body,
  // };
  // cases.push(newCase);
  // fs.writeFile(
  //   `${__dirname}/dev-data/cases.json`,
  //   JSON.stringify(cases),
  //   (error) => {
  //     res.status(201).json({ status: 'Success', case: newCase });
  //   },
  // );
};

exports.updateCase = async (req, res) => {
  const id = req.params.id * 1;
  const {
    title,
    description,
    caseType,
    priority,
    estimatedDuration,
    budgetRange,
    deadlineDate,
  } = req.body;
  const updates = [];
  const values = [];
  let i = 1;
  if (title) {
    updates.push(`title=$${i++}`);
    values.push(title);
  }
  if (description) {
    updates.push(`description=$${i++}`);
    values.push(description);
  }
  if (caseType) {
    updates.push(`case_type=$${i++}`);
    values.push(caseType);
  }
  if (priority) {
    updates.push(`priority=$${i++}`);
    values.push(priority);
  }
  if (estimatedDuration) {
    updates.push(`estimated_duration=$${i++}`);
    values.push(estimatedDuration);
  }
  if (budgetRange) {
    updates.push(`budget_range=$${i++}`);
    values.push(budgetRange);
  }
  if (deadlineDate) {
    updates.push(`deadline_date=$${i++}`);
    values.push(deadlineDate);
  }
  const result = await query.updateCase(updates, values, id);
  res.status(201).json({
    status: 'success',
    data: {
      result,
    },
  });
};

exports.getCase = async (req, res) => {
  const id = req.params.id * 1;
  const result = await query.getCase(id);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
  // const post = cases.find((post) => post.id === id);
  // res.status(200).json(post);
};

exports.deleteCase = async (req, res) => {
  const id = req.params.id * 1;
  await query.deleteCase(id);
  res.status(202).json({
    status: 'success',
    message: 'successfully deleted',
  });
  // const index = cases.findIndex((Case) => Case.id === id);
  // const deletedCase = cases[index];
  // cases.splice(index, 1);

  // res.status(204).json({
  //   status: 'success',
  //   message: 'Successfully deleted!',
  //   data: {
  //     deletedCase,
  //   },
  // });
};
