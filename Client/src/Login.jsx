
import React, { useState } from "react";
import './Register.css'
import logo2 from './assets/logo2.png'
import { Checkbox } from "@mui/material";
import FormControlLabel from "@mui/material/FormControlLabel";
import { useNavigate } from 'react-router-dom';

function Login() {
    const [formData, setFormData] = useState({
        username: "",
        password: "",
      });

        // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
            //insert pass_user match condition from db
            });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form data (e.g., send to backend)
        console.log("Form data submitted: ", formData);
    };
    const navigate = useNavigate();

    const loginHome = () => {
        navigate('/Bioscopic-LIS/home'); // This navigates to a specific route
    };
    return (
    <div className="d-flex align-items-center vh-100">
        <div className="d-flex justify-content-center flex-column vh-100 bg">
            <div className = "d-flex spacer bg align-items-center flex-column">
                <img src= {logo2}/>
                <h2 className = "text-white title">BIOSCOPIC DIAGNOSTIC CENTER</h2>
                <h3 className = "text-white">LABORATORY INFORMATION SYSTEM</h3>
                <div className = "spacer text-white">
                    An easy to use application for your laboratory viewing needs
                </div>
            </div>
        </div>
        <div className="d-flex justify-content-center align-items-centervh-100 w-100">
            <form onSubmit={handleSubmit}>
                <h1 className="text-center fw-bold mb-3">Welcome Back!</h1>
                    <div className="mb-3">
                        <label for="username" className="form-label">Username</label>
                        <input type="text" 
                        className="form-control" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange}/>
                    </div>
                    <div className="mb-3">
                        <label for="password" className="form-label">Password</label>
                        <input type="password" 
                        className="form-control"  
                        name="password" 
                        minlength="8" required
                        value={formData.password} 
                        onChange={handleChange}/>
                    </div>
                <div class="d-flex align-items-center flex-column mb-3 ">
                    <button onClick = {loginHome} type="submit" class="btn btn-primary btn-lg mb-3">LOGIN</button>
                    <div className = "mb-3">
                    <FormControlLabel control = {<Checkbox />} label = "Remember Me" /> 
                        <a href = "/Bioscopic-LIS/"> Forgot password? </a>
                    </div>
                    
                    <div className = "mb-3">
                        Don't have an account yet? 
                        <a href = "/Bioscopic-LIS/register"> Register </a>
                    </div>
                </div>
            </form>
        </div>    
    </div>
    );
}
export default Login