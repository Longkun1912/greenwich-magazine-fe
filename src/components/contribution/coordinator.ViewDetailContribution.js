import React, { useState, useEffect } from "react";
import Modal from "react-bootstrap/Modal";
import CommentService from "../../services/comment.service";
import "../../css/IndexForCoordinator.css";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const ContributionInfo = ({ open, close, contribution }) => {
  const [comments, setComments] = useState([]); // State để lưu trữ các bình luận
  const [editingCommentId, setEditingCommentId] = useState(null); // State để lưu trữ ID của bình luận đang chỉnh sửa
  const [editedCommentContent, setEditedCommentContent] = useState(""); // State để lưu trữ nội dung của bình luận đang chỉnh sửa

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

  // Handler để mở chế độ chỉnh sửa cho một bình luận cụ thể
  const handleEditComment = (commentId, content) => {
    setEditingCommentId(commentId);
    setEditedCommentContent(content);
  };

  // Handler để lưu các thay đổi của bình luận đã được chỉnh sửa
  const handleSaveComment = async (commentId) => {
    try {
      await CommentService.putComment(commentId, editedCommentContent); // Truyền nội dung mới của bình luận
      setEditingCommentId(null);
      // Refresh comments after editing
      const response = await CommentService.getAllComment(contribution.id);
      setComments(response.data);
      toast.success("Update comment successfully!");
    } catch (error) {
      console.error("Error updating comment:", error);
      toast.success("Error updating comment:", error);

    }
  };

  // Handler to delete a comment
  const handleDeleteComment = async (commentId) => {
    try {
      await CommentService.deleteComment(commentId); // Gọi hàm xóa bình luận từ CommentService
      // Sau khi xóa thành công, cần cập nhật danh sách bình luận bằng cách gọi lại API để lấy danh sách mới
      const response = await CommentService.getAllComment(contribution.id);
      setComments(response.data);
      toast.success("Delete comment successfully!");
    } catch (error) {
      console.error("Error deleting comment:", error);
      toast.success("Error deleting comment:", error);
    }
  };

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
          <div className="info-row feedback-content">
            <span className="info-label">Feedback: </span>
            <div className="info-value">
              {comments.length > 0 ? (
                comments.map(comment => (
                  <div key={comment.id}>
                    {editingCommentId === comment.id ? (
                      <div>
                        <input
                          type="textarea"
                          value={editedCommentContent}
                          onChange={(e) => setEditedCommentContent(e.target.value)}
                        />
                        <button className="btn-save" onClick={() => handleSaveComment(comment._id)}>Save</button>
                        <button className="btn-cancel" onClick={() => setEditingCommentId(null)}>Cancel</button>
                      </div>
                    ) : (
                      <div>
                        <span>{comment.content}</span>
                        <button className="btn-edit" onClick={() => handleEditComment(comment.id, comment.content)}>Edit</button>
                        <button className="btn-delete" onClick={() => handleDeleteComment(comment._id)}>Delete</button> 
                      </div>
                    )}
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
<ToastContainer/>


// //test
// import React, { useState, useEffect } from "react";
// import Modal from "react-bootstrap/Modal";
// import CommentService from "../../services/comment.service";
// import EditCommentCoordinator from "./coordinator.EditComment"; // Import EditCommentCoordinator component
// import "../../css/IndexForCoordinator.css";
// import { ToastContainer, toast } from "react-toastify";
// import "react-toastify/dist/ReactToastify.css";

// const ContributionInfo = ({ open, close, contribution }) => {
//   const [comments, setComments] = useState([]); // State to store comments
//   const [showEditModal, setShowEditModal] = useState(false); // State to control edit modal visibility
//   const [editingCommentId, setEditingCommentId] = useState(null); // State to hold the ID of the comment being edited

//   // Effect hook to fetch comments when contribution changes or when modal is opened

//   const fetchComments = async (contributionId) => {
//     try {
//       const response = await CommentService.getAllComment(contributionId);
//       return response.data;
//     } catch (error) {
//       console.error("Error fetching comments:", error);
//       throw error; // Throw error to handle it in the parent component if necessary
//     }
//   };

//   useEffect(() => {
//     if (open && contribution) {
//       fetchComments();
//     }
//   }, [open, contribution]);

//   // Handler to navigate to EditCommentCoordinator component
//   const handleEdit = (commentId) => {
//     setEditingCommentId(commentId); // Set the ID of the comment being edited
//     setShowEditModal(true); // Show the edit modal
//   };

//   // Handler to delete a comment
//   const handleDeleteComment = async (commentId) => {
//     try {
//       await CommentService.deleteComment(commentId);
//       const response = await CommentService.getAllComment(contribution.id);
//       setComments(response.data);
//       toast.success("Delete comment successfully!");
//     } catch (error) {
//       console.error("Error deleting comment:", error);
//       toast.error("Error deleting comment:", error);
//     }
//   };

//   return (
//     <Modal
//       aria-labelledby="contained-modal-title-vcenter"
//       centered
//       show={open}
//       onHide={close}
//       backdrop="static"
//       keyboard={false}
//     >
//       <Modal.Header closeButton>
//         <Modal.Title>
//           <div className="modal-title3">
//             <span>{contribution.title}</span>
//           </div>
//         </Modal.Title>
//       </Modal.Header>
//       <Modal.Body>
//         <div className="contribution-info">
//           <div className="info-row">
//             <span className="info-label">Id: </span>
//             <span className="info-value">{contribution.id}</span>
//           </div>
//           <div className="info-row feedback-content">
//             <span className="info-label">Feedback: </span>
//             <div className="info-value">
//               {comments.length > 0 ? (
//                 comments.map((comment) => (
//                   <div key={comment.id}>
//                     <span>{comment.content}</span>
//                     <button
//                       className="btn-edit"
//                       onClick={() => handleEdit(comment.id)} // Call handleEdit with comment ID
//                     >
//                       Edit
//                     </button>
//                     <button
//                       className="btn-delete"
//                       onClick={() => handleDeleteComment(comment.id)}
//                     >
//                       Delete
//                     </button>
//                   </div>
//                 ))
//               ) : (
//                 <span>No Feedback!!</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </Modal.Body>
//       <Modal.Footer>
//         <button className="btn btn-secondary" onClick={close}>
//           Close
//         </button>
//       </Modal.Footer>
      
//       {/* Render EditCommentCoordinator component */}
//       <EditCommentCoordinator
//         show={showEditModal}
//         handleClose={() => setShowEditModal(false)}
//         commentId={editingCommentId}
//         fetchContributions={fetchComments}
//         editingComment={comments.find(comment => comment.id === editingCommentId)}
//       />
//     </Modal>
//   );
// };

// export default ContributionInfo;
