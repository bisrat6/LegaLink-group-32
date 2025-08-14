const query = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.createAccount = catchAsync(async (req, res) => {
  const result = await query.createUser(req.body);
  res.status(201).json({
    status: 'success',
    data: {
      result,
    },
  });
});

//user can get their profile
exports.getProfile = catchAsync(async (req, res) => {
  const id = 6;
  const result = await query.getProfile(id);
  res.status(201).json({
    status: 'success',
    data: {
      result,
    },
  });
});
