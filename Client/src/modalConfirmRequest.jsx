import React from "react";
import PropTypes, { string } from "prop-types";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalConfirmRequest({ show, onClose, rowData }) {
  console.log(rowData); //testing remove later
  if (!rowData) return null;
  
  return (
    <>
      <Modal
        size="xs"
        show={show}
        onHide={onClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirming Patient Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Patient Name: {rowData.name}<br/>
          Handled By: {rowData.medtech}<br/>
          Test/s: {Array.isArray(rowData.tests) ? rowData.tests.join(', ') : rowData.tests }<br/>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary">Confirm with Payment</Button>
          <Button variant="primary">Confirm without Payment</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalConfirmRequest.propTypes = {
  show: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  rowData: PropTypes.shape({
    name: PropTypes.string.isRequired,
    medtech: PropTypes.string.isRequired,
    tests: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};

export default ModalConfirmRequest

//{Array.isArray(rowData.tests) ? rowData.tests.join(', ') : rowData.tests}
