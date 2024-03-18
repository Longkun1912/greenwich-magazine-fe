import React, { useState } from "react";
import { Link } from "react-router-dom";
import FacultyService from "../../services/faculty.service";

const CreateFaculty = () => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append('name', name);
      formData.append('description', description);
      formData.append('imageFile', imageFile);

      await FacultyService.createFaculty(formData, imageFile);
      // Sau khi tạo thành công, bạn có thể chuyển hướng về trang quản lý khoa học
    } catch (error) {
      console.error('Error creating faculty:', error);
    }
  };

  const handleImageChange = (e) => {
    setImageFile(e.target.files[0]);
  };

  return (
    <div className="content-container">
      <h1>Create Faculty</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Name:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Description:</label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
        </div>
        <div>
          <label>Image:</label>
          <input
            type="file"
            onChange={handleImageChange}
            required
          />
        </div>
        <button type="submit">Create</button>
      </form>
      {/* Liên kết để quay lại trang quản lý khoa học */}
      <Link to="/faculty">Back to Faculty</Link>
    </div>
  );
};

export default CreateFaculty;
