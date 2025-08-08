const express=require('express');

const applicationController=require('./../controllers/applicationController');

const router=express.Router();

router.route("/")
.get(applicationController.getAllApplication)
.post(applicationController.ApplyApplication);

router.route("/:id")
.get(applicationController.getApplication);

router.route("/:id/status")
.patch(applicationController.AcceptApplication);

module.exports=router;
