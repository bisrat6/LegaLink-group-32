const express = require('express');

const lawyerValidation = require('../middleware/lawyerValidation');
const userValidation = require('../middleware/userValidation');

const lawyerController = require('../controllers/lawyerController');

const router = express.Router();

router.route('/').get(lawyerController.getAllLawyers);

// Search route must come BEFORE parameterized routes
router.route('/search').get(lawyerController.filterLawyer);

// Create profile for a specific user
router
  .route('/profile')
  .post(
    lawyerValidation.validateLawyerProfile,
    lawyerController.createLawyerProfile,
  )
  .patch(
    lawyerValidation.validateUserUpdate,
    lawyerController.updateLawyerProfile,
  );

// Specific routes must come before parameterized routes
router.route('/my-reviews').get(lawyerController.getMyReviews);

// Update user/lawyer profile fields
router
  .route('/:id')
  .get(userValidation.validateIdParam('id'), lawyerController.getLawyer);

router
  .route('/:lawyerId/reviews')
  .get(
    userValidation.validateIdParam('lawyerId'),
    lawyerController.getLawyerReviews,
  );

router
  .route('/:id/verify')
  .patch(userValidation.validateIdParam('id'), lawyerController.verifyLawyer); //not implemented

module.exports = router;
