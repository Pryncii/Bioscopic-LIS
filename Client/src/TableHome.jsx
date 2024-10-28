import { useEffect, useState } from "react";
import ModalEditStatus from "./ModalEditStatus";
import ModalEditRequest from "./ModalEditRequest"; // Import the edit request modal
import './styles/Table.css';

function TableHome({ data }) {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [modalType, setModalType] = useState(null); // New state to manage the modal type
    const [users, setUsers] = useState([]); // State to hold users from MongoDB

    // Fetch user data from MongoDB
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await fetch('http://localhost:4000/users'); // Adjust the URL as necessary
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);
    const handleShowStatusModal = (patient) => {
        setSelectedPatient(patient);
        setModalType("status"); // Set modal type to status
    };

    const handleShowRequestModal = (patient) => {
        setSelectedPatient(patient);
        setModalType("request"); // Set modal type to request
    };

    const handleCloseModal = () => {
        setModalType(null); // Reset modal type to close any modal
        setSelectedPatient(null);
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
                {data.length > 0 ? (
                    data.map((item, index) => (
                    <tr key={index} onClick={() => handleShowRequestModal(item)}>
                        <td className="item-container number"><h6>{index + 1}</h6></td>
                        <td className="item-container"><h6>{item.requestID}</h6></td>
                        <td className="item-container"><h6>{item.patientID}</h6></td>
                        <td className="item-container"><h6>{item.name}</h6></td>
                        <td className="item-container"><h6>{item.tests}</h6></td>
                        <td className="item-container status" role="button" onClick={(e) => { e.stopPropagation(); handleShowStatusModal(item); }}>
                            <h6 className={`status-item ${item.barColor}`}>{item.requestStatus}</h6>
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
                        <td colSpan="10" className="item-container"><h6>No requests found</h6></td>
                    </tr>
                )}
            </tbody>
        </table>
        
        {selectedPatient && modalType === "status" && (
            <ModalEditStatus
                patient={selectedPatient}
                show={true}
                handleClose={handleCloseModal}
            />
        )}
        {selectedPatient && modalType === "request" && (
            <ModalEditRequest
                patient={[selectedPatient]}
                show={true} // Always show the modal
                handleClose={handleCloseModal}
                tests={selectedPatient.tests}
                medTechs={users}
                category={selectedPatient.category}
            />
        )}
        </>
    );
}

export default TableHome;
