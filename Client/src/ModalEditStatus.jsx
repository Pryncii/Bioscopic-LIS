import { useState } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";

function ModalEditStatus({ patient, show, handleClose }) {
  return (
    <Modal
      size="xs"
      show={show}
      onHide={handleClose}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Edit Status</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {patient && (
          <>
            <h4>{patient.name}</h4>
            <h5>Patient ID: {patient.patientID}</h5>
            <h5>Request ID: {patient.requestID}</h5>
            <Form.Label className="mt-3">Request Status</Form.Label>
            <Form.Select defaultValue={patient.requestStatus}>
              <option>Requested</option>
              <option>In Progress</option>
              <option>Completed</option>
            </Form.Select>
            <Form.Label className="mt-3">Payment Status</Form.Label>
            <Form.Select defaultValue={patient.paymentStatus}>
              <option>Paid</option>
              <option>Unpaid</option>
            </Form.Select>
            <Form.Group className="mt-3">
              <Form.Label>Medical Technologist's Remarks</Form.Label>
              <Form.Control as="textarea" rows={5} defaultValue={patient.remarks} />
            </Form.Group>
          </>
        )}
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={handleClose}>Save</Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalEditStatus.propTypes = {
  patient: PropTypes.shape({
    name: PropTypes.string,
    patientID: PropTypes.number,
    requestID: PropTypes.number,
    requestStatus: PropTypes.string,
    paymentStatus: PropTypes.string,
    remarks: PropTypes.string,
  }),
  show: PropTypes.bool.isRequired,
  handleClose: PropTypes.func.isRequired,
};

export default ModalEditStatus;
