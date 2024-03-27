import axios from "axios";
import publicApi from "./api.service";
import auth from "./auth.service";

//All Event
const getAllEvent = () => {
  return axios.get(publicApi.event, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const eventService = {
  getAllEvent,
};

export default eventService;
