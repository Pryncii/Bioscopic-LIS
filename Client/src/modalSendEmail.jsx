import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

function ModalSendEmail() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Email PDF
      </Button>

      <Modal
        size="xs"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Email PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <InputGroup className="mb-3">
            <Form.Control placeholder="example@email.com" readOnly/>
            <Button variant="outline-secondary">Send to Registered</Button>
          </InputGroup>
          <InputGroup className="mb-3">
            <Form.Control placeholder="" />
            <Button variant="outline-secondary">Send to Other</Button>
          </InputGroup>
        </Modal.Body>
        <Modal.Footer className="justify-content-center"></Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalSendEmail
