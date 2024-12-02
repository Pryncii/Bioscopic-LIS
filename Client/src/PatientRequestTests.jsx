function PatientRequestTests({ onCheckboxChange, selectedTests }) {
    const isCBCChecked = !!selectedTests["CBC"];    // only allow CBCwPC be checkable if CBC is checked

    return (
      <>
        <div className='table-body'>
          <table style={{ width: '100%', tableLayout: 'fixed', color: '#0D1D58', fontSize: '20px'}}>
              <tr><h4 className='_title'><b>Hematology</b></h4></tr>
              <tr>
                  <td><input class="Hematology form-check-input" id="H-1" type="checkbox" checked={!!selectedTests["CBC"]} onChange={() => onCheckboxChange("CBC", "Hematology")} /> CBC</td>
                  <td><input class="Hematology form-check-input" id="H-2" type="checkbox" checked={!!selectedTests["CBC with Platelet Count"]} onChange={() => onCheckboxChange("CBC with Platelet Count", "Hematology")} disabled={!isCBCChecked}/> Platelet Count</td>
                  <td><input class="Hematology form-check-input" id="H-3" type="checkbox" checked={!!selectedTests["ESR"]} onChange={() => onCheckboxChange("ESR", "Hematology")} /> ESR</td>
              </tr>
              <tr>
                  <td><input class="Hematology form-check-input" id="H-4" type="checkbox" checked={!!selectedTests["Blood Type with Rh"]} onChange={() => onCheckboxChange("Blood Type with Rh", "Hematology")} /> Blood Type with Rh</td>
                  <td><input class="Hematology form-check-input" id="H-5" type="checkbox" checked={!!selectedTests["Clotting Time"]} onChange={() => onCheckboxChange("Clotting Time", "Hematology")} /> Clotting Time</td>
                  <td><input class="Hematology form-check-input" id="H-6" type="checkbox" checked={!!selectedTests["Bleeding Time"]} onChange={() => onCheckboxChange("Bleeding Time", "Hematology")} /> Bleeding Time</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Clinical Microscopy</b></h4></tr>
              <tr>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-1" type="checkbox" checked={!!selectedTests["Urinalysis"]} onChange={() => onCheckboxChange("Urinalysis", "Clinical Microscopy")} /> Urinalysis</td>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-2" type="checkbox" checked={!!selectedTests["Fecalysis"]} onChange={() => onCheckboxChange("Fecalysis", "Clinical Microscopy")} /> Fecalysis</td>
                  <td><input class="ClinicalMicroscopy form-check-input" id="CM-3" type="checkbox" checked={!!selectedTests["FOBT"]} onChange={() => onCheckboxChange("FOBT", "Clinical Microscopy")} /> FOBT</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Chemistry</b></h4></tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-1" type="checkbox" checked={!!selectedTests["FBS"]} onChange={() => onCheckboxChange("FBS", "Chemistry")} /> FBS</td>
                  <td><input class="Chemistry form-check-input" id="C-1" type="checkbox" checked={!!selectedTests["RBS"]} onChange={() => onCheckboxChange("RBS", "Chemistry")} /> RBS</td>
                  <td><input class="Chemistry form-check-input" id="C-2" type="checkbox" checked={!!selectedTests["Creatinine"]} onChange={() => onCheckboxChange("Creatinine", "Chemistry")} /> Creatinine</td>
              </tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-3" type="checkbox" checked={!!selectedTests["Uric Acid"]} onChange={() => onCheckboxChange("Uric Acid", "Chemistry")} /> Uric Acid</td>
                  <td><input class="Chemistry form-check-input" id="C-4" type="checkbox" checked={!!selectedTests["Cholesterol"]} onChange={() => onCheckboxChange("Cholesterol", "Chemistry")} /> Cholesterol</td>
                  <td><input class="Chemistry form-check-input" id="C-5" type="checkbox" checked={!!selectedTests["Triglycerides"]} onChange={() => onCheckboxChange("Triglycerides", "Chemistry")} /> Triglycerides</td>
              </tr> 
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-6" type="checkbox" checked={!!selectedTests["HDL"]} onChange={() => onCheckboxChange("HDL", "Chemistry")} /> HDL</td>
                  <td><input class="Chemistry form-check-input" id="C-7" type="checkbox" checked={!!selectedTests["LDL"]} onChange={() => onCheckboxChange("LDL", "Chemistry")} /> LDL</td>
                  <td><input class="Chemistry form-check-input" id="C-8" type="checkbox" checked={!!selectedTests["VLDL"]} onChange={() => onCheckboxChange("VLDL", "Chemistry")} /> VLDL</td>
              </tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-9" type="checkbox" checked={!!selectedTests["BUN"]} onChange={() => onCheckboxChange("BUN", "Chemistry")} /> BUN</td>
                  <td><input class="Chemistry form-check-input" id="C-10" type="checkbox" checked={!!selectedTests["SGPT"]} onChange={() => onCheckboxChange("SGPT", "Chemistry")} /> SGPT</td>
                  <td><input class="Chemistry form-check-input" id="C-11" type="checkbox" checked={!!selectedTests["SGOT"]} onChange={() => onCheckboxChange("SGOT", "Chemistry")} /> SGOT</td>
              </tr>
              <tr>
                  <td><input class="Chemistry form-check-input" id="C-12" type="checkbox" checked={!!selectedTests["HbA1c"]} onChange={() => onCheckboxChange("HbA1c", "Chemistry")} /> HbA1c</td>
              </tr>
              <tr><td colSpan="3"><hr /></td></tr>
  
              <tr><h4 className='_title'><b>Serotology</b></h4></tr>
              <tr>
                  <td><input class="Serology form-check-input" id="S-1" type="checkbox" checked={!!selectedTests["HbsAg"]} onChange={() => onCheckboxChange("HbsAg", "Serology")} /> HbsAg</td>
                  <td><input class="Serology form-check-input" id="S-2" type="checkbox" checked={!!selectedTests["RPR/VDRL"]} onChange={() => onCheckboxChange("RPR/VDRL", "Serology")} /> RPR/VDRL</td>
                  <td><input class="Serology form-check-input" id="S-3" type="checkbox" checked={!!selectedTests["Serum Pregnancy Test"]} onChange={() => onCheckboxChange("Serum Pregnancy Test", "Serology")} /> Serum Pregnancy Test</td>
              </tr>
              <tr>
                  <td><input class="Serology form-check-input" id="S-4" type="checkbox" checked={!!selectedTests["Urine Pregnancy Test"]} onChange={() => onCheckboxChange("Urine Pregnancy Test", "Serology")} /> Urine Pregnancy Test</td>
                  <td><input class="Serology form-check-input" id="S-5" type="checkbox" checked={!!selectedTests["Dengue NS1"]} onChange={() => onCheckboxChange("Dengue NS1", "Serology")} /> Dengue NS1</td>
                  <td><input class="Serology form-check-input" id="S-6" type="checkbox" checked={!!selectedTests["Dengue Duo"]} onChange={() => onCheckboxChange("Dengue Duo", "Serology")} /> Dengue Duo</td>
              </tr>
          </table>    
        </div>
      </>
  
    )
  }
  
  export default PatientRequestTests