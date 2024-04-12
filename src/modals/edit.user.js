import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import UserService from "../services/user.service";
import UserValidation from "../validation/user";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditUserForm = (props) => {
  const { open, close, user, refreshUsers, roleOptions, facultyOptions } =
    props;
  const [selectedRole, setSelectedRole] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [error, setError] = useState("");
  const [duplicateMobileError, setDuplicateMobileError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [userForm, setUserForm] = useState({
    username: user.username,
    mobile: user.mobile,
    password: user.password,
    avatar: null,
    confirmPassword: user.password,
    role: user.role,
    faculty: user.faculty,
    // Validation
    usernameError: "",
    mobileError: "",
    passwordError: "",
    confirmPasswordError: "",
    roleError: "",
    facultyError: "",
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
    setDuplicateMobileError("");
    setError("");

    setUserForm((prevData) => ({
      ...prevData,
      usernameError: "",
      mobileError: "",
      passwordError: "",
      confirmPasswordError: "",
      avatarError: "",
      roleError: "",
      facultyError: "",
    }));

    const { username, mobile, password, confirmPassword, role, faculty } =
      userForm;

    const usernameError = UserValidation.requiredField(username);
    const mobileError = UserValidation.requiredField(mobile);

    let passwordError = null;
    if (password) {
      passwordError = UserValidation.vpassword(password, confirmPassword);
    }

    let confirmPasswordError = null;
    if (confirmPassword) {
      confirmPasswordError = UserValidation.vpassword(
        confirmPassword,
        password
      );
    }

    const roleError = !role ? "Required." : "";
    const facultyError = !faculty ? "Please select a faculty." : "";

    if (
      usernameError ||
      mobileError ||
      passwordError ||
      confirmPasswordError ||
      roleError ||
      facultyError
    ) {
      setUserForm((prevData) => ({
        ...prevData,
        usernameError,
        mobileError,
        passwordError,
        confirmPasswordError,
        roleError,
        facultyError,
      }));

      setIsSubmitting(false);
      return;
    } else {
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
        await UserService.editUser(updatedUser);
        await refreshUsers();
        close();
        toast.success("Update user successfully");

        setIsSubmitting(false);
      } catch (error) {
        if (
          error.response.data.error ===
          "DuplicateMobileError: This mobile is already taken"
        ) {
          setDuplicateMobileError("Mobile already exists.");
        } else {
          setError(error.response.data.error);
        }
        setUserForm((prevData) => ({
          ...prevData,
        }));
        setIsSubmitting(false);
        return;
      }
    }
  };

  const {
    usernameError,
    mobileError,
    passwordError,
    confirmPasswordError,
    roleError,
    facultyError,
  } = userForm;

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
          <Modal.Title className="modal-title9">Update User: <br/>
            {user.email}
          </Modal.Title>
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
                validations={[UserValidation.requiredField]}
              />
              {usernameError && (
                <div className="error-message">{usernameError}</div>
              )}
            </div>
            <div className="right-input">
              <TextField
                label="Mobile"
                name="mobile"
                onChange={handleFormChange}
                value={userForm.mobile}
                variant="outlined"
                validations={[UserValidation.requiredField]}
              />
              {mobileError && (
                <div className="error-message">{mobileError}</div>
              )}
              {duplicateMobileError && (
                <Alert variant="danger">{duplicateMobileError}</Alert>
              )}
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
                  {roleError && <Alert variant="danger">{roleError}</Alert>}
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
                  {facultyError && (
                    <Alert variant="danger">{facultyError}</Alert>
                  )}
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
                onChange={handleFormChange}
                value={userForm.password}
                defaultValue={user.password}
                validations={[UserValidation.vpassword]}
              />
              {passwordError && (
                <div className="error-message">{passwordError}</div>
              )}
            </div>
            <div className="right-input">
              <TextField
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                onChange={handleFormChange}
                value={userForm.confirmPassword}
                defaultValue={user.password}
                validations={[UserValidation.vpassword]}
              />
              {confirmPasswordError && (
                <div className="error-message">{confirmPasswordError}</div>
              )}
            </div>
          </div>
          {error && <Alert variant="danger">{error}</Alert>}
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
