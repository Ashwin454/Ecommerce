const express=require("express");
const { processPayment, sendStripeAPIkey } = require("../controllers/paymentController");
const pay=express.Router();

pay.route("/payment/process").post(processPayment);
pay.route("/payment/sentStripeAPI").get(sendStripeAPIkey);
module.exports=pay;