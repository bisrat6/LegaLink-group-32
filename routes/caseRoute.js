const express = require('express');
const caseValidation = require('../middleware/caseValidation');
const caseController = require('../controllers/caseController');
const caseData = require('../middleware/caseData');
const caseAuthorization = require('../middleware/caseAuthorization');

const router = express.Router();

// Advanced filter route

// router.param('id', caseController.checkId);

router
  .route('/')
  .get(caseValidation.validateCaseQuery, caseController.getAllCases)
  .post(caseValidation.validatePostCase, caseController.postCase);

router
  .route('/:caseId')
  .get(caseValidation.validateCaseId, caseController.getCase)
  .patch(
    caseValidation.validateCaseId,
    caseValidation.validateUpdateCase,
    caseData.fetchCaseBasic,
    caseAuthorization.validateStatusTransition,
    caseController.updateCase,
  )
  .delete(caseValidation.validateCaseId, caseController.deleteCase);

router
  .route('/:caseId/reviews')
  .post(
    caseValidation.validateCaseId,
    caseValidation.validateReview,
    caseController.postReview,
  );

module.exports = router;
