import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import { Alert } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import { isEmail } from "validator";
import UserService from "../services/user.service";

const requiredField = (value) => {
  if (!value) {
    return (
      <div className="alert alert-danger" role="alert">
        This field is required!
      </div>
    );
  }
};

const vemail = (value) => {
  if (!isEmail(value)) {
    return (
      <div className="alert alert-danger" role="alert">
        This is not a valid email.
      </div>
    );
  }
};

const vmobile = (value) => {
  if (value.length !== 10) {
    return (
      <div className="alert alert-danger" role="alert">
        Mobile number must be valid.
      </div>
    );
  }
};

const vpassword = (value, confirm_password) => {
  if (value.length < 5 || value.length > 100) {
    return (
      <div className="alert alert-danger" role="alert">
        The password must be between 5 and 100 characters.
      </div>
    );
  } else if (value && value !== confirm_password) {
    return (
      <div className="alert alert-danger" role="alert">
        Passwords do not match.
      </div>
    );
  }
};

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
    // Validation
    usernameError: "",
    emailError: "",
    mobileError: "",
    passwordError: "",
    confirmPasswordError: "",
    avatarError: "",
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

    setUserForm((prevData) => ({
      ...prevData,
      usernameError: "",
      emailError: "",
      mobileError: "",
      passwordError: "",
      confirmPasswordError: "",
      avatarError: "",
      roleError: "",
      facultyError: "",
    }));

    const {
      username,
      email,
      mobile,
      password,
      confirmPassword,
      role,
      faculty,
      avatar,
    } = userForm;

    const usernameError = requiredField(username);
    const emailError = requiredField(email) || vemail(email);
    const mobileError = requiredField(mobile) || vmobile(mobile);
    const passwordError =
      requiredField(password) || vpassword(password, confirmPassword);
    const confirmPasswordError =
      requiredField(confirmPassword) || vpassword(confirmPassword, password);
    const avatarError = !avatar ? "Please upload an avatar." : "";
    const roleError = !role ? "Required." : "";
    const facultyError = !faculty ? "Please select a faculty." : "";

    if (
      usernameError ||
      emailError ||
      mobileError ||
      passwordError ||
      confirmPasswordError ||
      avatarError ||
      roleError ||
      facultyError
    ) {
      setUserForm((prevData) => ({
        ...prevData,
        usernameError,
        emailError,
        mobileError,
        passwordError,
        confirmPasswordError,
        avatarError,
        roleError,
        facultyError,
      }));
      setIsSubmitting(false);
      return;
    } else {
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
        close();

        setIsSubmitting(false);
      } catch (error) {
        setError(error);
        console.error("Error creating user:", error);

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
    emailError,
    mobileError,
    passwordError,
    confirmPasswordError,
    avatarError,
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
                validations={[requiredField]}
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
                validations={[requiredField]}
              />
              {mobileError && (
                <div className="error-message">{mobileError}</div>
              )}
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

              {avatarError && <Alert> {avatarError} </Alert>}
            </div>
          </div>

          <div style={{ marginBottom: "2vh" }}>
            <TextField
              label="Email"
              name="email"
              onChange={handleFormChange}
              value={userForm.email}
              variant="outlined"
              fullWidth
              validations={[requiredField]}
            />

            {emailError && <div className="error-message">{emailError}</div>}
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
                  {roleError && <Alert>{roleError}</Alert>}
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

                  {facultyError && <Alert>{facultyError}</Alert>}
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
                variant="outlined"
                validations={[requiredField]}
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
                variant="outlined"
                validations={[requiredField]}
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

export default UserAddingForm;
