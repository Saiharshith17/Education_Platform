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
const preferenceRoutes= require("./router/preference-router");
const bookRouter = require("./router/book-router");
const corsOptions = {
    origin: ["http://localhost:5173", "https://education-platform-khaki.vercel.app"],
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(require("cors")(corsOptions));
app.use(express.json());
app.use("/api/auth",authRoute);
app.use("/api/form",contactRoute);
app.use(errorMiddleware);

app.use("/api/courses", courseRoute);

app.use("/api", courseRoutes);

app.use("/api/cart", cartRoutes);

app.use("/api/users", preferenceRoutes);
app.get("/",(req,res)=>{
    res.status(200).send("mg");
});

// In your server.js or app.js
app.use(express.json({ limit: '100mb' })); // or higher if needed

app.use("/api/books", bookRouter);


// app.get("/register",(req,res)=>{
//     res.status(200).send("mg");
// });

const port=5000;

connectDb().then(()=>{
app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
});
});