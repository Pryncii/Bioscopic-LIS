import Header from "./Header.jsx"
import "./styles/App.css"
import ModalConfirmRequest from "./modalConfirmRequest.jsx"
import ModalEditRequest from "./modalEditRequest.jsx"
import ModalEditStatus from "./modalEditStatus.jsx"

function App() {
  const tests = [
    { id: 1, name: "Test 1", isText: true },
    { id: 2, name: "Test 2", isText: false, options: ["opt1", "opt2", "opt3"] },
    { id: 3, name: "Test 3", isText: true },
    { id: 4, name: "Test 4", isText: true },
    { id: 5, name: "Test 5", isText: false, options: ["opt1", "opt2"] }
  ];
  const med_techs = [
    { name: "Arjay", prcno: 12345678 },
    { name: "Percival", prcno: 87654321 },
    { name: "Ian", prcno: 78456312 },
  ];
  const patients = [
    { name: "Matthew", patient_id: 1004, request_id: 2003 },
    { name: "Kyle", patient_id: 1005, request_id: 2004 },
    { name: "Jr", patient_id: 1006, request_id: 2005 },
  ];

  return (
    <>
      <Header />
      <ModalEditRequest
        patients={patients}
        category="Hematology"
        tests={tests}
        med_techs={med_techs}
      />
      <ModalEditStatus patients={patients} />
      <ModalConfirmRequest patients={patients} med_techs={med_techs} tests={tests}/>
    </>
  );
}

export default App
