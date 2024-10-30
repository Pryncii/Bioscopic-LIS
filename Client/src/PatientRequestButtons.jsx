function PatientRequestButtons({ onSubmit }) {
    return(
        <div className="button-page">
            <button className="btn-item btn btn-primary btn-lg">Cancel Request</button>
            <button className="btn-item btn btn-primary btn-lg" onClick={onSubmit}>Submit Request</button>
        </div>
    );
}

export default PatientRequestButtons;