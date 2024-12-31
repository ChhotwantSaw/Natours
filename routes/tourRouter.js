const express=require('express');
const tour=require('../controller/tourController');
const auth=require('./../controller/authController');
const reviewRouter=require('./reviewRouter');

const router=express.Router();
router.route('/get-monthly-plan/:year').get(auth.protect,auth.restrictTo('admin','lead-guide'),tour.getMonthlyPlan);
router.route('/tour-stats').get(tour.getTourStats);
router.route('/top-5-cheap').get(tour.aliasTopTours,tour.getAllTours);
router.route('/').get(tour.getAllTours).post(auth.protect,auth.restrictTo('admin','lead-guide'),tour.createTour);
router.route('/:id').get(tour.getTour).patch(auth.protect,auth.restrictTo('admin','lead-guide'),tour.updateTour).delete(auth.protect,auth.restrictTo('admin','lead-guide'),tour.deleteTour);

//nesting the route
router.use('/:tourId/reviews',reviewRouter);

// router.param('id',(req,res,next,val)=>{
//     console.log(val);
//     next();
// })
module.exports=router;