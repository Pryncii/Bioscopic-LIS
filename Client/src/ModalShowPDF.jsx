import ModalSendEmail from "./ModalSendEmail.jsx";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";

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
    const response = await fetch("http://localhost:4000/generate-pdf", {
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
        <ModalSendEmail formData={formData} email={email} onClose={handleCloseAll} pdfBlob={pdfBlob}/>
        <Button
          variant="primary"
          onClick={() => {
            if (pdfUrl) {
              const link = document.createElement("a");
              link.href = pdfUrl;

              let nameParts = formData.requestName.split(", "); // Split by comma and space
              let formattedName = nameParts[0] + nameParts[1].charAt(0); // Combine last name with the first initial

              link.download = `${formattedName}_${formData.category}.pdf`; // formatted file name
              link.click();
            } else {
              alert("No PDF available to download.");
            }
          }}
        >
          Download PDF
        </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}
export default ModalShowPDF