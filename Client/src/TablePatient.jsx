import './styles/Table.css';

function TablePatient({ data = [] }) {
    return (
        <table className="test-items">
            <thead>
                <tr>
                    <th className="item-label"><h5>Patient</h5></th>
                    <th className="item-label"><h5>Last Modified</h5></th>
                    <th className="item-label"><h5>Remarks</h5></th>
                </tr>
            </thead>
            <tbody>
                {data.length > 0 ? (
                    data.map((patient, index) => (
                        <tr key={index}>
                            <td className="item-container">
                                <h5>{patient.name}</h5>
                            </td>
                            <td className="item-container">
                                <h5>{patient.latestDate}</h5>
                            </td>
                            <td className="item-container">
                                <h5>{patient.remarks}</h5>
                            </td>
                        </tr>
                    ))
                ) : (
                    <tr>
                        <td colSpan="3" className="item-container">
                            <h5>No patients found</h5>
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default TablePatient;
