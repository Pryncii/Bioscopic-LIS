import { useState } from "react";
import ModalEditStatus from "./ModalEditStatus";
import ModalEditRequest from "./ModalEditRequest"; // Import the edit request modal
import './styles/Table.css';

// Sample tests and med techs data
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

function TableHome({ data }) {
    const [selectedPatient, setSelectedPatient] = useState(null);
    const [modalType, setModalType] = useState(null); // New state to manage the modal type

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
                patients={[selectedPatient]}
                show={true} // Always show the modal
                handleClose={handleCloseModal}
                tests={tests}
                med_techs={med_techs}
                category="Hematology"
            />
        )}
        </>
    );
}

export default TableHome;
