const { Console } = require('console');
const express=require('express');
const fs=require('fs');
const morgan=require('morgan');
const app=express();
const userRouter=require('./routes/userRouter');
const tourRouter=require('./routes/tourRouter')
const appError=require('./utils/appError.js');
const globalError=require('./controller/errorController');
app.use(morgan('dev'));
app.use(express.json());






// app.use((req,res,next)=>{
//     req.time=new Date().toISOString();
//     next();
// })

app.use('/api/v1/users',userRouter);
app.use('/api/v1/tours',tourRouter);
app.all('*',(req,res,next)=>{
    const err=new appError(`can't find ${req.originalUrl} on the server`,404);
    next(err);
})

app.use(globalError);

module.exports=app;



