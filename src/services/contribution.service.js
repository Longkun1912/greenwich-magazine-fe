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

const viewContributionsInFaculty = () => {
  const currentUser = auth.getCurrentUser();
  return axios.get(publicApi.contribution + "student/" + currentUser.id, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

// Admin
const createContribution = (contribution) => {
  return axios.post(publicApi.contribution + "contribution", contribution, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
      "Content-Type": "multipart/form-data",
    },
  });
};

// Student
const submitContribution = (contribution) => {
  return axios.post(
    publicApi.contribution + "student/contribution",
    contribution,
    {
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
        "Content-Type": "multipart/form-data",
      },
    }
  );
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

//test
const getAllContributionByFaculty = (facultyId) => {
  return axios.get(`${publicApi.contribution}coordinator/${facultyId}`, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const contributionService = {
  getAllContribution,
  viewContributionsInFaculty,
  createContribution,
  submitContribution,
  updateContribution,
  deleteContribution,
  getAllContributionByFaculty,
};

export default contributionService;
