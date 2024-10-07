const mongoose=require('mongoose');
const app=require('./app');
const dotenv=require('dotenv');

dotenv.config({path: './config.env'});
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
    
}).then(con=>{
    // console.log(con.connections);
    console.log('DB Connection Successful');
})



app.listen(3000,()=>{
    console.log("app running");
});
console.log(app.get('env'));