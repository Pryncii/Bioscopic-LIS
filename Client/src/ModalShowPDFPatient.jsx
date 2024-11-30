import ModalSendEmail from "./ModalSendEmail.jsx";
import { useState, useEffect } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

function ModalShowPDFPatient({ formData, show, handleClose }) {
    const [pdfUrl, setPdfUrl] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (show) {
            generatePDF();
        }
    }, [show]);  // Only run when `show` changes to true

    const generatePDF = async () => {
        setLoading(true);

        try {
            const response = await fetch("http://localhost:4000/generate-pdf", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Failed to generate PDF");

            console.log(response);
            const blob = await response.blob();
            const url = URL.createObjectURL(blob);
            setPdfUrl(url);
        } catch (error) {
            console.error("Error generating PDF:", error);
            alert("Failed to generate PDF. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            size="xs"
            show={show} // Control visibility with show prop
            onHide={handleClose}
            backdrop="static"
            keyboard={false}
            centered
        >
            <Modal.Header closeButton>
                <Modal.Title>PDF</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {loading ? (
                    <p>Generating PDF...</p>
                ) : pdfUrl ? (
                    <iframe
                        src={pdfUrl}
                        style={{ width: "100%", height: "500px" }}
                        title="Generated PDF"
                    />
                ) : (
                    <p>No PDF generated</p>
                )}
            </Modal.Body>
            <Modal.Footer className="justify-content-center">
                <Button variant="primary">Download PDF</Button>
                <ModalSendEmail />
            </Modal.Footer>
        </Modal>
    );
}

export default ModalShowPDFPatient;