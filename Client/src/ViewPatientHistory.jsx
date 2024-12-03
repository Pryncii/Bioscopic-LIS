import Header from './Header.jsx'
import PatientInformation from './PatientInformation.jsx'
import DateTime from './DateTime.jsx'
import TableButtons from './TableButtons.jsx'
import ViewPatientHistoryTable from './ViewPatientHistoryTable.jsx'
import './styles/Table.css';
import { useLocation } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { URL } from './constants'

function ViewPatientHistory() {
  const [data, setData] = useState({});
  const location = useLocation(); // Get current URL
  const [patient, setPatient] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0); // New state for totalPages
  const [tests, setTests] = useState([]); 
  const patientID = new URLSearchParams(location.search).get('patientID');
  
  useEffect(() => {
    const fetchPatientData = async () => {
      try {
        const res = await fetch(`${URL}/patienthistory?patientID=${patientID}`);
        if (!res.ok) {
          throw new Error('Failed to fetch patient data');
        }
        const data = await res.json();
        setTotalPages(data.requestData.length);
        setData(data);
        setCurrentPage(currentPage);
        console.log(data);

        const formattedPatient = {
          ...data.patient,
          birthday: formatDate(data.patient.birthday), // Format the birthday
        };
        
        setPatient(formattedPatient);

      } catch (error) {
        console.error('Error fetching patient data:', error);
      }
    };

    if (patientID) {
      fetchPatientData();
    }
  }, [patientID]);

  useEffect(() => {
    const handleKeyDown = (event) => {
        if (event.key === 'ArrowRight') {
            handleNext(); // Navigate to the next page
        } else if (event.key === 'ArrowLeft') {
            handleBack(); // Navigate to the previous page
        }
    };

    // Add event listener for keydown
    window.addEventListener('keydown', handleKeyDown);

    // Cleanup the event listener on component unmount
    return () => {
        window.removeEventListener('keydown', handleKeyDown);
    };
}, [currentPage, totalPages]);

  useEffect(() => {
    const fetchTestValues = async () => {
        try {
            const response = await fetch(`${URL}/tests`);
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

  // Function to handle the NEXT button click
  const handleNext = () => {
      if (currentPage < totalPages) {
          setCurrentPage(currentPage + 1);
      }
  };

  // Function to handle the BACK button click
  const handleBack = () => {
      if (currentPage > 1) {
          setCurrentPage(currentPage - 1);
      }
  };

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
        <ViewPatientHistoryTable data={data.requestData[currentPage - 1] || []} tests={tests} patientName={patient.name} patientEmail={patient.email}/>
        <hr />
        <div className="button-page">
            <button className="btn-item btn btn-primary btn-lg" onClick={handleBack} disabled={currentPage === 1}>
                BACK
            </button>
            <h5>Page {currentPage} of {totalPages}</h5>
            <button className="btn-item btn btn-primary btn-lg" onClick={handleNext} disabled={currentPage === totalPages}>
                NEXT
            </button>
        </div>
      </div>
    </>
  )
}

export default ViewPatientHistory;
