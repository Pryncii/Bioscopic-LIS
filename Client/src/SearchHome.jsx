import './Search.css';
import { useState } from 'react';

function SearchHome() {
  const [searchQuery, setSearchQuery] = useState("");
  
  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission logic here
    console.log("Search Query:", searchQuery);
    // Possibly trigger a search API or filter results in the frontend
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-box">
        <div className="norm">
          <input 
            className="input-item form-control" 
            type="text" 
            id="search" 
            name="search" 
            placeholder="Search" 
            value={searchQuery}
            onChange={handleSearchChange}
          />
          <button className="btn-item btn btn-primary btn-lg normal" type="submit">SEARCH</button>
          <button 
            className="btn-item btn btn-primary btn-lg advanced" 
            data-bs-toggle="collapse" 
            data-bs-target="#collapseSearch" 
            role="button" 
            aria-expanded="false" 
            aria-controls="collapseSearch" 
            type="button"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-chevron-double-down" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M1.646 6.646a.5.5 0 0 1 .708 0L8 12.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
              <path fillRule="evenodd" d="M1.646 2.646a.5.5 0 0 1 .708 0L8 8.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708"/>
            </svg>
          </button>
        </div>

        <div className="adv">
          <div className="collapse" id="collapseSearch">
            <div className="card card-body">
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="start_date">Starting Date Range</label>
                  <input type="date" className="form-control adv-item" id="lowerdate" name="lowerdate" />
                </div>
                <div className="col-md-6">
                  <label htmlFor="end_date">Ending Date Range</label>
                  <input type="date" className="form-control adv-item" id="upperdate" name="upperdate" />
                </div>
              </div>
              <div className="row">
                <div className="col-md-12">
                  <label htmlFor="status">Status</label>
                  <select className="form-select adv-item" id="status" name="status">
                    <option value="A">All</option>
                    <option value="Requested">Requested</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
              <div className="row">
                <div className="col-md-6">
                  <label htmlFor="category">Category</label>
                  <select className="form-select adv-item" id="category" name="category">
                    <option value="AA">All</option>
                    <option value="Hematology">Hematology</option>
                    <option value="Clinical Microscopy">Clinical Microscopy</option>
                    <option value="Chemistry">Chemistry</option>
                    <option value="Serology">Serology</option>
                  </select>
                </div>
                <div className="col-md-6">
                  <label htmlFor="tests">Test</label>
                  <select className="form-select adv-item" id="tests" name="tests">
                    <option value="AAA">All</option>
                    <option value="CBC">CBC</option>
                    <option value="CBC with Platelet Count">CBC with Platelet Count</option>
                    <option value="ESR">ESR</option>
                    <option value="Blood Type with Rh">Blood Type with Rh</option>
                    <option value="Clotting Time">Clotting Time</option>
                    <option value="Bleeding Time">Bleeding Time</option>
                    <option value="Urinalysis">Urinalysis</option>
                    <option value="Fecalysis">Fecalysis</option>
                    <option value="FOBT">FOBT</option>
                    <option value="FBS">FBS</option>
                    <option value="Creatinine">Creatinine</option>
                    <option value="Uric Acid">Uric Acid</option>
                    <option value="Cholesterol">Cholesterol</option>
                    <option value="Triglycerides">Triglycerides</option>
                    <option value="HDL">HDL</option>
                    <option value="LDL">LDL</option>
                    <option value="VLDL">VLDL</option>
                    <option value="BUN">BUN</option>
                    <option value="SGPT">SGPT</option>
                    <option value="SGOT">SGOT</option>
                    <option value="HbA1c">HbA1c</option>
                    <option value="HbsAg">HbsAg</option>
                    <option value="RPR/VDRL">RPR/VDRL</option>
                    <option value="Serum Pregnancy Test">Serum Pregnancy Test</option>
                    <option value="Urine Pregnancy Test">Urine Pregnancy Test</option>
                    <option value="Dengue NS1">Dengue NS1</option>
                    <option value="Dengue Duo">Dengue Duo</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          <div className="adv-icon">
            <h5 className="adv-icon">
              Sort by
              <a className="link-underline-primary" href="/"> Request ID (Descending) </a>
              / <a className="link-underline-primary" href="/"> Last Name A-Z </a>
              / <a className="link-underline-primary" href="/"> Requests A-Z </a>
              / <a className="link-underline-primary" href="/"> Reset</a>
            </h5>
          </div>
        </div>
      </div>
    </form>
  );
}

export default SearchHome;