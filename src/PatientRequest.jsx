import Header from './Header.jsx'
import PatientRequestButtons from './PatientRequestButtons.jsx'
import PatientRequestSearch from './PatientRequestSearch.jsx'
import PatientRequestTests from './PatientRequestTests.jsx'
import PatientInformation from './PatientInformation.jsx'
import DateTime from './DateTime.jsx'

function PatientRequest() {
    const sampleData =
    {
      patientName: 'Pika Chu',
      patientSex: 'M',
      patientPhoneNo: '09876543210',
      patientEmail: 'pikapika@chu.com',
      patientAge: '3',
      patientBday: 'April 1, 2021',
      patientAddress: 'Palette Town',
    };

  return (
    <>
      <Header/>
      <div className='title-body'>
        <h1 className='_title'>Add Patient Request</h1>
        <DateTime />
        <br></br>
        <PatientRequestSearch />
        <hr/>
        <PatientInformation data = {sampleData} />
        <hr/>
        
      </div>
      <div className='table-body'>
        <PatientRequestTests />
        <hr/>
        <PatientRequestButtons />
      </div>
    </>
      
  )
}

export default PatientRequest