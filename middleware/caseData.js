const db = require('../models/db');
const AppError = require('../utils/appError');

// Middleware to fetch case data and attach it to req.case
exports.fetchCaseData = async (req, res, next) => {
  try {
    const { caseId } = req.params;

    if (!caseId || isNaN(caseId)) {
      return next(new AppError('Invalid case ID provided', 400));
    }

    // Fetch case data with client information
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
      return next(new AppError('Case not found', 404));
    }

    // Attach case data to request object
    req.case = result.rows[0];
    next();
  } catch (error) {
    next(new AppError('Error fetching case data', 500));
  }
};

// Middleware to fetch case data for applications
exports.fetchCaseForApplication = async (req, res, next) => {
  try {
    const { caseId } = req.params;

    if (!caseId || isNaN(caseId)) {
      return next(new AppError('Invalid case ID provided', 400));
    }

    // Fetch basic case data needed for application validation
    const result = await db.query(
      `SELECT case_id, status, lawyer_id, client_id FROM cases WHERE case_id = $1`,
      [caseId],
    );

    if (result.rows.length === 0) {
      return next(new AppError('Case not found', 404));
    }

    // Attach case data to request object
    req.case = result.rows[0];
    next();
  } catch (error) {
    next(new AppError('Error fetching case data', 500));
  }
};

// Middleware to check if case exists and is accessible
exports.caseExists = async (req, res, next) => {
  try {
    const { caseId } = req.params;

    if (!caseId || isNaN(caseId)) {
      return next(new AppError('Invalid case ID provided', 400));
    }

    // Simple existence check
    const result = await db.query(
      'SELECT case_id FROM cases WHERE case_id = $1',
      [caseId],
    );

    if (result.rows.length === 0) {
      return next(new AppError('Case not found', 404));
    }

    next();
  } catch (error) {
    next(new AppError('Error checking case existence', 500));
  }
};

// Middleware to fetch case with minimal data for basic operations
exports.fetchCaseBasic = async (req, res, next) => {
  try {
    const { caseId } = req.params;

    if (!caseId || isNaN(caseId)) {
      return next(new AppError('Invalid case ID provided', 400));
    }

    // Fetch minimal case data
    const result = await db.query(
      'SELECT case_id, client_id, lawyer_id, status FROM cases WHERE case_id = $1',
      [caseId],
    );

    if (result.rows.length === 0) {
      return next(new AppError('Case not found', 404));
    }

    // Attach case data to request object
    req.case = result.rows[0];
    next();
  } catch (error) {
    next(new AppError('Error fetching case data', 500));
  }
};
