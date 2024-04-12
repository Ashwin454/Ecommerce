const mongoose=require('mongoose');
const validator=require('validator');
const bcrypt=require("bcryptjs");
const JWT=require("jsonwebtoken");
const crypto=require("crypto");
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        // required:[true , "Please enter your name"],
        maxLength:[30, "Name cannot exceed 30 letters"],
        minLenght:[4, "Name cannot be less than 4 letters"]
    },
    email:{
        type:String,
        required:[true, "Please enter email"],
        uniqe:true,
        validate:[validator.isEmail, "Please enter a valid email"]
    },
    password:{
        type:String,
        required:[true, "Please enter password"],
        minLength:[8, "Password lenght should not be less than 8"]
    },
    avatar:{
        publicId:{
            type:String,
            required:true
        },
        url:{
            type:String,
            required:true
        }
    },
    role:{
        type:String,
        default: "user",
    },
    cart:[{
        id:{
            type:mongoose.Schema.ObjectId,
            ref:"product"
        },
        count:{
            type:Number,
        }
    }],
    shipping:{
        country:{
            type:String
        },
        state:{
            type:String
        },
        city:{
            type:String
        },
        phone:{
            type:Number
        },
        address:{
            type:String
        }
    },
    resetPasswordToken:String,
    resetPasswordExpire: Date,
})

userSchema.pre("save",async function(next){
    if(!this.isModified("password")){
        next();
    } 
    this.password=await bcrypt.hash(this.password,10)
})

//JWT TOKEN
userSchema.methods.getJWTToken= function (){
    return JWT.sign({id:this._id},process.env.JWT_SECRET,{
        expiresIn:process.env.JWT_EXPIRE
    })
}

userSchema.methods.getresetpass=function(){
    const resetToken=crypto.randomBytes(20).toString("hex");
    this.resetPasswordToken=crypto.createHash("sha256").update(resetToken).digest("hex");
    this.resetPasswordExpire=new Date(Date.now()+15*60*1000);
    return resetToken;
}
module.exports = mongoose.model("User",userSchema );