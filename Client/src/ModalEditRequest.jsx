import ModalShowPDF from "./ModalShowPDF.jsx";

import { useEffect, useState, useRef } from "react";
import PropTypes from "prop-types";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Form from "react-bootstrap/Form";
import FloatingLabel from "react-bootstrap/FloatingLabel";
import Modal from "react-bootstrap/Modal";
import Row from "react-bootstrap/Row";

function ModalEditRequest(props) {
  const [show, setShow] = useState(props.show); // Initialize based on props
  const [testOptions, setTestOptions] = useState([]); // State to hold users from MongoDB
  const [users, setUsers] = useState([{ prcno: "" }]); // State to hold users from MongoDB
  const numberTypeTests = [ 'ESR', 'Blood with RH', 'Clotting Time', 
                            'Bleeding Time', 'FBS', 'RBS', 'Creatinine',
                            'Uric Acid', 'Cholesterol', 'Triglycerides',
                            'HDL', 'LDL', 'VLDL', 'BUN', 'SGPT', 'SGOT',
                            'HbA1c' ]
  useEffect(() => {
    const fetchTestOptions = async () => {
        try {
            const response = await fetch('http://localhost:4000/testoptions');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setTestOptions(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchTestOptions();
  }, []);
  
  // Fetch user data from MongoDB
  useEffect(() => {
    const fetchUsers = async () => {
        try {
            const response = await fetch('http://localhost:4000/users'); // Adjust the URL as necessary
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            setUsers(data);
        } catch (error) {
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchUsers();
  }, []);

  const handleClose = () => {
    setShow(false);
    props.handleClose(); // Call the passed in handleClose function from parent
  };

  const tests = [];
  const splitTests = props.tests.split(", ");
  for (let i = 0; i < splitTests.length; i++) {
    if (splitTests[i] === 'CBC' || splitTests[i] === 'CBC with Platelet Count') {
      tests.push(
        { name: 'Hemoglobin', isText: true, isNumber: true },
        { name: 'Hematocrit', isText: true, isNumber: true },
        { name: 'RBC Count', isText: true, isNumber: true },
        { name: 'WBC Count', isText: true, isNumber: true },
        { name: 'Neutrophil', isText: true, isNumber: true },
        { name: 'Lymphocyte', isText: true, isNumber: true },
        { name: 'Monocyte', isText: true, isNumber: true },
        { name: 'Eosinophil', isText: true, isNumber: true },
        { name: 'Basophil', isText: true, isNumber: true },
      );
      if (splitTests[i] === 'CBC with Platelet Count') {
        tests.push({ name: 'Platelet Count', isText: true, isNumber: true });
      }
    } else if (splitTests[i] === 'Urinalysis' || splitTests[i] === 'Fecalysis') {
      tests.push(
        { name: 'Color', isText: true, isNumber: false },
        { name: 'Bacteria', isText: true, isNumber: false },
        { name: 'RBC', isText: true, isNumber: true },
        { name: 'Pus', isText: true, isNumber: true },
      );
      if (splitTests[i] === 'Urinalysis') {
        tests.push(
          { name: 'Transparency', isText: true, isNumber: false },
          { name: 'pH', isText: true, isNumber: true },
          { name: 'Specific Gavity', isText: true, isNumber: true },
          { name: 'Sugar', isText: true, isNumber: false },
          { name: 'Protein', isText: true, isNumber: false },
          { name: 'Epithelial Cells', isText: true, isNumber: false },
          { name: 'Mucus Thread', isText: true, isNumber: false },
        );
      } else {
        tests.push(
          { name: 'Consistency', isText: true, isNumber: false },
          { name: 'WBC', isText: true, isNumber: true },
          { name: 'Ova Parasite', isText: true, isNumber: false },
          { name: 'Fat Globule', isText: true, isNumber: false },
          { name: 'Bile Crystal', isText: true, isNumber: false },
          { name: 'Vegetable Fiber', isText: true, isNumber: false },
          { name: 'Meat Fiber', isText: true, isNumber: false },
          { name: 'Erythrocyte', isText: true, isNumber: true },
          { name: 'Yeast Cell', isText: true, isNumber: true },
        );
      }
    }
    const matchingTest = testOptions.find(test => test.name === splitTests[i]);
    if (matchingTest) {
      tests.push({ name: splitTests[i], isText: false, options: matchingTest.options });
    } else {
      const isNumber = numberTypeTests.includes(splitTests[i]);
      tests.push({ name: splitTests[i], isText: true, isNumber: isNumber});
    }
  }

  const listTests = tests.map((test) => (
    <div key={test.id}>
      <Row>
        <Col>
          {test.isText ? (
            <FloatingLabel label={test.name}>
              <Form.Control type={test.isNumber ? "number" : "text"} placeholder="" />
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

  const midpoint = Math.ceil(listTests.length / 2);
  const test_col1 = listTests.slice(0, midpoint);
  const test_col2 = listTests.slice(midpoint);

  const listUsers = users.map((user, index) => (
    <option key={index} value={user.name}>
      {user.name}
    </option>
  ));

  const inputRef = useRef(null);

  function handleUserChange(event) {
    const user = users.find((user) => user.name === event.target.value);
    inputRef.current.value = user.prcno;
  }

  return (
    <Modal
      size="lg"
      show={show}
      onHide={handleClose} // Use handleClose to handle closing
      backdrop="static"
      keyboard={false}
      centered
    >
      <Modal.Header closeButton>
        <Modal.Title>{props.category}</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <h4>{props.patient.name}</h4>
        <h5>Patient ID: {props.patient.patientID}</h5>
        <h5>Request ID: {props.patient.requestID}</h5>
        <div>
          <Container className="px-0 my-3">
            <Row>
              <Col>{test_col1}</Col>
              <Col>{test_col2}</Col>
            </Row>
          </Container>
          <FloatingLabel label="Med Tech">
            <Form.Select onChange={handleUserChange}>
              {listUsers}
            </Form.Select>
          </FloatingLabel>
          <FloatingLabel label="PRC No" className="my-3">
            <Form.Control type="number" defaultValue={users[0].prcno} ref={inputRef} readOnly />
          </FloatingLabel>
        </div>
      </Modal.Body>
      <Modal.Footer className="justify-content-center">
        <Button variant="primary">Submit</Button>
        <ModalShowPDF />
      </Modal.Footer>
    </Modal>
  );
}

ModalEditRequest.propTypes = {
  patient: PropTypes.shape({
      name: PropTypes.string,
      patientID: PropTypes.number,
      requestID: PropTypes.number,
    }).isRequired,
  category: PropTypes.string.isRequired,
  tests: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired, // Add this prop type for show
  handleClose: PropTypes.func.isRequired, // Add this prop type for handleClose
};

export default ModalEditRequest;
