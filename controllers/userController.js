const query = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');

//user can get their profile
exports.getProfile = catchAsync(async (req, res) => {
  const id = req.user.user_id;
  const result = await query.getProfile(id);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});
