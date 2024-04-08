import { saveAs } from "file-saver";
import JSZip from "jszip";
import { Alert, Button, Modal } from "react-bootstrap";
import "../../css/Contribution.css";
import ContributionService from "../../services/contribution.service";

const ContributionForGuestDetails = ({ contribution, open, close }) => {
  // Handle download document
  const handleDownloadDocument = async (documentName) => {
    try {
      // Send file to download
      const response = await ContributionService.downloadDocument(documentName);
      const zip = new JSZip();
      zip.file(documentName, response.data);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${documentName}.zip`);
    } catch (error) {
      console.error("Error downloading document:", error);
    }
  };

  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title8">Contribution Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div id="img-container">
          <img
            src={contribution.image}
            className="guest-contribution-image"
            alt="Contribution"
          />
        </div>
        <Alert variant="info">
          <h5>Title: {contribution.title}</h5>
          <p>Submitted by: {contribution.submitter.username}</p>
          <p>Faculty: {contribution.faculty.name}</p>
          <p>Event: {contribution.event.name}</p>
        </Alert>
        <Alert variant="light">
          <h5>Content</h5>
          <p>
            {contribution.content.length > 49
              ? contribution.content.substring(0, 49) + "..."
              : contribution.content}
          </p>
          <h5>Document</h5>
          <a
            href="#"
            onClick={(e) => {
              e.preventDefault();
              handleDownloadDocument(contribution.document);
            }}
          >
            {contribution.document.length > 49
              ? contribution.document.substring(0, 49) + "..."
              : contribution.document}
          </a>
        </Alert>
      </Modal.Body>

      <Modal.Footer>
        <Button variant="secondary" onClick={close}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContributionForGuestDetails;
