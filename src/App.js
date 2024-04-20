import "mdb-react-ui-kit/dist/css/mdb.min.css";
import React, { useEffect, useState } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import "./App.css";
import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Register from "./components/Register";
import UnAuthorizedPage from "./components/Unauthorized";
import CoordinatorChat from "./components/chat/coordinator.chat";
import StudentChat from "./components/chat/student.chat";
import ContributionForGuest from "./components/contribution/contributionForGuest.index";
import IndexForCoordinator from "./components/contribution/coordinator.index";
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
            <div style={{ flexBasis: "100%" }}>
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
                  element={
                    currentUser ? (
                      <Profile currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/dashboard"
                  element={
                    currentUser && currentUser.role === "manager" ? (
                      <Dashboard />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/login"
                  element={<Login onLoginSuccess={handleLoginSuccess} />}
                />
                <Route path="/register" element={<Register />} />
                <Route
                  path="/faculty"
                  element={
                    currentUser && currentUser.role === "admin" ? (
                      <FacultyIndex />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/contributionIndex"
                  element={
                    currentUser &&
                    (currentUser.role === "admin" ||
                      currentUser.role === "manager") ? (
                      <ContributionIndex />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/IndexForCoordinator"
                  element={
                    currentUser && currentUser.role === "coordinator" ? (
                      <IndexForCoordinator />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/ContributionForGuest"
                  element={
                    currentUser && currentUser.role === "guest" ? (
                      <ContributionForGuest />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/eventIndex"
                  element={
                    currentUser && currentUser.role === "admin" ? (
                      <EventIndex currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />

                <Route
                  path="/user-management"
                  element={
                    currentUser &&
                    (currentUser.role === "admin" ||
                      currentUser.role === "manager") ? (
                      <UserIndex currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/student/contributions"
                  element={
                    currentUser && currentUser.role === "student" ? (
                      <StudentContributionIndex currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/student/contribution"
                  element={
                    currentUser && currentUser.role === "student" ? (
                      <StudentContributionForm currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/coordinator/students"
                  element={
                    currentUser && currentUser.role === "coordinator" ? (
                      <StudentIndex currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/coordinator/chat"
                  element={
                    currentUser && currentUser.role === "coordinator" ? (
                      <CoordinatorChat currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
                />
                <Route
                  path="/student/chat"
                  element={
                    currentUser && currentUser.role === "student" ? (
                      <StudentChat currentUser={currentUser} />
                    ) : (
                      <UnAuthorizedPage />
                    )
                  }
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
