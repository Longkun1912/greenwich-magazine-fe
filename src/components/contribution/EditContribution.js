import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import contributionService from "../../services/contribution.service";
import eventService from "../../services/event.service";

const statusOptions = ["pending", "approved", "rejected", "modified"];

const EditContribution = (props) => {
  const { show, handleClose, contribution, fetchContributions } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
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

  console.log("Selected contribution:", contribution);

  const [contributionForm, setContributionForm] = useState({
    id: contribution.id,
    title: contribution.title,
    content: contribution.content,
    status: contribution.status,
    event: contribution.event,
    image: contribution.image,
    document: contribution.document,
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

    try {
      console.log("Event:", JSON.stringify(contributionForm.event._id));

      const contribution = new FormData();
      contribution.append("id", contributionForm.id);
      contribution.append("title", contributionForm.title);
      contribution.append("content", contributionForm.content);
      contribution.append("status", contributionForm.status);
      contribution.append("event", contributionForm.event._id);
      contribution.append("image", contributionForm.image);
      contribution.append("document", contributionForm.document);

      await contributionService.updateContribution(contribution);
      await fetchContributions();
      setIsSubmitting(false);
      handleClose();
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating contribution:", error);
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>Update Contribution</Modal.Title>
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
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Content</label>
                  <input
                    type="text"
                    className="form-control"
                    value={contributionForm.content}
                    name="content"
                    onChange={handleChange}
                  />
                </div>
                <div className="mb-3">
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      fullWidth
                      onChange={(e) => handleSelectStatus(e)}
                      defaultValue={contributionForm.status}
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
                </div>
                <div className="mb-3">
                  <label className="form-label">Document</label>
                  <input
                    type="file"
                    className="form-control"
                    accept=".doc,.docx"
                    onChange={(e) => handleDocumentChange(e)}
                  />
                </div>
              </div>
            </div>
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
export default EditContribution;
