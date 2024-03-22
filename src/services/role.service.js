import axios from "axios";
import publicApi from "../services/api.service";
import auth from "./auth.service";

const viewRoles = async (req, res) => {
  return axios.get(publicApi.role + "roles", {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const RoleService = {
  viewRoles,
};

export default RoleService;
