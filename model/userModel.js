const mongoose=require('mongoose');
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
    password:{
        type:String,
        required:[true,"Please provide your password"],
        minlength:8
    },
    confirmPassword:{
        type:String,
        required:[true,"Please confirm your password"],
    }
});

const User=mongoose.model('User',userSchema);
module.exports=User;