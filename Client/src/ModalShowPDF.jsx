import ModalSendEmail from "./ModalSendEmail.jsx"

import { useState } from "react"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

function ModalShowPDF() {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Save to PDF
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
          <Modal.Title>PDF</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          PDF HERE
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary">Download PDF</Button>
          <ModalSendEmail />
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalShowPDF