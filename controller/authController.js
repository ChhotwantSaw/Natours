const User=require('./../model/userModel');
const jwt=require('jsonwebtoken');
const crypto=require('crypto');
const catchAsync=require('./../utils/catchAsync');
const appError=require('./../utils/appError');
const sendEmail=require('./../utils/email');
const { promisify}=require('util');

const signToken=(id)=>{
    return jwt.sign({id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRES_IN
    })
}
const createSendToken=(user,statusCode,res)=>{
    const token= signToken(user.id);
    const cookieOptions={
        expires: new Date(Date.now()+process.env.JWT_COOKIE_EXPIRES_IN*24*60*60*1000),
        httpOnly:true
    }
    if(process.env.NODE_ENV=='production') cookieOptions.secure=true;
    res.cookie('jwt',token,cookieOptions);
    res.status(statusCode).json({
        status:"success",
        token:token,
        data:user
    })
}
exports.signup=catchAsync(async(req,res,next)=>{
    const newUser=await User.create({
        name:req.body.name,
        email:req.body.email,
        password:req.body.password,
        confirmPassword:req.body.password,
        role:req.body.role
    });
    createSendToken(newUser,201,res);
    // const token= signToken(newUser.id);

    // res.status(201).json({
    //     status:"success",
    //     token,
    //     data:newUser
    // })
});

exports.login=catchAsync(async(req,res,next)=>{
    const {email,password}=req.body;
    if(!email || !password){
        return next(new appError("Please provide email and password",400));
    }

    const user= await User.findOne({email}).select('+password');
    
    if(!user || !(await user.correctPassword(password,user.password))){
        console.log(user.password,password);
        return next( new appError("Please enter correct email and password",401));
    }
    console.log(req.user);
    createSendToken(user,200,res);
    //  const token =signToken(user.id);
    // res.status(200).json({
    //     status:"Success",
    //     Token:token,
        
    // })
})

exports.protect=catchAsync(async (req,res,next)=>{
    //Check if there is token or not
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer') ){
        token=req.headers.authorization.split(' ')[1]; 
    }
    
    if(!token) return next(new appError("You are not logged in! Please login to access. ",401))

    //Token Verification
    const decoded= await promisify(jwt.verify)(token,process.env.JWT_SECRET);
    // console.log(decoded);
    
    //Check If user still exists
    const freshUser=await User.findById(decoded.id);
    
    if(!freshUser){
        return  next(new appError("The User belonging to this token does no longer exists",401));
    }

    //Check if password is changed
    if(freshUser.changedPasswordAfter(decoded.iat)){
        return next(new appError('User recently changed password! Please log in again.',401));
    }

    //Grant Access to Protected Route
    req.user=freshUser;
    next();
})

exports.restrictTo=(...roles)=>{

    //roles=['admin','lead-guide']
    return (req,res,next)=>{
        if(!roles.includes(req.user.role)){
            next(new appError("You don't have permission to perform this action."),403);
        }
        next();
    }
}

exports.forgotPassword=catchAsync(async(req,res,next)=>{
    //Get User based on posted email
    const user=await User.findOne({email:req.body.email});
    if(!user) return next(new appError("There is no user with this email address",404));

    //Generate the random reset token
    const resetToken=user.createPasswordResetToken();
    await user.save({validateBeforeSave:false});

    //Send it users email
    const resetURL=`${req.protocol}://${req.get('host')}/api/v1/users/resetPassword/${resetToken}`;
    const message=`Forgot your password? Submit a PATCH request with your new password and confirm password to ${resetURL}\n 
    If you didn'y forget your password please ignore this email`;
    try{
        await sendEmail({
            email:user.email,
            subject:"Your password reset token. (valid for 10 min) ",
            message:message
        });
    
        res.status(200).json({
            status:"Success",
            message:"Token sent to email"
        })
    }
    catch(err){
        user.passwordResetToken=undefined;
        user.passwordResetExpires=undefined;
        await user.save({validateBeforeSave:false});
        return next(new appError("There was an error sending the email.",500));
    }

})

exports.resetPassword=catchAsync(async(req,res,next)=>{
    //Get User based on Token
    const hashedToken=crypto.createHash('sha256').update(req.params.token).digest('hex');
    const user=await User.findOne({passwordResetToken:hashedToken, passwordResetExpires:{$gt: Date.now()}});

    //Check if user exists 
    if(!user) return next(new appError("Token is invalid or Expired",400));
    user.password=req.body.password;
    user.confirmPassword=req.body.confirmPassword;
    user.passwordResetToken=undefined;
    user.passwordResetExpires=undefined;
    await user.save();


    //Login the user and send jwt
    const token =signToken(user.id);
    res.status(200).json({
        status:"Success",
        Token:token,
        
    })
});

exports.updatePassword=catchAsync (async(req,res,next)=>{
    //Get User from collection
    const user=await User.findById(req.user.id).select('+password');
    
    //Check if posted current password is correct
    if(!user.correctPassword(req.body.password,user.password)) return next(new appError("Password doesn't matching",401));

    //If so update password
    user.password=req.body.newPassword;
    user.confirmPassword=req.body.confirmNewPassword
    await user.save();
    
    //log user in send jwt
    createSendToken(user,200,res);
});