const Order=require("../models/orderModel");
exports.createOrder=async(req,res,next)=>{
    try {
        const {orderedBy, shippingInfo, orderItems, paymentInfo, shippingPrice, itemsPrice, tax, total}=req.body;
        console.log(req.body);
        const order=await Order.create({
        shippingInfo,
        orderItems,
        paymentInfo,
        shippingPrice,
        itemsPrice,
        tax,
        total,
        paidAt:Date.now(),
        user:req.user.id,
        deliverAt:new Date(Date.now()+24*3600*1000),
        orderedBy,
    })
    // console.log(order);
    return res.status(201).json({
        success:true,
        order
    })
    } catch (error) {
        return res.status(500).json({
            success:false,
            message:`Internal Server Error: ${error}`
        })
    }
}
exports.getOrder=async(req,res,next)=>{
    const order=await Order.findById(req.params.id)
    if(!order){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    return res.status(200).json({
        success:true,
        order
    })
}

exports.myOrders=async(req,res,next)=>{
    const order=await Order.find({orderedBy : req.user.id});
    if(!order){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    return res.status(200).json({
        success:true,
        order
    })
}

exports.orderStatus=async(req,res,next)=>{
    let order=await Order.findById(req.params.id);
    if(!order){
        return res.status(400).json({
            success:false,
            message:"Order not found"
        })
    }
    if(order.orderStatus === "delivered"){
        return res.status(400).json({
            success:false,
            message:"The order has been delivered"
        })
    }
    order=await Order.findByIdAndUpdate(req.params.id , req.body, {
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    orderItems=order.orderItems;
    orderItems.forEach(order => {
        order.quantity=order.quantity - 1;
    });
    order.save();
    return res.status(200).json({
        success:true,
        order
    })
}

exports.getAll=async(req,res,next)=>{
    const order=Order.find();
    if(!order){
        return res.status(400).json({
            success:false,
            message:"Order not found"
        })
    }
    return res.status(200).json({
        success:true,
        order
    })
}

exports.deleteOrder=async(req,res,next)=>{
    const order=await Order.findById(req.params.id);
    if(!order){
        return res.status(400).json({
            success:false,
            message:"Order not found"
        })
    }
    await order.deleteOne();

    return res.status(200).json({
        success:true
    })
}