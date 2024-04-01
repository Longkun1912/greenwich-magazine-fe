import { useState } from "react";
import { FaUserGroup } from "react-icons/fa6";
import { GrDocumentUser } from "react-icons/gr";
import { MdEventAvailable, MdOutlineCollectionsBookmark } from "react-icons/md";
import { RiArticleFill } from "react-icons/ri";
import { TiThMenu } from "react-icons/ti";
import { Link } from "react-router-dom";
import "../css/Sidebar.css";

const Sidebar = ({ currentUser }) => {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <nav id="sidebar" className={isExpanded ? "sidebar" : "sidebar collapsed"}>
      <div class="sidebar-header">
        <Link to="/profile" id="link-profile">
          <img
            src={currentUser.avatar}
            alt="profile"
            id={isExpanded ? "user-profile-img" : "collapsed-field"}
          />
          <div className={isExpanded ? "profile-info" : "collapsed-field"}>
            <p className="profile-username-txt">{currentUser.username}</p>
            <p className="profile-info-txt">Role: {currentUser.role}</p>
          </div>
        </Link>

        <TiThMenu
          id="collapse-btn"
          onClick={() => setIsExpanded(!isExpanded)}
        />
      </div>

      <ul class="list-unstyled components" id="sidebar-menu">
        {/* admin */}
        {currentUser.role === "admin" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/user-management">
              <span className="option-container">
                <FaUserGroup className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Manage Users
                </p>
              </span>
            </Link>
          </li>
        )}
        {currentUser.role === "admin" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/Faculty">
              <span className="option-container">
                <MdOutlineCollectionsBookmark className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Manage Faculty
                </p>
              </span>
            </Link>
          </li>
        )}
        {currentUser.role === "admin" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/contributionIndex">
              <span className="option-container">
                <RiArticleFill className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Manage Contribution
                </p>
              </span>
            </Link>
          </li>
        )}
        {currentUser.role === "admin" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/eventIndex">
              <span className="option-container">
                <MdEventAvailable className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Manage Event
                </p>
              </span>
            </Link>
          </li>
        )}

        {/* manager */}
        {currentUser.role === "manager" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/contributionIndex">
              <span className="option-container">
                <GrDocumentUser className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  View Contribution
                </p>
              </span>
            </Link>
          </li>
        )}

        {currentUser.role === "manager" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/user-management">
              <span className="option-container">
                <GrDocumentUser className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  View Users
                </p>
              </span>
            </Link>
          </li>
        )}

        {/* coordinator */}
        {currentUser.role === "coordinator" && (
          <li>
            <Link to="#">Manage User</Link>
          </li>
        )}
        {currentUser.role === "coordinator" && (
          <li>
            <Link to="/IndexForCoordinator">Manage Contribution 2</Link>
          </li>
        )}

        {/* Student */}
        {currentUser.role === "student" && (
          <li>
            <Link to="/student/contributions">View all contributions</Link>
          </li>
        )}

        {currentUser.role === "student" && (
          <li>
            <Link to="/student/contribution">Create own contribution</Link>
          </li>
        )}

        {/* <li>
          <a href="#">About</a>
        </li>
        <li>
          <a href="#pageSubmenu" data-toggle="collapse" aria-expanded="false">
            Pages
          </a>
        </li>
        <li>
          <a href="#">Portfolio</a>
        </li>
        <li>
          <a href="#">Contact</a>
        </li> */}
      </ul>
    </nav>
  );
};

export default Sidebar;
