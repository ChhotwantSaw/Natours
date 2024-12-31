const express=require('express');
const reviewController=require('./../controller/reviewController');
const authController=require('./../controller/authController');
const router=express.Router({mergeParams:true}); //It will help to get the params which is not in this router but from this route is coming

router.use(authController.protect);
router.route('/').get(reviewController.getAllReview).post(authController.restrictTo('user'),reviewController.addData,reviewController.createReview);
router.route('/:id').delete(authController.restrictTo('user','admin'),reviewController.deleteReview).patch(authController.restrictTo('user','admin'),reviewController.updateReview);
module.exports=router;