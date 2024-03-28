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

//create Event
export const postCreateEvent = (name, description, firstDeadLineDate, finalDeadLineDate) => {
  return axios.post(publicApi.event, { name, description, firstDeadLineDate, finalDeadLineDate }, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
}

//edit Event
export const putUpdateEvent = (updatedEvent) => {
  const { id, name, description, firstDeadLineDate, finalDeadLineDate } = updatedEvent;
  return axios.put(`${publicApi.event}/${id}`, {
    name,
    description,
    firstDeadLineDate,
    finalDeadLineDate
  }, {
    headers: {
      "x-access-token": auth.getCurrentAccessToken(),
    },
  });
}


// delete Event
const deleteEvent = async (id) => {
  try {
    if (!id) {
      throw new Error('Missing Event ID');
    }
    await axios.delete(`${publicApi.event}/${id}`, {
      headers: {
        "x-access-token": auth.getCurrentAccessToken(),
      },
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    throw error;
  }
};


const eventService = {
  getAllEvent,
  postCreateEvent,
  deleteEvent,
  putUpdateEvent,
};

export default eventService;
