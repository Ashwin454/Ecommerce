const express=require('express');
const { reqisterUser, loginUser, logout, forgotPass, resetPass, getProfile, getAllUsers, getUser, changePassword, changeProfile, updateRole, deleteUser, addToCart, removeFromCart, saveShippingInfo } = require('../controllers/userController');
const { isAuthenticated, authorizeRoles } = require('../middleware/auth');
const user=express.Router();

user.route("/register").post(reqisterUser);
user.route("/login").post(loginUser);
user.route("/forgotPassword").post(forgotPass)
user.route("/reset/:token").put(resetPass);
user.route("/logout").get(logout);
user.route("/profile").get(isAuthenticated,getProfile);
user.route("/getAllUsers").get(isAuthenticated,authorizeRoles,getAllUsers);
user.route("/user/:id").get(isAuthenticated,authorizeRoles,getUser);
user.route("/user/changePass").put(isAuthenticated,changePassword);
user.route("/user/changeProfile").put(isAuthenticated,changeProfile);
user.route("/user/updateRole").put(isAuthenticated,authorizeRoles,updateRole);
user.route("/user/deleteUser/:id").post(isAuthenticated,authorizeRoles,deleteUser);
user.route("/user/addtoCart").put(isAuthenticated,addToCart);
user.route("/user/removeFromCart").put(isAuthenticated,removeFromCart);
user.route("/user/shipping").put(isAuthenticated, saveShippingInfo);
module.exports=user;