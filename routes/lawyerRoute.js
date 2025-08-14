const express = require('express');

const lawyerValidation = require('../middleware/lawyerValidation');

const lawyerController = require('../controllers/lawyerController');

const router = express.Router();

router
  .route('/')
  .get(lawyerController.getAllLawyers)
  .post(
    lawyerValidation.validateLawyerProfile,
    lawyerController.createLawyerProfile,
  )
  .patch(
    lawyerValidation.validateUserUpdate,
    lawyerController.updateLawyerProfile,
  );

router
  .route('/search')
  .get(lawyerValidation.validateLawyerSearch, lawyerController.filterLawyer);

// Specific routes must come before parameterized routes
router.route('/my-reviews').get(lawyerController.getMyReviews);

router.route('/:id').get(lawyerController.getLawyer);
router.route('/:lawyerId/reviews').get(lawyerController.getLawyerReviews);

router.route('/:id/verify').patch(lawyerController.verifyLawyer); //not implemented

module.exports = router;
