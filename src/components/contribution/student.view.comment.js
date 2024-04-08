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


// //test
// import React, { useState, useEffect } from "react";
// import { Alert, Button, Modal } from "react-bootstrap";
// import "../../css/Contribution.css";
// import CommentService from "../../services/comment.service";

// const StudentViewFeedback = ({ contribution, open, close }) => {
//   const [feedback, setFeedback] = useState("");

//   useEffect(() => {
//     if (open) {
//       fetchStudentFeedback();
//     }
//   }, [open]);

//   const fetchStudentFeedback = async () => {
//     try {
//       const studentFeedback = await CommentService.getStudentViewComment(contribution.submitter, contribution._id);
//       setFeedback(studentFeedback);
//     } catch (error) {
//       console.error("Error fetching student feedback:", error);
//       setFeedback("No feedback available.");
//     }
//   };

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
//           <p>Feedback here: {feedback}</p>
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

// //tsst
// import React, { useState, useEffect } from "react";
// import { Alert, Button, Modal } from "react-bootstrap";
// import "../../css/Contribution.css";
// import CommentService from "../../services/comment.service";

// const StudentViewFeedback = ({ contribution, open, close }) => {
//   const [feedback, setFeedback] = useState([]);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     const fetchStudentFeedback = async () => {
//       try {
//         const studentFeedback = await CommentService.getStudentViewComment(contribution.submitter, contribution.id);
//         setFeedback(studentFeedback);
//         setError(null);
//       } catch (error) {
//         console.error("Error fetching student feedback:", error);
//         setFeedback([]);
//         setError(error.response.data.error); // Lưu trữ thông điệp lỗi từ response
//       }
//     };

//     if (open) {
//       fetchStudentFeedback();
//     }
//   }, [open, contribution]);

//   return (
//     <Modal show={open} onHide={close}>
//       <Modal.Header closeButton>
//         <Modal.Title className="modal-title7">View Feedback</Modal.Title>
//       </Modal.Header>

//       <Modal.Body>
//         <Alert variant="info">
//           <h5>Title: {contribution.title}</h5>
//           <p>Submitted by: {contribution.submitter}</p>
//           <p>Event: {contribution.event}</p>
//         </Alert>
//         <Alert variant="light">
//           <div className="info-row">
//             <span className="info-label">Feedback: </span>
//             <div className="info-value">
//               {error ? ( // Hiển thị thông báo lỗi nếu có
//                 <span>Error: {error}</span>
//               ) : feedback.length > 0 ? (
//                 feedback.map(comment => (
//                   <div key={comment.id}>
//                     <span>{comment.content}</span>
//                   </div>
//                 ))
//               ) : (
//                 <span>No Feedback</span>
//               )}
//             </div>
//           </div>
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

const StudentViewFeedback = ({ contribution, open, close, currentUser }) => {
  const [feedback, setFeedback] = useState([]);
  const [error, setError] = useState(null);
  const [authorized, setAuthorized] = useState(false); // State để xác định quyền truy cập

  useEffect(() => {
    const fetchStudentFeedback = async () => {
      try {
        const studentFeedback = await CommentService.getStudentViewComment(contribution.submitter, contribution.id);

        // Kiểm tra xem người dùng hiện tại có quyền truy cập không
        if (currentUser && currentUser.id === contribution.submitter) {
          setFeedback(studentFeedback);
          setAuthorized(true); // Đặt authorized thành true nếu người dùng hiện tại có quyền
        } else {
          setError("You are not authorized to view comments for this contribution.");
        }
      } catch (error) {
        console.error("Error fetching student feedback:", error);
        setFeedback([]);
        setError(error.response.data.error); // Lưu trữ thông điệp lỗi từ response
      }
    };

    if (open) {
      fetchStudentFeedback();
    }
  }, [open, contribution, currentUser]);

  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title className="modal-title7">View Feedback</Modal.Title>
      </Modal.Header>

      <Modal.Body>
        <Alert variant="info">
          <h5>Title: {contribution.title}</h5>
          <p>Submitted by: {contribution.submitter}</p>
          <p>Event: {contribution.event}</p>
        </Alert>
        <Alert variant="light">
          <div className="info-row">
            <span className="info-label">Feedback: </span>
            <div className="info-value">
              {error ? ( // Hiển thị thông báo lỗi nếu có
                <span>Error: {error}</span>
              ) : authorized ? ( // Kiểm tra quyền truy cập
                feedback.length > 0 ? (
                  feedback.map(comment => (
                    <div key={comment.id}>
                      <span>{comment.content}</span>
                    </div>
                  ))
                ) : (
                  <span>No Feedback</span>
                )
              ) : null}
            </div>
          </div>
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
