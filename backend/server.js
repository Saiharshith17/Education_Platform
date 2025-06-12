require("dotenv").config();
const express= require("express");
const app=express();
const cors=require("cors");
const authRoute=require("./router/auth-router");
const contactRoute=require("./router/contact-router")
const connectDb= require("./utils/db")
const courseRoute = require("./router/course-router")
const courseRoutes = require("./router/course-routes");
const errorMiddleware=require("./middlewares/error-middleware");
const cartRoutes = require("./router/cartRoutes");


const corsOptions={
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE,PATCH,HEAD",
    credentials:true,
}
app.use(cors(corsOptions));
app.use(express.json());
app.use("/api/auth",authRoute);
app.use("/api/form",contactRoute);
app.use(errorMiddleware);

app.use("/api/courses", courseRoute);

app.use("/api", courseRoutes);

app.use("/api/cart", cartRoutes);

// app.get("/",(req,res)=>{
//     res.status(200).send("mg");
// });





// app.get("/register",(req,res)=>{
//     res.status(200).send("mg");
// });

const port=5000;

connectDb().then(()=>{
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
});
});