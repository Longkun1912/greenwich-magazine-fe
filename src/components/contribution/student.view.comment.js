
//test
// import React, { useState, useEffect } from "react";
// import { Alert, Button, Modal } from "react-bootstrap";
// import "../../css/Contribution.css";
// import CommentService from "../../services/comment.service";

// const StudentViewFeedback = ({ contribution, open, close, currentUser }) => {
//   const [feedback, setFeedback] = useState([]);
//   const [error, setError] = useState(null);
//   const [authorized, setAuthorized] = useState(false); // State để xác định quyền truy cập

//   useEffect(() => {
//     const fetchStudentFeedback = async () => {
//       try {
//         const studentFeedback = await CommentService.getStudentViewComment(contribution.submitter, contribution.user_id);

//         // Kiểm tra xem người dùng hiện tại có quyền truy cập không
//         if (currentUser && currentUser.id === contribution.submitter) {
//           setFeedback(studentFeedback);
//           setAuthorized(true); // Đặt authorized thành true nếu người dùng hiện tại có quyền
//         } else {
//           setError("You are not authorized to view comments for this contribution.");
//         }
//       } catch (error) {
//         console.error("Error fetching student feedback:", error);
//         setFeedback([]);
//         setError(error.response.data.error); // Lưu trữ thông điệp lỗi từ response
//       }
//     };

//     if (open) {
//       fetchStudentFeedback();
//     }
//   }, [open, contribution, currentUser]);

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
//               ) : authorized ? ( // Kiểm tra quyền truy cập
//                 feedback.length > 0 ? (
//                   feedback.map(comment => (
//                     <div key={comment.id}>
//                       <span>{comment.content}</span>
//                     </div>
//                   ))
//                 ) : (
//                   <span>No Feedback</span>
//                 )
//               ) : null}
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


// test
// import React, { useState, useEffect } from "react";
// import Modal from "react-bootstrap/Modal";
// import CommentService from "../../services/comment.service";
// import "../../css/IndexForCoordinator.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const StudentViewComment = ({ open, close, contribution }) => {
//   const [comments, setComments] = useState([]);
//   const [loadingComments, setLoadingComments] = useState(false);
//   const [loadingTitle, setLoadingTitle] = useState(false);

//   useEffect(() => {
//     const fetchComments = async () => {
//       try {
//         setLoadingComments(true);
//         if (open && contribution && contribution.id) {
//           const response = await CommentService.getStudentViewComment(contribution.user_id);
//           if (Array.isArray(response)) {
//             setComments(response);
//           } else {
//             setComments([]);
//           }
//         } else {
//           setComments([]);
//         }
//       } catch (error) {
//         console.error("Error fetching comments:", error);
//         toast.error(`Error fetching comments: ${error.message}`);
//       } finally {
//         setLoadingComments(false);
//       }
//     };

//     if (open && contribution && contribution.id) {
//       fetchComments();
//     } else {
//       setComments([]);
//     }
//   }, [open, contribution]);

//   useEffect(() => {
//     setLoadingTitle(true);
//     if (contribution && contribution.title) {
//       setLoadingTitle(false);
//     }
//   }, [contribution]);

//   return (
//     <>
//       <Modal
//         aria-labelledby="contained-modal-title-vcenter"
//         centered
//         show={open}
//         onHide={close}
//         backdrop="static"
//         keyboard={false}
//       >
//         <Modal.Header closeButton>
//           <Modal.Title>
//             <div className="modal-title3">
//               <span>{loadingTitle ? "Loading..." : (contribution ? contribution.title : "")}</span>
//             </div>
//           </Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//           <div className="contribution-info">
//             <div className="info-row feedback-content">
//               <span className="info-label">Feedback: </span>
//               <div className="info-value">
//                 {loadingComments ? (
//                   <span>Loading...</span>
//                 ) : (
//                   comments.length > 0 ? (
//                     comments.map((comment) => (
//                       <div key={comment._id}>
//                         <span>{comment.content}</span>
//                       </div>
//                     ))
//                   ) : (
//                     <span>No Feedback!!</span>
//                   )
//                 )}
//               </div>
//             </div>
//           </div>
//         </Modal.Body>
//         <Modal.Footer>
//           <button className="btn btn-secondary" onClick={close}>
//             Close
//           </button>
//         </Modal.Footer>
//       </Modal>
//       <ToastContainer />
//     </>
//   );
// };

// export default StudentViewComment;
import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CommentService from "../../services/comment.service";
import "../../css/IndexForCoordinator.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const StudentViewComment = ({ open, close, contribution }) => {
  const [comments, setComments] = useState([]);
  const [loadingComments, setLoadingComments] = useState(false);
  const [loadingTitle, setLoadingTitle] = useState(true); // Set default to true

  useEffect(() => {
    const fetchComments = async () => {
      try {
        setLoadingComments(true);
        if (open && contribution && contribution.id) {
          const response = await CommentService.getStudentViewComment(contribution.user_id, contribution.id);
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
          <Modal.Title>
            <div className="modal-title3">
              <span>{loadingTitle ? "Loading..." : (contribution && contribution.title ? contribution.title : "")}</span>
            </div>
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="contribution-info">
            <div className="info-row feedback-content">
              <span className="info-label">Feedback: </span>
              <div className="info-value">
                {loadingComments ? (
                  <span>Loading...</span>
                ) : (
                  comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div key={index}>
                        <span>{comment.content}</span>
                      </div>
                    ))
                  ) : (
                    <span>No Feedback!!</span>
                  )
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
