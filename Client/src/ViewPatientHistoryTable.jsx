import { useState, useEffect } from "react";
import './styles/Table.css';
import ModalShowPDFPatient from "./ModalShowPDFPatient.jsx";

function ViewPatientHistoryTable({ data, tests, patientName, patientEmail }) {
    const [tableData, setTableData] = useState(data);
    const [formData, setFormData] = useState(null);
    const [showModal, setShowModal] = useState(false); // Track modal visibility

    console.log(tableData);

    const handleShowPDF = (request) => {
        const test = tests.find(test => test.requestID === request.requestID);  

        const updatedTest = {
            ...test,
            requestName: patientName,
            category: request.category,
        };
        
        setFormData(updatedTest);
        setShowModal(true); // Show the modal when formData is set
    };

    const handleCloseModal = () => {
        setShowModal(false);  // Hide the modal when closed
        setFormData(null);  // Clear the formData when modal is closed
    };

    useEffect(() => {
        setTableData(data);
    }, [data]);

    return (
        <>
            <table className="test-items" style={{ width: '100%', tableLayout: 'fixed', fontSize: '20px', wordWrap: 'break-word'}}>
                <thead>
                    <tr>
                        <th className="item-label number">
                            <h6>#</h6>
                        </th>
                        <th className="item-label">
                            <h6>Test/s</h6>
                        </th>
                        <th className="item-label date">
                            <h6>Date Requested</h6>
                        </th>
                        <th className="item-label date">
                            <h6>Date Completed</h6>
                        </th>
                        <th className="item-label">
                            <h6>Remarks</h6>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {tableData.length > 0 ? (
                        tableData.map((item, index) => (
                            <tr key={index} onClick={() => handleShowPDF(item)} style={{ cursor: 'pointer' }}>
                                <td className="item-container number"><h6>{index + 1}</h6></td>
                                    <td className="item-container"><h6>{item.tests}</h6></td>
                                    <td className="item-container date"><h6>{item.dateRequested}</h6></td>
                                    <td className="item-container date"><h6>{item.dateCompleted}</h6></td>
                                    <td className="item-container"><h6>{item.remarks}</h6></td>
                                </tr>
                            ))
                        ) : (
                        <tr>
                            <td colSpan="5" className="item-container"><h6>No requests found</h6></td>
                        </tr>
                    )}
                </tbody>
            </table>

            {formData && showModal && (
                <ModalShowPDFPatient 
                    formData={formData}
                    email={patientEmail}
                    show={showModal}
                    handleClose={handleCloseModal}  // Pass close function to Modal
                />
            )}
        </>
    );
}

export default ViewPatientHistoryTable;
