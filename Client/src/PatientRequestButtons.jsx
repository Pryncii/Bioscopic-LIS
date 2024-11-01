function PatientRequestButtons({ onSubmit, onCancel, isDisabled }) {
    return(
        <div className="button-page">
            {/* if clicked reset patient information and checked tests */}
            <button className="btn-item btn btn-primary btn-lg" onClick={onCancel}>Cancel Request</button>  
            {/* only enablede if there is patient information and at least a checked test */}
            <button className="btn-item btn btn-primary btn-lg" onClick={onSubmit} disabled={isDisabled}>Submit Request</button>    
        </div>
    );
}

export default PatientRequestButtons;