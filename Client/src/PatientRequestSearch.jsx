function PatientRequestSearch() {
    return(
        <div class="form-box">
            <div class="norm" style={{ justifyContent: 'left', height: '40px'}}>
                <input class="input-item form-control" type="text" name="search" id="search-field" placeholder="Search"/>
                <button class="btn-item btn btn-primary" id="patient_search_btn" type="submit" style={{ display: 'flex', alignItems: 'center'}}>Search</button>
            </div>
        </div>
    );
}

export default PatientRequestSearch;