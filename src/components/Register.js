import Alert from "@mui/material/Alert";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardImage,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import "../css/Register.css";
import auth from "../services/auth.service";
import UserValidation from "../validation/user";

const Register = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const [state, setState] = useState({
    username: "",
    email: "",
    mobile: "",
    password: "",
    confirm_password: "",
    successful: false,
    message: "",
    // Validation
    usernameError: "",
    emailError: "",
    mobileError: "",
    passwordError: "",
    confirm_passwordError: "",
    avatarError: "",
  });

  const handleImageChange = (e) => {
    setSelectedImage(e.target.files[0]);
  };

  const onChange = (e) => {
    const { name, value } = e.target;

    setState((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setState((prevState) => ({
      ...prevState,
      username: "",
      email: "",
      mobile: "",
      password: "",
      confirm_password: "",
      successful: false,
      message: "",
      usernameError: "",
      emailError: "",
      mobileError: "",
      passwordError: "",
      confirm_passwordError: "",
      avatarError: "",
    }));
  };

  const handleRegister = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setState((prevState) => ({
      ...prevState,
      successful: false,
      usernameError: "",
      emailError: "",
      mobileError: "",
      passwordError: "",
      confirm_passwordError: "",
      avatarError: "",
    }));

    const { username, email, mobile, password, confirm_password } = state;

    const usernameError = UserValidation.requiredField(username);
    const emailError =
      UserValidation.requiredField(email) || UserValidation.vemail(email);
    const mobileError = UserValidation.requiredField(mobile);
    const passwordError =
      UserValidation.requiredField(password) ||
      UserValidation.vpassword(password, confirm_password);
    const confirm_passwordError =
      UserValidation.requiredField(confirm_password) ||
      UserValidation.vpassword(password, confirm_password);

    if (emailError || mobileError || passwordError || confirm_passwordError) {
      setState((prevState) => ({
        ...prevState,
        usernameError: usernameError,
        emailError: emailError,
        mobileError: mobileError,
        passwordError: passwordError,
        confirm_passwordError: confirm_passwordError,
        avatarError: !selectedImage ? "Please upload an avatar." : "",
      }));
      setIsSubmitting(false);
      return;
    } else {
      const formData = new FormData();
      formData.append("username", username);

      if (selectedImage) {
        formData.append("avatar_image", selectedImage);
      } else {
        setState((prevState) => ({
          ...prevState,
          avatarError: "Please upload an avatar.",
        }));
        setIsSubmitting(false);
        return;
      }

      formData.append("email", email);
      formData.append("mobile", mobile);
      formData.append("password", password);

      auth.register(formData).then(
        () => {
          setState((prevState) => ({
            ...prevState,
            message: "Registration successful!",
            successful: true,
          }));
          setIsSubmitting(false);
        },
        (error) => {
          const resMessage =
            (error.response &&
              error.response.data &&
              error.response.data.message) ||
            error.message ||
            error.toString();

          setState((prevState) => ({
            ...prevState,
            successful: false,
            message: resMessage,
          }));

          setIsSubmitting(false);
        }
      );
    }
  };

  const {
    usernameError,
    emailError,
    mobileError,
    passwordError,
    confirm_passwordError,
    avatarError,
  } = state;

  return (
    <MDBContainer fluid id="register-container">
      <MDBRow
        className="d-flex justify-content-center align-items-center"
        id="register-background"
      >
        <MDBCol>
          <MDBCard className="my-42">
            <MDBRow className="g-0" id="register-form">
              <MDBCol md="6" className="d-none d-md-block">
                <MDBCardImage
                  src="/gif/image1.gif"
                  alt="Sample photo"
                  className="rounded-start"
                  fluid
                />
              </MDBCol>

              <MDBCol md="6" id="sign-up-form">
                <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                  <h3
                    className="mb-5 text-uppercase fw-bold"
                    id="register-header"
                  >
                    Student registration form
                  </h3>

                  <Form onSubmit={handleRegister}>
                    <MDBRow>
                      <MDBCol md="12">
                        <MDBInput
                          wrapperClass="mb-2"
                          label="Username"
                          size="lg"
                          id="form1"
                          type="text"
                          name="username"
                          value={state.username}
                          onChange={onChange}
                          validations={[UserValidation.requiredField]}
                        />
                        {usernameError && (
                          <div className="error-message">{usernameError}</div>
                        )}
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-2"
                          label="Email"
                          size="lg"
                          id="form1"
                          type="text"
                          name="email"
                          value={state.email}
                          onChange={onChange}
                          validations={[
                            UserValidation.requiredField,
                            UserValidation.vemail,
                          ]}
                        />
                        {emailError && (
                          <div className="error-message">{emailError}</div>
                        )}
                      </MDBCol>

                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-2"
                          label="Mobile"
                          size="lg"
                          id="form1"
                          type="text"
                          name="mobile"
                          value={state.mobile}
                          onChange={onChange}
                          validations={[UserValidation.requiredField]}
                        />
                        {mobileError && (
                          <div className="error-message">{mobileError}</div>
                        )}
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-2"
                          label="Password"
                          size="lg"
                          id="form1"
                          type="password"
                          name="password"
                          value={state.password}
                          onChange={onChange}
                          validations={[
                            UserValidation.requiredField,
                            UserValidation.vpassword,
                          ]}
                        />
                        {passwordError && (
                          <div className="error-message">{passwordError}</div>
                        )}
                      </MDBCol>

                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-2"
                          label="Confirm Password"
                          size="lg"
                          id="form2"
                          type="password"
                          name="confirm_password"
                          value={state.confirm_password}
                          onChange={onChange}
                          validations={[UserValidation.requiredField]}
                        />
                        {confirm_passwordError && (
                          <div className="error-message">
                            {confirm_passwordError}
                          </div>
                        )}
                      </MDBCol>
                    </MDBRow>

                    <label
                      style={{
                        marginBottom: "1.5vh",
                        display: "flex",
                        fontWeight: "bold",
                        color: "#666666",
                        marginLeft: "0.5vh",
                      }}
                    >
                      Upload Avatar:
                    </label>
                    <MDBCol md="12">
                      <MDBInput
                        wrapperClass="mb-4"
                        type="file"
                        accept="image/*"
                        name="avatar"
                        onChange={handleImageChange}
                      />
                      {avatarError && (
                        <Alert severity="error">{avatarError}</Alert>
                      )}
                    </MDBCol>

                    {state.message && (
                      <Alert severity={state.successful ? "success" : "error"}>
                        {state.message}
                      </Alert>
                    )}

                    <div className="d-flex justify-content-end pt-3">
                      <MDBBtn
                        color="light"
                        size="lg"
                        className="ms-1"
                        onClick={() => resetForm()}
                      >
                        Reset all
                      </MDBBtn>
                      <MDBBtn
                        type="submit"
                        className="ms-2"
                        color="warning"
                        size="lg"
                      >
                        {isSubmitting ? "Please wait..." : "Register"}
                      </MDBBtn>
                    </div>
                  </Form>
                </MDBCardBody>
              </MDBCol>
            </MDBRow>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Register;
