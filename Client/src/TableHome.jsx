import { useState, useEffect } from "react";
import ModalEditStatus from "./ModalEditStatus";
import ModalEditRequest from "./ModalEditRequest"; // Import the edit request modal
import './styles/Table.css';

function TableHome({ data, onUpdate }) {
    const [tableData, setTableData] = useState(data);
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [modalType, setModalType] = useState(null);

    const formatDateTime = (date) => 
        date ? new Date(date).toLocaleString('en-US', {
          month: '2-digit', day: '2-digit', year: 'numeric',
          hour: '2-digit', minute: '2-digit', hour12: true
        }) : "";

    // Set `tableData` whenever `data` changes
    useEffect(() => {
        setTableData(data);
    }, [data]);

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

    // Function to handle updating a row after editing
    const handleStatusUpdate = (updatedPatient) => {
        setTableData(prevData =>
            prevData.map(row =>
                row.requestID === updatedPatient.requestID
                    ? {
                        ...row,
                        requestStatus: updatedPatient.status,
                        remarks: updatedPatient.remarks,
                        paymentStatus: updatedPatient.payStatus,
                        barColor: updatedPatient.status === "Completed" ? "c"
                                  : updatedPatient.status === "In Progress" ? "ip" : "req",
                        dateCompleted: formatDateTime(updatedPatient.dateEnd) || ""
                    }
                    : row
            )
        );
        // Call onUpdate to update the data at Home
        if (onUpdate) {
            onUpdate();
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
                show={true} // Always show the modal
                handleClose={handleCloseModal}
                tests={selectedPatient.tests}
                category={selectedPatient.category}
            />
        )}
        </>
    );
}

export default TableHome;
