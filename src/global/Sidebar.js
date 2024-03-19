import { useState } from "react";
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
        <li class="active"></li>
        {/* admin */}
        {currentUser.role === "admin" && (
          <li>
            <Link to="/user-management">Manage Users</Link>
          </li>
        )}
        {currentUser.role === "admin" && (
          <li>
            <Link to="/Faculty">Manage Faculty</Link>
          </li>
        )}
        {currentUser.role === "admin" && (
          <li>
            <Link to="/contributionIndex">Manage Contribution</Link>
          </li>
        )}
        {currentUser.role === "admin" && (
          <li>
            <Link to="#">Manage Event</Link>
          </li>
        )}

        {/* manager */}
        {currentUser.role === "manager" && (
          <li>
            <Link to="/contribution">Manage Contribution 1</Link>
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
            <Link to="/contribution">Manage Contribution 2</Link>
          </li>
        )}
        
        {/* Student */}
        {currentUser.role === "student" && (
          <li>
            <Link to="/contribution">Manage Contribution 2</Link>
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
