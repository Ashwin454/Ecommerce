const product=require("../models/productModels.js")
const catchAsyncError=require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const ApiFeatures = require("../utils/apifeatures.js");
const mongoose=require('mongoose')
exports.pC=catchAsyncError(async(req,res)=>{
    const resultPP=5;
    const productCount=await product.countDocuments();
    const apiFeature=new ApiFeatures(product.find(),req.query).search().filter().pagination(resultPP);
    const products=await apiFeature.query;
    res.status(200).json({
        success:true,
        products,
        productCount,
        resultPP,
    })
});

exports.createProduct=catchAsyncError(async(req,res,next)=>{
    // console.log("HHHH'hhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh");
    const prod=await product.create(req.body);
    res.status(201).json(
        {
            success:true,
            prod
        }
    )
});

exports.updateProduct=catchAsyncError(async(req,res,next)=>{
    let prod=await product.findById(req.params.id);

    if(!prod){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
    prod=await product.findByIdAndUpdate(req.params.id, req.body, {
        new:true,
        runValidators:true,
        userFindAndModify:false
    }),

    res.status(200).json({
        success:true,
        prod
    })
});

exports.deleteProduct=catchAsyncError(async(req,res,next)=>{
    const prod=await product.findById(req.params.id);
    if(!prod){
        return res.status(500).json({
            success:false,
            message:"Product not found"
        })
    }
    await prod.deleteOne();

    return res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
});

exports.getProductDetails=catchAsyncError(async(req, res, next)=>{
    let prod=await product.findById(req.params.id);
    if(!prod){
        return next(new ErrorHandler("Product not found", 404));
    }
    res.status(200).json({
        success:true,
        prod
    })
});

exports.rating=async(req,res,next)=>{
    try{
    console.log(req.body);
    const prod=await product.findById(req.body.id);
    if(!prod){
        return res.status(400).json({
            success:false,
            message:"Product not found"
        })
    }
    const rating=Number(req.body.rating);
    const update={
        name:req.user.name,
        rating:rating,
        comment:req.body.comment
    }
    let flag=0;
    let element={}
    prod.reviews.map((element)=>{
        console.log(element);
        if(element.name===update.name){
            prod.rating=prod.rating-((element.rating-update.rating)/prod.reviews.length)
            element.name=update.name;
            element.rating=update.rating;
            element.comment=update.comment;
            flag=1;
        }
    })
    if(flag===0){
        prod.reviews.push(update);
        prod.rating=(prod.rating+update.rating)/prod.reviews.length;
        element.numberOfReviews=element.numberOfReviews+1;
    }
    await prod.save();
    return res.status(200).json({
        success:true,
        reviews:prod.reviews,
        message:"Updated successfully"
    })
}catch(error){
    return res.status(500).json({
        success:false,
        message:`Internal Sever Error: ${error}`
    })
}
}
exports.DisplayCart=async(req,res,next)=>{
    const user1=req.user;
    // console.log(user1);
    const cart=user1.cart;
    let products=[];
    // products.push(prod)
    // console.log(cart);
    async function findProductsInCart(cart) {
        for (const element of cart) {
            const prod1 = await product.findById(element.id);
            // console.log(element._id);
            const prod={
                prod1,
                count:element.count,
                id:element._id
            }
            products.push(prod);
        }
        return products;
    }
    // Call the function with your cart array
    const productsInCart = await findProductsInCart(cart);
    // console.log(productsInCart);
        return res.status(200).json({
            success:true,
            productsInCart
        })
}
exports.adminProd=catchAsyncError(async(req,res)=>{
    let products=await product.find();
    res.status(200).json({
        success:true,
        products,
    })
});