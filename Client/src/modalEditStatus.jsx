import { useState } from "react"
import PropTypes from "prop-types"
import Button from "react-bootstrap/Button"
import Form from "react-bootstrap/Form"
import Modal from "react-bootstrap/Modal"

function ModalEditStatus(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Modal Edit Status
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
          <Modal.Title>Edit Status</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h4>{props.patients[0].name}</h4>
          <h5>Patient ID: {props.patients[0].patient_id}</h5>
          <h5>Request ID: {props.patients[0].request_id}</h5>
          <Form.Label className="mt-3">Request Status</Form.Label>
          <Form.Select>
            <option>Requested</option>
            <option>In Progress</option>
            <option>Completed</option>
          </Form.Select>
          <Form.Label className="mt-3">Payment Status</Form.Label>
          <Form.Select>
            <option>Paid</option>
            <option>Unpaid</option>
          </Form.Select>
          <Form.Group className="mt-3">
            <Form.Label>Medical Technologist&apos;s Remarks</Form.Label>
            <Form.Control as="textarea" rows={5} />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary">Save</Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalEditStatus.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      patient_id: PropTypes.number,
      request_id: PropTypes.number,
    })
  ),
};

export default ModalEditStatus
