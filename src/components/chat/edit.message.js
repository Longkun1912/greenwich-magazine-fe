import { useState } from "react";
import Modal from "react-bootstrap/Modal";
import { toast } from "react-toastify";
import ChatService from "../../services/chat.service";

const EditMessageForm = ({ message, refreshMessages, open, close }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [messageForm, setMessageForm] = useState({
    content: message.content,
    // Validation
    contentError: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setMessageForm({
      ...messageForm,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    setMessageForm((prev) => ({
      ...prev,
      contentError: "",
    }));

    if (messageForm.content === "") {
      setMessageForm((prev) => ({
        ...prev,
        contentError: "Message is required",
      }));
      setIsSubmitting(false);
      return;
    } else {
      const updatedMessage = new FormData();
      updatedMessage.append("content", messageForm.content);

      try {
        const response = await ChatService.editMessage(
          message.id,
          updatedMessage
        );
        if (response.status === 200) {
          toast.success("Message updated successfully");
          await refreshMessages();
          close();
        } else {
          setIsSubmitting(false);
          setError("Failed to edit message");
          toast.error("Failed to edit message");
          return;
        }
      } catch (error) {
        setIsSubmitting(false);
        console.error(error);
        setError("Failed to edit message");
        toast.error("Failed to edit message");
        return;
      }

      setIsSubmitting(false);
    }
  };

  return (
    <Modal
      aria-labelledby="contained-modal-title-vcenter"
      centered
      show={open}
      onHide={close}
      backdrop="static"
      keyboard={false}
    >
      <form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Message</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="form-group">
            <label htmlFor="content" style={{ fontSize: "2.5vh" }}>
              Message:
            </label>
            <textarea
              className="form-control"
              name="content"
              style={{ marginTop: "2vh" }}
              value={messageForm.content}
              onChange={handleChange}
              rows={6}
            ></textarea>
            {messageForm.contentError && (
              <div className="alert alert-danger mt-1">
                {messageForm.contentError}
              </div>
            )}
          </div>
          {error && <div className="alert alert-danger mt-1">{error}</div>}
        </Modal.Body>
        <Modal.Footer>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Submit"}
          </button>
          <button type="button" className="btn btn-secondary" onClick={close}>
            Close
          </button>
        </Modal.Footer>
      </form>
    </Modal>
  );
};

export default EditMessageForm;
