const serverURL = "http://localhost:5000";

const publicApi = {
  auth: serverURL + "/api/auth/",
  faculty: serverURL + "/api/faculty/",
  user: serverURL + "/api/user-management/",
  role: serverURL + "/api/role-management/",
  contribution: serverURL + "/api/contribution-management/",
  event: serverURL + "/api/event-management/events",
};
export default publicApi;

// Live server: https://greenwich-magazine-be-mlk0.onrender.com
// Local server: http://localhost:5000
