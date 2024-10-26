import Header from './Header.jsx'
import DateTime from './DateTime.jsx'
import SearchPatient from './SearchPatient.jsx'
import TablePatient from './TablePatient.jsx'
import TableButtons from './TableButtons.jsx'
import {useEffect, useState} from 'react'

function ViewPatients() {
    const [data, setData] = useState({});

    useEffect(() => {
        const fetchData = async () => {
          try {
            const res = await fetch('http://localhost:4000/patients');
            const jsonData = await res.json();
            setData(jsonData); // Save all data to state
            console.log(jsonData); // Log to check if data is fetched correctly
          } catch (error) {
            console.error('Error fetching data:', error);
          }
        };
        fetchData();
      }, []);

      const [currentPage, setCurrentPage] = useState(1);
      const totalPages = data.length; // Set this to the total number of pages you have
  
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


    return(
        <>
        <Header/>
        <div className='title-body'>
            <h1 className='_title'>View All Patients</h1>
            <DateTime/>
        </div>
        <SearchPatient/>
        <div className='table-body'>
            <TablePatient data={data[currentPage-1]}/>
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
         {
      <div>
        <h1>Fetched Data</h1>
        <pre>{JSON.stringify(data, null, 2)}</pre>
      </div>
      }
        </>
    );
}

export default ViewPatients;