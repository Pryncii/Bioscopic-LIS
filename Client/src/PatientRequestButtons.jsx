function PatientRequestButtons({ onSubmit, onCancel, isDisabled }) {
    return(
        <div className="button-page">
            <button className="btn-item btn btn-primary btn-lg" onClick={onCancel}>Cancel Request</button>
            <button className="btn-item btn btn-primary btn-lg" onClick={onSubmit} disabled={isDisabled}>Submit Request</button>
        </div>
    );
}

export default PatientRequestButtons;