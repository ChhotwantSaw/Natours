const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require('bcrypt');
const crypto=require('crypto');
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'Please provide your name'],
    },
    email:{
        type:String,
        unique:true,
        required:[true, 'Please provide your email'],
        lowercase:true,
        validate:[validator.isEmail,'Please provide correct email']

    },
    photo:String,
    role:{
        type:String,
        enum:['user','guide','lead-guide','admin'],
        default:'user'
    },
    password:{
        type:String,
        required:[true,"Please provide your password"],
        minlength:8,
        select:false
    },
    confirmPassword:{
        type:String,
        required:[true,"Please confirm your password"],
        validate:{
            // This only works on CREATE and SAVE
            validator:function(el){
                return this.password===el;
            },
            message:'Password are not same'
        }
    },
    active:{
        type:Boolean,
        default:true,
        select:false
    },
    passwordChangedAt:Date,
    passwordResetToken:String,
    passwordResetExpires:Date
});

userSchema.pre('save',async function(next){
    //Only run this if password is actually modified
    if(!this.isModified('password')) return next();

    //Hash the password with cost of 12
    this.password=await bcrypt.hash(this.password,12);

    this.confirmPassword=undefined;
    next();
})

userSchema.pre('save',function(next){
    if(!this.isModified('password') ||this.isNew) return next();
    this.passwordChangedAt=Date.now()-1000;
    next();
})

userSchema.pre(/^find/,function(next){
    this.find({active:{$ne:false}});
    next();
})

userSchema.methods.correctPassword=async function(candidatePassword,userPassword){
    return await bcrypt.compare(candidatePassword,userPassword);
}

userSchema.methods.changedPasswordAfter= function(JWTTimestamp){
    if(this.passwordChangedAt){
        const changedTimeStamp=parseInt(this.passwordChangedAt.getTime()/1000,10);
        return JWTTimestamp<changedTimeStamp;
    }
    return false;
}

userSchema.methods.createPasswordResetToken=function(){
    //original token
    const resetToken=crypto.randomBytes(32).toString('hex');

    //Hashed token
    this.passwordResetToken=crypto.createHash('sha256').update(resetToken).digest('hex');
    this.passwordResetExpires=Date.now()+10*60*1000;
    return resetToken;
}

const User=mongoose.model('User',userSchema);
module.exports=User;