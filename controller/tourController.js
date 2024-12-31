const { parse } = require('dotenv');
const { json } = require('express');
const appError = require('../utils/appError');
const Tour=require('./../model/tourModel');
const catchAsync=require("./../utils/catchAsync");
const handleFactory=require('./handlerFactory');




// const fs=require('fs');
// const tours=JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// exports.checkBody=(req,res,next)=>{
//     if(!req.body.name || !req.body.price){
//         return res.status(400).json({
//             status: 'fail',
//             message:'missing name or price'
//         })
//     }
//     next();
// }

exports.aliasTopTours= (req,res,next)=>{
    req.query.limit='5';
    req.query.sort='-ratingAvg,price';
    req.query.fields='name,price,ratingAvg,duration';
    next();
}






// try {
   
// }
// catch(err){
//     res.status(400).json({
//         status:'Fail',
//         message:err
//     })
// }
// }

exports.getTourStats=catchAsync(async(req,res,next)=>{
    // try{
        const stats=await Tour.aggregate([
            {   $match: {   ratingAvg:  { $gte:4.5  }   }  
             },
            {
                $group:{
                    _id: '$difficulty',
                    numTours:{$sum: 1},
                    numRatings:{$sum: '$ratingQuantity'},
                    avgRatings:{$sum: '$ratingAvg'},
                    avgPrice:{$avg:'$price'},
                    minPrice:{$min:'$price'},
                    maxPrice:{$max:'$price'}

                }
            },
            {
                $sort:{
                    avgPrice:1
                }
            },
            // {
            //     $match:{ _id:{ $ne:'easy'}}
            // }
        ]);
        res.status(200).json({
            status:'Success',
            data:stats
        })
    // }
    // catch(err){
    //     res.status(400).json({
    //         status:'Fail',
    //         message:err
    //     })
    // }
})

exports.getMonthlyPlan=catchAsync(async(req,res,next)=>{
    // try{
        const year=req.params.year*1;
        const plan=await Tour.aggregate([
            {
                $unwind:'$startDates'
            },
            {
                $match:{
                    startDates:{
                        $gte:new Date(`${year}-01-01`),
                        $lte:new Date(`${year}-12-31`),
                    }
                }
            },
            {
                $group:{
                    _id:{ $month:'$startDates'},
                    numTourStarts:{ $sum:1 } ,
                    tours:{ $push:'$name'}
                }
            },
            {
                $addFields:{
                    month:'$_id'
                }
            },
            {
                $project:{
                    _id:0
                }

            },
            {
                $sort:{ numTourStarts:-1}
            },
            {
                $limit:8
            }
        ]);
        res.status(200).json({
            status:'Success',
            length:plan.length,
            data:plan
        })
    // }
    // catch(err){
    //     res.status(400).json({
    //         status:'Fail',
    //         message:err
    //     })
    // }

})

// exports.getAllTours= catchAsync(async (req,res,next)=>{
//     try
//    {    
    // difficulty=easy&duration[gte]=5&page=2&
        //Building the query
        
        // const queryObj={...req.query};

        //  //Filtering
        // const excludedFields=['limit','sort','page','fields'];
        // excludedFields.forEach(el=> delete queryObj[el]);

        // //Advance Filtering
        // let queryStr=JSON.stringify(queryObj);
        // queryStr=queryStr.replace(/\b(gte|gt|lt|lte)\b/g, el=> `$${el}`);
        // let query=  Tour.find(JSON.parse(queryStr));
     
        //Sorting
        // console.log(req.query.sort);
        // if(req.query.sort){   
        //     query= query.sort(req.query.sort.split(',').join(' '));
        // }
        // else{
        //     query=query.sort('-createdAt');
        // }

        // //Fields Limiting

        // if(req.query.fields){
        //     query=query.select(req.query.fields.split(',').join(' '));
        // }
        // else{
        //     query=query.select('-__v');
        // }
        
        // //Pagination

        // const skip=req.query.page?req.query.page*1:1;
        // const limit=req.query.limit?req.query.limit*1:100;
        // if(req.query.page || req.query.limit){
        //     if((skip-1)*limit>=await Tour.countDocuments()) throw new Error("Page Doesn't exist");
        //     query=query.skip(skip-1).limit(limit);
        // }
        // else{
        //     query=query.limit(100);
        // }
        // const features=new API(Tour.find(),req.query).filter().sort().fieldLimit().pagination();
        // const tours= await features.query;        
        // res.status(200).json(
        //     {
        //     status:"success",
        //     length:tours.length,
        //     data:tours
        //     }

        // );
    // }
    // catch(err){
    //     console.log(err);
    //     res.status(400).json({
    //         status:'Fail',
    //         message: err
    //     })
    // }
// });
// exports.addTour=(req,res,next)=>{
//     // const newId=tours[tours.length-1].id+1;
//     const newObj=Object.assign({id:newId},req.body);
   
//     // res.send('done');
// };

// exports.getTour= catchAsync(async (req,res,next)=>{
//     // try{
//         const tours=await Tour.findById(req.params.id).populate('reviews');
//         if(!tours){
//             return next(new appError("No Tour Found",404));
//         }
//         res.status(200).json(
//             {
//             status:"success",
//             // result:tours.length,
//             data:{
//                 tours
//                 //  tour:tours.find(el=>el.id==req.params.id)
//             }
//             }
    
//         );
//     // }
//     // catch(err){
//     //     res.status(400).json({
//     //         status:"Failed",
//     //         Message :err
//     //     })
//     // }
// });

// exports.updateTour=catchAsync( async(req,res,next)=>{
//     // try{
//         const tour=await Tour.findByIdAndUpdate(req.params.id,req.body,{
//             new:true,
//             runValidators:true,
//         });
//         // const tour=await Tour.findById(req.params.id);
//         res.status(201).json({
//             status:"Success",
//             data:{
//                 tour
//             }    
//         })
//     // }
//     // catch(err){
//     //     res.status(400).json({
//     //         status:"Failed",
//     //         Message: err
//     //     })
//     // }

   
// });

exports.deleteTour=handleFactory.deleteOne(Tour);
exports.updateTour=handleFactory.updateOne(Tour);
exports.createTour=handleFactory.createOne(Tour);
exports.getTour=handleFactory.getOne(Tour,{path:'reviews'});
exports.getAllTours=handleFactory.getAll(Tour);
// exports.deleteTour= catchAsync(async(req,res,next)=>{
//     // try{
//         await Tour.findByIdAndDelete(req.params.id);
//         res.status(204).json({
//             status:"Success",
//             data:null
//         })
//     // }
//     // catch(err){
//     //     res.status(400).json(
//     //         {status:"Failed",
//     //         message:"Deletion failed"}
//     //     )
//     // }
// });