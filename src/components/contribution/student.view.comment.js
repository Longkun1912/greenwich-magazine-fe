import React, { useEffect, useState } from "react";
import Modal from "react-bootstrap/Modal";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/IndexForCoordinator.css";
import CommentService from "../../services/comment.service";

const StudentViewComment = ({ open, close, contribution }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState(true); // Set default to true

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        if (open && contribution && contribution.id) {
          const response = await CommentService.getStudentViewComment(
            contribution.id
          );
          if (Array.isArray(response)) {
            setComments(response);
          } else {
            setComments([]);
          }
        } else {
          setComments([]);
        }
      } catch (error) {
        console.error("Error fetching comments:", error);
        toast.error(`Error fetching comments: ${error.message}`);
      } finally {
        setLoadingComments(false);
      }
    };

    if (open && contribution && contribution.id) {
      fetchComments();
    } else {
      setComments([]);
    }
  }, [open, contribution]);

  useEffect(() => {
    setLoadingTitle(true);
    if (contribution && contribution.title) {
      setLoadingTitle(false);
    }
  }, [contribution]);

  return (
    <>
      <Modal
        aria-labelledby="contained-modal-title-vcenter"
        centered
        show={open}
        onHide={close}
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header closeButton>
          <Modal.Title className="modal-title10">
            <div>
              <span>
                {loadingTitle
                  ? "Loading..."
                  : contribution && contribution.title
                  ? contribution.title
                  : ""}
              </span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="contribution-info">
            <div className="info-row feedback-content">
              <span className="info-label">Comment: </span>
              <div className="info-value">
                {loadingComments ? (
                  <span>Loading comment...</span>
                ) : comments.length > 0 ? (
                  comments.map((comment, index) => (
                    <div key={index}>
                      <span>{comment.content}</span>
                    </div>
                  ))
                ) : (
                  <span>No comment yet!!</span>
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
      <ToastContainer />
    </>
  );
};

export default StudentViewComment;
