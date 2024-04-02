import { useState } from "react";
import { FaRegUser } from "react-icons/fa";
import { FaUserGroup } from "react-icons/fa6";
import { GrArticle, GrDocumentUser } from "react-icons/gr";
import {
  MdEventAvailable,
  MdOutlineClass,
  MdOutlineCollectionsBookmark,
} from "react-icons/md";
import { PiStudentBold } from "react-icons/pi";
import { RiArticleFill, RiDashboardFill } from "react-icons/ri";
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
            <Link to="/dashboard">
              <span className="option-container">
                <RiDashboardFill className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Dashboard
                </p>
              </span>
            </Link>
          </li>
        )}

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
                <FaRegUser className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  View Users
                </p>
              </span>
            </Link>
          </li>
        )}

        {/* coordinator */}
        {currentUser.role === "coordinator" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/coordinator/students">
              <span className="option-container">
                <PiStudentBold className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Manage Students
                </p>
              </span>
            </Link>
          </li>
        )}
        {currentUser.role === "coordinator" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/IndexForCoordinator">
              <span className="option-container">
                <MdOutlineClass className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Manage your Faculty
                </p>
              </span>
            </Link>
          </li>
        )}

        {/* Student */}
        {currentUser.role === "student" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/student/contributions">
              <span className="option-container">
                <MdOutlineClass className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  View all contributions
                </p>
              </span>
            </Link>
          </li>
        )}

        {currentUser.role === "student" && (
          <li className={isExpanded ? "manage-bar" : "manage-bar-hidden"}>
            <Link to="/student/contribution">
              <span className="option-container">
                <GrArticle className="manage-icon" />
                <p className={isExpanded ? "manage-txt" : "manage-txt-hidden"}>
                  Create own contribution
                </p>
              </span>
            </Link>
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
