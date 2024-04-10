const serverURL = "https://greenwich-magazine-be-mlk0.onrender.com";

const publicApi = {
  auth: serverURL + "/api/auth/",
  faculty: serverURL + "/api/faculty/",
  user: serverURL + "/api/user-management/",
  role: serverURL + "/api/role-management/",
  contribution: serverURL + "/api/contribution-management/",
  event: serverURL + "/api/event-management/events",
  dashboard: serverURL + "/api/dashboard/",
  contributionForGuest: serverURL + "/api/guest/contribution/",
  chat: serverURL + "/api/chat-management/",
  comment: serverURL + "/api/comment-management/comment/",
  studentComment: serverURL + "/api/student/comment",
};
export default publicApi;
// Live server: https://greenwich-magazine-be-mlk0.onrender.com
// Local server: http://localhost:5000
