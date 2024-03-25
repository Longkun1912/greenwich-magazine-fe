import "mdb-react-ui-kit/dist/css/mdb.min.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import UnAuthorizedPage from "./components/Unauthorized";
import ContribbutionIndex from "./components/contribution/index";
import FacultyIndex from "./components/faculty/index";
import EventIndex from "./components/event/index";
import UserIndex from "./components/user/index";
import GreenwichNavBar from "./global/Navbar";
import Sidebar from "./global/Sidebar";
import AuthService from "./services/auth.service";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    if (userData) setCurrentUser(userData);
  };

  const handleLogoutSuccess = () => {
    window.location.href = "/login";
    setCurrentUser(null);
  };

  useEffect(() => {
    const currentUser = AuthService.getCurrentUser();

    if (currentUser) {
      setCurrentUser(currentUser);
    }
  }, []);

  return (
    <BrowserRouter>
      <div className="App">
        <main className="content">
          <GreenwichNavBar
            currentUser={currentUser}
            onLogoutSuccess={handleLogoutSuccess}
          />
          <div className="page-content">
            {currentUser && <Sidebar currentUser={currentUser} />}
            <Routes>
              <Route
                path="/"
                element={<Login onLoginSuccess={handleLoginSuccess} />}
              />
              <Route
                path="/profile"
                element={<Profile currentUser={currentUser} />}
              />
              <Route path="/unauthorized" element={<UnAuthorizedPage />} />
              <Route path="/dashboard" element={<Dashboard />} />
              <Route
                path="/login"
                element={<Login onLoginSuccess={handleLoginSuccess} />}
              />
              <Route path="/register" element={<Register />} />
              <Route path="/faculty" element={<FacultyIndex />} />
              <Route
                path="/contributionIndex"
                element={<ContribbutionIndex />}
              />
              <Route
                path="/eventIndex"
                element={<EventIndex/>}
              />
  
              <Route
                path="/user-management"
                element={<UserIndex currentUser={currentUser} />}
              />
            </Routes>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
