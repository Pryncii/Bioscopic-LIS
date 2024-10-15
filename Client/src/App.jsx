import Home from './Home.jsx'
import PatientRequest from './PatientRequest.jsx'
import ViewPatients from './ViewPatients.jsx'
import ViewPatientHistory from './ViewPatientHistory.jsx'
import Header from './Header.jsx'
import Register from './Register.jsx'
import Login from './Login.jsx'
import {useEffect, useState} from 'react'

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
      <Login />
      <div>
        <h1>Fetched Data</h1>
        {/* Display the data in your preferred format */}
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
  
    </>
  )
}

export default App
