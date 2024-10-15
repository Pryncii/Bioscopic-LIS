import './PatientInformation.css';

function PatientInformation({ data }) {
    return(
        <div>
            <div class="patient-row">
                <div class="fiftyspace"><b>Name:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={data.patientName} readOnly></input> &nbsp; &nbsp; </div>
                <div class="twentyfivespace"><b>Sex:</b> &nbsp;&nbsp; <input class="patient-input-item" type="text" placeholder={data.patientSex} readOnly></input> &nbsp; &nbsp;  </div>
                <div class="twentyfivespace"><b>Phone No.:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={data.patientPhoneNo} readOnly></input>  </div>
            </div>

            <div class="patient-row">
                <div class="fiftyspace"><b>Email:</b> &nbsp;&nbsp; <input class="patient-input-item" type="text" placeholder={data.patientEmail} readOnly></input> &nbsp; &nbsp;  </div>
                <div class="twentyfivespace"><b>Age:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={data.patientAge} readOnly></input> &nbsp; &nbsp;  </div>
                <div class="twentyfivespace"><b>Birthday:</b> &nbsp;&nbsp;&nbsp;&nbsp; <input class="patient-input-item" type="text" placeholder={data.patientBday} readOnly></input>  </div>
            </div>

            <div class="patient-row">
                <div class="hundredspace"><b>Address:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={data.patientAddress} readOnly></input></div>
            </div>
        </div>
    );
}

export default PatientInformation;