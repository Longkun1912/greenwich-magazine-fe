import Modal from "react-bootstrap/Modal";

const UserInfo = ({ open, close, user }) => {
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
          <div className="modal-title4">
            <img src={user.avatar} alt="avatar" id="user-avatar" />
            <span>{user.email}</span>
          </div>
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <div className="user-info">
          <div className="info-row">
            <span className="info-label">Username: </span>
            <span className="info-value">{user.username}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Email: </span>
            <span className="info-value">{user.email}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Mobile: </span>
            <span className="info-value">{user.mobile}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role: </span>
            <span className="info-value">{user.role}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Faculty: </span>
            <span className="info-value">{user.faculty}</span>
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

export default UserInfo;
