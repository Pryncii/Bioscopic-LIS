import Header from './Header.jsx';
import PatientRequestButtons from './PatientRequestButtons.jsx';
import PatientRequestSearch from './PatientRequestSearch.jsx';
import PatientRequestTests from './PatientRequestTests.jsx';
import PatientInformation from './PatientInformation.jsx';
import DateTime from './DateTime.jsx';
import ModalConfirmRequest from './ModalConfirmRequest.jsx';
import { useState } from 'react';

function PatientRequest() {
  const [selectedTests, setSelectedTests] = useState({});
  const [showModal, setShowModal] = useState(false);

  const handleCheckboxChange = (test, category) => {
    setSelectedTests((prev) => {
      const updatedTests = { ...prev };

      if (prev[test]) {
        delete updatedTests[test];
      } else {
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
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
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

  const sampleData = {
    patientName: 'Pika Chu',
    patientSex: 'M',
    patientPhoneNo: '09876543210',
    patientEmail: 'pikapika@chu.com',
    patientAge: '3',
    patientBday: 'April 1, 2021',
    patientAddress: 'Palette Town',
  };

  // Temporary data for modal
  const tests = [
    { id: 1, name: "Test 1", isText: true },
    { id: 2, name: "Test 2", isText: false, options: ["opt1", "opt2", "opt3"] },
    { id: 3, name: "Test 3", isText: true },
    { id: 4, name: "Test 4", isText: true },
    { id: 5, name: "Test 5", isText: false, options: ["opt1", "opt2"] }
  ];
  const med_techs = [
    { name: "Arjay", prcno: 12345678 },
    { name: "Percival", prcno: 87654321 },
    { name: "Ian", prcno: 78456312 },
  ];
  const patients = [
    { name: "Matthew", patient_id: 1004, request_id: 2003 },
    { name: "Kyle", patient_id: 1005, request_id: 2004 },
    { name: "Jr", patient_id: 1006, request_id: 2005 },
  ];

  return (
    <>
      <Header />
      <div className='title-body'>
        <h1 className='_title'>Add Patient Request</h1>
        <DateTime />
        <br />
        <PatientRequestSearch />
        <hr />
        <PatientInformation data={sampleData} />
        <hr />
      </div>
      <div className='table-body'>
        <PatientRequestTests onCheckboxChange={handleCheckboxChange} />
        <hr />
        <PatientRequestButtons onSubmit={() => setShowModal(true)} />
      </div>

      <ModalConfirmRequest
        show={showModal}
        onHide={() => setShowModal(false)}
        patients={patients}
        med_techs={med_techs}
        tests={tests}
      />
    </>
  );
}

export default PatientRequest;
