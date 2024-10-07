const mongoose=require('mongoose');
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A tour must have a name'],
        unique: true,
        trim:true
    },
    duration:{
        type:Number,
        required:[true,'A tour must have duration']
    },
    maxGroupSize:{
        type:Number,
        required:[true,"A tour must have max group size"]
    },
    difficulty:{
        type:String,
        required:[true,"A tour must have difficulty"]
    },
    ratingAvg:{
        type:Number,
        default:4.5,

    },
    ratingQuantity:{
        type:Number,
        default:0,

    },
    price:{
        type:Number,
        required:[true, ' A Tour must have price']
    },
    priceDiscount:Number,
    summary:{
        type:String,
        trim:true,
        required:[true, 'A tour must have summary']
    },
    description:{
        type:String,
        trim:true,
        select:false
    },
    imageCover:{
        type:String,
        required:[true, 'A tour must have cover image']
    },
    image:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    },
    startDates:[Date]
});

const Tour= mongoose.model("Tour",tourSchema);
module.exports=Tour;