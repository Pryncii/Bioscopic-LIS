import React, { useState } from 'react';    

function PatientRequestSearch({ patients, onSearch }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [showSuggestions, setShowSuggestions] = useState(false);

    const filteredPatients = Object.values(patients || {})
        .filter(patient => patient.name && patient.name.toLowerCase().includes(searchQuery.toLowerCase()))
        .slice(0, 3);

    const handleInputChange = (e) => {
        setSearchQuery(e.target.value);
        setShowSuggestions(true);
    };

    const handleSuggestionClick = (name) => {
        setSearchQuery(name);
        setShowSuggestions(false);
    };


    const handleSearch = (e) => {
        e.preventDefault(); // Prevent default form submission behavior

        if (filteredPatients.length > 0) {
            const firstPatient = filteredPatients[0]; 
            onSearch({ name: firstPatient.name, patientID: firstPatient.patientID });
            setSearchQuery("");
        } else {
            console.log("No matches found.");
        }
    };


    return (
        <div className="form-box" style={{ position: 'relative', width: '300px' }}>
            <form onSubmit={handleSearch}> {/* Use form to capture enter key */}
            <div style={{ display: 'flex', alignItems: 'center' }}>
                <input 
                    className="input-item form-control" 
                    type="text" 
                    name="search" 
                    id="search-field" 
                    placeholder="Search" 
                    value={searchQuery} 
                    onChange={handleInputChange}
                    onBlur={() => setTimeout(() => setShowSuggestions(false), 150)} 
                    onFocus={() => setShowSuggestions(true)}
                    style={{ flex: 1 }}
                />
                <button 
                    className="btn-item btn btn-primary" 
                    id="patient_search_btn" 
                    type="submit" 
                    onClick={handleSearch}
                    style={{ marginLeft: '8px', height: '38px' }}
                >
                    Search
                </button>
            </div>
            </form>
            {showSuggestions && searchQuery && (
                <ul 
                    className="suggestions" 
                    style={{
                        listStyleType: 'none', 
                        padding: 0, 
                        margin: 0, 
                        position: 'absolute', 
                        top: '40px', 
                        left: 0, 
                        width: '100%', 
                        border: '1px solid #ccc', 
                        backgroundColor: 'white', 
                        zIndex: 1000,
                        maxHeight: '150px', 
                        overflowY: 'auto',
                        display: 'flex',
                        flexDirection: 'column',
                    }}
                >
                    {filteredPatients.map(patient => (
                        <li 
                            key={patient.patientID} 
                            onClick={() => handleSuggestionClick(patient.name)}
                            style={{ padding: '8px', cursor: 'pointer', borderBottom: '1px solid #eee' }}
                            onMouseDown={(e) => e.preventDefault()} 
                        >
                            {patient.name}
                        </li>
                    ))}
                    {filteredPatients.length === 0 && (
                        <li style={{ padding: '8px', color: '#999' }}>No matches found</li>
                    )}
                </ul>
            )}
        </div>
    );
}

export default PatientRequestSearch;
