import Header from './Header.jsx'
import React, { useState } from "react";
import './patientRegistration.css'

function PatientRegistration() {
    const [formData, setFormData] = useState({
        firstName: "",
        middleName: "",
        lastName: "",
        sex: "",
        birthday: "",
        age: "",
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
        <div className="main-content">
            <div className="_title container-fluid">
                <h1>Add Patient Data</h1>
                <h2 id="time"></h2>
            </div>

            <div className="reg-content">
                <form onSubmit={handleSubmit}>
                    <table className="reg-items">
                        <tr>
                            <th className="item-label"><h5>Full Name</h5></th>
                        </tr>
                        <tr>
                            <th className="item-container">
                                <input className="input-item form-control" 
                                type="text"
                                name="firstName" 
                                placeholder="First Name" required
                                value={formData.firstName} 
                                onChange={handleChange}/>
                                </th>
                            <th className="item-container">
                                <input className="input-item form-control" 
                                type="text"
                                name="mname" 
                                placeholder="Middle Name/Initial"
                                value={formData.middleName} 
                                onChange={handleChange}/></th>
                            <th className="item-container">
                                <input className="input-item form-control"
                                type="text" 
                                name="lastName"
                                placeholder="Last Name" required
                                value={formData.lastName} 
                                onChange={handleChange}/></th>
                        </tr>
                        <tr>
                            <th className="item-label"><h5>Sex</h5></th>
                            <th className="item-label"><h5 id="bday-lbl">Birthday</h5></th>
                            <th className="item-label"><h5 id="age-lbl">Age</h5></th>
                        </tr>
                        <tr>
                            <th className="item-container"> 
                                <select className="input-item form-control" 
                                name="sex" 
                                value={formData.sex} 
                                onChange={handleChange}>
                                    <option value="M">Male</option>
                                    <option value="F">Female</option>
                                </select>
                            </th>
                            <th className="item-container">
                                <input className="input-item form-control" type="date" name="birthday" value={formData.birthday} onChange={handleChange}/>
                            </th>
                            <th className="item-container">
                                <input className="input-item form-control" 
                                type="number"
                                name="age" 
                                min="0" required 
                                value={formData.age} 
                                onChange={handleChange}/>
                            </th>
                        </tr>
                    </table>
                    <table className="reg-items">
                        <tr>
                            <th className="item-label"><h5>Phone Number</h5></th>
                            <th className="item-label"><h5>Email</h5></th>
                            <th className="item-label"><span className="checkbox-flex"><input className="form-check-input checkbox-item" type="checkbox" value="PWD" id="PWD"/><h5>PWD ID</h5></span></th>
                            <th className="item-label"><span className="checkbox-flex"><input className="form-check-input checkbox-item" type="checkbox" value="Senior" id="Senior"/><h5>Senior ID</h5></span></th>
                        </tr>
                        <tr>
                            <th className="item-container">
                                <input className="input-item form-control" type="text" name="phoneNumber"/>
                                </th>
                            <th className="item-container">
                                <input className="input-item form-control" 
                                type="text"
                                name="email" 
                                placeholder="username@bioscopic.com" 
                                pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"  
                                value={formData.email} 
                                onChange={handleChange}/>
                                </th>
                            <th className="item-container">
                                <input className="input-item form-control" 
                                type="text" 
                                name="pwdNumber"
                                placeholder="PWD ID No." disabled
                                value={formData.pwdNumber} 
                                onChange={handleChange}/>
                                </th>
                            <th className="item-container">
                                <input className="input-item form-control" 
                                type="text" name="seniorNumber" 
                                placeholder="Senior ID No." disabled
                                value={formData.seniorNumber} 
                                onChange={handleChange}/>
                                </th>
                        </tr>
                        <tr>
                            <th className="item-label"><h5>Address</h5></th>
                        </tr>
                        <tr>
                            <th className="item-container" colspan="4">
                                <input className="input-item form-control" 
                                type="text"
                                name="address"
                                value={formData.address} 
                                onChange={handleChange}/>
                            </th>
                        </tr>
                    </table>
                    <div className="btn-container" colspan="2"><input className="reg-btn btn btn-primary btn-lg" type="submit" value="REGISTER"/></div>
                </form>
            </div>
        </div>
    )
}

export default PatientRegistration