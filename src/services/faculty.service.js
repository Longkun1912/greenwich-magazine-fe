import axios from "axios";
import publicApi from "../services/api.service";
import auth from "./auth.service";

// all faculty
const getAllFaculties = async () => {
  try {
    return axios.get(publicApi.faculty);
  } catch (error) {
    console.error("Error fetching all faculties:", error);
    throw error;
  }
};

// create faculty
export const postCreateFaculty = async (name, description, image) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    const token = auth.getCurrentAccessToken();
    const response = await axios.post(publicApi.faculty + "create", formData, {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error creating faculty:", error);
    throw error;
  }
};

// update faculty
export const putUpdateFaculty = async (id, name, description, image) => {
  try {
    const formData = new FormData();
    formData.append("name", name);
    formData.append("description", description);
    formData.append("image", image);

    const token = auth.getCurrentAccessToken();
    const response = await axios.put(publicApi.faculty + `update/${id}`, formData, {
      headers: {
        "x-access-token": token,
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (error) {
    console.error("Error updating faculty:", error);
    throw error;
  }
};

// delete faculty
const deleteFaculty = async (id) => {
  try {
    if (!id) {
      throw new Error("Missing Faculty ID");
    }
    await axios.delete(publicApi.faculty + `delete/${id}`, {
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
      },
    });
  } catch (error) {
    console.error("Error deleting faculty:", error);
    throw error;
  }
};

// get faculty by ID
export const getFacultyById = async (id) => {
  try {
    const response = await axios.get(`${publicApi.faculty}/${id}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching faculty by ID:", error);
    throw error;
  }
};

//getFacultiesByCoordinator
const getFacultiesByCoordinator = async (coordinatorId) => {
  try {
    const token = auth.getCurrentAccessToken(); // Lấy token từ auth service
    const response = await axios.get(`${publicApi.contribution}coordinator/${coordinatorId}`, {
      headers: {
        "x-access-token": token // Đảm bảo token được đính kèm vào header
      }
    });
    return response.data;
  } catch (error) {
    throw error;
  }
};

const facultyService = {
  postCreateFaculty,
  getAllFaculties,
  putUpdateFaculty,
  deleteFaculty,
  getFacultyById,
  getFacultiesByCoordinator,
};

export default facultyService;
