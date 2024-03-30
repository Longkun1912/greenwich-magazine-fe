import axios from "axios";
import publicApi from "../services/api.service";

// all faculty
const getAllFaculties = () => {
  return axios.get(publicApi.faculty);
};

// create faculty
export const postCreateFaculty = (name, description, image) => {
  let facultyForm = new FormData();
  facultyForm.append("name", name);
  facultyForm.append("description", description);
  facultyForm.append("image", image);

  return axios.post(publicApi.faculty + "create", facultyForm, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// update faculty
export const putUpdateFaculty = (id, name, description, image) => {
  let facultyForm = new FormData();
  facultyForm.append("name", name);
  facultyForm.append("description", description);
  facultyForm.append("image", image);

  return axios.put(publicApi.faculty + `update/${id}`, facultyForm, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};

// delete faculty
const deleteFaculty = async (id) => {
  try {
    if (!id) {
      throw new Error("Missing Faculty ID");
    }
    await axios.delete(publicApi.faculty + `delete/${id}`);
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

const facultyService = {
  postCreateFaculty,
  getAllFaculties,
  putUpdateFaculty,
  deleteFaculty,
  getFacultyById,
};

export default facultyService;
