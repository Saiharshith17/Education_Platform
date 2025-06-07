const {z} = require("zod");

const signupSchema = z.object({
    username: z
      .string({ required_error: "Name is Required" })
      .trim()
      .min(3, { message: "Name must be at least 3 characters." })
      .max(255, { message: "Name must not be more than 255 characters" }),
  
    email: z
      .string({ required_error: "Email is Required" })
      .trim()
      .email({ message: "Invalid email address" }),
  
    password: z
      .string({ required_error: "Password is Required" })
      .min(8, { message: "Password must be at least 8 characters." })
      .regex(/[A-Z]/, { message: "At least one uppercase letter required" })
      .regex(/[a-z]/, { message: "At least one lowercase letter required" })
      .regex(/[0-9]/, { message: "At least one number required" })
      .regex(/[^A-Za-z0-9]/, { message: "At least one special character required" }),
  
    phone: z
      .string({ required_error: "Phone number is Required" })
      .min(10,{message:"minimum of 10 characters required"})
      .trim()
      .regex(/^[6-9]\d{9}$/, { message: "Invalid Indian phone number" })
  });
  

  module.exports=signupSchema;