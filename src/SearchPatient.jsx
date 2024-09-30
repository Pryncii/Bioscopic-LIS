function SearchPatient() {
    return(
        <div class="form-box">
            <div class="norm">
                <input class="input-item form-control" type="text" name="search" id="search-field" placeholder="Search"/>
                <button class="btn-item btn btn-primary btn-lg" id="search-btn" type="submit">SEARCH</button>
            </div>

            <div class="adv">
                <h5>Sort by 
                    <a class="link-underline-primary" id="sortName-btn"> Last Name A-Z</a> / 
                    <a class="link-underline-primary" id="sortDate-btn"> Recently Modified</a> / 
                    <a class="link-underline-primary" id="reset-btn"> Reset</a>
                </h5>
            </div>
        </div>
    );
}

export default SearchPatient;