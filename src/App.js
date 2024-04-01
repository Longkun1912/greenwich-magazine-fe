import "mdb-react-ui-kit/dist/css/mdb.min.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import UnAuthorizedPage from "./components/Unauthorized";
import IndexForCoordinator from "./components/contribution/IndexForCoordinator";
import ContributionIndex from "./components/contribution/index";
import StudentContributionForm from "./components/contribution/student.create";
import StudentContributionIndex from "./components/contribution/student.view";
import EventIndex from "./components/event/index";
import FacultyIndex from "./components/faculty/index";
import UserIndex from "./components/user/index";
import StudentIndex from "./components/user/student.index";
import GreenwichNavBar from "./global/Navbar";
import Sidebar from "./global/Sidebar";
import AuthService from "./services/auth.service";

function App() {
  const [currentUser, setCurrentUser] = useState(null);

  const handleLoginSuccess = (userData) => {
    if (userData) setCurrentUser(userData);
  };

  const handleLogout = () => {
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
            handleLogout={handleLogout}
          />
          <div className="page-content">
            {currentUser && <Sidebar currentUser={currentUser} />}
            <div style={{ flexBasis: "70%" }}>
              <Routes>
                <Route
                  path="/"
                  element={
                    currentUser ? (
                      <Profile currentUser={currentUser} />
                    ) : (
                      <Login onLoginSuccess={handleLoginSuccess} />
                    )
                  }
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
                  element={<ContributionIndex />}
                />
                <Route
                  path="/IndexForCoordinator"
                  element={<IndexForCoordinator />}
                />

                <Route path="/eventIndex" element={<EventIndex />} />

                <Route
                  path="/user-management"
                  element={<UserIndex currentUser={currentUser} />}
                />
                <Route
                  path="/student/contributions"
                  element={
                    <StudentContributionIndex currentUser={currentUser} />
                  }
                />
                <Route
                  path="/student/contribution"
                  element={
                    <StudentContributionForm currentUser={currentUser} />
                  }
                />
                <Route
                  path="/coordinator/students"
                  element={<StudentIndex currentUser={currentUser} />}
                />
              </Routes>
            </div>
          </div>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;
