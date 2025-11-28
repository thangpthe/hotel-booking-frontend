import React, { useContext, useState } from 'react';
import "../assets/css/auth.css";
import { Link } from 'react-router-dom';
import PersonIcon from '@mui/icons-material/Person';
import EmailIcon from '@mui/icons-material/Email';
import BadgeIcon from '@mui/icons-material/Badge';
import LockIcon from '@mui/icons-material/Lock';
import VpnKeyIcon from '@mui/icons-material/VpnKey';
import { AppContext } from '../context/AppContext';
import axios from 'axios';

const SignUp = () => {
  
  const {navigate} = useContext(AppContext);
  console.log(axios);
  const [formData, setFormData] = useState({
    name:'',
    email: '',
    role: '',
    password: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('Form Submitted:', formData);
    try{
      const {data} = await axios.post("/api/user/signup",formData);
      if(data.success){
        // console.log(data.message);
        navigate('/login');
      }else{
        console.error(data.message);
      }

    }catch(error){
      console.log(error);
      
    }
  };

  return (
    <div className="auth-container">
      <h2>Create Account</h2>
      <p style={{textAlign: 'center', marginBottom: '20px', color: '#666'}}>
        Join <strong>MyBooking</strong> today
      </p>

      <form className="auth-form" onSubmit={handleSubmit}>
        {/* Username */}
        <div className="form-group">
          <label>Username</label>
          <div className="input-wrapper">
            <PersonIcon className="input-icon" />
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              placeholder="Enter your name"
            />
          </div>
        </div>

        {/* Email */}
        <div className="form-group">
          <label>Email</label>
          <div className="input-wrapper">
            <EmailIcon className="input-icon" />
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              placeholder="Enter email address"
            />
          </div>
        </div>

        {/* Role - Select box */}
        <div className="form-group">
          <label>I am a</label>
          <div className="input-wrapper">
            <BadgeIcon className="input-icon" />
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              required
              style={{cursor: 'pointer'}}
            >
              <option value="">-- Select Role --</option>
              <option value="user">Traveller (Individual)</option>
              <option value="owner">Hotel Owner (Business)</option>
            </select>
          </div>
        </div>

        {/* Password */}
        <div className="form-group">
          <label>Password</label>
          <div className="input-wrapper">
            <LockIcon className="input-icon" />
            <input
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Create password"
            />
          </div>
        </div>


        <button type="submit" className="btn-primary">Sign Up</button>

        <div className="auth-links">
          <p>Already have an account? <Link to="/login">Login</Link></p>
        </div>
      </form>
    </div>
  );
};

export default SignUp;