const jwt = require("jsonwebtoken");
const user = require("../models/userModels");
exports.isAuthenticated = async (req, res, next) => {
    try {
       const token = req.cookies.token;
       console.log("Token:", token);
       if(token==null){
            return res.status(401).json({
                success:false,
                message:"Not logged in currently"
            })
       }
       const decodedData= jwt.verify(token, process.env.JWT_SECRET);
       req.user=await user.findOne({email: decodedData.email})
       next(); 
    } catch (error) {
       console.log("Internal server error");
       res.status(500).json({
          success: false,
          message: "Internal server error",
       });
    }
 };
exports.authorizeRoles=(req,res,next)=>{
        if(!["admin"].includes(req.user.role)){
            return res.status(403).json({
                success:false,
                message:`User not authorized: ${req.user.role}`
            })
        }
        next();
    }
 