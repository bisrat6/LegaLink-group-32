const express = require('express');

const lawyerController = require('../controllers/lawyerController');

const router = express.Router();

router
  .route('/')
  .get(lawyerController.getAllLawyers)
  .post(lawyerController.createLawyerProfile)
  .patch(lawyerController.updateLawyerProfile);

router.route('/search').get(lawyerController.filterLawyer);

router.route('/:id').get(lawyerController.getLawyer);

router.route('/:id/verify').patch(lawyerController.verfiyLawyer); //not implemented

module.exports = router;
