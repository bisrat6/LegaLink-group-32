const express = require('express');
const caseValidation = require('../middleware/caseValidation');
const caseController = require('../controllers/caseController');

const router = express.Router();

// Advanced filter route

// router.param('id', caseController.checkId);

router
  .route('/')
  .get(caseValidation.validateCaseQuery, caseController.getAllCases)
  .post(caseValidation.validatePostCase, caseController.postCase);

router
  .route('/:id')
  .get(caseController.getCase)
  .patch(caseValidation.validateUpdateCase, caseController.updateCase)
  .delete(caseController.deleteCase);

router.route('/:caseId/reviews').post(caseController.postReview);

module.exports = router;
