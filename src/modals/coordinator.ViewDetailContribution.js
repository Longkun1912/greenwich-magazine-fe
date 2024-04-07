import Modal from "react-bootstrap/Modal";

const ContributionInfo = ({ open, close, contribution }) => {
  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={open}
      onHide={close}
      backdrop="static"
      keyboard={false}
    >
      <Modal.Header closeButton>
        <Modal.Title>
          <div>
            <span>{contribution.title}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="contribution-info">
        <div className="info-row">
            <span className="info-label">Id: </span>
            <span className="info-value">{contribution.id}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Event: </span>
            <span className="info-value">{contribution.event}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Faculty: </span>
            <span className="info-value">{contribution.faculty}</span>
          </div>
          <div className="info-row">
            <span className="info-label">State: </span>
            <span className="info-value">{contribution.state}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Content: </span>
            <span className="info-value">{contribution.content}</span>
          </div>
          
        </div>
      </Modal.Body>
      <Modal.Footer>
        <button className="btn btn-secondary" onClick={close}>
          Close
        </button>
      </Modal.Footer>
    </Modal>
  );
};

export default ContributionInfo;
