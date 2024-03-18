import {
  MDBBtn,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import React, { useState } from "react";
import { Form } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import "../css/Login.css";
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

const Login = ({ onLoginSuccess }) => {
  const navigator = useNavigate();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = (e) => {
    e.preventDefault();
    setLoading(true);
    auth.login(email, password).then(
      (data) => {
        console.log("Login successful!");
        if (onLoginSuccess) {
          onLoginSuccess(data);
        }
        navigator("/profile");
      },
      (error) => {
        setMessage("Login failed! Incorrect email or password.");
        setLoading(false);
      }
    );
  };

  return (
    <MDBContainer fluid>
      <MDBRow>
        <MDBCol sm="6">
          <div className="d-flex flex-row ps-5 pt-5">
            <MDBIcon fas icon="crow fa-3x me-3" style={{ color: "#709085" }} />
            <span className="h1 fw-bold mb-0">Logo</span>
          </div>

          <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
            <h3
              className="fw-normal mb-3 ps-5 pb-3"
              style={{ letterSpacing: "1px" }}
            >
              Log in
            </h3>

            <Form onSubmit={handleLogin}>
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Email address"
                id="formControlLg"
                type="email"
                size="lg"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                validations={[requiredField]}
              />
              <MDBInput
                wrapperClass="mb-4 mx-5 w-100"
                label="Password"
                id="formControlLg"
                type="password"
                size="lg"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                validations={[requiredField]}
              />

              <MDBBtn
                type="submit"
                className="mb-4 px-5 mx-5 w-100"
                color="info"
                size="lg"
                disabled={loading}
              >
                {loading && (
                  <span className="spinner-border spinner-border-sm me-1"></span>
                )}
                Login
              </MDBBtn>
              {message && (
                <div className="form-group">
                  <div className="alert alert-danger" role="alert">
                    {message}
                  </div>
                </div>
              )}
            </Form>

            <p className="ms-5">
              Don't have an account?{" "}
              <a href="#!" class="link-info">
                Register here
              </a>
            </p>
          </div>
        </MDBCol>

        <MDBCol sm="6" className="d-none d-sm-block px-0">
          <img
            src="https://mdbcdn.b-cdn.net/img/Photos/new-templates/bootstrap-login-form/img3.webp"
            alt="Login image"
            className="w-100"
            style={{ objectFit: "cover", objectPosition: "left" }}
          />
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default Login;
