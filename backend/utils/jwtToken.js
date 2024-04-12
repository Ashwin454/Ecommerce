exports.sendToken=(token,statusCode,res,user1)=>{
     const options={
        httpOnly:false,
        expires:new Date(Date.now() + process.env.COOKIE_EXPIRE*24*3600*1000)
     }

     res.status(statusCode).cookie('token',token,options).json({
        success:true,
        token:token,
        user1
     })
}