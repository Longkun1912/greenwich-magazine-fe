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
import { useNavigate } from "react-router-dom";
import { isEmail } from "validator";
import auth from "../services/auth.service";

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

const Register = () => {
  const navigator = useNavigate();
  const [selectedImage, setSelectedImage] = useState(null);

  const [state, setState] = useState({
    first_name: "",
    last_name: "",
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

  const handleRegister = (e) => {
    e.preventDefault();

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

    const { first_name, last_name, email, mobile, password, confirm_password } =
      state;

    const usernameError = requiredField(first_name) || requiredField(last_name);
    const emailError = requiredField(email) || vemail(email);
    const mobileError = requiredField(mobile) || vmobile(mobile);
    const passwordError =
      requiredField(password) || vpassword(password, confirm_password);
    const confirm_passwordError =
      requiredField(confirm_password) || vpassword(password, confirm_password);

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
      return;
    } else {
      const formData = new FormData();
      formData.append("username", first_name + " " + last_name);
      formData.append("avatar_image", selectedImage);
      formData.append("email", email);
      formData.append("mobile", mobile);
      formData.append("password", password);

      auth.register(formData).then(
        (response) => {
          setState((prevState) => ({
            ...prevState,
            message: response.data.message,
            successful: true,
          }));
          navigator("/login");
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
    <MDBContainer fluid className="bg-dark">
      <MDBRow className="d-flex justify-content-center align-items-center h-100">
        <MDBCol>
          <MDBCard className="my-4">
            <MDBRow className="g-0">
              <MDBCol md="6" className="d-none d-md-block">
                <MDBCardImage
                  src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-registration/img4.webp"
                  alt="Sample photo"
                  className="rounded-start"
                  fluid
                />
              </MDBCol>

              <MDBCol md="6">
                <MDBCardBody className="text-black d-flex flex-column justify-content-center">
                  <h3 className="mb-5 text-uppercase fw-bold">
                    Student registration form
                  </h3>

                  <Form onSubmit={handleRegister}>
                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-4"
                          label="First Name"
                          size="lg"
                          id="form1"
                          type="text"
                          name="first_name"
                          value={state.first_name}
                          onChange={onChange}
                          validations={[requiredField]}
                        />
                        {usernameError && (
                          <div className="error-message">{usernameError}</div>
                        )}
                      </MDBCol>

                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-4"
                          label="Last Name"
                          size="lg"
                          id="form2"
                          type="text"
                          name="last_name"
                          value={state.last_name}
                          onChange={onChange}
                          validations={[requiredField]}
                        />
                        {usernameError && (
                          <div className="error-message">{usernameError}</div>
                        )}
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-4"
                          label="Email"
                          size="lg"
                          id="form1"
                          type="text"
                          name="email"
                          value={state.email}
                          onChange={onChange}
                          validations={[requiredField, vemail]}
                        />
                        {emailError && (
                          <div className="error-message">{emailError}</div>
                        )}
                      </MDBCol>

                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-4"
                          label="Mobile"
                          size="lg"
                          id="form1"
                          type="text"
                          name="mobile"
                          value={state.mobile}
                          onChange={onChange}
                          validations={[requiredField, vmobile]}
                        />
                        {mobileError && (
                          <div className="error-message">{mobileError}</div>
                        )}
                      </MDBCol>
                    </MDBRow>

                    <MDBRow>
                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-4"
                          label="Password"
                          size="lg"
                          id="form1"
                          type="password"
                          name="password"
                          value={state.password}
                          onChange={onChange}
                          validations={[requiredField, vpassword]}
                        />
                        {passwordError && (
                          <div className="error-message">{passwordError}</div>
                        )}
                      </MDBCol>

                      <MDBCol md="6">
                        <MDBInput
                          wrapperClass="mb-4"
                          label="Confirm Password"
                          size="lg"
                          id="form2"
                          type="password"
                          name="confirm_password"
                          value={state.confirm_password}
                          onChange={onChange}
                          validations={[requiredField]}
                        />
                        {confirm_passwordError && (
                          <div className="error-message">
                            {confirm_passwordError}
                          </div>
                        )}
                      </MDBCol>
                    </MDBRow>

                    <label>Upload Avatar:</label>
                    <MDBCol md="12">
                      <MDBInput
                        wrapperClass="mb-4"
                        type="file"
                        accept="image/*"
                        name="avatar"
                        onChange={handleImageChange}
                      />
                      {avatarError && (
                        <div className="error-message">{avatarError}</div>
                      )}
                    </MDBCol>

                    <div className="d-flex justify-content-end pt-3">
                      <MDBBtn color="light" size="lg">
                        Reset all
                      </MDBBtn>
                      <MDBBtn
                        type="submit"
                        className="ms-2"
                        color="warning"
                        size="lg"
                      >
                        Submit form
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
