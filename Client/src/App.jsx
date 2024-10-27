import Home from './Home.jsx'
import PatientRequest from './PatientRequest.jsx'
import ViewPatients from './ViewPatients.jsx'
import ViewPatientHistory from './ViewPatientHistory.jsx'
import PatientRegistration from './PatientRegistration.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import {useEffect, useState} from 'react'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';

function App() {
  const [data, setData] = useState({}); // To store all the fetched data

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3000');
        const jsonData = await res.json();
        setData(jsonData); // Save all data to state
        console.log(jsonData); // Log to check if data is fetched correctly
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchData();
  }, []);
  return (
    <>
    <Router>
      <div>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/home" element={<Home />} />
          <Route path="/register" element={<Register />} />
          <Route path="/addpatient" element={<PatientRegistration />} />
          <Route path="/request" element={<PatientRequest />} />
          <Route path="/patients" element={<ViewPatientHistory />} />
          <Route path="/patienthistory" element={<ViewPatients />} />
        </Routes>
      </div>
    </Router>
      {
      // <div>
      //   <h1>Fetched Data</h1>
      //   <pre>{JSON.stringify(data, null, 2)}</pre>
      // </div>
      }
  
    </>
  )
}

export default App
