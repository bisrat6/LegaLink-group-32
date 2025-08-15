const query = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

exports.createAccount = catchAsync(async (req, res) => {
  await query.createUser(req.body);
  res.status(201).json({
    status: 'success',
    message: 'Account created successfully',
  });
});

//user can get their profile
exports.getProfile = catchAsync(async (req, res) => {
  const id = 25; // Assuming req.user.id is the user ID
  const result = await query.getProfile(id);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});
