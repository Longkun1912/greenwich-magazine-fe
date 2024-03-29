import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import auth from "../../services/auth.service";
import contributionService from "../../services/contribution.service";
import eventService from "../../services/event.service";
import UserValidation from "../../validation/user";

const statusOptions = ["pending", "approved", "rejected", "modified"];

const currentAuthenticatedUser = auth.getCurrentUser();

const CreateContribution = (props) => {
  const { show, handleClose, fetchContributions } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvent();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const [contributionForm, setContributionForm] = useState({
    title: "",
    content: "",
    status: "",
    event: null,
    image: null,
    document: null,
    // Validation
    titleError: "",
    contentError: "",
    statusError: "",
    eventError: "",
    imageError: "",
    documentError: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContributionForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSelectStatus = (e) => {
    setContributionForm((prevData) => ({
      ...prevData,
      status: e.target.value,
    }));
  };

  const handleSelectEvent = (e) => {
    setContributionForm((prevData) => ({
      ...prevData,
      event: e.target.value,
    }));
  };

  const handleImageChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      setContributionForm((prevData) => ({
        ...prevData,
        image: file,
      }));
    }
  };

  const handleDocumentChange = (e) => {
    if (e.target.files.length) {
      const file = e.target.files[0];
      setContributionForm((prevData) => ({
        ...prevData,
        document: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setContributionForm((prevData) => ({
      ...prevData,
      titleError: "",
      contentError: "",
      statusError: "",
      eventError: "",
      imageError: "",
      documentError: "",
    }));

    const { title, content, status, event, image, document } = contributionForm;

    const titleError = UserValidation.requiredField(title);
    const contentError = UserValidation.requiredField(content);
    const statusError = !status ? "Status is required" : "";
    const eventError = !event ? "Event is required" : "";
    const imageError = !image ? "Image is required" : "";
    const documentError = !document ? "Document is required" : "";

    if (
      titleError ||
      contentError ||
      statusError ||
      eventError ||
      imageError ||
      documentError
    ) {
      setContributionForm((prevData) => ({
        ...prevData,
        titleError,
        contentError,
        statusError,
        eventError,
        imageError,
        documentError,
      }));
      setIsSubmitting(false);
      return;
    } else {
      try {
        const contribution = new FormData();

        console.log("Event:", contributionForm.event);

        contribution.append("title", contributionForm.title);
        contribution.append("content", contributionForm.content);
        contribution.append("status", contributionForm.status);
        contribution.append("event", contributionForm.event._id);
        contribution.append("image", contributionForm.image);
        contribution.append("document", contributionForm.document);
        contribution.append("submitter", currentAuthenticatedUser.id);

        await contributionService.createContribution(contribution);
        await fetchContributions();
        setIsSubmitting(false);
        handleClose();
      } catch (error) {
        setError(error.response.data.error);
        setContributionForm((prevData) => ({
          ...prevData,
        }));

        setIsSubmitting(false);
        return;
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Add New Contribution</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="body-add-new-faculty">
              <div>
                <div className="mb-3">
                  <label className="form-label">Title</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contributionForm.title}
                    name="title"
                    onChange={handleChange}
                    validations={contributionForm.titleError}
                  />
                  {contributionForm.titleError && (
                    <div className="error-message">
                      {contributionForm.titleError}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contributionForm.content}
                    name="content"
                    onChange={handleChange}
                    validations={contributionForm.contentError}
                  />
                  {contributionForm.contentError && (
                    <div className="error-message">
                      {contributionForm.contentError}
                    </div>
                  )}
                </div>
                <div className="mb-3">
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      fullWidth
                      onChange={(e) => handleSelectStatus(e)}
                    >
                      <MenuItem value="" disabled>
                        <em>Select a status</em>
                      </MenuItem>
                      {statusOptions.map((status) => (
                        <MenuItem key={status} value={status}>
                          {status}
                        </MenuItem>
                      ))}
                    </Select>
                    {contributionForm.statusError && (
                      <Alert variant="danger">
                        {contributionForm.statusError}
                      </Alert>
                    )}
                  </FormControl>
                </div>
                <div className="mb-3">
                  <FormControl fullWidth>
                    <InputLabel>Events</InputLabel>
                    <Select
                      label="Event"
                      fullWidth
                      onChange={(e) => handleSelectEvent(e)}
                    >
                      <MenuItem value="" disabled>
                        <em>Select an event</em>
                      </MenuItem>
                      {events.map((event) => (
                        <MenuItem key={event.id} value={event}>
                          {event.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {contributionForm.eventError && (
                      <Alert variant="danger">
                        {contributionForm.eventError}
                      </Alert>
                    )}
                  </FormControl>
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <input
                    type="file"
                    className="form-control"
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
                  />
                  {contributionForm.imageError && (
                    <Alert variant="danger">
                      {contributionForm.imageError}
                    </Alert>
                  )}
                </div>
                <div className="mb-3">
                  <label className="form-label">Document</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".doc,.docx"
                    onChange={(e) => handleDocumentChange(e)}
                  />
                  {contributionForm.documentError && (
                    <Alert variant="danger">
                      {contributionForm.documentError}
                    </Alert>
                  )}
                </div>
              </div>
            </div>
            {error && <Alert variant="danger">{error}</Alert>}
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" type="submit">
              {isSubmitting ? "Updating..." : "Save changes"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
};
export default CreateContribution;
