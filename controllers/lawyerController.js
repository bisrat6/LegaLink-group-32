const query = require('../models/lawyerModel');

exports.getAllLawyers = async (req, res) => {
  const result = await query.getAll();
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

exports.createLawyerProfile = async (req, res) => {
  const id = 6;
  await query.createProfile(req.body, id);
  res.status(201).json({
    status: 'success',
    message: 'Successfully created',
  });
};

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

exports.updateLawyerProfile = async (req, res) => {
  const id = 6;
  const {
    licenseNumber,
    barAssociation,
    yearOfExperience,
    consultationFee,
    bio,
    education,
    languageSpoken,
  } = req.body;
  const updates = [];
  const values = [];
  let i = 1;
  if (licenseNumber) {
    updates.push(`license_number=$${i++}`);
    values.push(licenseNumber);
  }
  if (barAssociation) {
    updates.push(`bar_association=$${i++}`);
    values.push(barAssociation);
  }
  if (yearOfExperience) {
    updates.push(`years_of_experience=$${i++}`);
    values.push(yearOfExperience);
  }
  if (consultationFee) {
    updates.push(`consultation_fee=$${i++}`);
    values.push(consultationFee);
  }
  if (bio) {
    updates.push(`bio=$${i++}`);
    values.push(bio);
  }
  if (education) {
    updates.push(`education=$${i++}`);
    values.push(education);
  }
  if (languageSpoken) {
    updates.push(`languages_spoken=$${i++}`);
    values.push(languageSpoken);
  }
  console.log(updates);
  const result = await query.updateProfile(updates, values, id);
  res.status(201).json({
    status: 'success',
    data: {
      result,
    },
  });
};

exports.filterLawyer = async (req, res) => {
  const result = await query.searchLawyer(req.query);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

exports.verfiyLawyer = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not yet defined',
  });
};
