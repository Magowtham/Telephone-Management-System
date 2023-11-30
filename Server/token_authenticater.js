const jwt=require("jsonwebtoken");
const tokenAuthenticater=(req,res,next)=>{
  const token=req.header("Authorisation").split(" ")[1];
  console.log(token);
  jwt.verify(token,"spp",(err,user)=>{
    if(err){
      return res.status(401).json({error:"Invalid Token"})
    }
   next()
  })
} 

module.exports=tokenAuthenticater;