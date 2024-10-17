const mongoose=require('mongoose');
const app=require('./app');
const dotenv=require('dotenv');

process.on('uncaughtException',err=>{
    process.exit(1);
})
dotenv.config({path: './config.env'});
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology: true 
    
}).then(()=>console.log('DB Connection Successful'))
    // console.log(con.connections);
    



// console.log(j);
const server=app.listen(3000,()=>{
    console.log("app running");
});
console.log(app.get('env'));

process.on('unhandledRejection',err=>{
    console.log(err.name, err.message);
    server.close(()=>{process.exit(1)});
})