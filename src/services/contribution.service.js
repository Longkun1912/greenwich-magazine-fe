import axios from "axios";
import publicApi from "./api.service";

//all Contribution
const getAllContribution = () => {
    return axios.get(publicApi.contribution)
};


const contributionService = {
    getAllContribution,
}

export default contributionService;