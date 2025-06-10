// import React,{lazy, Suspense} from 'react'
// import './App.css'
// import Services from '../pages/services'
// import {BrowserRouter,Routes,Route} from "react-router-dom"


// const Home =lazy(()=> import ("../pages/Home"));
// const About =lazy(()=> import ("../pages/About"));
// const Contact =lazy(()=> import ("../pages/Contact"));
// const Register =lazy(()=> import ("../pages/Register"));
// const Login=lazy(()=> import("../pages/Login"));
// const Error=lazy(()=> import("../pages/Error"));
// const Navbar=lazy(()=> import("../components/Navbar"));
// const Footer=lazy(()=> import("../components/Footer/Footer"));
// const Logout=lazy(()=>import("../pages/Logout"));
// const App = () => {
//   return (
//     <>
//     <BrowserRouter>
//     <Navbar />
//     <Routes>
//       <Route path="/" element={<Home/>}/>
//       <Route path="/Home" element={<Home/>}/>
//       <Route path="/about" element={<About/>}/>
//       <Route path="/contact" element={<Contact/>}/>
//       <Route path="/register" element={<Register/>}/>
//       <Route path="/services" element={<Services/>}/>
//       <Route path="/login" element={<Login/>}/>
//       <Route path="/logout" element={<Logout/>}/>
//       <Route path="*" element={<Error/>}/>
//     </Routes>
//     <Footer/>
//     </BrowserRouter>
//     </>
//   )
// }

// export default App


import React, { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "../layouts/Layouts";
import Contact from "../pages/Contact";

const Login = lazy(() => import("../pages/Login"));
const Signup = lazy(() => import("../pages/Signup"));
const Home = lazy(() => import("../pages/Home"));
const AllCourses=lazy(()=>import("../pages/AllCourses"));
const App = () => {
  return (
    <BrowserRouter>
      <Suspense fallback={<div>Loading...</div>}>
        <Routes>
          {/* Pages with layout */}
          <Route
            path="/Home"
            element={
              <Layout>
                <Home />
              </Layout>
            }
          />
          <Route
            path="/courses"
            element={
              <Layout>
                <AllCourses />
              </Layout>
            }
          />
          <Route path="/contactus" element={<Contact/>}/>
          
          {/* Login and Signup without layout */}
          <Route path="/login" element={<Login />} />
          <Route path="/signUp" element={<Signup />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
};

export default App;
