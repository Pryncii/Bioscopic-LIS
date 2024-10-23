import './styles/Table.css';

function ViewPatientHistoryTable({ data }) {
    return (
        <table className="test-items" style={{ width: '100%', tableLayout: 'fixed', fontSize: '20px', wordWrap: 'break-word'}}>
            <thead>
                <tr>
                    <th className="item-label number">
                        <h6>#</h6>
                    </th>
                    <th className="item-label">
                        <h6>Test/s</h6>
                    </th>
                    <th className="item-label date">
                        <h6>Date Requested</h6>
                    </th>
                    <th className="item-label date">
                        <h6>Date Completed</h6>
                    </th>
                    <th className="item-label">
                        <h6>Remarks</h6>
                    </th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={index}>
                            <td className="item-container number"><h6>{index + 1}</h6></td>
                            <td className="item-container"><h6>{item.tests}</h6></td>
                            <td className="item-container date"><h6>{item.dateRequested}</h6></td>
                            <td className="item-container date"><h6>{item.dateCompleted}</h6></td>
                            <td className="item-container" role="button" data-bs-toggle="modal" data-bs-target="#statusModal">
                                <h6>{item.remarks}</h6>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="10" className="item-container"><h6>No requests found</h6></td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default ViewPatientHistoryTable;