import { useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import CommentService from "../../services/comment.service";

const CoordinatorComment = (props) => {
  const { show, handleClose, contributionId, fetchContributions } = props;
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    try {
      // Gửi comment
      await CommentService.postComment(contributionId, commentContent);
      await fetchContributions();
      setTimeout(() => {
        setIsSubmitting(false);
        handleClose();
      }, 2000);
      toast.success("Comment created successfully!");
      // Fetch comments và đóng modal
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating Comment:", error);
      toast.error(error.response.data.error);
    }
    e.preventDefault();
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title10">
            Create New Comment
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="commentContent">
              <Form.Label>Comment Content</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter your comment here"
                value={commentContent}
                onChange={handleCommentChange}
                required
              />
            </Form.Group>
            <Modal.Footer>
              <Button variant="secondary" onClick={handleClose}>
                Close
              </Button>
              <Button variant="primary" onClick={handleSubmit}>
                {isSubmitting ? "Saving..." : "Save changes"}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default CoordinatorComment;
