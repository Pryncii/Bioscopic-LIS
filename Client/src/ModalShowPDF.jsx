import ModalDownloadAndSendPDF from "./ModalDownloadAndSendPDF.jsx";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { URL } from './constants'

function ModalShowPDF({formData, email, onClose}) {
const [pdfUrl, setPdfUrl] = useState(null);
const [show, setShow] = useState(false);
const [loading, setLoading] = useState(false);
const [pdfBlob, setPdfBlob] = useState(null); // Store the blob in state

const handleClose = () => {
  setShow(false);
  setPdfUrl(null); // Clear the PDF URL when the modal closes
  setPdfBlob(null); // clear the blob
};

const handleCloseAll = () => {
  setShow(false);
  setPdfUrl(null); // Clear the PDF URL when the modal closes
  setPdfBlob(null); // clear the blob
  onClose();
};

const handleShow = async () => {
  setShow(true);
  setLoading(true);

  try {
    const response = await fetch(`${URL}/generate-pdf`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (!response.ok) throw new Error("Failed to generate PDF");

    const blob = await response.blob();
    const url = URL.createObjectURL(blob);
    setPdfUrl(url);
    setPdfBlob(blob); // Store the blob in state
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Button variant="primary" onClick={handleShow}>
        Save to PDF
      </Button>

      <Modal
        size="xs"
        show={show}
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
        <ModalDownloadAndSendPDF formData={formData} email={email} pdfUrl={pdfUrl} pdfBlob={pdfBlob} onClose={handleCloseAll}/>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalShowPDF