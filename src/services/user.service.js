import axios from "axios";
import publicApi from "../services/api.service";
import auth from "./auth.service";

const viewSystemUsers = async (req, res) => {
  return axios.get(publicApi.user + "users", {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const createUser = async (userForm) => {
  return axios.post(publicApi.user + "user", userForm, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const editUser = async (userForm) => {
  return axios.put(publicApi.user + "user", userForm, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteUser = async (userId) => {
  return axios.delete(publicApi.user + "user/" + userId, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const UserService = {
  viewSystemUsers,
  createUser,
  editUser,
  deleteUser,
};

export default UserService;
