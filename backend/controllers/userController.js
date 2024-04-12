const catchAsyncError=require("../middleware/catchAsyncErrors.js");
const ErrorHandler = require("../utils/errorHandler.js");
const user=require("../models/userModels.js");
const JWT=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const { sendToken } = require("../utils/jwtToken.js");
const sendEmail=require("../utils/sendEmail.js");
const crypto=require("crypto");
const mongoose=require("mongoose")
exports.reqisterUser=catchAsyncError(async(req,res,next)=>{
    const {name,email,password} = req.body;
    const user1=await user.create({
        name,email,password,
        avatar:{
            publicId:"Abc",
            url:"xyz"
        }
    });
    // console.log(name)
    // const user2=await user.findOne({email : email});
    // console.log(user2);
    const token= JWT.sign({email:email},process.env.JWT_SECRET,{
            expiresIn:process.env.JWT_EXPIRE})
    // .log({email:email});
    sendToken(token,201,res);
    req.user=user1;
})

exports.loginUser =
        async(req,res,next)=>{
            try {
                const {email , password}=req.body;
            if(!email || !password){
                return res.json({
                    success:false,
                    message:"Please enter email and password"
                })
            }
            // console.log(email);
            const user1=await user.findOne({email : email});
            // console.log(user1);
            if(!user1){
                return res.status(401).json({
                    success:false,
                    message:"User not found"
                })
            }
            const isMatching=await bcrypt.compare(password , user1.password);
            if(!isMatching){
                return res.status(401).json({
                    success:false,
                    message:"Invalid email or password",
                    user:user1
                })
            }
            const token=JWT.sign({email:email},process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRE})
            sendToken(token,200,res,user1);
            req.user=user1;
            // console.log(req.user);
            } catch (error) {
                console.log("Some error occured: ",error)
                return res.status(500).json({
                    success:false,
                    message:"Some Internal server error"
                })
            }
        }

exports.logout=async(req,res,next)=>{
    res.cookie('token' , null , {
        expiresIn:new Date(Date.now()),
        httpOnly:true
    })
    return res.status(200).json({
        success:true,
        message:"Logged out successfully"
    })
}

exports.forgotPass=async(req,res,next)=>{
    const user1=await user.findOne({email:req.body.email});
    if(!user1){
        return res.status(404).json({
            success:false,
            message:"User not found"
        })
    }
    const resetToken=user1.getresetpass();
    await user1.save({validateBeforeSave: false});

    const resetPassURL=`http://localhost:3000/api/v1/reset/${resetToken}`;

    const message=`Your password reset token is: \n\n ${resetPassURL} \n\nIf you have not send this request, please ignore.`

    try {
        await sendEmail({
            email:user1.email,
            subject:"Ecommerce Password recovery",
            message
        })
        return res.status(200).json({
            success:true,
            message:"Email sent successfully",
            user:req.user
        })
    } catch (error) {
        user.resetPasswordToken=undefined,
        user.resetPasswordExpite=undefined
        await user1.save({validateBeforeSave:false})
        return res.status(500).json({
            success:false,
            message:`Some error occured: ${error}`
        })
    }
}

exports.resetPass=async(req,res,next)=>{
    const tokenRecieved=crypto.createHash("sha256").update(req.params.token).digest("hex");
    const user1=await user.findOne({resetPasswordToken : tokenRecieved})
    // console.log(user1);
    if(!user1){
        return res.status(404).json({
            success:false,
            message:"Invalid request"
        })
    }
    // console.log(Date.now());
    // console.log()
    // if(user1.resetPasswordExpire < Date.now()){
    //     return res.status(400).json({
    //         success:false,
    //         message:"Link has been expired"
    //     })
    // }
    user1.password=req.body.password;
    // console.log(req.body.password);
    user1.resetPasswordExpire=undefined;
    user1.resetPasswordToken=undefined;
    await user1.save();
    // console.log(user1);
    return res.status(200).json({
        success:true,
        message:"Password has been changed successsfully"
    })
}
exports.getProfile=async(req,res,next)=>{
    const user1=req.user;
    if(!user1){
        return res.status(400).json({
            success:false,
            message:"Currently not logged in"
        })
    }
    return res.status(200).json({
        success:true,
        user1
    })
}

