import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
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
import { useEffect, useState } from "react";
import { RiDeleteBin5Fill, RiEditFill } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "../../css/Dialogue.css";
import ChatService from "../../services/chat.service";
import EditMessageForm from "./edit.message";

const StudentChat = ({ currentUser }) => {
  const [loading, setLoading] = useState(false);
  const [chat, setChat] = useState({});
  const [message, setMessage] = useState("");

  const getChatWithCoordinator = async () => {
    setLoading(true);
    await ChatService.contactCoordinator()
      .then((response) => {
        setChat(response.data);
      })
      .catch((error) => {
        console.log(error);
        toast.error("An error occurred while fetching chat with coordinator");
      });
    setLoading(false);
  };

  useEffect(() => {
    getChatWithCoordinator();
  }, []);

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
        await getChatWithCoordinator();
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
      await getChatWithCoordinator();
      toast.success("Message deleted successfully");
    } catch (error) {
      toast.error("Failed to delete message");
      console.error(error);
    }
  };

  return (
    <MDBCard>
      <ToastContainer />
      <h1 className="text-center">Chat with Coordinators</h1>
      <MDBCardBody id="chat">
        <MDBTypography listUnStyled className="mb-0" />
        {loading ? (
          <MDBContainer id="loading-page">
            <Box>
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
              <Skeleton animation="wave" />
              <Skeleton />
              <Skeleton animation={false} />
              <Skeleton animation="wave" />
              <Skeleton />
              <Skeleton animation={false} />
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
              <Skeleton />
              <Skeleton animation="wave" />
              <Skeleton animation={false} />
            </Box>
          </MDBContainer>
        ) : (
          <MDBContainer>
            <MDBRow className="studentchat">
              <MDBCol id="compose-message-container">
                <div className="message-form">
                  <MDBTypography tag="h5">Chat with Coordinator</MDBTypography>

                  <li className="bg-white mb-3" id="input-message">
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
                    onClick={() => handleSendMessage(chat.chat)}
                  >
                    Send
                  </MDBBtn>
                </div>
              </MDBCol>
              <MDBCol id="chat-details">
                <div className="chat-container">
                  {chat.messages && chat.messages.length > 0 ? (
                    chat.messages.map((message) =>
                      message.sender === currentUser.id ? (
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
                              src={chat.currentUser.avatar}
                              alt="avatar"
                              className="rounded-circle d-flex align-self-start me-3 shadow-1-strong"
                              id="sender-avatar"
                            />
                            <div className="message-management">
                              <RiEditFill
                                id="edit-message-btn"
                                onClick={() =>
                                  handleEditMessage(selectedMessage)
                                }
                              />
                              {showEditMessage && (
                                <EditMessageForm
                                  open={showEditMessage}
                                  close={closeEditMessage}
                                  message={message}
                                  refreshMessages={() =>
                                    getChatWithCoordinator()
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
                            src={chat.coordinator.avatar}
                            alt="avatar"
                            className="rounded-circle d-flex align-self-start ms-3 shadow-1-strong"
                            id="receiver-avatar"
                          />
                          <MDBCard className="w-100">
                            <MDBCardHeader className="d-flex justify-content-between p-3">
                              <p class="fw-bold mb-0">
                                {chat.coordinator.username}
                              </p>
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
                    <MDBTypography tag="p" className="text-muted">
                      No messages yet
                    </MDBTypography>
                  )}
                </div>
              </MDBCol>
            </MDBRow>
          </MDBContainer>
        )}
      </MDBCardBody>
    </MDBCard>
  );
};

export default StudentChat;
