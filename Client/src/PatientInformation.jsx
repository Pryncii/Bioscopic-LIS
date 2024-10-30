import './PatientInformation.css';

function PatientInformation({ patient }) {
    const { name, sex, phoneNo, email, age, birthday, address } = patient;
    return(
        <div>
            <div class="patient-row">
                <div class="fiftyspace"><b>Name:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={name} readOnly></input> &nbsp; &nbsp; </div>
                <div class="twentyfivespace"><b>Sex:</b> &nbsp;&nbsp; <input class="patient-input-item" type="text" placeholder={sex} readOnly></input> &nbsp; &nbsp;  </div>
                <div class="twentyfivespace"><b>Phone No.:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={phoneNo} readOnly></input>  </div>
            </div>

            <div class="patient-row">
                <div class="fiftyspace"><b>Email:</b> &nbsp;&nbsp; <input class="patient-input-item" type="text" placeholder={email} readOnly></input> &nbsp; &nbsp;  </div>
                <div class="twentyfivespace"><b>Age:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={age} readOnly></input> &nbsp; &nbsp;  </div>
                <div class="twentyfivespace"><b>Birthday:</b> &nbsp;&nbsp;&nbsp;&nbsp; <input class="patient-input-item" type="text" placeholder={birthday} readOnly></input>  </div>
            </div>

            <div class="patient-row">
                <div class="hundredspace"><b>Address:</b> &nbsp; <input class="patient-input-item" type="text" placeholder={address} readOnly></input></div>
            </div>
        </div>
    );
}

export default PatientInformation;