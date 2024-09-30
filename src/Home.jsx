import Header from './Header.jsx'
import DateTime from './DateTime.jsx'
import SearchHome from './SearchHome.jsx'
import TableHome from './TableHome.jsx'
import TableButtons from './TableButtons.jsx'

function Home() {

  const sampleData = [
    {
      requestId: 'REQ123',
      patientId: 'PAT001',
      name: 'John Doe',
      tests: 'CBC, Urinalysis',
      requestStatus: 'Requested',
      barColor: 'req', // This would be a CSS class to style the status color
      remarks: 'Medtech needed',
      paymentStatus: 'Paid',
      dateRequested: '2024-09-25',
      dateCompleted: ''
    },
    {
        requestId: 'REQ123',
        patientId: 'PAT001',
        name: 'John Doe',
        tests: 'CBC, Urinalysis',
        requestStatus: 'In Progress',
        barColor: 'ip', // This would be a CSS class to style the status color
        remarks: 'Urgent',
        paymentStatus: 'Paid',
        dateRequested: '2024-09-25',
        dateCompleted: ''
    },
    {
        requestId: 'REQ124',
        patientId: 'PAT002',
        name: 'Jane Smith',
        tests: 'FBS, Cholesterol',
        requestStatus: 'Completed',
        barColor: 'c',
        remarks: 'Normal',
        paymentStatus: 'Paid',
        dateRequested: '2024-09-24',
        dateCompleted: '2024-09-26'
    },
    {},{}
  ];


  return (
    <>
      <Header/>
      <div className='title-body'>
        <h1 className='_title'>Requested/Ongoing Lab Tests</h1>
        <DateTime/>
      </div>
      <SearchHome/>
      <div className='table-body'>
        <TableHome data={sampleData}/>
        <TableButtons/>
      </div>
    </>
      
  )
}

export default Home