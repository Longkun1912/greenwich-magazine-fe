import axios from "axios";
import publicApi from "../services/api.service";
import auth from "./auth.service";

const getStudentsInFacultyForChat = () => {
  const currentUser = auth.getCurrentUser();

  return axios.get(publicApi.chat + "students/" + currentUser.id, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const contactCoordinator = () => {
  const currentUser = auth.getCurrentUser();

  return axios.get(publicApi.chat + "coordinator/" + currentUser.id, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const getMessagesInSelectedChat = (chatId) => {
  return axios.get(publicApi.chat + "messages/" + chatId, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const sendMessage = (messageForm) => {
  return axios.post(publicApi.chat + "message", messageForm, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const editMessage = (messageId, messageForm) => {
  return axios.put(publicApi.chat + "message/" + messageId, messageForm, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteMessage = (messageId) => {
  return axios.delete(publicApi.chat + "message/" + messageId, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const ChatService = {
  getStudentsInFacultyForChat,
  contactCoordinator,
  getMessagesInSelectedChat,
  sendMessage,
  editMessage,
  deleteMessage,
};

export default ChatService;
