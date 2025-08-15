const query = require('../models/clientModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
//used by the lawyers
exports.getClient = catchAsync(async (req, res) => {
  const id = req.params.id * 1;
  const result = await query.getClient(id);
  if (!result) {
    throw new AppError('No client found with that ID', 404);
  }
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// used by clients
exports.updateClient = catchAsync(async (req, res) => {
  const id = 25; // Assuming req.user.id is the user ID
  // Define the mapping of request body fields to database columns
  const userFields = {
    country: 'country',
    firstName: 'first_name',
    lastName: 'last_name',
    phone: 'phone',
    email: 'email',
    password: 'password_hash',
    dateOfBirth: 'date_of_birth',
    city: 'city',
    state: 'state',
    address: 'address',
  };
  const updates = [];
  const values = [];

  let index = 1;

  // Build updates for users
  for (const [key, column] of Object.entries(userFields)) {
    if (req.body[key] !== undefined) {
      updates.push(`${column}=$${index++}`);
      values.push(req.body[key]);
    }
  }

  const result = await query.updateClient(updates, values, id);
  if (!result) {
    throw new AppError('No client found with that ID', 404);
  }
  res.status(201).json({
    status: 'success',
    data: result,
  });
});
