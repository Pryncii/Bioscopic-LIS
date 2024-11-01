
import React, { useState } from "react";
import './styles/Register.css'
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
        navigate('/home'); // This navigates to a specific route
    };
    return (
    <div className="d-flex align-items-center vh-100">
        <div className="d-flex justify-content-center flex-column vh-100 bg">
            <div className = "d-flex align-items-center flex-column">
                <img src= {logo2}/>
                <div className="d-flex align-items-center flex-column title">
                    <h2 className = "text-white title-text">BIOSCOPIC DIAGNOSTIC CENTER</h2>
                    <h4 className = "text-white">LABORATORY INFORMATION SYSTEM</h4>
                </div>
                <span className = "text-white">
                    An easy to use application for your laboratory viewing needs
                </span>
            </div>
        </div>
        <div className="d-flex justify-content-center w-100">
            <div className="col-5">
                <form onSubmit={handleSubmit}>
                    <h1 className="fw-bold mb-3">Welcome!</h1>
                    <div className="mb-3">
                        <label for="username" className="form-label">Username</label>
                        <input type="text" 
                        className="form-control" 
                        name="username" 
                        value={formData.username} 
                        onChange={handleChange}/>
                    </div>
                    <div className="mb-2">
                        <label for="password" className="form-label">Password</label>
                        <input type="password" 
                        className="form-control"  
                        name="password" 
                        minlength="8" required
                        value={formData.password} 
                        onChange={handleChange}/>
                    </div>
                    <div className = "mb-3 d-flex justify-content-between">
                        <div className="remember">
                            <input className="form-check-input cb" type="checkbox" value="" id="remember" />
                            <label className="form-check-label" for="remember">Remember me</label>
                        </div>
                        <a href = "/">Forgot password?</a>
                    </div>
                    <div class="d-flex justify-content-center">
                        <button onClick = {loginHome} type="submit" class="btn btn-primary btn-lg mb-3">LOGIN</button>
                    </div>
                    <div className="text-center">Don't have an account yet? <a href = "register">Register Now</a></div>
                </form>
            </div>
        </div>    
    </div>
    );
}
export default Login