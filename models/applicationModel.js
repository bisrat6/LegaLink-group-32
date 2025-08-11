const db = require('./db');

exports.applyApplication = async (caseId, lawyerId, applicationData) => {
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
};

exports.getAllApplications = async (caseId) => {
  const result = await db.query(
    `
        SELECT * FROM case_applications
        WHERE case_id = $1;
        `,
    [caseId],
  );

  return result.rows;
};

exports.getApplicationsByLawyer = async (lawyerId) => {
  const result = await db.query(
    `
        SELECT * FROM case_applications
        WHERE lawyer_id = $1;
        `,
    [lawyerId],
  );

  return result.rows;
};

exports.acceptApplication = async (applicationId) => {
  const result = await db.query(
    `
        UPDATE case_applications
        SET status = 'accepted'
        WHERE id = $1
        RETURNING *;
        `,
    [applicationId],
  );

  const caseId = result.rows[0].case_id;

  await db.query(
    `UPDATE applications SET status = 'rejected' WHERE case_id = $2 AND application_id != $1;`,
    [applicationId, caseId],
  );

  return result.rows[0];
};

//dont forget to add the routes on the applicationRoutes.js
