import Header from './Header.jsx';
import PatientRequestButtons from './PatientRequestButtons.jsx';
import PatientRequestSearch from './PatientRequestSearch.jsx';
import PatientRequestTests from './PatientRequestTests.jsx';
import PatientInformation from './PatientInformation.jsx';
import DateTime from './DateTime.jsx';
import ModalConfirmRequest from './ModalConfirmRequest.jsx';
import { useState, useEffect } from 'react';

function PatientRequest() {
  const [selectedTests, setSelectedTests] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState({});
  const [selectPatient, setSelectedPatient] = useState("");

  useEffect(() => {
    const fetchPatients = async () => {
      try {
        const res = await fetch('http://localhost:4000/requests');
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const patients = await res.json();

        const updatedPatients = patients.map(patient => {
          return {
            ...patient,
            birthday: new Date(patient.birthday).toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            }),
          };
        });

        setPatients(updatedPatients);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
    fetchPatients();
  }, []);

  const searchPatients = Object.values(patients || {}).map(patient => ({
    patientID: patient.patientID,
    name: patient.name
  }));

  const handleSearchQuery = (searchResult) => {
    const patient = patients.find(p => p.patientID === searchResult.patientID);
      if (patient) {
          setSelectedPatient(patient);
      } else {
          console.log("Patient not found");
      }
  };

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

  const handleSubmit = async (payment) => {
    const requestData = {
      tests: selectedTests,
      patientID: selectPatient.patientID,
      payment: payment,
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
      setSelectedPatient({});
      setSelectedTests({});

      console.log('Data submitted successfully:', result);

    } catch (error) {
      console.error('Error submitting data:', error);
    }
  };

  const handleCancel = async () => {
    try {
      setSelectedPatient({});
      setSelectedTests({});

      console.log('Successfully Cancelled Request');

    } catch (error) {
      console.error('Error in Cancelling Request:', error);
    }
  };

  return (
    <>
      <Header />
      <div className='title-body'>
        <h1 className='_title'>Add Patient Request</h1>
        <DateTime />
        <br />
        <PatientRequestSearch patients={searchPatients} onSearch={handleSearchQuery}/>
        <hr />
        {patients.length > 0 ? (
          <PatientInformation patient={selectPatient} />
        ) : (
          <div>Loading patient information...</div>
        )}
        <hr />
      </div>
      <div className='table-body'>
        <PatientRequestTests onCheckboxChange={handleCheckboxChange} selectedTests={selectedTests}  />
        <hr />
        <PatientRequestButtons 
          onSubmit={() => setShowModal(true)}
          onCancel={handleCancel}
          isDisabled={!Object.keys(selectPatient).length > 0 || !Object.keys(selectedTests).length > 0}
        />
      </div>

      <ModalConfirmRequest
        show={showModal}
        onHide={() => setShowModal(false)}
        patient={selectPatient}
        tests={selectedTests}
        onSubmit={handleSubmit}
      />
    </>
  );
}

export default PatientRequest;
