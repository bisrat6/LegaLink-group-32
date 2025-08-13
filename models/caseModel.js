const db = require('./db');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCases = async (queryString) => {
  try {
    const apiFeatures = new APIFeatures(queryString)
      .filter(['priority', 'case_type', 'status'])
      .sort()
      .limitFields([
        'case_id',
        'title',
        'status',
        'priority',
        'case_type',
        'client_id',
        'lawyer_id',
        'created_at',
      ])
      .paginate();

    // Base query: only open cases not assigned to any lawyer
    const baseQuery = `
      SELECT c.case_id, c.title, c.status, c.priority, c.case_type,
             c.client_id, c.lawyer_id, c.created_at
      FROM cases c
      WHERE c.status = 'open' AND c.lawyer_id IS NULL
    `;

    const { query, values } = apiFeatures.build(baseQuery);
    const result = await db.query(query, values);

    return result.rows;
  } catch (error) {
    console.error('Error in getAllCases:', error);
    throw error;
  }
};

//   try {
//     const result = await db.query(
//       `SELECT c.*
//          FROM cases c
//          JOIN specializations s ON c.case_type = s.name
//          JOIN lawyer_specializations ls ON s.specialization_id = ls.specialization_id
//          JOIN lawyer_profiles lp ON ls.profile_id = lp.profile_id
//          WHERE c.status = 'open'
//            AND lp.user_id = $1`,
//       [lawyerId],
//     );
//     return result.rows;
//   } catch (error) {
//     console.error('Error in getAllCases:', error);
//     throw error;
//   }
// };

exports.postCase = async (clientId, profile) => {
  try {
    const {
      title,
      description,
      caseType,
      priority,
      estimatedDuration,
      budgetRange,
      deadlineDate,
    } = profile;
    const result = await db.query(
      `INSERT INTO cases (client_id,title,description,case_type,priority,estimated_duration,budget_range,deadline_date)  VALUES
              ($1,$2,$3,$4,$5,$6,$7,$8)
              RETURNING *;
          `,
      [
        clientId,
        title,
        description,
        caseType,
        priority,
        estimatedDuration,
        budgetRange,
        deadlineDate,
      ],
    );
    return result.rows;
  } catch (error) {
    console.error('Error in postCase:', error);
    throw error;
  }
};

exports.getCase = async (caseId) => {
  try {
    const result = await db.query(
      `SELECT
      c.*, users.first_name, users.country, users.phone, users.email
    FROM cases c
    JOIN users
      ON c.client_id = users.user_id
    WHERE c.case_id = $1
    `,
      [caseId],
    );
    return result.rows;
  } catch (error) {
    console.error('Error in getCase:', error);
    throw error;
  }
};

exports.deleteCase = async (caseId) => {
  try {
    await db.query(
      `DELETE FROM
      cases
      WHERE case_id=$1`,
      [caseId],
    );
  } catch (error) {
    console.error('Error in deleteCase:', error);
    throw error;
  }
};

exports.updateCase = async (updates, values, caseId) => {
  try {
    const result = await db.query(
      `UPDATE cases
    SET ${updates.join(', ')}
    WHERE case_id = ${caseId}
    RETURNING *
  `,
      values,
    );
    return result.rows;
  } catch (error) {
    console.error('Error in updateCase:', error);
    throw error;
  }
};
