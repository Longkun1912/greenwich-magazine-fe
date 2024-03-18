import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import FacultyService from '../../services/faculty.service';

const EditFaculty = () => {
  const { id } = useParams();
  const [faculty, setFaculty] = useState({
    name: '',
    image: '',
    description: ''
  });
  useEffect(() => {
    const fetchFaculty = async () => {
      try {
        const response = await FacultyService.getFacultyById(id);
        setFaculty(response.data);
      } catch (error) {
        console.error('Error fetching faculty:', error);
      }
    };

    fetchFaculty();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFaculty(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await FacultyService.updateFaculty(id, faculty);
      // Redirect or show success message after successful update
    } catch (error) {
      console.error('Error updating faculty:', error);
      // Handle error
    }
  };

  return (
    <div>
      <h1>Edit Faculty</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            name="name"
            value={faculty.name}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Image URL:</label>
          <input
            type="text"
            name="image"
            value={faculty.image}
            onChange={handleChange}
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            name="description"
            value={faculty.description}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Save Changes</button>
      </form>
    </div>
  );
};

export default EditFaculty;
