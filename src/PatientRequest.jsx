import Header from './Header.jsx'
import PatientRequestButtons from './PatientRequestButtons.jsx'
import PatientRequestSearch from './PatientRequestSearch.jsx'
import PatientInformation from './PatientInformation.jsx'
import DateTime from './DateTime.jsx'

function PatientRequest() {
    const Hematology1 =
    {
        test1: 'CBC',
        test2: 'Platelet Count',
        test3: 'ESR'
    };

    const Hematology2 =
    {
        test1: 'Blood Type with Rh',
        test2: 'Clotting Time',
        test3: 'Bleeding Time'
    };

    const ClinicalMicroscopy =
    {
        test1: 'Urinalysis',
        test2: 'Fecalysis',
        test3: 'FOBT'
    };

    const Chesmitry1 =
    {
        test1: 'FBS',
        test2: 'Creatinine',
        test3: 'Uric Acid'
    };

    const Chesmitry2 =
    {
        test1: 'Cholesterol',
        test2: 'Triglycerides',
        test3: 'HDL'
    };

    const Chesmitry3 =
    {
        test1: 'LDL',
        test2: 'VLDL',
        test3: 'BUN'
    };

    const Chesmitry4 =
    {
        test1: 'SGPT',
        test2: 'SGOT',
        test3: 'HbA1c'
    };

    const Serology1 =
    {
        test1: 'HbsAg',
        test2: 'RPR/VDRL',
        test3: 'Serum Pregnancy Test'
    };

    const Serology2 =
    {
        test1: 'Urine Pregnancy Test',
        test2: 'Dengue NS1',
        test3: 'Dengue Duo'
    };

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
        <PatientInformation data = {sampleData} />
        
      </div>
      <div className='table-body'>
        <h4 className='_title'><b>Hematology</b></h4>
        <h4 className='_title'><b>Clinical Microscopy</b></h4>
        <h4 className='_title'><b>Chemistry</b></h4>
        <h4 className='_title'><b>Serotology</b></h4>
        <PatientRequestButtons />
      </div>
    </>
      
  )
}

export default PatientRequest