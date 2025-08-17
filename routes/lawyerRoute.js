const express = require('express');

const lawyerValidation = require('../middleware/lawyerValidation');
const userValidation = require('../middleware/userValidation');
const authController = require('../controllers/authController');
const lawyerController = require('../controllers/lawyerController');

const router = express.Router();

router.route('/').get(authController.protect, lawyerController.getAllLawyers);
// Search route must come BEFORE parameterized routes
router
  .route('/search')
  .get(authController.protect, lawyerController.filterLawyer);

// Create profile for a specific user
router
  .route('/profile')
  .post(
    authController.protect,
    authController.restrictTo('lawyer'),
    lawyerValidation.validateLawyerProfile,
    lawyerController.createLawyerProfile,
  )
  .patch(
    authController.protect,
    authController.restrictTo('lawyer'),
    lawyerValidation.validateUserUpdate,
    lawyerController.updateLawyerProfile,
  );

// Specific routes must come before parameterized routes
router
  .route('/my-reviews')
  .get(
    authController.protect,
    authController.restrictTo('lawyer'),
    lawyerController.getMyReviews,
  );

// Update user/lawyer profile fields
router
  .route('/:id')
  .get(
    authController.protect,
    userValidation.validateIdParam('id'),
    lawyerController.getLawyer,
  );

router
  .route('/:lawyerId/reviews')
  .get(
    authController.protect,
    authController.restrictTo('client'),
    userValidation.validateIdParam('lawyerId'),
    lawyerController.getLawyerReviews,
  );

router
  .route('/:id/verify')
  .patch(
    authController.protect,
    authController.restrictTo('admin'),
    userValidation.validateIdParam('id'),
    lawyerController.verifyLawyer,
  ); //not implemented

module.exports = router;
