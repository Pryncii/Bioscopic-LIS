import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalConfirmRequest({ show, onHide, patient, tests , onSubmit }) {
  return (
    <Modal
      size="xs"
      show={show}
      onHide={onHide}
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>Confirming Patient Request</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        Patient Name: {patient.name}<br />
        Handled By: Placeholder<br /> {/* add medtech when sessions are available */}
        Test/s: {Object.keys(tests).join(", ")}<br />
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary" onClick={() => { onSubmit("Paid"); onHide(); }}>Confirm with Payment</Button>
        <Button variant="primary" onClick={() => { onSubmit("Unpaid"); onHide(); }}>Confirm without Payment</Button>
      </Modal.Footer>
    </Modal>
  );
}

export default ModalConfirmRequest;