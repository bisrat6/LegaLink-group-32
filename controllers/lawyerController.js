const query = require('../models/lawyerModel');

//client can get all lawyers
exports.getAllLawyers = async (req, res) => {
  const result = await query.getAll();
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

//lawyer profile creation
exports.createLawyerProfile = async (req, res) => {
  const id = 6;
  await query.createProfile(req.body, id);
  res.status(201).json({
    status: 'success',
    message: 'Successfully created',
  });
};

//client get lawyers by their id
exports.getLawyer = async (req, res) => {
  const id = req.params.id * 1;
  const result = await query.getLawyer(id);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

//lawyer can update their profile
exports.updateLawyerProfile = async (req, res) => {
  const id = 6; // Hardcoded? Consider getting from req.params or auth

  // Mapping of body keys to DB column names
  const lawyerProfileFields = {
    licenseNumber: 'license_number',
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

  const updates = [];
  const values = [];

  let index = 1;

  // Build updates for lawyer_profiles
  for (const [key, column] of Object.entries(lawyerProfileFields)) {
    if (req.body[key] !== undefined) {
      updates.push(`${column}=$${index++}`);
      values.push(req.body[key]);
    }
  }
  index = 1;
  // Build updates for users
  for (const [key, column] of Object.entries(userFields)) {
    if (req.body[key] !== undefined) {
      updates.push(`${column}=$${index++}`);
      values.push(req.body[key]);
    }
  }

  const result = await query.updateProfile(updates, values, id);

  res.status(201).json({
    status: 'success',
    data: result,
  });
};

//client can filter lawyers
exports.filterLawyer = async (req, res) => {
  const result = await query.searchLawyer(req.query);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

// it is only for the admin
exports.verfiyLawyer = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
