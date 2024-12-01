import { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function ModalEditStatus({ patient, show, handleClose, onStatusUpdate }) {
  const [paymentStatus, setPaymentStatus] = useState(patient?.paymentStatus || "");
  const [remarks, setRemarks] = useState(patient?.remarks || "");

  const handleSave = async () => {
    try {
        // console.log("Saving changes for patient:", patient);
        // console.log("Status:", requestStatus, "Payment:", paymentStatus, "Remarks:", remarks);

        const response = await fetch(`http://localhost:4000/api/requests/${patient.requestID}`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                payStatus: paymentStatus,
                remarks
            }),
        });

        if (!response.ok) {
            throw new Error("Failed to update request");
        }

        // Parse the updated request data from the response
        const updatedPatient = await response.json();
        // console.log("Updated patient data received from server:", updatedPatient);

        // Ensure onStatusUpdate is defined
        if (onStatusUpdate) {
            onStatusUpdate(updatedPatient); // Pass full updated data to onStatusUpdate
        } else {
            console.error("onStatusUpdate is not defined");
        }

        handleClose(); // Close modal after successful save
    } catch (error) {
        console.error("Failed to update request:", error);
    }
  };


  return (
    <Modal size="xs" show={show} onHide={handleClose} backdrop="static" keyboard={false} centered>
      <Modal.Header closeButton>
        <Modal.Title>Edit Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {patient && (
          <>
            <h4>{patient.name}</h4>
            <h5>Patient ID: {patient.patientID}</h5>
            <h5>Request ID: {patient.requestID}</h5>
            <Form.Label className="mt-3" htmlFor="paymentStatus">Payment Status</Form.Label>
            <Form.Select id="paymentStatus" value={paymentStatus} onChange={(e) => setPaymentStatus(e.target.value)}>
              <option>Paid</option>
              <option>Unpaid</option>
            </Form.Select>
            <Form.Group className="mt-3">
              <Form.Label htmlFor="remarks" >Medical Technologist's Remarks</Form.Label>
              <Form.Control id="remarks" as="textarea" rows={5} value={remarks} onChange={(e) => setRemarks(e.target.value)} />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={handleSave}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalEditStatus.propTypes = {
  patient: PropTypes.shape({
    name: PropTypes.string,
    patientID: PropTypes.number,
    requestID: PropTypes.number,
    paymentStatus: PropTypes.string,
    remarks: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
  onStatusUpdate: PropTypes.func.isRequired,
};

export default ModalEditStatus;
