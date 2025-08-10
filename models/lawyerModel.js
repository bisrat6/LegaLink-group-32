const db = require('./db');

exports.getAll = async () => {
  const result = await db.query('SELECT * FROM users WHERE role = $1', [
    'lawyer',
  ]);
  return result.rows;
};

exports.getLawyer = async (id) => {
  const result = await db.query(
    'SELECT * FROM users u  JOIN lawyer_profiles lp ON u.user_id=lp.user_id WHERE u.user_id=$1 AND u.role=$2',
    [id, 'lawyer'],
  );
  return result.rows;
};

exports.createProfile = async (profile, id) => {
  const {
    licenseNumber,
    barAssociation,
    yearOfExperience,
    consultationFee,
    bio,
    education,
    languageSpoken,
  } = profile;
  await db.query(
    `INSERT INTO lawyer_profiles 
    (user_id,license_number,bar_association,years_of_experience,consultation_fee,bio,education,languages_spoken) 
    VALUES ($1,$2,$3,$4,$5,$6,$7,$8)`,
    [
      id,
      licenseNumber,
      barAssociation,
      yearOfExperience,
      consultationFee,
      bio,
      education,
      languageSpoken,
    ],
  );
};

exports.updateProfile = async (updates, values, id) => {
  const result = await db.query(
    `
  UPDATE lawyer_profiles
  SET ${updates.join(', ')}
  WHERE user_id = ${id}
  RETURNING *
`,
    values,
  );
  return result.rows;
};

exports.searchLawyer = async (query) => {
  const { name, location, specialization, rating } = query;
  const result = await db.query(
    `SELECT u.user_id, u.first_name, u.country, s.name, lp.average_rating
       FROM users u
       JOIN lawyer_profiles lp ON u.user_id = lp.user_id
       JOIN lawyer_specializations ls ON lp.profile_id = ls.profile_id
       JOIN specializations s ON ls.specialization_id = s.specialization_id
       WHERE ($1::text IS NULL OR u.country = $1)
         AND ($2::text IS NULL OR s.name = $2)
         AND ($3::float IS NULL OR lp.average_rating >= $3)
         AND ($4::text IS NULL OR LOWER(u.first_name) LIKE LOWER('%' || $4 || '%'))
       GROUP BY u.user_id, u.first_name, u.country, s.name, lp.average_rating`,
    [location || null, specialization || null, rating || null, name || null],
  );

  return result.rows;
};
