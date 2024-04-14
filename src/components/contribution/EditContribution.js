import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import contributionService from "../../services/contribution.service";
import eventService from "../../services/event.service";
import facultyService from "../../services/faculty.service";
import UserValidation from "../../validation/user";

const statusOptions = ["pending", "approved", "rejected", "modified"];

const EditContribution = (props) => {
  const { show, handleClose, contribution, fetchContributions } = props;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);

  const fetchEvents = async () => {
    try {
      const response = await eventService.getAllEvent();
      setEvents(response.data);
    } catch (error) {
      console.error("Error fetching events:", error);
    }
  };

  const fetchFaculties = async () => {
    try {
      const response = await facultyService.getAllFaculties();
      setFaculties(response.data);
    } catch (error) {
      console.error("Error fetching faculties:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
    fetchFaculties();
  }, []);

  console.log("Selected contribution:", contribution);

  const [contributionForm, setContributionForm] = useState({
    id: contribution.id,
    title: contribution.title,
    status: contribution.status,
    event: contribution.event,
    faculty: contribution.faculty,
    images: contribution.images,
    documents: contribution.documents,
    // Validation
    titleError: "",
    statusError: "",
    eventError: "",
    facultyError: "",
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

  const handleSelectFaculty = (e) => {
    setContributionForm((prevData) => ({
      ...prevData,
      faculty: e.target.value,
    }));
  };

  // Handle uploading multiple image files
  const handleUploadImages = (files) => {
    setImageFiles(files);
    setContributionForm((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  // Handle uploading multiple document files
  const handleUploadDocuments = (files) => {
    setDocumentFiles(files);
    setContributionForm((prevData) => ({
      ...prevData,
      documents: files,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setContributionForm((prevData) => ({
      ...prevData,
      titleError: "",
      statusError: "",
      eventError: "",
      facultyError: "",
    }));

    const { title, status, event, faculty } = contributionForm;

    const titleError = UserValidation.requiredField(title);
    const statusError = !status ? "Status is required" : "";
    const eventError = !event ? "Event is required" : "";
    const facultyError = !faculty ? "Faculty is required" : "";

    if (titleError || statusError || eventError || facultyError) {
      setContributionForm((prevData) => ({
        ...prevData,
        titleError,

        statusError,
        eventError,
        facultyError,
      }));
      setIsSubmitting(false);
      return;
    } else {
      try {
        console.log("Event:", JSON.stringify(contributionForm.event._id));

        const contribution = new FormData();
        contribution.append("id", contributionForm.id);
        contribution.append("title", contributionForm.title);
        contribution.append("status", contributionForm.status);
        contribution.append("event", contributionForm.event._id);
        contribution.append("faculty", contributionForm.faculty._id);

        // Loop through image files and append them
        for (const image of [...new Set(contributionForm.images)]) {
          contribution.append("image", image.file); // Use image.file for actual file data
        }

        // Loop through document files and append them
        for (const document of [...new Set(contributionForm.documents)]) {
          contribution.append("document", document.file); // Use document.file for actual file data
        }

        await contributionService.updateContribution(contribution);
        await fetchContributions();
        setIsSubmitting(false);
        handleClose();
        toast.success("Contribution updated successfully");
        setImageFiles([]);
        setDocumentFiles([]);
      } catch (error) {
        setError(error.response.data.error);
        setContributionForm((prevData) => ({
          ...prevData,
        }));
        setIsSubmitting(false);
        console.error("Error updating Contribution:", error);
        toast.error("Failed to update Contribution");
        return;
      }
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title className="modal-title10">
              Update Contribution
            </Modal.Title>
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
                  <FormControl fullWidth>
                    <InputLabel>Status</InputLabel>
                    <Select
                      label="Status"
                      fullWidth
                      onChange={(e) => handleSelectStatus(e)}
                      defaultValue={contribution.status}
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
                      defaultValue={contribution.event}
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
                  <FormControl fullWidth>
                    <InputLabel>Faculties</InputLabel>
                    <Select
                      label="Faculty"
                      fullWidth
                      onChange={(e) => handleSelectFaculty(e)}
                    >
                      <MenuItem value="" disabled>
                        <em>Select a faculty</em>
                      </MenuItem>
                      {faculties.map((faculty) => (
                        <MenuItem key={faculty.id} value={faculty}>
                          {faculty.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {contributionForm.facultyError && (
                      <Alert variant="danger">
                        {contributionForm.facultyError}
                      </Alert>
                    )}
                  </FormControl>
                </div>
                <div className="mb-3">
                  <label className="form-label">Image</label>
                  <Dropzone
                    onChange={(files) => handleUploadImages(files)}
                    multiple
                    accept="image/*"
                  >
                    {imageFiles.map((file) => (
                      <FileMosaic {...file} preview />
                    ))}
                  </Dropzone>
                </div>
                <div className="mb-3">
                  <label className="form-label">Document</label>
                  <Dropzone
                    onChange={(files) => handleUploadDocuments(files)}
                    multiple
                    accept=".doc,.docx"
                  >
                    {documentFiles.map((file) => (
                      <FileMosaic {...file} preview />
                    ))}
                  </Dropzone>
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
        {error && <Alert variant="danger">{error}</Alert>}
      </Modal>
    </>
  );
};
export default EditContribution;
<ToastContainer />;
