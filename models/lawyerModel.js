const db = require('./db');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllLawyers = async (queryString) => {
  try {
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
  } catch (error) {
    console.error('Error in getAllLawyers:', error);
    throw error;
  }
};

exports.getLawyer = async (id) => {
  try {
    const result = await db.query(
      'SELECT * FROM users u  JOIN lawyer_profiles lp ON u.user_id=lp.user_id WHERE u.user_id=$1 AND u.role=$2',
      [id, 'lawyer'],
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getLawyer:', error);
    throw error;
  }
};

exports.createProfile = async (profile, id) => {
  try {
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
  } catch (error) {
    console.error('Error in createProfile:', error);
    throw error;
  }
};

exports.updateProfile = async (updates, values, id) => {
  try {
    const update1 = updates.slice(0, 7);
    const values1 = values.slice(0, 7);
    const update2 = updates.slice(7);
    const values2 = values.slice(7);

    const result = await db.query(
      `
    UPDATE lawyer_profiles
    SET ${update1.join(', ')}
    WHERE user_id = ${id}
    RETURNING *
  `,
      values1,
    );

    const result2 = await db.query(
      `
    UPDATE users
    SET ${update2.join(', ')}
    WHERE user_id = ${id}
    RETURNING *
  `,
      values2,
    );

    return { ...result.rows[0], ...result2.rows[0] };
  } catch (error) {
    console.error('Error in updateProfile:', error);
    throw error;
  }
};

exports.searchLawyer = async (query) => {
  try {
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
  } catch (error) {
    console.error('Error in searchLawyer:', error);
    throw error;
  }
};
