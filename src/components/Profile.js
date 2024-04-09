import { useCallback, useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import { FaEdit } from "react-icons/fa";
import "../css/Profile.css";
import EditProfileForm from "../modals/edit.profile";
import UserService from "../services/user.service";

const Profile = ({ currentUser }) => {
  const [user, setUser] = useState(currentUser);

  const fetchUserDetails = useCallback(async () => {
    try {
      const response = await UserService.viewCurrentUserInfo(user.id);
      setUser(response.data);
    } catch (error) {
      console.error(error);
    }
  }, [user.id]);

  useEffect(() => {
    fetchUserDetails();
  }, [fetchUserDetails]);

  // Handle opening edit profile modal
  const [isOpenEditProfile, setIsOpenEditProfile] = useState(false);

  const openEditProfile = () => {
    setIsOpenEditProfile(true);
  };

  const closeEditProfile = () => {
    setIsOpenEditProfile(false);
  };

  return (
    <div className="container">
      <h1 className="mt-4">Profile <span>{user.username}</span></h1>
      <div className="main-body" id="profile-body">
        <div className="row gutters-sm">
          <div className="col-md-4 mb-3">
            <div className="card">
              <div className="card-body">
                <div className="d-flex flex-column align-items-center text-center">
                  <img
                    src={user.avatar}
                    alt="Admin"
                    className="rounded-circle"
                    id="profile-avatar"
                  />
                  <div className="mt-3">
                    <h4>{user.username}</h4>
                    <p className="text-secondary mb-1">{user.email}</p>

                    <Button
                      className="btn btn-primary"
                      id="edit-profile-btn"
                      onClick={() => openEditProfile()}
                    >
                      <FaEdit id="edit-icon" />
                      <span >Edit Profile</span>
                    </Button>
                    {isOpenEditProfile && (
                      <EditProfileForm
                        user={user}
                        open={isOpenEditProfile}
                        close={closeEditProfile}
                        fetchUserDetails={fetchUserDetails}
                      />
                    )}
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
                  <div className="col-sm-9 text-secondary">{user.username}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6>Email</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{user.email}</div>
                </div>
                <hr />
                <div className="row">
                  <div className="col-sm-3">
                    <h6>Mobile</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{user.mobile}</div>
                </div>
                <hr />

                <div className="row">
                  <div className="col-sm-3">
                    <h6>Role</h6>
                  </div>
                  <div className="col-sm-9 text-secondary">{user.role}</div>
                </div>
                <hr />

                <div className="row">
                  <div className="col-sm-3">
                    <h6>Faculty</h6>
                  </div>
                  {user.faculty ? (
                    <div className="col-sm-9 text-secondary">
                      {user.faculty}
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
