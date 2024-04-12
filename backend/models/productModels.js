const mongoose=require('mongoose');

const productSchema= new mongoose.Schema({
    name:{
        type:String,
        required:[true, "Please enter name"]
    },
    description:{
        type:String,
        required:[true, "Please enter description of the product"]
    },
    price:{
        type:Number,
        required:[true, "Please enter a price for your product"],
        maxLength:[8, "Please enter valid price"]
    },
    rating:{
        type:Number,
        default:0
    },
    images:[{
        publicId:{
            type:String,
            required:true
        },
        publicURL:{
            type:String,
            required:true
        }
    }],
    category:{
        type:String,
        required:[true, "Enter product category"]
    },
    Stock:{
        type:Number,
        required:[true, "Please see the stocks"],
        maxLength:[4 , "Stocks cannot be greater tha 10000"],
        default:0
    },
    numOfReviews:{
        type:Number,
        default:0
    },
    reviews:[
        {
            name:{
                type:String,
                required:true
            },
            rating:{
                type:Number,
                required:true,
            },
            comment:{
                type:String
            }
        }
    ],
    createdAt:{
        type:Date,
        default:Date.now
    }
})

module.exports=mongoose.model("products", productSchema);