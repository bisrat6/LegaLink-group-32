const bcrypt = require('bcrypt');
const db = require('./db');

exports.createUser = async (profile) => {
  const {
    email,
    password,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    address,
    city,
    state,
    zipCode,
    country,
    role,
  } = profile;

  const values = [
    email,
    password,
    firstName,
    lastName,
    phone,
    dateOfBirth,
    address,
    city,
    state,
    zipCode,
    country,
    role,
  ];

  const result = await db.query(
    `
      INSERT INTO users 
        (email, password_hash, first_name, last_name, phone, date_of_birth, address, city, state, zip_code, country, role) 
      VALUES
        ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12) 
      RETURNING *;
      `,
    values,
  );

  return result.rows[0];
};

exports.getProfile = async (id) => {
  const result = await db.query(`SELECT * FROM users WHERE user_id=$1`, [id]);
  const basicProfile = result.rows[0];
  if (!basicProfile) {
    return { basic: {}, details: [] };
  }
  let detailsRes;
  if (basicProfile.role === 'lawyer') {
    detailsRes = await db.query(
      `
        SELECT 
          lp.profile_id,
          lp.license_number,
          lp.bar_association,
          lp.years_of_experience,
          lp.hourly_rate,
          lp.consultation_fee,
          lp.bio,
          lp.education,
          lp.certifications,
          lp.languages_spoken,
          lp.availability_schedule,
          lp.average_rating,
          lp.total_reviews,
          STRING_AGG(s.name, ', ') AS specializations,
          COUNT(c.case_id) AS total_cases,
          SUM(CASE WHEN c.status = 'open' THEN 1 ELSE 0 END) AS active_cases,
          SUM(CASE WHEN c.status = 'closed' THEN 1 ELSE 0 END) AS closed_cases,
          SUM(CASE WHEN c.status = 'in_progress' THEN 1 ELSE 0 END) AS pending_cases
        FROM lawyer_profiles lp
        JOIN users u 
          ON u.user_id = lp.user_id
        LEFT JOIN lawyer_specializations ls 
          ON ls.profile_id = lp.profile_id
        LEFT JOIN specializations s 
          ON s.specialization_id = ls.specialization_id
        LEFT JOIN cases c 
          ON c.lawyer_id = lp.user_id
        WHERE lp.user_id = $1
        GROUP BY 
          lp.profile_id, lp.license_number, lp.bar_association, lp.years_of_experience,
          lp.hourly_rate, lp.consultation_fee, lp.bio, lp.education,
          lp.certifications, lp.languages_spoken, lp.availability_schedule,
          lp.average_rating, lp.total_reviews;
      `,
      [id],
    );
  } else {
    detailsRes = await db.query(
      `
        SELECT c.* 
        FROM users u
        LEFT JOIN cases c
          ON u.user_id = c.client_id
        WHERE u.user_id = $1
      `,
      [id],
    );
  }

  return {
    basic: basicProfile || {},
    details: detailsRes.rows || [],
  };
};

exports.getUserByEmail = async (email) => {
  const result = await db.query(`SELECT * FROM users WHERE email=$1`, [email]);
  return result.rows[0];
};
exports.getUserById = async (id) => {
  const result = await db.query(`SELECT * FROM users WHERE user_id=$1`, [id]);
  return result.rows[0];
};

exports.updatePassword = async (userId, newPassword) => {
  const hashedPassword = await bcrypt.hash(newPassword, 12);
  await db.query(
    `UPDATE users 
     SET password_hash = $1, password_changed_at = NOW() 
     WHERE user_id = $2`,
    [hashedPassword, userId],
  );
};
//token adding
exports.updateUser = async (user) => {
  const { passwordResetToken, passwordResetExpires } = user;
  await db.query(
    `UPDATE users 
     SET password_reset_token = $1, password_reset_expires = $2
     WHERE user_id = $3`,
    [passwordResetToken, passwordResetExpires, user.user_id],
  );
};
exports.getUserByToken = async (token) => {
  const user = await db.query(
    `
    SELECT * FROM users WHERE password_reset_token=$1`,
    [token],
  );
  return user.rows[0];
};
exports.deleteMe = async (userId) => {
  await db.query(`UPDATE users SET is_active = false WHERE user_id = $1`, [
    userId,
  ]);
  return 1;
};
