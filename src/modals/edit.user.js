import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useEffect, useState } from "react";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import FacultyService from "../services/faculty.service";
import RoleService from "../services/role.service";
import UserService from "../services/user.service";

const EditUserForm = ({ user, open, close, refreshUsers }) => {
  const [facultyOptions, setFacultyOptions] = useState([]);
  const [roleOptions, setRoleOptions] = useState([]);
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userForm, setUserForm] = useState({
    username: user.username,
    mobile: user.mobile,
    password: "",
    avatar: null,
    confirmPassword: "",
    role: user.role,
    faculty: user.faculty,
  });

  const fetchFaculty = async () => {
    try {
      await FacultyService.getAllFaculties().then((response) => {
        localStorage.setItem("faculties", JSON.stringify(response.data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  const fetchRoles = async () => {
    try {
      await RoleService.viewRoles().then((response) => {
        localStorage.setItem("roles", JSON.stringify(response.data));
      });
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const initializeData = async () => {
      await fetchFaculty().then(() => {
        setFacultyOptions(JSON.parse(localStorage.getItem("faculties")));
      });
      await fetchRoles().then(() => {
        setRoleOptions(JSON.parse(localStorage.getItem("roles")));
      });
    };
    initializeData();
  }, []);

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
    console.log("Lock 2");
    const selectedFile = e.target.files[0];

    setUserForm((prevData) => ({
      ...prevData,
      avatar: selectedFile,
    }));
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;

    setUserForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (value) => {
    value.preventDefault();
    setIsSubmitting(true);

    console.log("User form data: ", userForm);

    const updatedUser = new FormData();
    updatedUser.append("id", user._id);
    updatedUser.append("email", user.email);
    updatedUser.append("username", userForm.username);
    updatedUser.append("mobile", userForm.mobile);
    updatedUser.append("avatar_image", userForm.avatar);
    updatedUser.append("role", userForm.role);
    updatedUser.append("faculty", userForm.faculty);
    updatedUser.append("password", userForm.password);

    try {
      await UserService.editUser(updatedUser).then(() => {
        refreshUsers();
      });

      close();
    } catch (error) {
      setError("Error updating user. Please try again.");
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
          <Modal.Title>Update User: {user.email}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="input-row">
            <div className="left-input">
              <TextField
                label="Username"
                onChange={handleFormChange}
                value={userForm.username}
                variant="outlined"
              />
            </div>
            <div className="right-input">
              <TextField
                label="Mobile"
                onChange={handleFormChange}
                value={userForm.mobile}
                variant="outlined"
              />
            </div>
          </div>
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
export default EditUserForm;
