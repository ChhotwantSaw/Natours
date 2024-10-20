const fs=require('fs');
const mongoose=require('mongoose');
const dotenv=require('dotenv');
const Tour=require('./../../model/tourModel');

dotenv.config({path: './config.env'});
const DB=process.env.DATABASE.replace('<PASSWORD>',process.env.DATABASE_PASSWORD);
mongoose.connect(DB,{
    useNewUrlParser:true,
    useCreateIndex:true,
    useFindAndModify:false
    
})
//Read JSON File
const tours=JSON.parse(fs.readFileSync(`${__dirname}/tours-simple.json`,'utf-8'));

//Importing data into DB
const importData=async()=>{
    try{
        await Tour.create(tours);
        console.log('Data Imported');
    }
    catch(err){
        console.log(err);
    }
    process.exit();

}

//Deleting data from DB
const deleteData=async()=>{
try{
    await Tour.deleteMany();
    console.log("Data deleted Successfully");
} catch(err){
    console.log(err);
}
process.exit();
}
if(process.argv[2]=='--import'){
    importData();
}else if(process.argv[2]=='--delete'){
    deleteData();
}

console.log(process.argv);