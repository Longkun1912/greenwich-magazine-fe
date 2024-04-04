import { Alert, Button, Modal } from "react-bootstrap";
import "../../css/Contribution.css";

const ContributionForGuestDetails = ({ contribution, open, close }) => {
  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Contribution Details</Modal.Title>
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

export default ContributionForGuestDetails;
