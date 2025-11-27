import React, { useContext, useState } from 'react';
import "../assets/css/auth.css";
import { Link, useNavigate } from 'react-router-dom';
import { AppContext } from "../context/AppContext";

import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import toast from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const { setUser,setOwner } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }


const handleSubmit = async (e) => {
  e.preventDefault();
  
  try {
    const { data } = await axios.post("/api/user/login", formData, {
      withCredentials: true
    });
    
    if (data.success) {
      toast.success("Login successful!");
      setUser(data.user);
      localStorage.setItem("user", JSON.stringify(data.user));
      
     if (data.user.role === "owner") {
        setOwner(true);
        navigate('/owner/dashboard');
      } else {
        setOwner(false);
        navigate('/');
      }
    } else {
      toast.error("Email or password incorrect.");
    }
  } catch (error) {
    console.log("Login error:", error.response?.data || error);
    toast.error("Login failed");
  }
}

  return (
    <div className="auth-container">
      <h2>Welcome Back</h2>
      <form className="auth-form" onSubmit={handleSubmit}>
        
        {/* Email Input */}
        <div className="form-group">
          <label htmlFor="email">Email Address</label>
          <div className="input-wrapper">
            <EmailIcon className="input-icon" />
            <input
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter your email"
            />
          </div>
        </div>

        {/* Password Input */}
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <div className="input-wrapper">
            <LockIcon className="input-icon" />
            <input
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>
        </div>

        <button type="submit" className="btn-primary">
          Login
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <p>
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </form>
    </div>
  )
}

export default Login;