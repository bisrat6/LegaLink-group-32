const query = require('../models/clientModel');

//used by the lawyers
exports.getClient = async (req, res) => {
  const id = req.params.id * 1;
  const result = await query.getClient(id);
  res.status(200).json({
    status: 'success',
    data: {
      result,
    },
  });
};

// used by clients
exports.updateClient = async (req, res) => {
  const id = 6;
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

  res.status(201).json({
    status: 'success',
    data: result,
  });
};

// exports.createClientProfile = async (req, res) => {
//   const result = await query.createClient(req.body);
//   res.status(201).json({
//     status: 'success',
//     data: {
//       result,
//     },
//   });
// };
