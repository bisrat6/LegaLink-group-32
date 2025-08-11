const db = require('./db');

exports.getAllCases = async (lawyerId) => {
  const result = await db.query(
    `SELECT c.*
       FROM cases c
       JOIN specializations s ON c.case_type = s.name
       JOIN lawyer_specializations ls ON s.specialization_id = ls.specialization_id
       JOIN lawyer_profiles lp ON ls.profile_id = lp.profile_id
       WHERE c.status = 'open'
         AND lp.user_id = $1`,
    [lawyerId],
  );
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
    WHERE case_id=$1`,
    [caseId],
  );
};

exports.updateCase = async (updates, values, caseId) => {
  const result = await db.query(
    `UPDATE cases
  SET ${updates.join(', ')}
  WHERE case_id = ${caseId}
  RETURNING *
`,
    values,
  );
  return result.rows;
};
