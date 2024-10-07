const { Console } = require('console');
const express=require('express');
const fs=require('fs');
const morgan=require('morgan');
const app=express();
const userRouter=require('./routes/userRouter');
const tourRouter=require('./routes/tourRouter')
app.use(morgan('dev'));
app.use(express.json());





app.use((req,res,next)=>{
    req.time=new Date().toISOString();
    next();
})

app.use('/api/v1/users',userRouter);
app.use('/api/v1/tours',tourRouter);


module.exports=app;



