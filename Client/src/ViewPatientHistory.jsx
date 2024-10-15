import Header from './Header.jsx'
import PatientInformation from './PatientInformation.jsx'
import DateTime from './DateTime.jsx'
import TableButtons from './TableButtons.jsx'
import ViewPatientHistoryTable from './ViewPatientHistoryTable.jsx'

function ViewPatientHistory() {
    const patientData =
    {
      patientName: 'Pika Chu',
      patientSex: 'M',
      patientPhoneNo: '09876543210',
      patientEmail: 'pikapika@chu.com',
      patientAge: '3',
      patientBday: 'April 1, 2021',
      patientAddress: 'Palette Town',
    };

    const requestData = [
      {
        tests: 'CBC, Serum pregnancy test',
        remarks: 'Nurse Joy needed',
        dateRequested: '2024-09-25',
        dateCompleted: ''
      },
      {
        tests: 'CBC, Urinalysis',
        remarks: 'Urgent',
        dateRequested: '2024-09-25',
        dateCompleted: ''
      },
      {
        tests: 'FBS, Cholesterol',
        remarks: 'Normal',
        dateRequested: '2024-09-24',
        dateCompleted: '2024-09-26'
      },
      {},{}
    ];

  return (
    <>
      <Header/>
      <div className='title-body'>
        <DateTime />
        <hr/>
        <h2 className='_title'>{patientData.patientName}</h2>
        <hr/>
        <PatientInformation data = {patientData} />
        <hr/>

      </div>
      <div className='table-body'>
        <ViewPatientHistoryTable data = {requestData} />
        <hr />
        <TableButtons />
      </div>

    </>

  )
}

export default ViewPatientHistory