import Header from './Header.jsx'
import React, { useState } from "react";
import './patientRegistration.css'

function Register() {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        sex: "",
        birthday: "",
        phoneNumber: "",
        email: "",
        pwdNumber: "",
        seniorNumber: "",
        address: ""
      });

        // Handle input change
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({
        ...formData,
        [name]: value
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        // Process form data (e.g., send to backend)
        console.log("Form data submitted: ", formData);
    };

    return (
        <div class="reg-content">
            
        </div>
    )
}