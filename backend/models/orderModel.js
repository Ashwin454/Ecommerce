const mongoose=require("mongoose");
const orderSchema=mongoose.Schema({
    shippingInfo:{
        address:{
            type:String,
            required:true
        },
        city:{
            type:String,
            required:true
        },
        state:{
            type:String,
            required:true
        },
        country:{
            type:String,
            required:true
        },
        phone:{
            type:Number,
            required:true
        }
    },
    orderItems:[
        {
            count:{
                type:Number,
                required:true
            },
            id:{
                type:mongoose.Schema.ObjectId,
                required:true,
                ref:"products"
            }
        }
    ],
        paymentInfo:{
            id:{
                type:String,
                required:true,
            },
            status:{
                type:String,
                required:true
            }
        },
        itemsPrice:{
            type:Number,
            required:true,
            default:0
        },
    tax:{
        type:Number,
        required:true,
        default:0
    },
    shippingPrice:{
        type:Number,
        required:true,
        default:0
    },
    total:{
        type:Number,
        required:true,
        default:0
    },
    orderStatus:{
        type:String,
        required:true,
        default:"Processing"
    },
    deliverAt:{
        type:Date,
        required:true,
        default:Date.now()
    },
    orderedBy:{
        type:mongoose.Schema.ObjectId,
        required:true,
        ref:"users"
    }
})

module.exports=mongoose.model("Orders" , orderSchema)