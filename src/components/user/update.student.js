import { useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import UserService from "../../services/user.service";
import UserValidation from "../../validation/user";

const StudentUpdateForm = ({ student, open, close, fetchStudents }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [duplicateMobileError, setDuplicateMobileError] = useState("");
  const [error, setError] = useState("");

  const [studentForm, setStudentForm] = useState({
    username: student.username,
    mobile: student.mobile,
    password: student.password,
    confirmPassword: student.password,
    avatar: null,
    // Validation
    usernameError: "",
    mobileError: "",
    passwordError: "",
    confirmPasswordError: "",
  });

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      setStudentForm((prevData) => ({
        ...prevData,
        avatar: e.target.files[0],
      }));
    }
  };

  const handleFormChange = (e) => {
    setStudentForm((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setError("");
    setDuplicateMobileError("");

    setStudentForm((prevData) => ({
      ...prevData,
      usernameError: "",
      mobileError: "",
      passwordError: "",
      confirmPasswordError: "",
    }));

    const { username, mobile, password, confirmPassword, avatar } = studentForm;

    const usernameError = UserValidation.requiredField(username);
    const mobileError = UserValidation.requiredField(mobile);
    let passwordError = null;
    let confirmPasswordError = null;

    if (password !== confirmPassword) {
      passwordError = "Passwords do not match";
      confirmPasswordError = "Passwords do not match";
    }

    if (usernameError || mobileError || passwordError || confirmPasswordError) {
      setStudentForm((prevData) => ({
        ...prevData,
        usernameError,
        mobileError,
        passwordError,
        confirmPasswordError,
      }));
      setIsSubmitting(false);
      return;
    } else {
      try {
        const updatedStudent = new FormData();
        updatedStudent.append("id", student._id);
        updatedStudent.append("username", username);
        updatedStudent.append("mobile", mobile);
        updatedStudent.append("password", password);
        updatedStudent.append("avatar", avatar);

        await UserService.updateStudent(updatedStudent);
        await fetchStudents();
        setIsSubmitting(false);
        close();
      } catch (error) {
        console.error("Error updating student:", error);
        setIsSubmitting(false);
      }
    }
  };

  const { usernameError, mobileError, passwordError, confirmPasswordError } =
    studentForm;

  return (
    <Modal show={open} onHide={close}>
      <Modal.Header closeButton>
        <Modal.Title>Update Student</Modal.Title>
      </Modal.Header>
      <Form onSubmit={handleSubmit}>
        <Modal.Body>
          <Form.Group>
            <Form.Label>Username:</Form.Label>
            <Form.Control
              type="text"
              name="username"
              value={studentForm.username}
              onChange={handleFormChange}
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
              value={studentForm.mobile}
              onChange={handleFormChange}
              validations={[UserValidation.requiredField]}
            />
            {mobileError && <div className="error-message">{mobileError}</div>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Password:</Form.Label>
            <Form.Control
              type="password"
              name="password"
              value={studentForm.password}
              onChange={handleFormChange}
              validations={[UserValidation.requiredField]}
            />
            {passwordError && <Alert variant="danger">{passwordError}</Alert>}
          </Form.Group>

          <Form.Group>
            <Form.Label>Confirm Password:</Form.Label>
            <Form.Control
              type="password"
              name="confirmPassword"
              value={studentForm.confirmPassword}
              onChange={handleFormChange}
              validations={[UserValidation.requiredField]}
            />
            {confirmPasswordError && (
              <Alert variant="danger">{confirmPasswordError}</Alert>
            )}
          </Form.Group>

          <Form.Group>
            <Form.Label>Avatar:</Form.Label>
            <Form.Control
              type="file"
              name="avatar"
              accept="image/*"
              onChange={handleImageChange}
            />
          </Form.Group>

          {error && <div className="error-message">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {isSubmitting ? "Updating..." : "Update"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentUpdateForm;
