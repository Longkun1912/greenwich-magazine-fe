import React, { useState } from "react";
import { Alert } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import Modal from "react-bootstrap/Modal";
import UserService from "../services/user.service";
import UserValidation from "../validation/user";

const EditProfileForm = ({ user, open, close, fetchUserDetails }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [duplicateMobileError, setDuplicateMobileError] = useState("");

  const [profile, setProfile] = useState({
    username: user.username,
    mobile: user.mobile,
    avatar: user.avatar,
    password: user.password,
    confirmPassword: user.password,
    // Validation
    usernameError: "",
    mobileError: "",
    avatarError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;

    setProfile((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleImageChange = (e) => {
    const selectedFile = e.target.files[0];

    setProfile((prevData) => ({
      ...prevData,
      avatar: selectedFile,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setError("");
    setDuplicateMobileError("");

    setProfile((prevData) => ({
      ...prevData,
      usernameError: "",
      mobileError: "",
      avatarError: "",
      passwordError: "",
      confirmPasswordError: "",
    }));

    const { username, mobile, avatar, password, confirmPassword } = profile;

    const usernameError = UserValidation.requiredField(username);
    const mobileError = UserValidation.requiredField(mobile);
    const avatarError = !avatar ? "Please select an avatar" : "";

    let passwordError = null;
    if (password) {
      passwordError = UserValidation.vpassword(password, confirmPassword);
    }

    let confirmPasswordError = null;
    if (confirmPassword) {
      confirmPasswordError = UserValidation.vpassword(
        password,
        confirmPassword
      );
    }

    if (
      usernameError ||
      mobileError ||
      avatarError ||
      passwordError ||
      confirmPasswordError
    ) {
      setProfile((prevData) => ({
        ...prevData,
        usernameError,
        mobileError,
        avatarError,
        passwordError,
        confirmPasswordError,
      }));
      setIsSubmitting(false);
      return;
    } else {
      const profileForm = new FormData();
      profileForm.append("id", user.id);
      profileForm.append("username", username);
      profileForm.append("mobile", mobile);
      profileForm.append("avatar_image", avatar);
      profileForm.append("password", password);

      try {
        await UserService.editProfile(profileForm);
        await fetchUserDetails();
        setIsSubmitting(false);
        close();
      } catch (error) {
        if (
          error.response.data.error ===
          "DuplicateMobileError: This mobile is already taken"
        ) {
          setDuplicateMobileError("Mobile already exists.");
        } else {
          setError(error.response.data.error);
        }
        setProfile((prevData) => ({
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
    avatarError,
    passwordError,
    confirmPasswordError,
  } = profile;

  return (
    <Modal show={open} onHide={close}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Profile</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={profile.username}
              onChange={handleChange}
              validations={[UserValidation.requiredField]}
            />
            {usernameError && (
              <div className="error-message">{usernameError}</div>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Mobile:</Form.Label>
            <Form.Control
              type="text"
              name="mobile"
              value={profile.mobile}
              onChange={handleChange}
              validations={[UserValidation.requiredField]}
            />
            {mobileError && <div className="error-message">{mobileError}</div>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Avatar:</Form.Label>
            <Form.Control
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleImageChange}
            />
            {avatarError && <Alert variant="danger">{avatarError}</Alert>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={profile.password}
              onChange={handleChange}
              validations={[UserValidation.vpassword]}
            />
            {passwordError && (
              <div className="error-message">{passwordError}</div>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={profile.confirmPassword}
              onChange={handleChange}
              validations={[UserValidation.vpassword]}
            />
            {confirmPasswordError && (
              <div className="error-message">{confirmPasswordError}</div>
            )}
          </Form.Group>

          {duplicateMobileError && (
            <Alert variant="danger">{duplicateMobileError}</Alert>
          )}

          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>

        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {isSubmitting ? "Please wait..." : "Saving changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EditProfileForm;
