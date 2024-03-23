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

const editUser = async (userForm, avatar_image) => {
  return axios.put(publicApi.user + "update-user", userForm, avatar_image, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const UserService = {
  viewSystemUsers,
};

export default UserService;
