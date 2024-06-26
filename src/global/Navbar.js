import { faUserLock, faUsers } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  MDBContainer,
  MDBNavbar,
  MDBNavbarBrand,
  MDBNavbarItem,
  MDBNavbarLink,
  MDBNavbarNav,
} from "mdb-react-ui-kit";
import React from "react";
import { Button } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import "../css/Navbar.css";
import AuthService from "../services/auth.service";

const GreenwichNavBar = ({ currentUser, handleLogout }) => {
  const navigator = useNavigate();

  const logOut = async () => {
    await AuthService.logout();
    navigator("/login");
    currentUser = null;
    localStorage.clear();
    handleLogout();
  };

  return (
    <MDBNavbar expand="lg" dark bgColor="primary">
      <MDBContainer id="navbar-container">
        <div className="web-brand">
          {/* <img
            src="https://res.cloudinary.com/dokyaftrm/image/upload/v1713418936/greenwich-magazine/Our%20logo.png"
            alt="Logo"
            className="logo"
          /> */}
          
          <img src="/logoGreenwich.jpg" alt="Logo" id="header-logo" />

          <MDBNavbarBrand href="#">EduCollab</MDBNavbarBrand>
        </div>
        <MDBNavbarNav id="navbar-option">
          {!currentUser ? (
            <div className="right-bar">
              <MDBNavbarItem id="login-option">
                <Link to="/login">
                  <MDBNavbarLink>
                    <FontAwesomeIcon icon={faUserLock} className="fa-icon" />
                    Login
                  </MDBNavbarLink>
                </Link>
              </MDBNavbarItem>

              <MDBNavbarItem id="register-option">
                <MDBNavbarLink>
                  <Link to="/register">
                    <FontAwesomeIcon icon={faUsers} className="fa-icon" />
                    Register
                  </Link>
                </MDBNavbarLink>
              </MDBNavbarItem>
            </div>
          ) : (
            <div className="right-bar">
              <div className="right-bar1">
                <MDBNavbarItem id="authenticated-options">
                  <MDBNavbarItem>
                    <img
                      src={currentUser.avatar}
                      alt="avatar"
                      className="profile-img"
                    />
                  </MDBNavbarItem>
                  <div style={{ width: "20vh" }}>
                    <span className="username">{currentUser.username}</span>

                    <Link>
                      <Button id="logout-option" onClick={logOut}>
                        LogOut
                      </Button>
                    </Link>
                  </div>
                </MDBNavbarItem>
              </div>
            </div>
          )}
        </MDBNavbarNav>
      </MDBContainer>
    </MDBNavbar>
  );
};

export default GreenwichNavBar;
