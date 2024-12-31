const appError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const User=require('./../model/userModel');
const handlerFactory=require('./handlerFactory');

// exports.getAllUsers=catchAsync(async (req,res,next)=>{
//     const users= await User.find();        
//     res.status(200).json(
//             {
//             status:"success",
//             length:users.length,
//             data:users
//             }
// )});

// exports.getUser=((req,res)=>{

// })

// exports.createUser=(req,res)=>{
//     res.status(500).json(
//         {
//         status:"error",
        
//         data:"No data found"
//         }

//     );
// };


// exports.updateUser=(req,res)=>{
//     res.status(500).json(
//         {
//         status:"error",
        
//         data:"No data "
//         }

//     );
// };

// exports.deleteUser=(req,res)=>{
//     res.status(500).json(
//         {
//         status:"error",
        
//         data:"No data found"
//         }

//     );
// };

const filteredObj=(obj,...allowedFields)=>{
    const allowed={};
    Object.keys(obj).forEach(el=>{
        if(allowedFields.includes(el)) allowed[el]=obj[el];
    })
    return allowed;
}
exports.updateMe=catchAsync(async (req,res,next)=>{

    //1. Check is password in a req body. return error if it is as password change is not allowed in this route.
    if(req.body.password || req.body.confirmPassword){
        return next(new appError("This route is not for password update, Plaese use /updateMyPassword",400));
    }
    
    // 2. Filtered out unwanted field names that are not allowed to be updated
    const filteredBody=filteredObj(req.body,'name','email');
    
    // 3. Update user document
    const updatedUser=await User.findByIdAndUpdate(req.user.id,filteredBody,{
        new:true,
        runValidators:true
    });
    
    res.status(200).json({
        status:"Success",
        data:updatedUser
    })
});

exports.deleteMe=catchAsync(async(req,res,next)=>{
    await User.findByIdAndUpdate(req.user.id,{active:false});

    res.status(204).json({
        status:"success",
        data:null
    })
})

exports.getMe=(req,res,next)=>{
    req.params.id=req.user.id;
    next();
}

exports.deleteUser=handlerFactory.deleteOne(User);
exports.updateUser=handlerFactory.updateOne(User);
exports.createUser=handlerFactory.createOne(User);
exports.getAllUsers=handlerFactory.getAll(User);
exports.getUser=handlerFactory.getOne(User);