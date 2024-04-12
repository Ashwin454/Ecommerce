const express=require('express');
const { pC,createProduct, updateProduct, deleteProduct, getProductDetails, rating, DisplayCart, adminProd }=require("../controllers/productController.js");
const { isAuthenticated, authorizeRoles } = require('../middleware/auth.js');
const router=express.Router();


router.route("/product").get(pC); 
router.route("/product/new").post(isAuthenticated,createProduct);
router.route("/product/:id").put(isAuthenticated,updateProduct);
router.route("/product/:id").delete(isAuthenticated,deleteProduct);
router.route("/product/:id").get(getProductDetails);
router.route("/product/rating").post(isAuthenticated,rating);
router.route("/cart").get(isAuthenticated,DisplayCart);
router.route("/adminProd").get(isAuthenticated, authorizeRoles, adminProd);
module.exports=router;