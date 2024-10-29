import './Table.css';
import React, { useState } from "react";
import ModalConfirmRequest from "./modalConfirmRequest";

function TableHome({ data }) {
    
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedRow, setSelectedRow] = useState(null);

    const handleRowClick = (rowData) => {
        if (rowData.name && rowData.medtech && rowData.tests) {  // Check if required fields exist
            setSelectedRow({
                name: rowData.name,
                medtech: rowData.medtech,
                tests: rowData.tests
            });
            setIsModalOpen(true);
        } else {
            console.log("Incomplete row data:", rowData);  // Log if data is incomplete
        }
        console.log(isModalOpen, selectedRow)//testing remove later
    };
    
      const closeModal = () => {
        setIsModalOpen(false);
        setSelectedRow(null); // Clear selected patient when closing
    };

    return (
        <>
        <table className="test-items">
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
                {Array.isArray(data) && data.length > 0 ? (
                    data.filter(item => Object.keys(item).length > 0).map((item, index) => (
                        <tr key={index} onClick={() => handleRowClick(item)}>
                            <td className="item-container number"><h6>{index + 1}</h6></td>
                            <td className="item-container"><h6>{item.requestId}</h6></td>
                            <td className="item-container"><h6>{item.patientId}</h6></td>
                            <td className="item-container"><h6>{item.name}</h6></td>
                            <td className="item-container"><h6>{item.tests}</h6></td>
                            <td className="item-container status" role="button">
                                <a data-bs-toggle="modal" data-bs-target="#statusModal">
                                    <h6 className={`status-item ${item.barColor}`}>{item.requestStatus}</h6>
                                </a>
                            </td>
                            <td className="item-container" role="button" data-bs-toggle="modal" data-bs-target="#statusModal">
                                <h6>{item.remarks}</h6>
                            </td>
                            <td className="item-container id-item" role="button" data-bs-toggle="modal" data-bs-target="#statusModal">
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

        {isModalOpen && (
            <ModalConfirmRequest
              show={isModalOpen}
              onClose={closeModal}
              rowData={selectedRow}  // Pass selected patient as array
            />
        )}

        </>
    );
}

export default TableHome;

{
    /*<td className={`item-container status ${item.barColor}`}>
                                <h6>{item.requestStatus}</h6>
                            </td>
                            <td className="item-container"><h6>{item.remarks}</h6></td>
                            <td className="item-container id-item"><h6>{item.paymentStatus}</h6></td>
    
   <tr key={index} onClick={() => handleRowClick(item)}>
                            <td className="item-container number"><h6>{index + 1}</h6></td>
                            <td className="item-container"><h6>{item.requestId}</h6></td>
                            <td className="item-container"><h6>{item.patientId}</h6></td>
                            <td className="item-container"><h6>{item.name}</h6></td>
                            <td className="item-container"><h6>{item.tests}</h6></td>
                            <td className="item-container status" role="button">
                                <a data-bs-toggle="modal" data-bs-target="#statusModal">
                                    <h6 className={`status-item ${item.barColor}`}>{item.requestStatus}</h6>
                                </a>
                            </td>
                            <td className="item-container" role="button" data-bs-toggle="modal" data-bs-target="#statusModal">
                                <h6>{item.remarks}</h6>
                            </td>
                            <td className="item-container id-item" role="button" data-bs-toggle="modal" data-bs-target="#statusModal">
                                <h6>{item.paymentStatus}</h6>
                            </td>
                            <td className="item-container date"><h6>{item.dateRequested}</h6></td>
                            <td className="item-container date"><h6>{item.dateCompleted}</h6></td>
                        </tr> */}
