import axios from "axios";
import publicApi from "./api.service";
import auth from "./auth.service";

//all Contribution
const getAllContribution = () => {
  return axios.get(publicApi.contribution + "contribution", {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const createContribution = (contribution) => {
  return axios.post(publicApi.contribution + "contribution", contribution, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const updateContribution = (contribution) => {
  return axios.put(publicApi.contribution + "contribution", contribution, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const deleteContribution = (id) => {
  return axios.delete(publicApi.contribution + "contribution/" + id, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const contributionService = {
  getAllContribution,
  createContribution,
  updateContribution,
  deleteContribution,
};

export default contributionService;
