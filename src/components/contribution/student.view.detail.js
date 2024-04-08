import { Alert, Button, Modal } from "react-bootstrap";
import "../../css/Contribution.css";
const StudentContributionDetails = ({ contribution, open, close }) => {
  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-tile6">Contribution Details</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div id="img-container">
          <img
            src={contribution.image}
            className="student-contribution-image"
            alt="Nature"
          />
        </div>
        <Alert variant="info">
          <h5>Title: {contribution.title}</h5>
          <p>Submitted by: {contribution.submitter}</p>
          <p>Event: {contribution.event}</p>
        </Alert>
        <Alert variant="light">
          <h5>Content:</h5>
          <p>
            {contribution.content.length > 49
              ? contribution.content.substring(0, 49) + "..."
              : contribution.content}
          </p>
          <h5>Document:</h5>
          <a href={contribution.document.replace(/^http:/, "https:")}>
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

export default StudentContributionDetails;
