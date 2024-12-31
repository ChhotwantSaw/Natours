const catchAsync=require('./../utils/catchAsync');
const Review=require('./../model/reviewModel');
const handlerFactory=require('./handlerFactory');
const express = require('express');


// exports.getAllReview=catchAsync(async(req,res,next)=>{
//     let filter={}
//     if(req.params.tourId) filter={tour:req.params.tourId};
//     const allReviews= await Review.find(filter);
//     res.status(200).json({
//         status:"Success",
//         len:allReviews.length,
//         data:{
//             allReviews
//         }
//     })
// });
exports.addData=(req,res,next)=>{
    if(!req.body.tour) req.body.tour=req.params.tourId;
    if(!req.body.user) req.body.user=req.user.id;
    next();
}
// exports.createReview=catchAsync(async(req,res,next)=>{
//     if(!req.body.tour) req.body.tour=req.params.tourId;
//     if(!req.body.user) req.body.user=req.user.id;
//     // console.log(req.user);
//     const newReview=await Review.create(req.body);
//     res.status(201).json({
//         status:"Success",
//         len:newReview.length,
//         data:{
//             newReview
//         }
//     });
// });
exports.createReview=handlerFactory.createOne(Review);
exports.deleteReview=handlerFactory.deleteOne(Review);
exports.updateReview=handlerFactory.updateOne(Review);
exports.getAllReview=handlerFactory.getAll(Review);

