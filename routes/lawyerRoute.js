const express=require('express');

const lawyerController=require('./../controllers/lawyerController');

const router=express.Router();

router.route("/")
.get(lawyerController.getAllLawyers)
.post(lawyerController.createLawyerProfile);

router.route("/:id")
.get(lawyerController.getLawyer)
.put(lawyerController.updateLawyerProfile);

router.route("/:id/verify")
.patch(lawyerController.verfiyLawyer);



module.exports=router;