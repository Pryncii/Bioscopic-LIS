import ModalSendEmail from "./ModalSendEmail.jsx";
import { useState } from "react";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

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

const sendToEmail = async (email) => {
  // Regular expression for email validation
  const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Check if email matches the pattern
  if (!email || !emailPattern.test(email)) {
    alert("Please provide a valid email address.");
    return;
  }

  // Confirm before sending the email
  const confirmSend = confirm(`Are you sure you want to send the PDF to ${email}?`);
  if (!confirmSend) return; // If the user cancels, do nothing

  // Create FormData to send the email, formData, and the PDF file
  const formDataToSend = new FormData();
  formDataToSend.append("email", email);
  formDataToSend.append("formData", JSON.stringify(formData)); // Send formData as JSON string
  formDataToSend.append("pdf", pdfBlob, "document.pdf"); // Append the PDF Blob with filename

  try {
    const response = await fetch("http://localhost:4000/send-pdf-email", {
      method: "POST",
      body: formDataToSend, // Send FormData including the PDF file
    });

    if (!response.ok) throw new Error("Failed to send email");

    alert("PDF sent successfully!");
    handleCloseAll();
  } catch (error) {
    console.error("Error sending email:", error);
    alert("Failed to send PDF. Please try again.");
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
        <InputGroup className="mb-3">
          <Form.Control value={email} readOnly />
          <Button variant="outline-secondary" onClick={() => sendToEmail(email)}>
            Send to Registered
          </Button>
        </InputGroup>
        <InputGroup className="mb-3">
          <Form.Control placeholder="example@email.com" id="other-email" />
          <Button
            variant="outline-secondary"
            onClick={() =>
              sendToEmail(document.getElementById("other-email").value)
            }
          >
            Send to Other
          </Button>
        </InputGroup>
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