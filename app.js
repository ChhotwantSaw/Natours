const { Console } = require('console');
const express=require('express');
const fs=require('fs');
const morgan=require('morgan');
const app=express();
const userRouter=require('./routes/userRouter');
const tourRouter=require('./routes/tourRouter');
const reviewRouter=require('./routes/reviewRouter.js');
const appError=require('./utils/appError.js');
const globalError=require('./controller/errorController');
const rateLimit=require('express-rate-limit');
const helmet=require('helmet');
const mongoSanitize=require('express-mongo-sanitize');
const xss=require('xss-clean');
const hpp=require('hpp');

//GLOBAL MIDDLEWARE

//Set security http header
app.use(helmet());

if(process.env.NODE_ENV=='dev') app.use(morgan('dev'));

const limiter=rateLimit({
    max:100,
    windowMs:60*60*1000,
    message:"Too many requests from this IP, please try again in an hour!"
});

//Limiting requests per IP
app.use('/api',limiter);

//Body parser, read data from body to req.body
app.use(express.json({ limit:'10kb'}));

//Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

//Prevent parameter pollution
app.use(hpp({
    whitelist:['duration','ratingQuantity','ratingAvg','maxGroupSize','difficulty','price']
}))


// app.use((req,res,next)=>{
//     req.time=new Date().toISOString();
//     next();
// })

//Serving static files
app.use('/api/v1/users',userRouter);
app.use('/api/v1/tours',tourRouter);
app.use('/api/v1/reviews',reviewRouter);
app.all('*',(req,res,next)=>{
    const err=new appError(`can't find ${req.originalUrl} on the server`,404);
    next(err);
})

app.use(globalError);

module.exports=app;



