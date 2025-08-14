const db = require('./db');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllLawyers = async (queryString) => {
  // Only use pagination
  const apiFeatures = new APIFeatures(queryString)
    .limitFields([
      'user_id',
      'email',
      'first_name',
      'last_name',
      'phone',
      'city',
      'state',
      'profile_picture_url',
    ])
    .paginate(); // just handles LIMIT and OFFSET

  // Base query: select all lawyers
  const baseQuery = `SELECT * FROM users WHERE role = 'lawyer'`;

  const { query, values } = apiFeatures.build(baseQuery);
  const result = await db.query(query, values);

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

exports.updateProfile = async (
  profileUpdates,
  profileValues,
  userUpdates,
  userValues,
  id,
) => {
  let profileResult = {};
  let userResult = {};

  if (profileUpdates.length) {
    // Build safe parameterized query
    const profileSetClause = profileUpdates
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    const res1 = await db.query(
      `UPDATE lawyer_profiles
         SET ${profileSetClause}
         WHERE user_id=$1
         RETURNING *`,
      [id, ...profileValues],
    );
    profileResult = res1.rows[0];
  }

  if (userUpdates.length) {
    // Build safe parameterized query
    const userSetClause = userUpdates
      .map((field, index) => `${field} = $${index + 2}`)
      .join(', ');
    const res2 = await db.query(
      `UPDATE users
         SET ${userSetClause}
         WHERE user_id=$1
         RETURNING *`,
      [id, ...userValues],
    );
    userResult = res2.rows[0];
  }

  return { ...profileResult, ...userResult };
};

exports.searchLawyer = async (query) => {
  const {
    name,
    location,
    specialization,
    rating,
    page = 1,
    limit = 10,
  } = query;

  const offset = (page - 1) * limit;

  const result = await db.query(
    `SELECT 
        u.user_id AS lawyer_id,
        u.first_name AS first_name,
        u.last_name AS last_name,
        u.country AS location,
        s.name AS specialization,
        lp.average_rating AS rating
       FROM users u
       JOIN lawyer_profiles lp ON u.user_id = lp.user_id
       JOIN lawyer_specializations ls ON lp.profile_id = ls.profile_id
       JOIN specializations s ON ls.specialization_id = s.specialization_id
       WHERE ($1::text IS NULL OR u.country = $1)
         AND ($2::text IS NULL OR s.name = $2)
         AND ($3::float IS NULL OR lp.average_rating >= $3)
         AND ($4::text IS NULL OR LOWER(u.first_name) LIKE LOWER('%' || $4 || '%'))
       GROUP BY u.user_id, u.first_name, u.last_name, u.country, s.name, lp.average_rating
       LIMIT $5 OFFSET $6`,
    [
      location || null,
      specialization || null,
      rating || null,
      name || null,
      limit,
      offset,
    ],
  );

  return result.rows;
};

exports.getLawyerReviews = async (lawyerId) => {
  const result = await db.query(
    `SELECT * FROM reviews WHERE reviewed_lawyer_id = $1`,
    [lawyerId],
  );
  return result.rows;
};

exports.getMyReviews = async (lawyerId) => {
  const result = await db.query(
    `
    SELECT r.review_id, r.review_text, r.rating, r.created_at, 
             c.title AS case_title,
             cl.first_name AS client_name,
             cl.last_name AS client_last_name
      FROM reviews r
      JOIN cases c ON r.case_id = c.case_id
      JOIN users cl ON r.reviewer_id = cl.user_id
      WHERE r.reviewed_lawyer_id = $1
      ORDER BY r.created_at DESC;
    `,
    [lawyerId],
  );

  return result.rows;
};
