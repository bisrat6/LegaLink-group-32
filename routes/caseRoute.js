const express = require('express');
const caseValidation = require('../middleware/caseValidation');
const caseController = require('../controllers/caseController');
const caseData = require('../middleware/caseData');
const caseAuthorization = require('../middleware/caseAuthorization');
const authController = require('../controllers/authController');

const router = express.Router();

router
  .route('/')
  .get(
    authController.protect,
    caseValidation.validateCaseQuery,
    caseController.getAllCases,
  )
  .post(
    authController.protect,
    authController.restrictTo('client'),
    caseValidation.validatePostCase,
    caseController.postCase,
  );

router
  .route('/:caseId')
  .get(
    authController.protect,
    authController.restrictTo('lawyer'),
    caseValidation.validateCaseId,
    caseController.getCase,
  )
  .patch(
    authController.protect,
    authController.restrictTo('client'),
    caseValidation.validateCaseId,
    caseValidation.validateUpdateCase,
    caseData.fetchCaseBasic,
    caseAuthorization.validateStatusTransition,
    caseController.updateCase,
  )
  .delete(
    authController.protect,
    authController.restrictTo('client'),
    caseValidation.validateCaseId,
    caseController.deleteCase,
  );

router
  .route('/:caseId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('client'),
    caseValidation.validateCaseId,
    caseValidation.validateReview,
    caseController.postReview,
  );

module.exports = router;
