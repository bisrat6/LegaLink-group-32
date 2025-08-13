const db = require('./db');
const APIFeatures = require('../utils/apiFeatures');

exports.applyApplication = async (caseId, lawyerId, applicationData) => {
  try {
    const { message } = applicationData;

    const result = await db.query(
      `
          INSERT INTO case_applications (case_id, lawyer_id, message)
          VALUES ($1, $2, $3)
          RETURNING *;
          `,
      [caseId, lawyerId, message],
    );

    return result.rows[0];
  } catch (error) {
    console.error('Error in applyApplication:', error);
    throw error;
  }
};

exports.getAllApplications = async (caseId, queryString) => {
  try {
    // Initialize APIFeatures with query parameters
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

    return result.rows;
  } catch (error) {
    console.error('Error in getAllApplications:', error);
    throw error;
  }
};

exports.getApplicationsByLawyer = async (lawyerId, queryString) => {
  try {
    // Merge lawyerId into queryString for APIFeatures
    const filters = { ...queryString, lawyer_id: lawyerId };

    const apiFeatures = new APIFeatures(filters)
      .filter(['lawyer_id', 'status']) // include lawyer_id as filter
      .paginate();

    const baseQuery = `SELECT * FROM case_applications`;

    const { query, values } = apiFeatures.build(baseQuery);
    const result = await db.query(query, values);

    return result.rows;
  } catch (error) {
    console.error('Error in getApplicationsByLawyer:', error);
    throw error;
  }
};

exports.acceptApplication = async (applicationId) => {
  try {
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
  } catch (error) {
    console.error('Error in acceptApplication:', error);
    throw error;
  }
};

exports.rejectApplication = async (applicationId) => {
  try {
    const result = await db.query(
      `UPDATE case_applications SET status = 'rejected' WHERE application_id = $1 RETURNING *;`,
      [applicationId],
    );
    return result.rows[0];
  } catch (error) {
    console.error('Error in rejectApplication:', error);
    throw error;
  }
};
