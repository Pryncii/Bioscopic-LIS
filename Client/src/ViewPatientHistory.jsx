import Header from './Header.jsx'
import PatientInformation from './PatientInformation.jsx'
import DateTime from './DateTime.jsx'
import TableButtons from './TableButtons.jsx'
import ViewPatientHistoryTable from './ViewPatientHistoryTable.jsx'
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';

function ViewPatientHistory() {

  const location = useLocation(); // Get current URL
  const [patient, setPatient] = useState(null);
  const [requests, setRequests] = useState([]);
  const [tests, setTests] = useState([]); 

  const patientID = new URLSearchParams(location.search).get('patientID');
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await fetch(`http://localhost:4000/patienthistory?patientID=${patientID}`);
        if (!res.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await res.json();

        const formattedPatient = {
          ...data.patient,
          birthday: formatDate(data.patient.birthday), // Format the birthday
        };
        
        setPatient(formattedPatient);

        const formattedRequests = data.requests.map(request => ({
          ...request,
          dateStart: formatDate(request.dateStart),
          dateEnd: formatDate(request.dateEnd),
        }));

        setRequests(formattedRequests);
      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (patientID) {
      fetchPatientData();
    }
  }, [patientID]);

  useEffect(() => {
    const fetchTestValues = async () => {
        try {
            const response = await fetch('http://localhost:4000/tests');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();

            setTests(data);
        } catch (error) {
            setError(error.message);
        }
    };

    fetchTestValues();
}, []);

  // Function to format date to readable string
  const formatDate = (date) => {
    if (!date) return '';
    const newDate = new Date(date);
    const formatter = new Intl.DateTimeFormat('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
    return formatter.format(newDate);
  };

  if (!patient) {
    return <div>Loading patient data...</div>;
  }

  return (
    <>
      <Header/>
      <div className='title-body'>
        <DateTime />
        <hr/>
        <h2 className='_title'>{patient?.name || 'No Name Available'}</h2>
        <hr/>
        <PatientInformation patient={patient} />
        <hr/>
      </div>
      <div className='table-body'>
        <ViewPatientHistoryTable requests={requests} tests={tests} patientName={patient.name}/>
        <hr />
        <TableButtons />
      </div>
    </>
  )
}

export default ViewPatientHistory;
