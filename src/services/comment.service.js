import axios from "axios";
import publicApi from "../services/api.service";
import auth from "./auth.service";

//get all comment in coordinator
const getAllComment = (contributionId) => {
  return axios.get(publicApi.comment + `${contributionId}`, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

//Create Comment
const postComment = async (contributionId, commentContent) => {
  try {
    // Xây dựng payload cho comment
    const commentPayload = {
      content: commentContent,
    };

    // Gửi yêu cầu POST để tạo mới comment
    const response = await axios.post(
      publicApi.comment + `${contributionId}`,
      commentPayload,
      {
        headers: {
          "x-access-token": auth.getCurrentAccessToken(),
        },
      }
    );

    // Trả về dữ liệu từ phản hồi
    return response.data;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error posting comment:", error);
    throw error;
  }
};

// Edit Comment
const putComment = async (commentId, newCommentContent) => {
  try {
    // Xây dựng payload cho comment cập nhật
    const commentPayload = {
      content: newCommentContent,
    };

    // Gửi yêu cầu PUT để cập nhật comment
    const response = await axios.put(
      publicApi.comment + `${commentId}`,
      commentPayload,
      {
        headers: {
          "x-access-token": auth.getCurrentAccessToken(),
        },
      }
    );
    // Trả về dữ liệu từ phản hồi
    return response.data;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error updating comment:", error);
    throw error;
  }
};

//delete Comment
const deleteComment = async (commentId) => {
  try {
    // Gửi yêu cầu DELETE để xóa comment
    const response = await axios.delete(`${publicApi.comment}${commentId}`, {
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
      },
    });
    // Trả về dữ liệu từ phản hồi
    return response.data;
  } catch (error) {
    // Xử lý lỗi nếu có
    console.error("Error deleting comment:", error);
    throw error;
  }
};

//student view Comment
const getStudentViewComment = async (idContribution) => {
  try {
    const response = await axios.get(publicApi.studentComment, {
      params: {
        idContribution: idContribution,
      },
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
      },
    });

    // Kiểm tra mã trạng thái của response
    if (response.status === 200) {
      // Kiểm tra xem response.data có tồn tại không
      if (response.data) {
        return response.data;
      } else {
        throw new Error("No data returned from the server.");
      }
    } else if (response.status === 403) {
      // Nếu mã trạng thái là 403, nghĩa là người dùng không có quyền truy cập
      throw new Error(
        "You are not authorized to view comments for this contribution."
      );
    } else {
      // Xử lý các trường hợp khác nếu cần thiết
      throw new Error(
        `Error fetching student view comment: ${response.statusText}`
      );
    }
  } catch (error) {
    console.error("Error getting student view comment:", error);
    throw error;
  }
};

const CommentService = {
  getAllComment,
  postComment,
  putComment,
  deleteComment,
  getStudentViewComment,
};

export default CommentService;
