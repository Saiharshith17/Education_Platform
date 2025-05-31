const errorMiddleware=(error,req,res,next)=>{
   const status=error.status|500;
   const message=error.message| "Backend Error";
   const extraDetails=error.extraDetails| "error from Backend";

   return res.status(status).json({message, extraDetails});
};

module.exports=errorMiddleware;