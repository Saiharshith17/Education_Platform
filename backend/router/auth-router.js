const express=require("express");
const  router=express.Router();
const {home,register,login,user}=require("../controllers/auth-controller");
const validate=require("../middlewares/validate-middleware");
const signupSchema=require("../validators/auth-validator");
const authmiddleware=require("../middlewares/auth-middleware");




router.route("/").get(home);

router.route("/register").post(validate(signupSchema),register);

router.route("/login").post(login);

router.route("/user").get(authmiddleware, user);


module.exports=router;