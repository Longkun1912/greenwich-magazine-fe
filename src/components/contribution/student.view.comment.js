// import { Alert, Button, Modal } from "react-bootstrap";
// import "../../css/Contribution.css";


// const StudentViewFeedback = ({ contribution, open, close }) => {
//   return (
//     <Modal show={open} onHide={close}>
//       <Modal.Header closeButton>
//         <Modal.Title className="modal-tile7">View Feedback</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Alert variant="info">
//           <h5>Title: {contribution.title}</h5>
//           <p>Submitted by: {contribution.submitter}</p>
//           <p>Event: {contribution.event}</p>
//         </Alert>
//         <Alert variant="light">
//           <h5>Feedback</h5>
//           <p>
//             Feedback here
//           </p>
          
//         </Alert>
//       </Modal.Body>
//       <Modal.Footer>
//         <Button variant="secondary" onClick={close}>
//           Close
//         </Button>
//       </Modal.Footer>
//     </Modal>
//   );
// };

// export default StudentViewFeedback;


//test
import React, { useState, useEffect } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import "../../css/Contribution.css";
import CommentService from "../../services/comment.service";

const StudentViewFeedback = ({ contribution, open, close }) => {
  const [feedback, setFeedback] = useState("");

  useEffect(() => {
    if (open) {
      fetchStudentFeedback();
    }
  }, [open]);

  const fetchStudentFeedback = async () => {
    try {
      const comments = await CommentService.getStudentViewComment(
        contribution.submitter,
        contribution._id
      );
      if (comments.length > 0) {
        // Lấy feedback từ comment đầu tiên
        setFeedback(comments[0].content);
      } else {
        setFeedback("No feedback available.");
      }
    } catch (error) {
      console.error("Error fetching student feedback:", error);
    }
  };

  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-tile7">View Feedback</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="info">
          <h5>Title: {contribution.title}</h5>
          <p>Submitted by: {contribution.submitter}</p>
          <p>Event: {contribution.event}</p>
        </Alert>
        <Alert variant="light">
          <h5>Feedback</h5>
          <p>{feedback}</p>
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

export default StudentViewFeedback;
