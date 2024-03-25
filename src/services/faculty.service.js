import axios from 'axios';
import publicApi from '../services/api.service';

// all faculty
const getAllFaculties = () => {
    return axios.get(publicApi.faculty);
};

// create faculty 
export const postCreateFaculty  = (name, description, image) => {
    return axios.post(publicApi.faculty + "create", {name, description, image})
}

// update faculty
export const putUpdateFaculty  = (id, name, description, image) => {
    return axios.put(publicApi.faculty + `update/${id}`, {name, description, image})
}

// delete faculty
const deleteFaculty = async (id) => {
    try {
        if (!id) {
            throw new Error('Missing Faculty ID');
        }
        await axios.delete(publicApi.faculty + `delete/${id}`);
    } catch (error) {
        console.error('Error deleting faculty:', error);
        throw error;
    }
};


// get faculty by ID
export const getFacultyById = async (id) => {
    try {
        const response = await axios.get(`${publicApi.faculty}/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error fetching faculty by ID:', error);
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


