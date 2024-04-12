const express=require('express');
const errorMiddleware=require("./middleware/error.js");
const cookieParser=require('cookie-parser');
const dotenv=require("dotenv");
dotenv.config({path : "backend/config/config.env"});
const app=express();
app.use(express.json());
app.use(errorMiddleware);
app.use(cookieParser());

const router=require("./routes/productRoutes.js");
const user = require('./routes/userRoutes.js');
const order = require('./routes/orderRoutes.js');
const pay=require("./routes/paymentRoute.js")

app.use("/api/v1" , router);
app.use("/api/v1", pay);
app.use("/api/v1" , user)
app.use("/api/v1/order", order)

module.exports=app;
