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
import { Link, useNavigate } from "react-router-dom";
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
    <MDBContainer fluid className="login">
      <div className="form-container">
        <MDBRow id="form-details">
          <MDBCol sm="6" id="sign-in-form">
            <div style={{ marginTop: "4vh" }}>
              <MDBIcon
                fas
                icon="crow fa-3x me-3"
                style={{ color: "#709085" }}
              />
              <span className="animate-character">Greenwich Magazine</span>
            </div>

            <div className="d-flex flex-column justify-content-center h-custom-2 w-75 pt-4">
              <Form onSubmit={handleLogin}>
                <label className="email">Email address:</label>
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  // label="Email address"
                  id="formControlLg"
                  type="email"
                  size="lg"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  validations={[requiredField]}
                />
                <label className="password">Password:</label>
                <MDBInput
                  wrapperClass="mb-4 mx-5 w-100"
                  // label="Password"
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
                  <div className="form-group" id="error-login-message">
                    <div className="alert alert-danger" role="alert">
                      {message}
                    </div>
                  </div>
                )}
              </Form>

              <p className="ms-5">
                Don't have an account?{" "}
                <Link class="link-info" to="/register">
                  Register here
                </Link>
              </p>
            </div>
          </MDBCol>
        </MDBRow>
      </div>
    </MDBContainer>
  );
};

export default Login;
