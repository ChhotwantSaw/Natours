const express=require('express');
const tour=require('../controller/tourController');
const router=express.Router();
router.route('/get-monthly-plan/:year').get(tour.getMonthlyPlan);
router.route('/tour-stats').get(tour.getTourStats);
router.route('/top-5-cheap').get(tour.aliasTopTours,tour.getAllTours);
router.route('/').get(tour.getAllTours).post(tour.createTour);
router.route('/:id').get(tour.getTour).patch(tour.updateTour).delete(tour.deleteTour);

// router.param('id',(req,res,next,val)=>{
//     console.log(val);
//     next();
// })
module.exports=router;