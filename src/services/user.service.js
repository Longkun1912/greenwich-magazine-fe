import axios from "axios";
import publicApi from "../services/api.service";
import auth from "./auth.service";

const viewSystemUsers = (req, res) => {
  return axios.get(publicApi.user + "users", {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const viewStudentByFaculty = (id) => {
  return axios.get(publicApi.user + "students/" + id, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const createUser = (userForm) => {
  return axios.post(publicApi.user + "user", userForm, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const editUser = (userForm) => {
  return axios.put(publicApi.user + "user", userForm, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateStudent = (studentForm) => {
  return axios.put(publicApi.user + "student", studentForm, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteUser = (userId) => {
  return axios.delete(publicApi.user + "user/" + userId, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const UserService = {
  viewSystemUsers,
  viewStudentByFaculty,
  createUser,
  editUser,
  updateStudent,
  deleteUser,
};

export default UserService;
