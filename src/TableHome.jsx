import './Table.css';

function TableHome({ data }) {
    return (
        <table className="test-items">
            <thead>
                <tr>
                    <th className="item-label number">
                        <h6>#</h6>
                    </th>
                    <th className="item-label id-item">
                        <h6>Request ID</h6>
                    </th>
                    <th className="item-label id-item">
                        <h6>Patient ID</h6>
                    </th>
                    <th className="item-label">
                        <h6>Name</h6>
                    </th>
                    <th className="item-label">
                        <h6>Test/s</h6>
                    </th>
                    <th className="item-label status">
                        <h6>Request Status</h6>
                    </th>
                    <th className="item-label remarks">
                        <h6>Remarks</h6>
                    </th>
                    <th className="item-label id-item">
                        <h6>Payment Status</h6>
                    </th>
                    <th className="item-label date">
                        <h6>Date Requested</h6>
                    </th>
                    <th className="item-label date">
                        <h6>Date Completed</h6>
                    </th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(data) && data.length > 0 ? (
                    data.map((item, index) => (
                        <tr key={index}>
                            <td className="item-container number"><h6>{index + 1}</h6></td>
                            <td className="item-container"><h6>{item.requestId}</h6></td>
                            <td className="item-container"><h6>{item.patientId}</h6></td>
                            <td className="item-container"><h6>{item.name}</h6></td>
                            <td className="item-container"><h6>{item.tests}</h6></td>
                            <td className="item-container status" role="button">
                                <a data-bs-toggle="modal" data-bs-target="#statusModal">
                                    <h6 className={`status-item ${item.barColor}`}>{item.requestStatus}</h6>
                                </a>
                            </td>
                            <td className="item-container" role="button" data-bs-toggle="modal" data-bs-target="#statusModal">
                                <h6>{item.remarks}</h6>
                            </td>
                            <td className="item-container id-item" role="button" data-bs-toggle="modal" data-bs-target="#statusModal">
                                <h6>{item.paymentStatus}</h6>
                            </td>
                            <td className="item-container date"><h6>{item.dateRequested}</h6></td>
                            <td className="item-container date"><h6>{item.dateCompleted}</h6></td>
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

export default TableHome;
