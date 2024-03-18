import {
  MDBCollapse,
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import React from "react";
import { Button } from "react-bootstrap";
import { Link } from "react-router-dom";
import "../css/Navbar.css";
import AuthService from "../services/auth.service";
const GreenwichNavBar = ({ currentUser, onLogoutSuccess }) => {
  const logOut = () => {
    AuthService.logout();
    localStorage.clear();
    onLogoutSuccess();
  };

  return (
    <MDBNavbar expand="lg" dark bgColor="primary">
      <MDBContainer fluid>
        <div className="web-brand">
          <MDBNavbarBrand href="#">Greenwich</MDBNavbarBrand>
        </div>
        <MDBCollapse navbar>
          <MDBNavbarNav className="me-auto mb-2 mb-lg-0">
            <div className="left-bar">
              <MDBNavbarItem>
                <MDBNavbarLink href="#">Features</MDBNavbarLink>
              </MDBNavbarItem>
            </div>
            {!currentUser ? (
              <div className="right-bar">
                <MDBNavbarItem id="login-option">
                  <Link to="/login">
                    <MDBNavbarLink>Login</MDBNavbarLink>
                  </Link>
                </MDBNavbarItem>
                <MDBNavbarItem>
                  <MDBNavbarLink>
                    <Link to="/register">
                      <MDBNavbarLink>Register</MDBNavbarLink>
                    </Link>
                  </MDBNavbarLink>
                </MDBNavbarItem>
              </div>
            ) : (
              <div className="right-bar">
                <MDBNavbarItem id="authenticated-options">
                  <MDBNavbarItem>
                    <img
                      src={currentUser.avatar}
                      alt="avatar"
                      className="profile-img"
                    />
                  </MDBNavbarItem>
                  <div style={{ width: "20vh" }}>
                    <span>{currentUser.username}</span>

                    <Link>
                      <Button id="logout-option" onClick={logOut}>
                        Logout
                      </Button>
                    </Link>
                  </div>
                </MDBNavbarItem>
              </div>
            )}
          </MDBNavbarNav>
        </MDBCollapse>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default GreenwichNavBar;
