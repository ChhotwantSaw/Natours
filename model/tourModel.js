const mongoose=require('mongoose');
const slugify=require('slugify');
const validator=require('validator');
const User=require('./userModel');
const tourSchema=new mongoose.Schema({
    name:{
        type:String,
        required:[true, 'A tour must have a name'],
        unique: true,
        trim:true,
        maxlength:[40,"A tour name must have 40 or less than characters"],
        minlength:[10,"A tour name must have 10 or more than characters"]
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
        required:[true,"A tour must have difficulty"],
        enum:{
            values:['easy','medium','difficult'],
            message:'Difficulty has to be easy, medium or difficult'
        }
    },
    ratingAvg:{
        type:Number,
        default:4.5,
        max:[5," rating has to be 5 or less"],
        min:[1," rating has to be 1 or more"]

    },
    ratingQuantity:{
        type:Number,
        default:0,

    },
    slug:String,
    price:{
        type:Number,
        required:[true, ' A Tour must have price']
    },
    priceDiscount:{
        type:Number,
        validate:{
            validator:function(val){
                return val<this.price;
            },
            message:"Discount ({VALUE}) is greater than price"
        }
    },
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
    secretTour:{
        type:Boolean,
        default:false
    },
    startLocation:{
        type:{
            type:String,
            default:"Point",
            enum:["Point"]
        },
        coordinates:[Number],
        address:String,
        description:String

    },
    locations:[{
        type:{
            type:String,
            default:"Point",
            enum:["Point"]
        },
        coordinates:[Number],
        address:String,
        description:String,
        day:Number
    }],
    guides:[
        {
            type:mongoose.Schema.ObjectId,
            ref:'User'
        }
    ],
    startDates:[Date]
},
{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
});

tourSchema.virtual('durationWeek').get(function(){
    return this.duration/7;
})

tourSchema.index({price:1,ratingsAverage:-1});
tourSchema.index({slug:1});

//Virtual Populate
tourSchema.virtual('reviews',{
    ref:'Review',
    foreignField:'tour',
    localField:'_id'
});

//DOCUMENT MIDDLEWARE runs before and after .save() and .create()
// tourSchema.pre('save',function(next){
//     console.log('will save documents');
//     next();
// })

// tourSchema.post('save',function(doc,next){
//     console.log(doc);
//     next();
// })

tourSchema.pre('save',function(next){
    this.slug= slugify(this.name,{lower:true});
    next();
})

//this is to check if users is the guides array exists or not
//  tourSchema.pre('save',async function(next){
//     const guidesPromises=this.guides.map(async id=> await User.findById(id));
//     const allGuides=await Promise.all(guidesPromises);
//     this.guides=allGuides.filter(id=> id!==null);

//     next();
//  })
//QUERY MIDDLEWARE
tourSchema.pre(/^find/,function(next){
    // console.log("Hi");
 this.find({secretTour:{$ne:true}});
 this.time=Date.now();
 next();
})

tourSchema.pre(/^find/,function(next){
    this.populate({
        path:'guides',
        select:'-__v -passwordChangedAt'
    })
    next();
});

tourSchema.post(/^find/,function(docs,next){
    // console.log(`${Date.now()-this.time} miliseconds`);
    next();
})

// tourSchema.pre('findOne',function(next){
//     // console.log("Hi");
//  this.find({secretTour:{$ne:true}});
//  next();
// })


//AGGREGATE MIDDLEWARE
tourSchema.pre('aggregate',function(next){
    this.pipeline().unshift({$match:{secretTour:{$ne:true}}});
    // console.log(this.pipeline());
    next();
})

const Tour= mongoose.model("Tour",tourSchema);
module.exports=Tour;