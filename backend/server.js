const app=require("./app.js");
const dotenv=require("dotenv");
const mongoose=require("mongoose");

mongoose.connect("mongodb://127.0.0.1:27017/SONI?directConnection=true&serverSelectionTimeoutMS=2000&appName=mongosh+2.0.2").then(()=>{
    console.log("Connected to mongodb!!");
}).catch((err)=>{
    console.log("Some error occured: ",err);
})

dotenv.config({path: "./config/config.env"});

app.listen(process.env.PORT , ()=>{
    console.log("server is up");
})