import Header from './Header.jsx'
import DateTime from './DateTime.jsx'
import SearchHome from './SearchHome.jsx'
import TableHome from './TableHome.jsx'
import './styles/Table.css';
import {useEffect, useState} from 'react'
import { URL } from './constants'

function Home() {
  const [data, setData] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const totalPages = data.length; // Set this to the total number of pages you have

  const fetchData = async (params = {}) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await fetch(`${URL}/requests?${query}`);
      const jsonData = await res.json();
      setData(jsonData);
      setCurrentPage(currentPage);
      console.log(jsonData);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  // Fetch initial data on component mount
  useEffect(() => {
    fetchData(); // Call fetchData without parameters to get all data initially
  }, []);

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

  // Function to handle updated status data from TableHome
  const handleUpdate = () => {
    fetchData();
  };

  return (
    <>
      <Header/>
      <div className='title-body'>
        <h1 className='_title'>Requested/Ongoing Lab Tests</h1>
        <DateTime/>
      </div>
      <SearchHome onSearch={(params) => fetchData(params)} />
      <div className='table-body'>
        <TableHome data={data[currentPage - 1] || []} onUpdate={handleUpdate}/>
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

export default Home