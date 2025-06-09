import React,{useState} from 'react'
import {useNavigate} from "react-router-dom";
import {useAuth} from "../src/store/auth";
const Login = () => {


  const URL="http://localhost:5000/api/auth/login"
    const [user,setUser]=useState({
        email:"",
        password:"",
    });

    const navigate=useNavigate();
     const {storetokenInLS}=useAuth();
    const handleInput=(e)=>{
        let name=e.target.name;
        let value=e.target.value;

        setUser({
            ...user,
            [name]:value,
        });
    };
    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(user);
        try{
          const response=await fetch(URL,{
          method:"POST",
          headers:{
            "Content-Type":"application/json",
          },
          body:JSON.stringify(user),
          });
          console.log("login", response);
          if(response.ok){
            alert("login successful");
            const res_data=await response.json();
            storetokenInLS(res_data.token);
            setUser({
              email:"",password:""
            });
            navigate("/Home");
          }else{
            alert("invalid Credentials");
          }
        }catch(error){
          console.log(error);
        }
      };




  return (
    <>
    <section>
        <main>
          <div className="section-registration">
            <div className="container grid grid-two-cols">
              <div className="registration-image reg-img">
                <img
                  src="/images/register.png"
                  alt="a nurse with a cute look"
                  width="400"
                  height="500"
                />
              </div>
              {/* our main registration code  */}
              <div className="registration-form">
                <h1 className="main-heading mb-3">Login form</h1>
                <br />
                <form onSubmit={handleSubmit}>
                  <div>
                    <label htmlFor="email">email</label>
                    <input
                      type="text"
                      name="email"
                      value={user.email}
                      onChange={handleInput}
                      placeholder="email"
                      style={{ width: '400px' }}
                    />
                  </div>

                  <div>
                    <label htmlFor="password">password</label>
                    <input
                      type="password"
                      name="password"
                      value={user.password}
                      onChange={handleInput}
                      placeholder="password"
                      style={{ width: '400px' }}
                    />
                  </div>
                  <br />
                  <button type="submit" className="btn btn-submit">
                    Login
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>
      </section>
    </>
  )
}

export default Login