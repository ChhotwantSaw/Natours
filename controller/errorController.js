const appError=require('./../utils/appError');

const handleCastErrorDB=(err=>{
    const message=`Invalid ${err.path}: ${err.value}`;
    return new appError(message,400);
})

const handleJWTError=()=>{
    return new appError("Inavlid Token! Please login again",401);
}

const handleJWTExpiredError=()=>{
    return new appError("Your token has expired! Please log in again");
}

const handleCodeErrorDB=(err=>{
    const value=err.keyValue.name;
    return new appError(`Duplicate field value ${value}, Please insert another value`,400);
})
const sendErrorDev=(err,res)=>{
    res.status(err.statusCode).json({
        status:err.status,
        message:err.message,
        error:err,
        stack:err.stack
    })
}
//
const handleValidationErrorDB=err=>{
    // console.log(Object.values(err.errors));
    const val=Object.values(err.errors).map(el=>el.message)
    // console.log(val);
    const message=`Invalid input ${val.join('. ')}`
    return new appError(message,400);
}

const sendErrorProd=(err,res)=>{
    if(err.isOperational){
        res.status(err.statusCode).json({
            status:err.status,
            message:err.message
        });
    }
    else{
        console.error('Error🔥',err);
        res.status(500).json({
            status:'error',
            message:'Something went wrong'
        });
    }
};

module.exports=(err,req,res,next)=>{
    err.statusCode=err.statusCode||500;
    err.status=err.status||"error";
    if(process.env.NODE_ENV==='development'){
        sendErrorDev(err,res);
    }
    else if(process.env.NODE_ENV==='production'){
        let error={...err,name: err.name};
        // console.log(JSON.stringify(error),error.name);
        if(error.name === "CastError") error=handleCastErrorDB(error);
        if(error.code==11000) error= handleCodeErrorDB(error);
        if(error.name==='ValidationError') error=handleValidationErrorDB(error);
        if(error.name=='JsonWebTokenError') error=handleJWTError();
        if(error.name=='TokenExpiredError') error=handleJWTExpiredError();
        sendErrorProd(error,res);
    }
}