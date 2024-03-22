import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import FacultyService from "../services/faculty.service";
import RoleService from "../services/role.service";
import UserService from "../services/user.service";

const EditUserForm = ({ user, open, close }) => {
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchFaculty = async () => {
    await FacultyService.getAllFaculties().then((response) => {
      setFacultyOptions(response.data.name);
    });
  };
  const fetchRoles = async () => {
    await RoleService.viewRoles().then((response) => {
      setRoleOptions(response.data.name);
    });
  };

  useEffect(() => {
    fetchFaculty();
    fetchRoles();
  });

  const handleSelectRole = (e) => {
    setSelectedRole(e.target.value);
  };

  const handleSelectedFaculty = (e) => {
    setSelectedFaculty(e.target.value);
  };

  // Handle image upload
  const [selectedImage, setSelectedImage] = useState(null);

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const handleSubmit = async (value) => {
    const updatedUser = {
      id: user.id,
      username: value.username,
      mobile: value.mobile,
      password: value.password,
      role: selectedRole,
      faculty: selectedFaculty,
    };

    try {
      setIsSubmitting(true);
      await UserService.updateUser(updatedUser, selectedImage);

      close();
    } catch (error) {
      setError(error.response.data.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={open}
      onHide={close}
      backdrop="static"
      keyboard={false}
    >
      <Form>
        <Modal.Header closeButton>
          <Modal.Title>Update User: {user.email}</Modal.Title>
        </Modal.Header>
        <Modal.Body></Modal.Body>
        <Modal.Footer>
          <button className="btn btn-primary" type="submit">
            {isSubmitting ? "Updating..." : "Save changes"}
          </button>
          <button className="btn btn-secondary" onClick={close}>
            Close
          </button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};
export default EditUserForm;
