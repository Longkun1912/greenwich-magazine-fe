import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCardHeader,
  MDBCol,
  MDBContainer,
  MDBIcon,
  MDBRow,
  MDBTextArea,
  MDBTypography,
} from "mdb-react-ui-kit";
import { Ripple, initMDB } from "mdb-ui-kit";
import React, { useEffect, useState } from "react";
import { RiDeleteBin5Fill, RiEditFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "../../css/Chat.css";
import ChatService from "../../services/chat.service";
import EditMessageForm from "./edit.message";

initMDB({ Ripple });

const CoordinatorChat = ({ currentUser }) => {
  const [loadingChats, setLoadingChats] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);
  const [studentChats, setStudentChats] = useState([]);
  const [originalStudentChats, setOriginalStudentChats] = useState([]);
  const [selectedChat, setSelectedChat] = useState(null);
  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");

  const fetchStudentsInFaculty = async () => {
    setLoadingChats(true);
    try {
      const response = await ChatService.getStudentsInFacultyForChat();
      setStudentChats(response.data);
      setOriginalStudentChats(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching students");
    }
    setLoadingChats(false);
  };

  useEffect(() => {
    fetchStudentsInFaculty();
  }, []);

  // Handle search student
  const [searchKeyword, setSearchKeyword] = useState("");

  const handleSearchStudent = () => {
    if (searchKeyword === "") {
      setStudentChats(originalStudentChats);
    } else {
      // Filter the original list, not the state
      const filteredChats = originalStudentChats.filter((studentChat) =>
        studentChat.student.username
          .toLowerCase()
          .includes(searchKeyword.toLowerCase())
      );
      setStudentChats(filteredChats);
    }
  };

  // Fetch messages in selected chat
  const handleStudentChat = async (chatId) => {
    try {
      setLoadingMessages(true);
      setSelectedChat(chatId);
      const response = await ChatService.getMessagesInSelectedChat(chatId);
      setMessages(response.data);
    } catch (error) {
      console.error(error);
      toast.error("Error fetching messages");
    }
    setLoadingMessages(false);
  };

  // Format message date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const options = {
      hour: "numeric",
      minute: "numeric",
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour12: true, // Include AM/PM
    };
    return date.toLocaleDateString("en-GB", options);
  };

  // Handle send message
  const handleSendMessage = async (chatId) => {
    try {
      if (message !== "") {
        const messageForm = new FormData();
        messageForm.append("chatId", chatId);
        messageForm.append("content", message);
        messageForm.append("sender", currentUser.id);
        await ChatService.sendMessage(messageForm);
        await handleStudentChat(chatId);
        toast.success("Message sent successfully");
        setMessage("");
      } else {
        toast.error("Message cannot be empty");
        return;
      }
    } catch (error) {
      toast.error("Failed to send message");
      console.error(error);
    }
  };

  // Handle edit message
  const [showEditMessage, setShowEditMessage] = useState(false);
  const [selectedMessage, setSelectedMessage] = useState(null);

  const handleEditMessage = (message) => {
    setSelectedMessage(message);
    setShowEditMessage(true);
  };

  const closeEditMessage = () => {
    setShowEditMessage(false);
  };

  // Handle delete message
  const handleDeleteMessage = async (messageId) => {
    try {
      await ChatService.deleteMessage(messageId);
      await handleStudentChat(selectedChat);
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
      console.error(error);
    }
  };

  return (
    <MDBContainer fluid className="py-5" style={{ backgroundColor: "#eee" }}>
      <ToastContainer />
      <div className="chat-header">
        <h2 className="text-center">Chat with students</h2>
      </div>
      <MDBRow>
        <MDBCol md="6" lg="5" xl="4" className="mb-4 mb-md-0">
          <h5 className="font-weight-bold mb-3 text-center text-lg-start">
            Students in faculty:
          </h5>

          <div class="input-group">
            <input
              type="search"
              class="form-control rounded"
              placeholder="Name or email"
              aria-label="Search"
              aria-describedby="search-addon"
              id="search-student-input"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
            />
            <button
              type="button"
              class="btn btn-outline-primary"
              id="search-student-btn"
              onClick={handleSearchStudent}
              data-mdb-ripple-init
            >
              search
            </button>
          </div>

          <MDBCard>
            <MDBCardBody id="chat-list">
              <MDBTypography listUnStyled className="mb-0">
                {loadingChats ? (
                  <div className="text-center">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading chats...</span>
                    </div>
                  </div>
                ) : (
                  studentChats.map(
                    (studentChat) =>
                      studentChat && (
                        <li
                          className="p-2 border-bottom"
                          key={studentChat.student.id}
                        >
                          <button
                            className="d-flex justify-content-between btn btn-link"
                            id="select-student-chat-btn"
                            onClick={() => handleStudentChat(studentChat.chat)}
                          >
                            <div className="d-flex flex-row" id="chat-info">
                              <img
                                src={studentChat.student.avatar}
                                alt="avatar"
                                className="rounded-circle d-flex align-self-center me-3 shadow-1-strong"
                                id="student-avatar"
                              />
                              <div className="pt-1" id="student-chat-info">
                                <p className="fw-bold mb-0">
                                  {studentChat.student.username}
                                </p>
                                <p className="small text-muted mb-1">
                                  {formatDate(studentChat.updatedAt)}
                                </p>
                                <p
                                  className="small text-muted"
                                  style={{ marginTop: "2vh" }}
                                >
                                  {studentChat.latestMessage
                                    ? studentChat.latestMessage.length > 17
                                      ? studentChat.latestMessage.substring(
                                          0,
                                          17
                                        ) + "..."
                                      : studentChat.latestMessage
                                    : "No message yet"}
                                </p>
                              </div>
                            </div>
                          </button>
                        </li>
                      )
                  )
                )}
              </MDBTypography>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
        <MDBCol md="6" lg="7" xl="8">
          <MDBTypography listUnStyled>
            <div className="messages-container">
              {selectedChat && (
                <div className="chat-details">
                  <h3 id="message-title">Messages</h3>
                </div>
              )}
              {loadingMessages ? (
                <div className="text-center">
                  <div className="spinner-border" role="status">
                    <span className="visually-hidden">Loading messages...</span>
                  </div>
                </div>
              ) : messages && messages.length ? (
                messages.map((message) =>
                  message.sender._id === currentUser.id ? (
                    <li
                      className="d-flex justify-content-between mb-4"
                      style={{ margin: "2vh" }}
                    >
                      <MDBCard>
                        <MDBCardHeader className="d-flex justify-content-between p-3">
                          <p className="fw-bold mb-0">You</p>
                          <p className="text-muted small mb-0">
                            <MDBIcon far icon="clock" />{" "}
                            {formatDate(message.updatedAt)}
                          </p>
                        </MDBCardHeader>
                        <MDBCardBody>
                          <p className="mb-0">{message.content}</p>
                        </MDBCardBody>
                      </MDBCard>
                      <div className="sender-info">
                        <img
                          src={message.sender.avatar}
                          alt="avatar"
                          className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                          id="sender-avatar"
                        />
                        <div className="message-management">
                          <RiEditFill
                            id="edit-message-btn"
                            onClick={() => handleEditMessage(message)}
                          />
                          {showEditMessage && (
                            <EditMessageForm
                              open={showEditMessage}
                              close={closeEditMessage}
                              message={selectedMessage}
                              refreshMessages={() =>
                                handleStudentChat(selectedChat)
                              }
                            />
                          )}
                          <RiDeleteBin5Fill
                            id="delete-message-btn"
                            onClick={() => handleDeleteMessage(message.id)}
                          />
                        </div>
                      </div>
                    </li>
                  ) : (
                    <li
                      class="d-flex justify-content-between mb-4"
                      style={{ margin: "2vh" }}
                    >
                      <img
                        src={message.sender.avatar}
                        alt="avatar"
                        className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                        id="receiver-avatar"
                      />
                      <MDBCard className="w-100">
                        <MDBCardHeader className="d-flex justify-content-between p-3">
                          <p class="fw-bold mb-0">{message.sender.username}</p>
                          <p class="text-muted small mb-0">
                            <MDBIcon far icon="clock" />
                            {formatDate(message.updatedAt)}
                          </p>
                        </MDBCardHeader>
                        <MDBCardBody>
                          <p className="mb-0">{message.content}</p>
                        </MDBCardBody>
                      </MDBCard>
                    </li>
                  )
                )
              ) : (
                <div className="text-center" style={{ marginTop: "1vh" }}>
                  <p className="text-muted">No messages yet</p>
                </div>
              )}
            </div>

            <li className="bg-white mb-3" style={{ marginTop: "3vh" }}>
              <MDBTextArea
                label="Message"
                id="textAreaExample"
                rows={4}
                value={message}
                onChange={(e) => setMessage(e.target.value)}
              />
            </li>
            <MDBBtn
              color="info"
              rounded
              className="float-end"
              onClick={() => handleSendMessage(selectedChat)}
            >
              Send
            </MDBBtn>
          </MDBTypography>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default CoordinatorChat;
