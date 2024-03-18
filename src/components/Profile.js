import React from "react";
import Button from "react-bootstrap/Button";
import { FaEdit } from "react-icons/fa";
import "../css/Profile.css";

const Profile = ({ currentUser }) => {
  return (
    <div className="container">
      <h1 className="mt-4">Profile</h1>
      <div className="main-body" id="profile-body">
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={currentUser.avatar}
                    alt="Admin"
                    className="rounded-circle"
                    id="profile-avatar"
                  />
                  <div className="mt-3">
                    <h4>{currentUser.username}</h4>
                    <p className="text-secondary mb-1">{currentUser.email}</p>

                    <Button className="btn btn-primary" id="edit-profile-btn">
                      <FaEdit id="edit-icon" />
                      <span>Edit Profile</span>
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="col-md-8">
            <div className="card mb-3">
              <div className="card-body">
                <div className="row">
                  <div className="col-sm-3">
                    <h6>Username</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {currentUser.username}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6>Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {currentUser.email}
                  </div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6>Mobile</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {currentUser.mobile}
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className="col-sm-3">
                    <h6>Role</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">
                    {currentUser.role}
                  </div>
                </div>
                <hr />

                <div className="row">
                  <div className="col-sm-3">
                    <h6>Faculty</h6>
                  </div>
                  {currentUser.faculty ? (
                    <div className="col-sm-9 text-secondary">
                      {currentUser.faculty}
                    </div>
                  ) : (
                    <div className="col-sm-9 text-secondary">No faculty</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
