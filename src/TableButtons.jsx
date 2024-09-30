import './Table.css';

function TableButtons() {
    return(
        <div className="button-page">
            <button className="btn-item btn btn-primary btn-lg" disabled>BACK</button>
            <h5>Page # of #</h5>
            <button className="btn-item btn btn-primary btn-lg">NEXT</button>
        </div>
    );
}

export default TableButtons;