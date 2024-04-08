import { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postComment } from "../../services/comment.service";

const CoordinatorComment = (props) => {
  const { show, handleClose, contributionId, fetchContributions } = props;
  const [commentContent, setCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCommentChange = (e) => {
    setCommentContent(e.target.value);
  };

  const handleSubmit = async (e) => {
    setIsSubmitting(true);
    e.preventDefault();

    try {
      // Gửi comment
      await postComment(contributionId, commentContent);
      handleClose();
      // Thông báo thành công
      toast.success("Comment created successfully!");
      // Fetch comments và đóng modal
      await fetchContributions();
    } catch (error) {
      setIsSubmitting(false);
      toast.error("Failed to create comment!! Contributions have comments.");
    }
  };
  

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Create New Comment</Modal.Title>
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

