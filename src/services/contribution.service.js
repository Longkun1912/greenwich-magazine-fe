import axios from "axios";
import publicApi from "./api.service";
import auth from "./auth.service";

const downloadDocument = (documentName) => {
  return axios.get(
    publicApi.contribution + "contribution/download/" + documentName,
    {
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
      },
      responseType: "blob",
    }
  );
};

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

// Student
const editContribution = (contribution) => {
  return axios.put(
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

// Student
const removeContribution = (id) => {
  return axios.delete(publicApi.contribution + "student/contribution/" + id, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
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

//Coordinator
//getAllContributionByFacultyId
const getAllContributionByFaculty = (facultyId) => {
  return axios.get(`${publicApi.contribution}coordinator/${facultyId}`, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

//Edit State, Status For Coordinator
const EditForCoordinator = (contributionId, editForm) => {
  return axios.put(
    publicApi.contribution + "coordinator",
    { id: contributionId, ...editForm }, // Thêm `id` vào editForm
    {
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
      },
    }
  );
};


//Edit Event For Coordinator
const updateEventForCoordinator = (eventId, eventDetails) => {
  return axios.put(
    publicApi.event + `/${eventId}`,
    eventDetails,
    {
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
        "Content-Type": "application/json", // Đặt Content-Type là application/json cho dữ liệu gửi đi
      },
    }
  );
};

const getAllEvents = () => {
  return axios.get(publicApi.event, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};


//Guest
const getAllContributionForGuest = (facultyId) => {
  return axios.get(publicApi.contributionForGuest + `${facultyId}`, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
};

const contributionService = {
  downloadDocument,
  getAllContribution,
  viewContributionsInFaculty,
  createContribution,
  submitContribution,
  editContribution,
  updateContribution,
  removeContribution,
  deleteContribution,
  getAllContributionByFaculty,
  EditForCoordinator,
  getAllContributionForGuest,
  updateEventForCoordinator,
  getAllEvents,
};

export default contributionService;
