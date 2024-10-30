import ModalShowPDF from "./modalShowPDF.jsx"

import { useState, useRef } from "react"
import PropTypes from "prop-types"
import Button from "react-bootstrap/Button"
import Col from "react-bootstrap/Col"
import Container from "react-bootstrap/Container"
import Form from "react-bootstrap/Form"
import FloatingLabel from "react-bootstrap/FloatingLabel"
import Modal from "react-bootstrap/Modal"
import Row from "react-bootstrap/Row"

function ModalEditRequest(props) {
  const [show, setShow] = useState(false);

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  const list_tests = props.tests.map((test) => (
    <div key={test.id}>
      <Row>
        <Col>
          {test.isText ? (
            <FloatingLabel label={test.name}>
              <Form.Control type="text" placeholder="" />
            </FloatingLabel>
          ) : (
            <FloatingLabel label={test.name}>
              <Form.Select>
                {test.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          )}
        </Col>
        <Col>
          <Form.Control type="text" placeholder="" className="h-100" readOnly />
        </Col>
      </Row>
      <br />
    </div>
  ));
  const midpoint = Math.ceil(list_tests.length / 2);
  const test_col1 = list_tests.slice(0, midpoint);
  const test_col2 = list_tests.slice(midpoint);

  const list_med_techs = props.med_techs.map((med_tech, index) => (
    <option key={index} value={med_tech.name}>
      {med_tech.name}
    </option>
      
  ));

  const inputRef = useRef(null);
  
  function handleMedTechChange(event){
    const med_tech = props.med_techs.find(medtech => medtech.name === event.target.value);
    inputRef.current.value = med_tech.prcno;
  }

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Modal Edit Request
      </Button>

      <Modal
        size="lg"
        show={show}
        onHide={handleClose}
        backdrop="static"
        keyboard={false}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>{props.category}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <h4>{props.patients[0].name}</h4>
          <h5>Patient ID: {props.patients[0].patient_id}</h5>
          <h5>Request ID: {props.patients[0].request_id}</h5>
          <div>
            <Container className="px-0 my-3">
              <Row>
                <Col>{test_col1}</Col>
                <Col>{test_col2}</Col>
              </Row>
            </Container>
            <FloatingLabel label="Med Tech">
              <Form.Select onChange={handleMedTechChange}>
                {list_med_techs}
              </Form.Select>
            </FloatingLabel>
            <FloatingLabel label="PRC No" className="my-3">
              <Form.Control type="number" value={props.med_techs[0].prcno} ref={inputRef} readOnly />
            </FloatingLabel>
          </div>
        </Modal.Body>
        <Modal.Footer className="justify-content-center">
          <Button variant="primary">Submit</Button>
          <ModalShowPDF/>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalEditRequest.propTypes = {
  patients: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      patient_id: PropTypes.number,
      request_id: PropTypes.number,
    })
  ),
  category: PropTypes.string,
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

export default ModalEditRequest
