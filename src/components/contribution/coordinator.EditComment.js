// import { useState } from "react";
// import { Button, Modal, Form } from "react-bootstrap";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";
// import { putComment } from "../../services/comment.service";

// const EditCommentCoordinator = (props) => {
//   const { show, handleClose, contributionId, fetchContributions } = props;

//   return (
//     <h1>heheeh</h1>
//   )
// }

// export default EditCommentCoordinator;

//test1
import React, { useState } from "react";
import { Button, Modal, Form } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { putComment } from "../../services/comment.service";

const EditCommentCoordinator = (props) => {
  const { show, handleClose, commentId, fetchContributions, editingComment } = props;
  const [newCommentContent, setNewCommentContent] = useState(editingComment.content);

  const handleEditComment = async () => {
    try {
      await putComment(commentId, newCommentContent);

      toast.success("Comment updated successfully");

      handleClose();
      fetchContributions();
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.error("Failed to update comment");
    }
  };


  return (
    <Modal show={show} onHide={handleClose}>
      <Modal.Header closeButton>
        <Modal.Title>Edit Comment</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form>
          <Form.Group controlId="formCommentContent">
            <Form.Label>Comment Content</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter comment content"
              value={newCommentContent}
              onChange={(e) => setNewCommentContent(e.target.value)}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
        <Button variant="primary" onClick={handleEditComment}>
          Save Changes
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default EditCommentCoordinator;
