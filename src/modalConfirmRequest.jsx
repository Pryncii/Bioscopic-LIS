import { useState } from "react"
import PropTypes from "prop-types"
import Button from "react-bootstrap/Button"
import Modal from "react-bootstrap/Modal"

function ModalConfirmRequest(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Submit Request
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
          <Modal.Title>Confirming Patient Request</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Patient Name: {props.patients[1].name}<br/>
          Handled By: {props.med_techs[1].name}<br/>
          Test/s: {props.tests[1].name}<br/>
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
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      patient_id: PropTypes.number,
      request_id: PropTypes.number,
    })
  ),
  med_techs: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      prcno: PropTypes.number,
    })
  ),
  tests: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string,
      isText: PropTypes.bool,
      options: PropTypes.arrayOf(PropTypes.string),
    })
  ),
};

export default ModalConfirmRequest
