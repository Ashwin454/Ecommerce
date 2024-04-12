const express=require("express");
const { createOrder, getOrder, myOrders, orderStatus, deleteOrder } = require("../controllers/orderController");
const { isAuthenticated, authorizeRoles } = require("../middleware/auth");
const order=express.Router();

order.route("/new").post(isAuthenticated, createOrder);
order.route("/getAll/:id").get(isAuthenticated,getOrder);
order.route("/myOrders").get(isAuthenticated, myOrders)
order.route("/updateStatus/:id").post(isAuthenticated,authorizeRoles, orderStatus);
order.route("/delete/:id").get(isAuthenticated,deleteOrder)

module.exports=order;