exports.getAllUsers=async(req,res,next)=>{
    const user1=await user.find();
    res.status(200).json({
        success:true,
        user1
    })
}

exports.getUser=async(req,res,next)=>{
    const user1=await user.findById(req.params.id);
    if(!user1){
        return res.status(400).json({
            success:false,
            message:"user not found"
        })
    }
    return res.status(200).json({
        success:true,
        user1,
    })
}

exports.changePassword=async(req,res,next)=>{
    const user1=req.user;
    const ismatched=bcrypt.compare(req.body.oldPassword, user1.password);
    if(!ismatched){
        return res.status(500).json({
            success:false,
            message:"Password doesn't matches"
        })
    }
    user1.password=req.body.newPassword;
    user1.save();
    return res.status(200).json({
        success:true,
        user1
    })
}

exports.changeProfile=async(req,res,next)=>{
    const user1=req.user;

    const user2=await user.findByIdAndUpdate(user1.id , req.body , {
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    await user1.save();
    req.user=user2;
    return res.status(200).json({
        success:true,
        message:"Updated successfully",
        user2
    })
    
}

exports.updateRole=async(req,res,next)=>{
    const user1=req.user;
    await user.findByIdAndUpdate(user1.id, req.body , {
        new:true,
        runValidators:true,
        userFindAndModify:false
    })
    return res.status(200).json({
        success:true,
        message:"updated successfully",
    })
}

exports.deleteUser=async(req,res,next)=>{
    const user2=await user.findById(req.params.id);
    if(!user2){
        return res.status(400).json({
            success:false,
            message:"User not found"
        })
    }
    await user2.deleteOne();
    return res.status(200).json({
        success:true,
        message:"deleted successfully"
    })
}
exports.addToCart=async(req,res,next)=>{
    const user1=req.user
    let user2=await user.findById(user1.id);
    const update=req.body.cart;
    let flag=0;
    user2.cart.forEach(element => {
        // console.log(element);
        if(element.id.valueOf() === update.id){
            flag=1;
        }
    });
    if(flag===1){
        // console.log("we got error..");
        flag=0;
            return res.status(400).json({
                success:false,
                message:"Product already in Cart"
            })
    }
    console.log("we didnt got error..");
    // console.log(flag);
    user2.cart.push(update);
    await user2.save();
    return res.status(200).json({
        success:true,
        user2
    })
}
exports.removeFromCart=async(req,res,next)=>{
    try{
        const user1=req.user
    const user2=await user.findById(user1.id);
    const update=req.body.id

    // console.log(update);
    // console.log("ooooooooooooooooooooooooooooooooooooooo");

    let flag=0;
    user2.cart.forEach(element=>{
        if(element._id.valueOf()===update){
            user2.cart.remove(element)
            flag=1;
        }
    })
    if(flag===0){
        return res.status(404).json({
            success:false,
            message:"Product not found"
        })
    }
    await user2.save();
    // console.log(flag);
    return res.status(200).json({
        success:true,
        user2
    })
    }catch(error){
        res.status(500).json({
            success:false,
            message:"Internal sever error"
        })
    }
}
exports.saveShippingInfo=async(req,res,next)=>{
    try{
        const user1=req.user;
        const update=req.body.shipping.shipping;
        const user2=await user.findById(user1.id)
        console.log(update);
        user2.shipping=update
        await user2.save();
        console.log(user2);
        return res.status(200).json({
            success:true,
            user2
        })
    }catch(error){
        return res.status(500).json({
            success:false,
            message:"Internal Server Error"
        })
    }
}