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
import { CardText } from "react-bootstrap";

function ModalEditRequest(props) {
  const [show, setShow] = useState(props.show); // Initialize based on props
  const [medtechID, setMedtechID] = useState(props.users[0].medtechID);
  const numberTypeTests = [ 'ESR', 'Blood Type with RH', 'Clotting Time', 
                            'Bleeding Time', 'FBS', 'RBS', 'Creatinine',
                            'Uric Acid', 'Cholesterol', 'Triglycerides',
                            'HDL', 'LDL', 'VLDL', 'BUN', 'SGPT', 'SGOT',
                            'HbA1c' ];
                  
  const testValues = props.testValues.find(record => record.requestID === props.patient.requestID);

  const getInitialFormData = () => {
    switch (props.category) {
      case 'Hematology':
        return {
          requestName: props.patient.name,
          physName: props.users.name,
          requestID: props.patient.requestID,
          hemoglobin: testValues.hemoglobin,
          hematocrit: testValues.hematocrit,
          rbcCount: testValues.rbcCount,
          wbcCount: testValues.wbcCount,
          neutrophil: testValues.neutrophil,
          lymphocyte: testValues.lymphocyte,
          monocyte: testValues.monocyte,
          eosinophil: testValues.eosinophil,
          basophil: testValues.basophil,
          withPlateletCount: testValues.plateletCount !== -1, /////////////////
          plateletCount: testValues.plateletCount,
          esr: testValues.esr,
          bloodTypeWithRh: testValues.bloodTypeWithRh,
          clottingTime: testValues.clottingTime,
          bleedingTime: testValues.bleedingTime,
          category: props.category,
        };
      case 'Clinical Microscopy':
        return {
          requestName: props.patient.name,
          physName: props.users.name,
          requestID: props.patient.requestID,
          // Common fields
          color: testValues.color,
          bacteria: testValues.bacteria,
          rbc: testValues.rbc,
          pus: testValues.pus,

          // Urinalysis-specific fields
          transparency: testValues.transparency,
          pH: testValues.pH,
          specificGravity: testValues.specificGravity,
          sugar: testValues.sugar,
          protein: testValues.protein,
          epithelialCells: testValues.epithelialCells,
          mucusThread: testValues.mucusThread,

          // Fecalysis-specific fields
          consistency: testValues.consistency,
          wbc: testValues.wbc,
          ovaParasite: testValues.ovaParasite,
          fatGlobule: testValues.fatGlobule,
          bileCrystal: testValues.bileCrystal,
          vegetableFiber: testValues.vegetableFiber,
          meatFiber: testValues.meatFiber,
          erythrocyte: testValues.erythrocyte,
          yeastCell: testValues.yeastCell,
          category: props.category,
        };
      case 'Chemistry':
        return {
          requestName: props.patient.name,
          physName: props.users.name,
          requestID: props.patient.requestID,
          fbs: testValues.fbs,
          rbs: testValues.rbs,
          creatinine: testValues.creatinine,
          uricAcid: testValues.uricAcid,
          cholesterol: testValues.cholesterol,
          triglycerides: testValues.triglycerides,
          hdl: testValues.hdl,
          ldl: testValues.ldl,
          vldl: testValues.vldl,
          bun: testValues.bun,
          sgpt: testValues.sgpt,
          sgot: testValues.sgot,
          hbA1c: testValues.hbA1c,
          category: props.category,
        };
      case 'Serology':
        return {
          requestName: props.patient.name,
          physName: props.users.name,
          requestID: props.patient.requestID,
          hbsAg: testValues.hbsAg,
          rPROrVdrl: testValues.rPROrVdrl,
          pregnancyTestSerum: testValues.pregnancyTestSerum,
          pregnancyTestUrine: testValues.pregnancyTestUrine,
          dengueNs1: testValues.dengueNs1,
          dengueDuo: testValues.dengueDuo,
          category: props.category,
        };
    }
  };

  const [formData, setFormData] = useState(getInitialFormData(props.category));
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
        ...formData,
        [name]: value
    });
    console.log(formData);
  };

  const handleClose = () => {
    setShow(false);
    props.handleClose(); // Call the passed in handleClose function from parent
  };

  const handleSubmit = () => {
    props.handleSubmit(formData, medtechID); // Call the passed in handleClose function from parent
  };

  const tests = [];
  const splitTests = props.tests.split(", ");
  for (let i = 0; i < splitTests.length; i++) {
    if (splitTests[i] === 'CBC' || splitTests[i] === 'CBC with Platelet Count') {
      tests.push(
        { id: 'hemoglobin', name: 'Hemoglobin', isText: true, isNumber: true },
        { id: 'hematocrit', name: 'Hematocrit', isText: true, isNumber: true },
        { id: 'rbcCount', name: 'RBC Count', isText: true, isNumber: true },
        { id: 'wbcCount', name: 'WBC Count', isText: true, isNumber: true },
        { id: 'neutrophil', name: 'Neutrophil', isText: true, isNumber: true },
        { id: 'lymphocyte', name: 'Lymphocyte', isText: true, isNumber: true },
        { id: 'monocyte', name: 'Monocyte', isText: true, isNumber: true },
        { id: 'eosinophil', name: 'Eosinophil', isText: true, isNumber: true },
        { id: 'basophil', name: 'Basophil', isText: true, isNumber: true },
      );
      if (splitTests[i] === 'CBC with Platelet Count') {
        tests.push({ id: 'plateletCount', name: 'Platelet Count', isText: true, isNumber: true });
      }
    } else if (splitTests[i] === 'Urinalysis' || splitTests[i] === 'Fecalysis') {
      tests.push(
        { id: 'color', name: 'Color', isText: true, isNumber: false },
        { id: 'bacteria', name: 'Bacteria', isText: true, isNumber: false },
        { id: 'rbc', name: 'RBC', isText: true, isNumber: true },
        { id: 'pus', name: 'Pus', isText: true, isNumber: true },
      );
      if (splitTests[i] === 'Urinalysis') {
        tests.push(
          { id: 'transparency', name: 'Transparency', isText: true, isNumber: false },
          { id: 'pH', name: 'pH', isText: true, isNumber: true },
          { id: 'specificGravity', name: 'Specific Gavity', isText: true, isNumber: true },
          { id: 'sugar', name: 'Sugar', isText: true, isNumber: false },
          { id: 'protein', name: 'Protein', isText: true, isNumber: false },
          { id: 'epithelialCells', name: 'Epithelial Cells', isText: true, isNumber: false },
          { id: 'mucusThread', name: 'Mucus Thread', isText: true, isNumber: false },
        );
      } else {
        tests.push(
          { id: 'consistency', name: 'Consistency', isText: true, isNumber: false },
          { id: 'wbc', name: 'WBC', isText: true, isNumber: true },
          { id: 'ovaParasite', name: 'Ova Parasite', isText: true, isNumber: false },
          { id: 'fatGlobule', name: 'Fat Globule', isText: true, isNumber: false },
          { id: 'bileCrystal', name: 'Bile Crystal', isText: true, isNumber: false },
          { id: 'vegetableFiber', name: 'Vegetable Fiber', isText: true, isNumber: false },
          { id: 'meatFiber', name: 'Meat Fiber', isText: true, isNumber: false },
          { id: 'erythrocyte', name: 'Erythrocyte', isText: true, isNumber: true },
          { id: 'yeastCell', name: 'Yeast Cell', isText: true, isNumber: true },
        );
      }
    } else {
      let id = '';
      if (splitTests[i] === splitTests[i].toUpperCase()) {
        id = splitTests[i].toLowerCase()
      } else {
        let tempIDs = splitTests[i].split(' ');
        tempIDs[0] = tempIDs[0].charAt(0).toLowerCase() + tempIDs[0].slice(1);
        for (let i = 1; i < tempIDs.length; i++) {
          tempIDs[i] = tempIDs[i].toLowerCase();
          tempIDs[i] = tempIDs[i].charAt(0).toUpperCase() + tempIDs[i].slice(1);
        }
        id = tempIDs.join('');
      }
      const matchingTest = props.testOptions.find(test => test.name === splitTests[i]);
      if (matchingTest) {
        tests.push({ id: id, name: splitTests[i], isText: false, options: matchingTest.options });
      } else {
        const isNumber = numberTypeTests.includes(splitTests[i]);
        tests.push({ id: id,name: splitTests[i], isText: true, isNumber: isNumber});
      }
    }
  }
    
  const listTests = tests.map((test) => (
    <div key={test.id}>
      <Row>
        <Col>
          {test.isText ? (
            <FloatingLabel label={test.name}>
              <Form.Control 
                type={test.isNumber ? "number" : "text"} 
                name={test.id} 
                value={formData[test.id] == -1 ? '' : formData[test.id]}
                placeholder=""
                onChange={handleChange} />
            </FloatingLabel>
          ) : (
            <FloatingLabel label={test.name}>
              <Form.Select 
                name={test.id} 
                onChange={handleChange}>
                {test.options.map((option, index) => (
                  <option key={index} value={option}>
                    {option}
                  </option>
                ))}
              </Form.Select>
            </FloatingLabel>
          )}
        </Col>
        {/*
        <Col>
          <Form.Control type="text" placeholder="" className="h-100" readOnly />
        </Col>
*/}
      </Row>
      <br />
    </div>
  ));

  const midpoint = Math.ceil(listTests.length / 2);
  const test_col1 = listTests.slice(0, midpoint);
  const test_col2 = listTests.slice(midpoint);

  const listUsers = props.users.map((user, index) => (
    <option key={index} value={user.name}>
      {user.name}
    </option>
  ));

  const inputRef = useRef(null);

  function handleUserChange(event) {
    const user = props.users.find((user) => user.name === event.target.value);
    setMedtechID(user.medtechID);
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
              <Form.Control 
                type="number" 
                defaultValue={props.users[0].prcno} 
                ref={inputRef} 
                readOnly />
            </FloatingLabel>
          </div>
          <Modal.Footer className="justify-content-center">
            <Button variant="primary" type="submit" onClick={() => { handleSubmit(); handleClose(); }}>Submit</Button>
            <ModalShowPDF formData={formData} email={props.patient.email} onClose={handleClose} />
          </Modal.Footer>
      </Modal.Body>
    </Modal>
  );
}

ModalEditRequest.propTypes = {
  patient: PropTypes.shape({
      name: PropTypes.string,
      patientID: PropTypes.number,
      requestID: PropTypes.number,
    }).isRequired,
  users: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      prcno: PropTypes.string,
    })).isRequired,
  tests: PropTypes.string.isRequired,
  testOptions: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string,
      options: PropTypes.arrayOf(PropTypes.string),
  })).isRequired,
  category: PropTypes.string.isRequired,
  show: PropTypes.bool.isRequired, // Add this prop type for show
  handleClose: PropTypes.func.isRequired, // Add this prop type for handleClose
  handleSubmit: PropTypes.func.isRequired,
};

export default ModalEditRequest;
