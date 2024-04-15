import { Alert, Button, Modal } from "react-bootstrap";
import "../../css/Contribution.css";
const StudentContributionDetails = ({ contribution, open, close }) => {
  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title10">
          Contribution Details
        </Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <div id="img-container">
          <img
            src="https://newjerseylawyernow.com/wp-content/uploads/2020/06/quill-pen-writing-scaled.jpg"
            className="student-contribution-image"
            alt="Nature"
          />
        </div>
        <Alert variant="info">
          <h5>Title: {contribution.title}</h5>
          <p>Submitted by: {contribution.submitter}</p>
          <p>Event: {contribution.event}</p>
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
