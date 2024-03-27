import axios from "axios";
import publicApi from "./api.service";
import auth from "./auth.service";

//all Contribution
const getAllContribution = () => {
  return axios.get(publicApi.contribution);
};

const createContribution = (contribution) => {
  return axios.post(publicApi.contribution + "contribution", contribution, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

const contributionService = {
  getAllContribution,
  createContribution,
};

export default contributionService;
