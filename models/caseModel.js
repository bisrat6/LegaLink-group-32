const db = require('./db');
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');

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
    `INSERT INTO cases (
      client_id, title, description, case_type, priority, 
      estimated_duration, budget_range, deadline_date, status
    ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, 'open')
    RETURNING *;`,
    [
      clientId,
      title.trim(),
      description.trim(),
      caseType,
      priority,
      estimatedDuration?.trim() || null,
      budgetRange || null,
      deadlineDate || null,
    ],
  );

  return result.rows[0];
};

exports.getCase = async (caseId) => {
  const result = await db.query(
    `SELECT
      c.*, 
      u.first_name, 
      u.last_name,
      u.country, 
      u.phone, 
      u.email,
      u.role as client_role
    FROM cases c
    JOIN users u ON c.client_id = u.user_id
    WHERE c.case_id = $1`,
    [caseId],
  );

  if (result.rows.length === 0) {
    throw new AppError('Case not found', 404);
  }

  return result.rows[0];
};


exports.updateCase = async (updates, values, caseId) => {
  // 'updates' already contains properly parameterized fragments like "column=$1"
  const setClause = updates.join(', ');
  
  const result = await db.query(
    `UPDATE cases
    SET ${setClause}, updated_at = CURRENT_TIMESTAMP
    WHERE case_id = $${values.length + 1} AND status NOT IN ('closed', 'cancelled')
    RETURNING *`,
    [...values, caseId],
  );
  
  if (result.rows.length === 0) {
    throw new AppError('Failed to update case', 500);
  }
  
  return result.rows[0];
};

exports.deleteCase = async (caseId) => {
  // Check for related records before deletion
  const applicationsCheck = await db.query(
    'SELECT COUNT(*) FROM case_applications WHERE case_id = $1',
    [caseId]
  );

  if (parseInt(applicationsCheck.rows[0].count) > 0) {
    throw new AppError('Cannot delete case with pending applications', 400);
  }

  const documentsCheck = await db.query(
    'SELECT COUNT(*) FROM documents WHERE case_id = $1',
    [caseId]
  );

  if (parseInt(documentsCheck.rows[0].count) > 0) {
    throw new AppError('Cannot delete case with attached documents', 400);
  }

  // Use transaction for safe deletion
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');
    
    // Delete related records first
    await client.query('DELETE FROM case_applications WHERE case_id = $1', [caseId]);
    
    // Delete the case
    const result = await client.query(
      'DELETE FROM cases WHERE case_id = $1 RETURNING *',
      [caseId]
    );
    
    await client.query('COMMIT');
    
    return result.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};
exports.postReview = async (caseId, review) => {
  const { rating, comment, reviewerId } = review;

  // Check if user already reviewed this case
  const existingReview = await db.query(
    'SELECT review_id FROM reviews WHERE case_id = $1 AND reviewer_id = $2',
    [caseId, reviewerId]
  );

  if (existingReview.rows.length > 0) {
    throw new AppError('You have already reviewed this case', 400);
  }

  // Get case details to get lawyer ID
  const caseCheck = await db.query(
    'SELECT lawyer_id FROM cases WHERE case_id = $1 AND status IN (\'closed\')',
    [caseId]
  );

  if (caseCheck.rows.length === 0) {
    throw new AppError('Case not found', 404);
  }

  const lawyerId = caseCheck.rows[0].lawyer_id;

  // Use transaction for all operations
  const client = await db.connect();
  
  try {
    await client.query('BEGIN');

    // Insert review
    const reviewResult = await client.query(
      `INSERT INTO reviews (case_id, reviewer_id, reviewed_lawyer_id, rating, review_text)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *;`,
      [caseId, reviewerId, lawyerId, rating, comment.trim()]
    );

    // Update case status to closed
    await client.query(
      `UPDATE cases SET status = 'closed', updated_at = CURRENT_TIMESTAMP WHERE case_id = $1`,
      [caseId]
    );

    // Update lawyer's average rating and total reviews
    await client.query(
      `UPDATE lawyer_profiles 
       SET average_rating = (
         SELECT COALESCE(AVG(rating), 0) 
         FROM reviews 
         WHERE reviewed_lawyer_id = $1
       ),
       total_reviews = (
         SELECT COUNT(*) 
         FROM reviews 
         WHERE reviewed_lawyer_id = $1
       )
       WHERE user_id = $1`,
      [lawyerId]
    );

    await client.query('COMMIT');
    
    return reviewResult.rows[0];
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Get case statistics for users
exports.getCaseStats = async (userId, userRole) => {
  let query;
  let params = [];

  if (userRole === 'client') {
    query = `
      SELECT 
        COUNT(*) as total_cases,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_cases,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_cases,
        COUNT(CASE WHEN status = 'pending_review' THEN 1 END) as pending_review_cases,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_cases,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_cases
      FROM cases 
      WHERE client_id = $1
    `;
    params = [userId];
  } else if (userRole === 'lawyer') {
    query = `
      SELECT 
        COUNT(*) as total_cases,
        COUNT(CASE WHEN status = 'open' THEN 1 END) as open_cases,
        COUNT(CASE WHEN status = 'in_progress' THEN 1 END) as in_progress_cases,
        COUNT(CASE WHEN status = 'pending_review' THEN 1 END) as pending_review_cases,
        COUNT(CASE WHEN status = 'closed' THEN 1 END) as closed_cases,
        COUNT(CASE WHEN status = 'cancelled' THEN 1 END) as cancelled_cases
      FROM cases 
      WHERE lawyer_id = $1
    `;
    params = [userId];
  } else {
    throw new AppError('Invalid user role for case statistics', 400);
  }

  const result = await db.query(query, params);
  return result.rows[0];
};

// Check if case can be deleted
exports.canDeleteCase = async (caseId) => {
  const caseCheck = await db.query(
    'SELECT status, lawyer_id FROM cases WHERE case_id = $1',
    [caseId]
  );

  if (caseCheck.rows.length === 0) {
    throw new AppError('Case not found', 404);
  }

  const caseData = caseCheck.rows[0];

  if (caseData.status === 'in_progress' || caseData.lawyer_id) {
    throw new AppError('Cannot delete case that is in progress or assigned to a lawyer', 400);
  }

  // Check for related records
  const applicationsCheck = await db.query(
    'SELECT COUNT(*) FROM case_applications WHERE case_id = $1',
    [caseId]
  );

  if (parseInt(applicationsCheck.rows[0].count) > 0) {
    throw new AppError('Cannot delete case with pending applications', 400);
  }

  const documentsCheck = await db.query(
    'SELECT COUNT(*) FROM documents WHERE case_id = $1',
    [caseId]
  );

  if (parseInt(documentsCheck.rows[0].count) > 0) {
    throw new AppError('Cannot delete case with attached documents', 400);
  }

  return true;
};

// Check if case can be reviewed
exports.canReviewCase = async (caseId, reviewerId) => {
  const caseCheck = await db.query(
    'SELECT client_id, lawyer_id, status FROM cases WHERE case_id = $1',
    [caseId]
  );

  if (caseCheck.rows.length === 0) {
    throw new AppError('Case not found', 404);
  }

  const caseData = caseCheck.rows[0];

  if (caseData.client_id !== reviewerId) {
    throw new AppError('Only case owner can review this case', 403);
  }

  if (!caseData.lawyer_id) {
    throw new AppError('Cannot review case without assigned lawyer', 400);
  }

  if (caseData.status !== 'in_progress' && caseData.status !== 'pending_review') {
    throw new AppError('Case must be in progress or pending review to be reviewed', 400);
  }

  return true;
};
