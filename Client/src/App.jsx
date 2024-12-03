import Home from "./Home.jsx";
import PatientRequest from "./PatientRequest.jsx";
import ViewPatients from "./ViewPatients.jsx";
import ViewPatientHistory from "./ViewPatientHistory.jsx";
import PatientRegistration from "./PatientRegistration.jsx";
import Register from "./Register.jsx";
import Login from "./Login.jsx";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  Navigate,
} from "react-router-dom";
//import ProtectedRoute from "./ProtectedRoute.jsx";
//import RedirectedRoute from "./RedirectedRoute.jsx";

function App() {
  return (
    <>
      <Router>
        <div>
          <Routes>
            <Route>
              <Route path="/" element={<Navigate to="/login" />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
            </Route>
            <Route>
              <Route path="/home" element={<Home />} />
              <Route path="/addpatient" element={<PatientRegistration />} />
              <Route path="/request" element={<PatientRequest />} />
              <Route path="/patienthistory" element={<ViewPatientHistory />} />
              <Route path="/patients" element={<ViewPatients />} />
            </Route>
            <Route path="*" element={<Navigate to="/" />} />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;
