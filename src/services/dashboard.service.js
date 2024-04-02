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

const dashboardService = {
  viewNumberOfContributions,
};

export default dashboardService;
