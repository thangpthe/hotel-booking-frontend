import React, { useContext, useState } from 'react';
import "../assets/css/auth.css";
import { Link } from 'react-router-dom';
import { AppContext } from "../context/AppContext";
import axios from 'axios';
import EmailIcon from '@mui/icons-material/Email';
import LockIcon from '@mui/icons-material/Lock';
import toast from 'react-hot-toast';

const Login = () => {
  const { navigate, checkAuth } = useContext(AppContext);
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      console.log('🔑 Attempting login...');
      
      const { data } = await axios.post("/api/user/login", formData);
      
      // console.log('📥 Login response:', data);
      
      if (data.success) {
        toast.success(data.message || "Login successful!");
        if (data.token) {
          localStorage.setItem('token', data.token);
          // console.log('✅ Token saved to localStorage');
          
          // ✅ Set token in axios headers
          axios.defaults.headers.common['Authorization'] = `Bearer ${data.token}`;
          // console.log('✅ Token set in axios headers');
        }
        
        // ✅ Fetch user profile to update state
        await checkAuth();
        
        // Navigate based on role
        if (data.user.role === "owner") {
          console.log('🏨 Navigating to owner dashboard');
          navigate('/owner/dashboard');
        } else {
          console.log('🏠 Navigating to home');
          navigate('/');
        }
      } else {
        toast.error(data.message || "Login failed");
      }
    } catch (error) {
      console.error('Login error:', error);
      
      if (error.response) {
        toast.error(error.response.data?.message || "Login failed");
      } else if (error.request) {
        toast.error("No response from server");
      } else {
        toast.error("An error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

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
              disabled={loading}
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
              disabled={loading}
            />
          </div>
        </div>

        <button type="submit" className="btn-primary" disabled={loading}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div className="auth-links">
          <Link to="/forgot-password">Forgot Password?</Link>
          <p>
            Don't have an account? <Link to="/signup">Register</Link>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;