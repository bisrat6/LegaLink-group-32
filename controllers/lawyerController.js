const query = require('../models/lawyerModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const userValidation = require('../middleware/userValidation');
//client can get all lawyers
exports.getAllLawyers = catchAsync(async (req, res) => {
  const result = await query.getAllLawyers(req.query);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

//lawyer profile creation
exports.createLawyerProfile = catchAsync(async (req, res) => {
  const id = 44;
  const result = await query.getLawyer(id);
  if (!result) {
    throw new AppError('No user found with that ID', 404);
  }
  await query.createProfile(req.body, id);
  res.status(201).json({
    status: 'success',
    message: 'Successfully created',
  });
});

//client get lawyers by their id
exports.getLawyer = catchAsync(async (req, res) => {
  const id = req.params.id * 1;
  const result = await query.getLawyer(id);
  if (!result) {
    throw new AppError('No lawyer found with that ID', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

//lawyer can update their profile
exports.updateLawyerProfile = catchAsync(async (req, res) => {
  const id = 44; // Assuming req.user.id is the lawyer ID

  const lawyerProfileFields = {
    barAssociation: 'bar_association',
    yearOfExperience: 'years_of_experience',
    consultationFee: 'consultation_fee',
    bio: 'bio',
    education: 'education',
    languageSpoken: 'languages_spoken',
  };

  const userFields = {
    country: 'country',
    firstName: 'first_name',
    lastName: 'last_name',
    phone: 'phone',
    email: 'email',
    password: 'password',
    dateOfBirth: 'date_of_birth',
    city: 'city',
    state: 'state',
    address: 'address',
  };

  const profileUpdates = [];
  const profileValues = [];
  let index = 1;
  for (const [key, column] of Object.entries(lawyerProfileFields)) {
    if (req.body[key] !== undefined) {
      profileUpdates.push(`${column}=$${index++}`);
      profileValues.push(req.body[key]);
    }
  }

  const userUpdates = [];
  const userValues = [];
  index = 1;
  for (const [key, column] of Object.entries(userFields)) {
    if (req.body[key] !== undefined) {
      userUpdates.push(`${column}=$${index++}`);
      userValues.push(req.body[key]);
    }
  }

  const result = await query.updateProfile(
    profileUpdates,
    profileValues,
    userUpdates,
    userValues,
    id,
  );
  if (!result) {
    throw new AppError('No lawyer found with that ID', 404);
  }
  res.status(201).json({
    status: 'success',
    data: result,
  });
});

// it is only for the admin
exports.verifyLawyer = catchAsync(async (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
});

// Search and filter lawyers
exports.filterLawyer = catchAsync(async (req, res) => {
  const result = await query.searchLawyer(req.query);
  res.status(200).json({
    status: 'success',
    data: result,
  });
});

// Get reviews for a specific lawyer
exports.getLawyerReviews = catchAsync(async (req, res) => {
  const lawyerId = req.params.lawyerId * 1;
  const result = await query.getLawyerReviews(lawyerId);
  if (!result.length) {
    throw new AppError('No reviews found for that lawyer ID', 404);
  }
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});

exports.getMyReviews = catchAsync(async (req, res) => {
  const lawyerId = 31; // Assuming req.user.id is the lawyer ID
  const resultTemp = await query.getLawyer(lawyerId);
  if (!resultTemp) {
    throw new AppError('No lawyer found with that ID', 404);
  }
  const result = await query.getMyReviews(lawyerId);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
});
