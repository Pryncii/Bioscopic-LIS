function PatientRequestTests() {

    return (
      <>
        <div className='table-body'>
          <table style={{ width: '100%', tableLayout: 'fixed', color: '#0D1D58', fontSize: '20px'}}>
              <tr><h4 className='_title'><b>Hematology</b></h4></tr>
              <tr>
                  <td><input class="Hematology form-check-input" id="H-1" type="checkbox"/> CBC</td>
                  <td><input class="Hematology form-check-input" id="H-2" type="checkbox" disabled/> Platelet Count</td>
                  <td><input class="Hematology form-check-input" id="H-3" type="checkbox"/> ESR</td>
              </tr>
              <tr>
                  <td><input class="Hematology form-check-input" id="H-4" type="checkbox"/> Blood Type with Rh</td>
                  <td><input class="Hematology form-check-input" id="H-5" type="checkbox"/> Clotting Time</td>
                  <td><input class="Hematology form-check-input" id="H-6" type="checkbox"/> Bleeding Time</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Clinical Microscopy</b></h4></tr>
              <tr>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-1" type="checkbox"/> Urinalysis</td>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-2" type="checkbox"/> Fecalysis</td>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-3" type="checkbox"/> FOBT</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Chemistry</b></h4></tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-1" type="checkbox"/> FBS</td>
                  <td><input class="Chemistry form-check-input" id="C-2" type="checkbox"/> Creatinine</td>
                  <td><input class="Chemistry form-check-input" id="C-3" type="checkbox"/> Uric Acid</td>
              </tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-4" type="checkbox"/> Cholesterol</td>
                  <td><input class="Chemistry form-check-input" id="C-5" type="checkbox"/> Triglycerides</td>
                  <td><input class="Chemistry form-check-input" id="C-6" type="checkbox"/> HDL</td>
              </tr> 
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-7" type="checkbox"/> LDL</td>
                  <td><input class="Chemistry form-check-input" id="C-8" type="checkbox"/> VLDL</td>
                  <td><input class="Chemistry form-check-input" id="C-9" type="checkbox"/> BUN</td>
              </tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-10" type="checkbox"/> SGPT</td>
                  <td><input class="Chemistry form-check-input" id="C-11" type="checkbox"/> SGOT</td>
                  <td><input class="Chemistry form-check-input" id="C-12" type="checkbox"/> HbA1c</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Serotology</b></h4></tr>
              <tr>
                  <td><input class="Serology form-check-input" id="S-1" type="checkbox"/> HbsAg</td>
                  <td><input class="Serology form-check-input" id="S-2" type="checkbox"/> RPR/VDRL</td>
                  <td><input class="Serology form-check-input" id="S-3" type="checkbox"/> Serum Pregnancy Test</td>
              </tr>
              <tr>
                  <td><input class="Serology form-check-input" id="S-4" type="checkbox"/> Urine Pregnancy Test</td>
                  <td><input class="Serology form-check-input" id="S-5" type="checkbox"/> Dengue NS1</td>
                  <td><input class="Serology form-check-input" id="S-6" type="checkbox"/> Dengue Duo</td>
              </tr>
          </table>    
        </div>
      </>
  
    )
  }
  
  export default PatientRequestTests