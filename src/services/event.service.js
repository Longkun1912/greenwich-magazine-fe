import axios from "axios";
import publicApi from "./api.service";

//All Event
const getAllEvent = () => {
    return axios.get(publicApi.event);
};

const eventService = {
    getAllEvent,
}

export default eventService;