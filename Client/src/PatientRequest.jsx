import Header from './Header.jsx';
import PatientRequestButtons from './PatientRequestButtons.jsx';
import PatientRequestSearch from './PatientRequestSearch.jsx';
import PatientRequestTests from './PatientRequestTests.jsx';
import PatientInformation from './PatientInformation.jsx';
import DateTime from './DateTime.jsx';
import ModalConfirmRequest from './ModalConfirmRequest.jsx';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { URL } from './constants'


function PatientRequest() {
  const navigate = useNavigate();
  const [selectedTests, setSelectedTests] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [patients, setPatients] = useState({});
  const [selectPatient, setSelectedPatient] = useState("");

  useEffect(() => {   //  fetch all of the patients' information
    const fetchPatients = async () => {
      try {
        const res = await fetch(`${URL}/request`);
        if (!res.ok) {
          throw new Error('Network response was not ok');
        }
        const patients = await res.json();

        const updatedPatients = patients.map(patient => {
          return {
            ...patient,
            birthday: new Date(patient.birthday).toLocaleDateString('en-US', {    // convert date type to string date
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

  const handleSearchQuery = (searchResult) => {   //  whenever a search is done, the patient selected will be stored in selectedPatient
    const patient = patients.find(p => p.patientID === searchResult.patientID);
      if (patient) {
          setSelectedPatient(patient);
      } else {
          console.log("Patient not found");
      }
  };

  const handleCheckboxChange = (test, category) => {  //  whenever a checkbox is checked it will be added to the selectedTests and viceversa
    setSelectedTests((prev) => {
      const updatedTests = { ...prev };

      if (prev[test]) {
        delete updatedTests[test];
      } else {
        updatedTests[test] = category;
      }

      if (test === "CBC" && !updatedTests[test]) {  // if CBC is clicked and unchecked
        updatedTests["CBC with Platelet Count"] = false;  // also uncheck CBCwPC if ever checked
      }

      return updatedTests;
    });
  };

  const handleSubmit = async (payment) => {   //  when submit is pressed then pass the information to save records to the api
    if (selectedTests["CBC with Platelet Count"]) {   //  remove CBC when CBCwPC is selected because of priority
      delete selectedTests["CBC"];
    }
    const requestData = {   //  data to be passed
      tests: selectedTests,
      patientID: selectPatient.patientID,
      payment: payment,
    };

    try {
      const res = await fetch(`${URL}/api/requests`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestData),
      });

      if (!res.ok) {
        throw new Error('Failed to submit data');
      }

      const result = await res.json();  //  message from api

      setSelectedPatient({});   //  clear data of patient information and checked tests
      setSelectedTests({});     //  meaning remove patient information, remove selectedPatient, and uncheck selectedTests

      console.log('Data submitted successfully:', result);

    } catch (error) {
      console.error('Error submitting data:', error);
    }
    navigate('/home'); 
  };

  const handleCancel = async () => {  //  reset everything
    try {
      setSelectedPatient({});   //  clear data of patient information and checked tests
      setSelectedTests({});     //  meaning remove patient information, remove selectedPatient, and uncheck selectedTests

      console.log('Successfully Cancelled Request');

    } catch (error) {
      console.error('Error in Cancelling Request:', error);
    }
  };
  
  const searchPatients = Object.values(patients || {}).map(patient => ({    // only pass patientId and patient name to search bar
    patientID: patient.patientID,
    name: patient.name
  }));

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
