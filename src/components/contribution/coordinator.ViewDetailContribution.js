import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CommentService from "../../services/comment.service"; 
import "../../css/IndexForCoordinator.css";

const ContributionInfo = ({ open, close, contribution }) => {
  const [comments, setComments] = useState([]); // State để lưu trữ các bình luận

  // Effect hook để lấy các bình luận khi contribution thay đổi hoặc khi Modal được mở
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await CommentService.getAllComment(contribution.id); 
        setComments(response.data); // Cập nhật state với dữ liệu bình luận từ API
      } catch (error) {
        console.error("Error fetching comments:", error);
      }
    };

    if (open && contribution) {
      fetchComments(); // Gọi hàm lấy bình luận khi Modal được mở và contribution có giá trị
    }
  }, [open, contribution]); // dependency array, sẽ chạy lại effect khi open hoặc contribution thay đổi

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
          <div className="modal-title3">
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
            <span className="info-label">Submitter: </span>
            <span className="info-value">{contribution.submitter}</span>
          </div>
          <div className="info-row">
            <span className="info-label">State: </span>
            <span className="info-value">{contribution.state}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Content: </span>
            <span className="info-value">{contribution.content}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Feedback: </span>
            <div className="info-value">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id}>
                    <span>{comment.content}</span>
                  </div>
                ))
              ) : (
                <span>No Feedback!!</span>
              )}
            </div>
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


