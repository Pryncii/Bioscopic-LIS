import { useState, useEffect } from "react";
import ModalEditStatus from "./ModalEditStatus";
import ModalEditRequest from "./ModalEditRequest"; // Import the edit request modal
import './styles/Table.css';
import { URL } from './constants'
//commit
function TableHome({ data, onUpdate }) {
    const [tableData, setTableData] = useState(data);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [modalType, setModalType] = useState(null);
    const [users, setUsers] = useState([{ prcno: "" }]); 
    const [testOptions, setTestOptions] = useState([""]); 
    const [testValues, setTestValues] = useState([]); 

    const formatDateTime = (date) => 
        date ? new Date(date).toLocaleString('en-US', {
          month: '2-digit', day: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        }) : "";
    
    const fetchMedtechID = async () => {
        try {
            const response = await fetch(`${URL}/api/user`, {
            method: 'GET',
            credentials: 'include',  // This ensures the session cookie is sent with the request
            });
            if (!response.ok) {
            throw new Error('Failed to fetch user data');
            }
            const data = await response.json();
            return data.medtechID;
        } catch (error) {
            console.error('Error fetching medtechID:', error);
            return null;
        }
    };

    const handleStatusChange = async (e, item) => {
        const updatedStatus = e.target.value;
        
        try {
            const medtechID = await fetchMedtechID();
            const response = await fetch(`${URL}/api/requests/${item.requestID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    status: updatedStatus, // Pass the updated status
                    medtechID
                }),
            });
            
            if (!response.ok) {
                throw new Error("Failed to update request");
            }
    
            const updatedPatient = await response.json();
            // console.log(updatedPatient);

            setTableData(prevData =>
                prevData.map(row =>
                    row.requestID === item.requestID
                        ? {
                            ...row,
                            requestStatus: updatedPatient.status,
                            barColor: updatedPatient.status === "Completed" ? "c"
                                    : updatedPatient.status === "In Progress" ? "ip" : "req",
                            dateCompleted: formatDateTime(updatedPatient.dateEnd) || ""
                        }
                        : row
                )
            );
        } catch (error) {
            console.error("Failed to update request:", error);
        }

        if (onUpdate) {
            onUpdate();
        }
    };        
        
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch(`${URL}/users`); // Adjust the URL as necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } 
        };
    
        fetchUsers();
        }, []);

    useEffect(() => {
        const fetchTestOptions = async () => {
            try {
                const response = await fetch(`${URL}/testoptions`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTestOptions(data);
            } catch (error) {
                setError(error.message);
            } 
        };
    
        fetchTestOptions();
        }, []);

    useEffect(() => {
        const fetchTestValues = async () => {
            try {
                const response = await fetch(`${URL}/tests`);
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setTestValues(data);
            } catch (error) {
                setError(error.message);
            } 
        };
    
        fetchTestValues();
        }, []);

    // Set `tableData` whenever `data` changes
    useEffect(() => {
        setTableData(data);
    }, [data]);
    
    const handleShowStatusModal = (patient) => {
        setSelectedPatient(patient);
        setModalType("status"); // Set modal type to status
    };

    const handleShowRequestModal = async (patient) => {
        setSelectedPatient(patient);
        try {
          const response = await fetch(`${URL}/requests/${patient.requestID}`);
          if (!response.ok) {
            throw new Error('Failed to fetch request data');
          }
      
          const requestData = await response.json(); // Get the request data, including medtechID
          const medtechID = requestData.medtechID;
      
          const updatedUsers = users.filter(user => user.medtechID === medtechID);
          const otherUsers = users.filter(user => user.medtechID !== medtechID);
          const sortedOtherUsers = otherUsers.sort((a, b) => a.name.localeCompare(b.name));
      
          setUsers([updatedUsers[0], ...sortedOtherUsers]);
      
          setModalType("request"); // Set modal type to request
        } catch (error) {
          console.error('Error fetching request data:', error);
        }
      };
      

    const handleCloseModal = () => {
        setModalType(null); // Reset modal type to close any modal
        setSelectedPatient(null);
    };

    // Function to handle updating a row after editing
    const handleStatusUpdate = (updatedPatient) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.requestID === updatedPatient.requestID
                    ? {
                        ...row,
                        remarks: updatedPatient.remarks,
                        paymentStatus: updatedPatient.payStatus
                    }
                    : row
            )
        );
        // Call onUpdate to update the data at Home
        if (onUpdate) {
            onUpdate();
        }
    };

    const handleSubmit = async (formData, medtechID) => {
    
        console.log(formData); // Log the form data for debugging
    
        try {
            const response = await fetch(`${URL}/testvalues`, {
              method: 'POST',
              headers: {
                  'Content-Type': 'application/json',
              },
              body: JSON.stringify(formData),
            });
            if (!response.ok) {
                console.log('here');
                const errorText = await response.text();
                console.error('Error response:', response.status, errorText);
                return; 
            } else {
                const { requestID } = formData; 
                const requestIndex = testValues.findIndex(item => item.requestID === requestID);
                testValues[requestIndex] = { ...testValues[requestIndex], ...formData };
                const responseData = await response.json(); 
                console.log('Response Data:', responseData); 
            }
    
        } catch (error) {
            // Handle fetch errors
            console.error('Error during submission:', error);
            setErrorMessage('An error occurred while submitting the form. Please try again.'); // Set a generic error message
        }

        try {
            const response = await fetch(`${URL}/api/requests/${formData.requestID}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    medtechID
                }),
            });
            
            if (!response.ok) {
                throw new Error("Failed to update request");
            }
        } catch (error) {
            console.error("Failed to update request:", error);
        }
    };

    return (
        <>
        <table className="test-items home-table">
            <thead>
                <tr>
                    <th className="item-label number">
                        <h6>#</h6>
                    </th>
                    <th className="item-label id-item">
                        <h6>Request ID</h6>
                    </th>
                    <th className="item-label id-item">
                        <h6>Patient ID</h6>
                    </th>
                    <th className="item-label">
                        <h6>Name</h6>
                    </th>
                    <th className="item-label">
                        <h6>Test/s</h6>
                    </th>
                    <th className="item-label status">
                        <h6>Request Status</h6>
                    </th>
                    <th className="item-label remarks">
                        <h6>Remarks</h6>
                    </th>
                    <th className="item-label id-item">
                        <h6>Payment Status</h6>
                    </th>
                    <th className="item-label date">
                        <h6>Date Requested</h6>
                    </th>
                    <th className="item-label date">
                        <h6>Date Completed</h6>
                    </th>
                </tr>
            </thead>
            <tbody>
                {tableData.length > 0 ? (
                    tableData.map((item, index) => (
                        <tr key={index} onClick={() => handleShowRequestModal(item)}>
                            <td className="item-container number"><h6>{index + 1}</h6></td>
                            <td className="item-container"><h6>{item.requestID}</h6></td>
                            <td className="item-container"><h6>{item.patientID}</h6></td>
                            <td className="item-container"><h6>{item.name}</h6></td>
                            <td className="item-container"><h6>{item.tests}</h6></td>
                            <td className="item-container status" role="button" onClick={(e) => { e.stopPropagation(); }}>
                                <select className={`status-item ${item.barColor}`} value={item.requestStatus} onChange={(e) => handleStatusChange(e, item)}>                               
                                    <option value="Requested">Requested</option>
                                    <option value="In Progress">In Progress</option>
                                    <option value="Completed">Completed</option>
                                </select>
                            </td>
                            <td className="item-container" role="button" onClick={(e) => { e.stopPropagation(); handleShowStatusModal(item); }}>
                                <h6>{item.remarks}</h6>
                            </td>
                            <td className="item-container id-item" role="button" onClick={(e) => { e.stopPropagation(); handleShowStatusModal(item); }}>
                                <h6>{item.paymentStatus}</h6>
                            </td>
                            <td className="item-container date"><h6>{item.dateRequested}</h6></td>
                            <td className="item-container date"><h6>{item.dateCompleted}</h6></td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="10" className="item-container text-center"><h6>No requests found</h6></td>
                    </tr>
                )}
            </tbody>
        </table>
        
        {selectedPatient && modalType === "status" && (
            <ModalEditStatus
                patient={selectedPatient}
                show={true}
                handleClose={handleCloseModal}
                onStatusUpdate={handleStatusUpdate} // Pass the function to ModalEditStatus
            />
        )}
        {selectedPatient && modalType === "request" && (
            <ModalEditRequest
                patient={selectedPatient}
                users={users}
                show={true} // Always show the modal
                handleClose={handleCloseModal}
                handleSubmit={handleSubmit}
                tests={selectedPatient.tests}
                testOptions={testOptions}
                category={selectedPatient.category}
                testValues={testValues}
            />
        )}
        </>
    );
}

export default TableHome;
