
import React, { useState } from "react";
import './styles/Register.css'
import Header from './Header.jsx'

function PatientRegistration() {
    const [formData, setFormData] = useState({
        firstName: "Jeka",
        middleName: "Bunda",
        lastName: "Cataluna",
        sex: "M",
        birthday: "",
        birthyear:"",
        age: 0,
        phoneNumber: "09364606008",
        email: "cataluna.joriceerika@yahoo.com",
        pwdID: "",
        seniorID: "",
        address: "asdadasd",
      });
      const [error, setError] = useState('');

        // Handle input change
    const handleChange = (e) => {
        setError("");
        const { name, value } = e.target;
        setFormData({
            ...formData,
            [name]: value
        });
    };

    //validate age and birthday
    const validate = () => {
        if (formData.birthday){
            if(formData.age){
                const today = new Date();
                const birthDate = new Date(formData.birthday);
                let calculatedAge = today.getFullYear() - birthDate.getFullYear();
                if (today < new Date(today.getFullYear(), birthDate.getMonth(), birthDate.getDate())) {
                    calculatedAge--;    
                }

                if (formData.age != calculatedAge){
                    setError("Age and Birthday does not match!");
                    return 1;
                }
                else{
                    return 0;
                }
            }
        }
    }
    // Handle form submission
    const handleSubmit = async (e) => {
        e.preventDefault();

        //validate age and birthday

        //format the name
        const fullName = formData.lastName + ', ' + formData.firstName + ', ' + formData.middleName;
        const dataToSend ={
            ...formData,
            name: fullName,
          };
        
        try{
            if(!validate()){
                const res = await fetch('http://localhost:4000/addpatient', {
                    method: 'POST',
                    headers:{
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(dataToSend)
                });
                const json = await res.json()
                if(res.ok){
                    console.log('Patient Added:',  json);
                    
                }
                else{
                    console.log('Data Received:', json);
                    console.log('Failed to add patient. Please try again');      
                }
            }
        }catch(error){
            console.error('Error adding patient:', error);
        }
        // Process form data (e.g., send to backend)
        console.log("Form data submitted: ", dataToSend);
        
    };
    return (
        <>
        <Header />
        <div className="d-flex justify-content-center align-items-center vh-100 w">
            <div className="w-50">
                <form onSubmit={handleSubmit}>
                <div className="spacer">
                <h1 className="text-center fw-bold mb-3">Add Patient</h1>
                        <label className = "form-label">Full Name *: </label>
                        <div className="d-flex justify-content-evenly mb-3 gap-3">   
                                <input type="text" 
                                className="form-control" 
                                name="firstName" 
                                placeholder="First Name" required 
                                value={formData.firstName} 
                                onChange={handleChange}
                                />
                                <input type="text" 
                                className="form-control" 
                                name="middleName" 
                                placeholder="Middle Name" required 
                                value={formData.middleName} 
                                onChange={handleChange}
                                />
                                <input type="text" 
                                className="form-control" 
                                name="lastName" 
                                placeholder="Last Name" required 
                                value={formData.lastName} 
                                onChange={handleChange}
                                />
                        </div>
                        <div className="mb-3">
                            <label className="form-label">Sex</label>
                            <select className="form-select" name="sex"value={formData.sex} onChange={handleChange}>
                                <option value="null"> </option>
                                <option value="M">Male</option>
                                <option value="F">Female</option>
                            </select>
                        </div>
                        <div className="mb-3">
                            <label for="date" className="form-label">Birthdate</label>
                            <input type="date" 
                            className="form-control"  
                            name="birthday"
                            value={formData.birthday} 
                            onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label for="age" className ="form-label">Age *</label>
                            <input type="number" 
                            className ="form-control" 
                            name="age"  required
                            min = "0"
                            value={formData.age} 
                            onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label for="phoneNumber" className ="form-label">Phone Number *</label>
                            <input type="text" 
                            className ="form-control" 
                            name="phoneNumber" required 
                            pattern = "\d{11}"
                            title = "Please enter 11 digits (09xxxxxxxxx)"
                            value={formData.phoneNumber} 
                            onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label for="email" className="form-label">Email Address *</label>
                            <input type="email" 
                            className="form-control" 
                            name="email" 
                            placeholder="username@bioscopic.com" 
                            pattern="^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$" required
                            value={formData.email} 
                            onChange={handleChange}/>
                        </div>
                        <div className="mb-3">
                            <label for="address" className="form-label">Home Address</label>
                            <input type="text" 
                            className="form-control" 
                            name="address"
                            value={formData.address} 
                            onChange={handleChange}/>
                        </div>
                        <div className ="mb-3">
                            <label for="pwdID" className = "form-label">PWD ID</label>
                            <input type="text"
                            className ="form-control" 
                            name = "pwdID"
                            value={formData.pwdID} 
                            onChange={handleChange}/>
                        </div>
                        {formData.age >= 65 && (<div className ="mb-3">
                            <label for="seniorID" className = "form-label">SENIOR ID</label>
                            <input type="text"
                            className ="form-control" 
                            name = "seniorID"
                            value={formData.seniorID} 
                            onChange={handleChange}/>
                        </div>)}
                        
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>} {/* Display error message */}
                    <div class="d-flex justify-content-center mb-3">
                        <button type="submit" class="btn btn-primary btn-lg">REGISTER</button>
                    </div>
                </form>
            </div>
        </div>
    </>
    );
}
export default PatientRegistration