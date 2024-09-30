import Header from './Header.jsx'
import DateTime from './DateTime.jsx'
import SearchPatient from './SearchPatient.jsx'
import TablePatient from './TablePatient.jsx'
import TableButtons from './TableButtons.jsx'

function ViewPatients() {
    const patientData = [
        { patientID: '12345', name: 'John Doe', latestDate: '2024-09-28', remarks: 'Follow-up needed' },
        { patientID: '67890', name: 'Jane Smith', latestDate: '2024-09-29', remarks: 'All clear' },
        {}, {}, {}
    ];

    return(
        <>
        <Header/>
        <div className='title-body'>
            <h1 className='_title'>View All Patients</h1>
            <DateTime/>
        </div>
        <SearchPatient/>
        <div className='table-body'>
            <TablePatient data={patientData}/>
            <TableButtons/>
        </div>
        </>
    );
}

export default ViewPatients;