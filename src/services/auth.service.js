import axios from "axios";
import publicApi from "../services/api.service";

const register = (formData) => {
  return axios.post(publicApi.auth + "register", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

const login = (email, password) => {
  return axios
    .post(publicApi.auth + "login", {
      email,
      password,
    })
    .then((response) => {
      if (response.data.accessToken) {
        localStorage.setItem(
          "currentAuthenticatedUser",
          JSON.stringify(response.data)
        );
      }

      return response.data;
    });
};

const logout = () => {
  localStorage.removeItem("currentAuthenticatedUser");
  return axios.post(publicApi.auth + "logout");
};

const getCurrentUser = () => {
  return JSON.parse(localStorage.getItem("currentAuthenticatedUser"));
};

const getCurrentAccessToken = () => {
  const user = JSON.parse(localStorage.getItem("currentAuthenticatedUser"));
  return user.accessToken;
};

const auth = {
  register,
  login,
  logout,
  getCurrentUser,
  getCurrentAccessToken,
};

export default auth;
