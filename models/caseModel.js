const db = require('./db');
const APIFeatures = require('../utils/apiFeatures');

exports.getAllCases = async (queryString) => {
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
  let baseQuery = `
      SELECT c.case_id, c.title, c.status, c.priority, c.case_type,
             c.client_id, c.lawyer_id, c.created_at
      FROM cases c
    `;
  if (!queryString.status) {
    baseQuery += ` WHERE c.status = 'open' AND c.lawyer_id IS NULL`;
  }

  const { query, values } = apiFeatures.build(baseQuery);
  const result = await db.query(query, values);

  return result.rows;
};

exports.postCase = async (clientId, profile) => {
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
};

exports.getCase = async (caseId) => {
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
};

exports.deleteCase = async (caseId) => {
  await db.query(
    `DELETE FROM
    cases
    WHERE case_id=$1
    RETURNING *;`,
    [caseId],
  );
};

exports.updateCase = async (updates, values, caseId) => {
  // Build safe parameterized query
  const setClause = updates
    .map((field, index) => `${field} = $${index + 1}`)
    .join(', ');
  const result = await db.query(
    `UPDATE cases
    SET ${setClause}
    WHERE case_id = $${updates.length + 1}
    RETURNING *
  `,
    [...values, caseId],
  );
  return result.rows;
};

exports.postReview = async (caseId, review) => {
  const temp = await db.query(
    `
      SELECT lawyer_id,client_id FROM cases WHERE case_id = $1
    `,
    [caseId],
  );
  const { rating, comment, reviewerId } = review;
  const lawyerId = temp.rows[0].lawyer_id;
  const clientId = temp.rows[0].client_id;
  if (clientId !== reviewerId) {
    throw new Error('You are not authorized to review this case');
  }
  const result = await db.query(
    `INSERT INTO reviews (case_id, reviewer_id, reviewed_lawyer_id, rating, review_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
    [caseId, reviewerId, lawyerId, rating, comment],
  );
  // Update the case status to 'closed' after review
  await db.query(`UPDATE cases SET status = 'closed' WHERE case_id = $1`, [
    caseId,
  ]);
  //update the lawyer's average rating
  await db.query(
    `UPDATE lawyer_profiles SET average_rating = (
         SELECT AVG(rating) FROM reviews WHERE reviewed_lawyer_id = $1
       ) WHERE user_id = $1`,
    [lawyerId],
  );
  return result.rows[0];
};
