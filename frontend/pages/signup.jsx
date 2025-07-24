import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../src/store/auth';
import { z } from 'zod';
import './signup.css';

// ✅ Zod Validation Schema
const signupSchema = z.object({
  username: z.string().min(3, { message: "Username must be at least 3 characters" }),
  email: z.string().email({ message: "Invalid email address" }),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, { message: "Enter valid Indian phone number" }),
  password: z
    .string()
    .min(8, { message: "Minimum 8 characters" })
    .regex(/[A-Z]/, { message: "One uppercase letter required" })
    .regex(/[a-z]/, { message: "One lowercase letter required" })
    .regex(/[0-9]/, { message: "One number required" })
    .regex(/[^A-Za-z0-9]/, { message: "One special character required" }),
});

const Signup = () => {
  const URL = `${import.meta.env.VITE_API_BASE_URL}/api/auth/register`;
  const navigate = useNavigate();
  const { storetokenInLS } = useAuth();

  const [user, setUser] = useState({
    username: '',
    email: '',
    phone: '',
    password: '',
  });

  const [errors, setErrors] = useState({});
  const [serverError, setServerError] = useState('');

  const handleInput = (e) => {
    const { name, value } = e.target;
    setUser((prev) => ({ ...prev, [name]: value }));

    if (signupSchema.shape[name]) {
      const singleField = z.object({ [name]: signupSchema.shape[name] });
      const result = singleField.safeParse({ [name]: value });

      if (!result.success) {
       console.log(result.error.issues); // Full list of error objects

  const messages = result.error.issues?.map((err) => err.message) || ["Invalid input"];

        setErrors((prev) => ({
          ...prev,
          [name]: messages,
        }));
      } else {
        setErrors((prev) => ({ ...prev, [name]: '' }));
      }
    }

    setServerError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setServerError('');

    const validation = signupSchema.safeParse(user);
    if (!validation.success) {
      const fieldErrors = {};
      if (validation.error && validation.error.errors) {
        validation.error.errors.forEach((err) => {
          const field = err.path?.[0] || 'general';
          if (!fieldErrors[field]) {
            fieldErrors[field] = [];
          }
          fieldErrors[field].push(err.message);
        });
      }
      setErrors(fieldErrors);
      return;
    }

    try {
      const res = await fetch(URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(user),
      });

      const data = await res.json();

      if (!res.ok) {
        setServerError(data.msg || "Registration failed.");
        return;
      }

      storetokenInLS(data.token);
      navigate('/login', {
        state: {
          guest: { email: user.email, password: user.password },
        },
      });

      setUser({ username: '', email: '', phone: '', password: '' });
    } catch (err) {
      setServerError("Server error. Please try again later.");
    }
  };

  return (
    <section>
      <main>
        <div className="section-registration">
          <div className="container grid grid-two-cols">
            <div className="registration-image reg-img">
              <img
                src="/phishing-account-concept.png"
                alt="signup illustration"
                width="400"
                height="500"
              />
            </div>

            <div className="registration-form">
              <h1 className="main-heading mb-3">Registration Form</h1>

              {serverError && (
                <p className="error-text" style={{ color: 'red', marginBottom: '1rem' }}>
                  {serverError}
                </p>
              )}

              <form onSubmit={handleSubmit} noValidate>
                {/* Username */}
                <div>
                  <label htmlFor="username">Username</label>
                  <input
                    type="text"
                    name="username"
                    value={user.username}
                    onChange={handleInput}
                    placeholder="Enter username"
                  />
                 {Array.isArray(errors.username) && (
  <ul style={{
    backgroundColor: '#ffe6e6',
    border: '1px solid #ff4d4d',
    color: '#b30000',
    borderRadius: '8px',
    padding: '8px 12px',
    marginTop: '6px',
    listStyle: 'none',
    fontSize: '0.9rem',
    boxShadow: '0 2px 6px rgba(255, 77, 77, 0.2)'
  }}>
    {errors.username.map((msg, i) => (
      <li key={i} style={{ marginBottom: '4px' }}>⚠️ {msg}</li>
    ))}
  </ul>
)}
                </div>

                {/* Email */}
                <div>
                  <label htmlFor="email">Email</label>
                  <input
                    type="email"
                    name="email"
                    value={user.email}
                    onChange={handleInput}
                    placeholder="Enter email"
                  />
                  {Array.isArray(errors.email) && (
  <ul style={{
    backgroundColor: '#ffe6e6',
    border: '1px solid #ff4d4d',
    color: '#b30000',
    borderRadius: '8px',
    padding: '8px 12px',
    marginTop: '6px',
    listStyle: 'none',
    fontSize: '0.9rem',
    boxShadow: '0 2px 6px rgba(255, 77, 77, 0.2)'
  }}>
    {errors.email.map((msg, i) => (
      <li key={i} style={{ marginBottom: '4px' }}>⚠️ {msg}</li>
    ))}
  </ul>
)}
                </div>

                {/* Phone */}
                <div>
                  <label htmlFor="phone">Phone</label>
                  <input
                    type="text"
                    name="phone"
                    value={user.phone}
                    onChange={handleInput}
                    placeholder="Enter phone number"
                  />
                  {Array.isArray(errors.phone) && (
                  <ul style={{
                    backgroundColor: '#ffe6e6',
                    border: '1px solid #ff4d4d',
                    color: '#b30000',
                   borderRadius: '8px',
                   padding: '8px 12px',
                    marginTop: '6px',
                    listStyle: 'none',
                    fontSize: '0.9rem',
                    boxShadow: '0 2px 6px rgba(255, 77, 77, 0.2)'
                   }}>
                   {errors.phone.map((msg, i) => (
                     <li key={i} style={{ marginBottom: '4px' }}>⚠️ {msg}</li>
                    ))}
                   </ul>
                  )}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password">Password</label>
                  <input
                    type="password"
                    name="password"
                    value={user.password}
                    onChange={handleInput}
                    placeholder="Enter password"
                  />
                  {Array.isArray(errors.password) && (
                  <ul style={{
                   backgroundColor: '#ffe6e6',
                   border: '1px solid #ff4d4d',
                   color: '#b30000',
                   borderRadius: '8px',
                   padding: '8px 12px',
                   marginTop: '6px',
                   listStyle: 'none',
                   fontSize: '0.9rem',
                   boxShadow: '0 2px 6px rgba(255, 77, 77, 0.2)'
                  }}>
                    {errors.password.map((msg, i) => (
                   <li key={i} style={{ marginBottom: '4px' }}>⚠️ {msg}</li>
                  ))}
                </ul>
                  )}
                </div>

                <br />

                <div className="btn-container">
                  <button type="submit" className="btn btn-submit">
                    Sign Up
                  </button>
                  <Link to="/login" className="btn-signup">
                    Login
                  </Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </main>
    </section>
  );
};

export default Signup;
