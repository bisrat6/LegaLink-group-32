const db = require('./db');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

exports.getAllApplications = async (caseId, queryString, clientId) => {
  // Initialize APIFeatures with query parameters
  const isOwner = await db.query(
    `SELECT case_id FROM cases WHERE client_id=$1`,
    [clientId],
  );
  const caseIds = isOwner.rows.map((row) => row.case_id);
  if (!caseIds.includes(caseId)) {
    throw new AppError('you are not authorized to see applications');
  }
  const apiFeatures = new APIFeatures(queryString).paginate();

  // Base query: use parameterized caseId
  const baseQuery = `
      SELECT * FROM case_applications
      WHERE case_id = $1
    `;

  // Prepend caseId to values array
  apiFeatures.values.unshift(caseId);
  apiFeatures.paramIndex++; // adjust index for subsequent filters
  // Build final query with values
  const { query, values } = apiFeatures.build(baseQuery);
  const result = await db.query(query, values);
  if (!result.rows.length) {
    throw new AppError('No applications found for this case', 404);
  }
  return result.rows;
};

exports.applyApplication = async (caseId, lawyerId, applicationData) => {
  const { message } = applicationData;
  const checkCase = await db.query(`SELECT * FROM cases WHERE case_id = $1`, [
    caseId,
  ]);
  if (!checkCase.rows[0]) {
    throw new AppError('No case found with this ID', 404);
  }
  if (checkCase.rows[0].status !== 'open') {
    throw new AppError('This case is not open for applications', 400);
  }

  const result = await db.query(
    `
          INSERT INTO case_applications (case_id, lawyer_id, message)
          VALUES ($1, $2, $3)
          RETURNING *;
          `,
    [caseId, lawyerId, message],
  );

  return result.rows[0];
};

exports.getApplicationsByLawyer = async (lawyerId, queryString) => {
  const apiFeatures = new APIFeatures(queryString);
  apiFeatures.paramIndex = 1;
  apiFeatures
    .filter(['status']) // include lawyer_id as filter
    .paginate();
  const baseQuery = `SELECT * FROM case_applications WHERE lawyer_id = $1`;

  const { query, values } = apiFeatures.build(baseQuery);
  const result = await db.query(query, [lawyerId, ...values]);
  if (result.rows.length === 0) {
    throw new AppError('No applications found for this lawyer', 404);
  }
  return result.rows;
};

exports.acceptApplication = async (applicationId) => {
  const result = await db.query(
    `
          UPDATE case_applications
          SET status = 'accepted'
          WHERE application_id = $1
          RETURNING *;
          `,
    [applicationId],
  );

  const caseId = result.rows[0].case_id;
  const lawyerId = result.rows[0].lawyer_id;

  await db.query(
    `UPDATE case_applications SET status = 'rejected' WHERE case_id = $2 AND application_id != $1;`,
    [applicationId, caseId],
  );

  await db.query(
    `UPDATE cases SET status='in_progress',lawyer_id=$1 WHERE case_id = $2;`,
    [lawyerId, caseId],
  );

  return result.rows[0];
};

exports.rejectApplication = async (applicationId) => {
  const result = await db.query(
    `UPDATE case_applications SET status = 'rejected' WHERE application_id = $1 RETURNING *;`,
    [applicationId],
  );
  return result.rows[0];
};
