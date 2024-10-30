import Header from './Header.jsx'
import PatientRequestButtons from './PatientRequestButtons.jsx'
import PatientRequestSearch from './PatientRequestSearch.jsx'
import PatientRequestTests from './PatientRequestTests.jsx'
import PatientInformation from './PatientInformation.jsx'
import DateTime from './DateTime.jsx'
import { useState } from 'react';

function PatientRequest() {
  const [selectedTests, setSelectedTests] = useState({});

  const handleCheckboxChange = (test, category) => {
    setSelectedTests((prev) => {
      const updatedTests = { ...prev };

      if (prev[test]) {
        delete updatedTests[test]; 
      } 
      else {
        updatedTests[test] = category; 
      }

      return updatedTests;
  });
  };

  const handleSubmit = async () => {
    const requestData = {
        tests: selectedTests,
    };

    try {
        const res = await fetch('http://localhost:4000/api/requests', {
            method: 'POST', // Use POST for creating new entries
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(requestData), // Send the data as JSON
        });

        if (!res.ok) {
            throw new Error('Failed to submit data');
        }

        const result = await res.json();
        console.log('Data submitted successfully:', result);
        // You can also add logic to clear selected tests or show a success message

    } catch (error) {
        console.error('Error submitting data:', error);
    }
};

  const sampleData =
  {
    patientName: 'Pika Chu',
    patientSex: 'M',
    patientPhoneNo: '09876543210',
    patientEmail: 'pikapika@chu.com',
    patientAge: '3',
    patientBday: 'April 1, 2021',
    patientAddress: 'Palette Town',
  };

  return (
    <>
      <Header/>
      <div className='title-body'>
        <h1 className='_title'>Add Patient Request</h1>
        <DateTime />
        <br></br>
        <PatientRequestSearch />
        <hr />
        <PatientInformation data = {sampleData} />
        <hr />

      </div>
      <div className='table-body'>
        <PatientRequestTests onCheckboxChange={handleCheckboxChange}/>
        <hr/>
        <PatientRequestButtons onSubmit={handleSubmit}/>
      </div>
    </>

  )
}

export default PatientRequest