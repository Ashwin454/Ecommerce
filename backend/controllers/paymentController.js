const stripe= require("stripe")(process.env.STRIPE_SECRET_KEY);

exports.processPayment=async(req,res,next)=>{
    const myPayment=await stripe.paymentIntents.create({
        amount:req.body,
        currency:"inr",
        metadata:{
            company:"SONI"
        }
    })
    return res.status(200).json({
        success:true,
        client_secret:myPayment.client_secret
    })
}

exports.sendStripeAPIkey=async(req,res,next)=>{
    return res.status(200).json({
        stripeAPIKey:process.env.STRIPE_SECRET_KEY
    })
}