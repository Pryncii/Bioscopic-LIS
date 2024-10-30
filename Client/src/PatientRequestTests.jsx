function PatientRequestTests({ onCheckboxChange }) {

    return (
      <>
        <div className='table-body'>
          <table style={{ width: '100%', tableLayout: 'fixed', color: '#0D1D58', fontSize: '20px'}}>
              <tr><h4 className='_title'><b>Hematology</b></h4></tr>
              <tr>
                  <td><input class="Hematology form-check-input" id="H-1" type="checkbox" onChange={() => onCheckboxChange("CBC", "Hematology")} /> CBC</td>
                  <td><input class="Hematology form-check-input" id="H-2" type="checkbox" disabled onChange={() => onCheckboxChange("CBC with Platelet Count", "Hematology")} /> Platelet Count</td>
                  <td><input class="Hematology form-check-input" id="H-3" type="checkbox" onChange={() => onCheckboxChange("ESR", "Hematology")} /> ESR</td>
              </tr>
              <tr>
                  <td><input class="Hematology form-check-input" id="H-4" type="checkbox" onChange={() => onCheckboxChange("Blood Type with Rh", "Hematology")} /> Blood Type with Rh</td>
                  <td><input class="Hematology form-check-input" id="H-5" type="checkbox" onChange={() => onCheckboxChange("Clotting Time", "Hematology")} /> Clotting Time</td>
                  <td><input class="Hematology form-check-input" id="H-6" type="checkbox" onChange={() => onCheckboxChange("Breeding Time", "Hematology")} /> Bleeding Time</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Clinical Microscopy</b></h4></tr>
              <tr>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-1" type="checkbox" onChange={() => onCheckboxChange("Urinalysis", "Clinical Microscopy")} /> Urinalysis</td>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-2" type="checkbox" onChange={() => onCheckboxChange("Fecalysis", "Clinical Microscopy")} /> Fecalysis</td>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-3" type="checkbox" onChange={() => onCheckboxChange("FOBT", "Clinical Microscopy")} /> FOBT</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Chemistry</b></h4></tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-1" type="checkbox" onChange={() => onCheckboxChange("FBS", "Chemistry")} /> FBS</td>
                  <td><input class="Chemistry form-check-input" id="C-2" type="checkbox" onChange={() => onCheckboxChange("Creatinine", "Chemistry")} /> Creatinine</td>
                  <td><input class="Chemistry form-check-input" id="C-3" type="checkbox" onChange={() => onCheckboxChange("Uric Acid", "Chemistry")} /> Uric Acid</td>
              </tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-4" type="checkbox" onChange={() => onCheckboxChange("Cholesterol", "Chemistry")} /> Cholesterol</td>
                  <td><input class="Chemistry form-check-input" id="C-5" type="checkbox" onChange={() => onCheckboxChange("Triglycerides", "Chemistry")} /> Triglycerides</td>
                  <td><input class="Chemistry form-check-input" id="C-6" type="checkbox" onChange={() => onCheckboxChange("HDL", "Chemistry")} /> HDL</td>
              </tr> 
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-7" type="checkbox" onChange={() => onCheckboxChange("LDL", "Chemistry")} /> LDL</td>
                  <td><input class="Chemistry form-check-input" id="C-8" type="checkbox" onChange={() => onCheckboxChange("VLDL", "Chemistry")} /> VLDL</td>
                  <td><input class="Chemistry form-check-input" id="C-9" type="checkbox" onChange={() => onCheckboxChange("BUN", "Chemistry")} /> BUN</td>
              </tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-10" type="checkbox" onChange={() => onCheckboxChange("SGPT", "Chemistry")} /> SGPT</td>
                  <td><input class="Chemistry form-check-input" id="C-11" type="checkbox" onChange={() => onCheckboxChange("SGOT", "Chemistry")} /> SGOT</td>
                  <td><input class="Chemistry form-check-input" id="C-12" type="checkbox" onChange={() => onCheckboxChange("HbA1c", "Chemistry")} /> HbA1c</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Serotology</b></h4></tr>
              <tr>
                  <td><input class="Serology form-check-input" id="S-1" type="checkbox" onChange={() => onCheckboxChange("HbsAg", "Serology")} /> HbsAg</td>
                  <td><input class="Serology form-check-input" id="S-2" type="checkbox" onChange={() => onCheckboxChange("RPR/VDRL", "Serology")} /> RPR/VDRL</td>
                  <td><input class="Serology form-check-input" id="S-3" type="checkbox" onChange={() => onCheckboxChange("Serum Pregnancy Test", "Serology")} /> Serum Pregnancy Test</td>
              </tr>
              <tr>
                  <td><input class="Serology form-check-input" id="S-4" type="checkbox" onChange={() => onCheckboxChange("Urine Pregnancy Test", "Serology")} /> Urine Pregnancy Test</td>
                  <td><input class="Serology form-check-input" id="S-5" type="checkbox" onChange={() => onCheckboxChange("Dengue NS1", "Serology")} /> Dengue NS1</td>
                  <td><input class="Serology form-check-input" id="S-6" type="checkbox" onChange={() => onCheckboxChange("Dengue Duo", "Serology")} /> Dengue Duo</td>
              </tr>
          </table>    
        </div>
      </>
  
    )
  }
  
  export default PatientRequestTests