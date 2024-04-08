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
export const postComment = async (contributionId, commentContent) => {
    try {
        // Xây dựng payload cho comment
        const commentPayload = {
            content: commentContent
        };

        // Gửi yêu cầu POST để tạo mới comment
        const response = await axios.post(publicApi.comment + `${contributionId}`, commentPayload, {
            headers: {
                "x-access-token": auth.getCurrentAccessToken(),
            },
        });

        // Trả về dữ liệu từ phản hồi
        return response.data;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error posting comment:", error);
        throw error;
    }
};


// Edit Comment
export const putComment = async (commentId, newCommentContent) => {
    try {
        // Xây dựng payload cho bình luận mới
        const updatedCommentPayload = {
            content: newCommentContent
        };
        // Gửi yêu cầu PUT để cập nhật bình luận
        const response = await axios.put(publicApi.comment + `${commentId}`, updatedCommentPayload, {
            headers: {
                "x-access-token": auth.getCurrentAccessToken(),
            },
        });
        // Trả về dữ liệu từ phản hồi
        return response.data;
    } catch (error) {
        // Xử lý lỗi nếu có
        console.error("Error updating comment:", error);
        throw error;
    }
};


//delete Comment
export const deleteComment = async (commentId) => {
    try {
        // Gửi yêu cầu DELETE để xóa comment
        const response = await axios.delete(publicApi.comment + `${commentId}`, {
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
export const getStudentViewComment = async (idUser, idContribution) => {
    try {
        const response = await axios.get(publicApi.studentComment, {
            params: {
                idUser: idUser,
                idContribution: idContribution
            },
            headers: {
                "x-access-token": auth.getCurrentAccessToken(),
            },
        });
        return response.data;
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
  