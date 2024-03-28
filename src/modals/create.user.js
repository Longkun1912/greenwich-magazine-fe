import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import UserService from "../services/user.service";

const UserAddingForm = ({
  open,
  close,
  roleOptions,
  facultyOptions,
  fetchUsers,
}) => {
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userForm, setUserForm] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    avatar: null,
    confirmPassword: "",
    role: null,
    faculty: null,
  });

  const handleSelectRole = (e) => {
    setSelectedRole(e.target.value);

    setUserForm((prevData) => ({
      ...prevData,
      role: e.target.value,
    }));
  };

  const handleSelectFaculty = (e) => {
    setSelectedFaculty(e.target.value);

    setUserForm((prevData) => ({
      ...prevData,
      faculty: e.target.value,
    }));
  };

  // Handle image upload

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setUserForm((prevData) => ({
      ...prevData,
      avatar: file,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setUserForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const user = new FormData();
    user.append("email", userForm.email);
    user.append("username", userForm.username);
    user.append("mobile", userForm.mobile);
    user.append("avatar_image", userForm.avatar);
    user.append("role", userForm.role);
    user.append("faculty", userForm.faculty);
    user.append("password", userForm.password);

    try {
      await UserService.createUser(user);
      await fetchUsers();
      setIsSubmitting(false);
      close();
    } catch (error) {
      setError("Error creating user. Please try again.");
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
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Create New User</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-row">
            <div className="left-input">
              <TextField
                label="Username"
                name="username"
                onChange={handleFormChange}
                value={userForm.username}
                variant="outlined"
              />
            </div>
            <div className="right-input">
              <TextField
                label="Mobile"
                name="mobile"
                onChange={handleFormChange}
                value={userForm.mobile}
                variant="outlined"
              />
            </div>
          </div>
          <div className="input-row">
            <div className="avatar-field">
              <h5>Upload avatar</h5>
              <input
                type="file"
                className="avatar-input"
                accept="image/*"
                onChange={(e) => handleImageChange(e)}
                name="avatar"
                sx={{ gridColumn: "span 2" }}
              />
            </div>
            <div>
              <TextField
                label="Email"
                name="email"
                onChange={handleFormChange}
                value={userForm.email}
                variant="outlined"
              />
            </div>
          </div>

          <div className="input-row">
            <div className="left-select">
              {roleOptions && (
                <FormControl fullWidth>
                  <InputLabel>Role</InputLabel>
                  <Select
                    label="Role"
                    value={userForm.role}
                    onChange={(e) => handleSelectRole(e)}
                  >
                    <MenuItem value="" disabled>
                      <em>Select role</em>
                    </MenuItem>
                    {roleOptions.map((role) => (
                      <MenuItem key={role._id} value={role.name}>
                        {role.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>

            <div className="right-select">
              {facultyOptions && (
                <FormControl fullWidth>
                  <InputLabel>Faculty</InputLabel>
                  <Select
                    label="Faculty"
                    value={userForm.faculty}
                    onChange={(e) => handleSelectFaculty(e)}
                  >
                    <MenuItem value="" disabled>
                      <em>Select faculty</em>
                    </MenuItem>
                    {facultyOptions.map((faculty) => (
                      <MenuItem key={faculty._id} value={faculty.name}>
                        {faculty.name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </div>
          </div>

          <div className="input-row">
            <div className="left-input">
              <TextField
                label="Password"
                name="password"
                type="password"
                // autoComplete="current-password"
                onChange={handleFormChange}
                value={userForm.password}
              />
            </div>
            <div className="right-input">
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                onChange={handleFormChange}
                value={userForm.confirmPassword}
              />
            </div>
          </div>
        </Modal.Body>
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

export default UserAddingForm;
