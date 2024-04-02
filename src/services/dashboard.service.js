import axios from "axios";
import publicApi from "../services/api.service";
import auth from "./auth.service";

const viewNumberOfContributions = () => {
  return axios.get(publicApi.dashboard + "contributions", {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const viewPercentageOfContributionsInFaculties = () => {
  return axios.get(publicApi.dashboard + "faculties/contributions", {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const viewNumberOfContributorsForEachFaculty = () => {
  return axios.get(publicApi.dashboard + "faculties/contributors", {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const dashboardService = {
  viewNumberOfContributions,
  viewPercentageOfContributionsInFaculties,
  viewNumberOfContributorsForEachFaculty,
};

export default dashboardService;
