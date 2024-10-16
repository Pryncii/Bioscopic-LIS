import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.css';
import App from './App.jsx';
import ViewPatientHistory from './ViewPatientHistory.jsx'; // for testing
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <ViewPatientHistory />
);