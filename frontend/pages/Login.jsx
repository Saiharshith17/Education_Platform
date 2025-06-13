import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from "../src/store/auth";

const Login = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { storetokenInLS } = useAuth();

  const [user, setUser] = useState({
    email: "",
    password: "",
  });

  const hasSubmitted = useRef(false); // ✅ this avoids multiple submits

  // Handle guest login auto fill & submit
  useEffect(() => {
    const guestUser = location.state?.guest;
    if (guestUser) {
      setUser({
        email: guestUser.email,
        password: guestUser.password,
      });

      setTimeout(() => {
        const form = document.querySelector("form");
        if (form && !hasSubmitted.current) {
          form.dispatchEvent(new Event("submit", { cancelable: true, bubbles: true }));
        }
      }, 100);
    }
  }, [location.state]);

  const URL = "http://localhost:5000/api/auth/login";

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (hasSubmitted.current) return; // ✅ prevent second call
    hasSubmitted.current = true;

    try {
      const response = await fetch(URL, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(user),
      });

      if (response.ok) {
        const res_data = await response.json();
        alert("login successful");
        storetokenInLS(res_data.token);
        setUser({ email: "", password: "" });
        navigate("/Home");
      } else {
        alert("invalid Credentials");
        hasSubmitted.current = false; // reset so retry is allowed
      }
    } catch (error) {
      console.log("Login error:", error);
      hasSubmitted.current = false; // reset if network error
    }
  };

  return (
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

            <div className="registration-form">
              <h1 className="main-heading mb-3">Login form</h1>
              <br />
              <form onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="text"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    placeholder="Email"
                    style={{ width: '400px' }}
                  />
                </div>

                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    placeholder="Password"
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
  );
};

export default Login;
