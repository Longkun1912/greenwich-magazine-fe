import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { MDBCheckbox, MDBCol, MDBInput, MDBRow } from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { Alert, Button, Modal } from "react-bootstrap";
import Form from "react-bootstrap/Form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../../services/auth.service";
import contributionService from "../../services/contribution.service";
import eventService from "../../services/event.service";
import UserValidation from "../../validation/user";

const StudentUpdateContributionForm = ({
  open,
  close,
  contribution,
  fetchContributions,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [events, setEvents] = useState([]);
  const [isChecked, setIsChecked] = useState(false);
  const [imageFiles, setImageFiles] = useState([]);
  const [documentFiles, setDocumentFiles] = useState([]);

  const currentAuthenticatedUser = auth.getCurrentUser();

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

  const [contributionSubmission, setContributionSubmission] = useState({
    title: contribution.title,
    event: contribution.event,
    images: [],
    documents: [],
    // Validation
    titleError: "",
    eventError: "",
    checkboxError: "",
  });

  const handleSelectEvent = (e) => {
    setContributionSubmission({
      ...contributionSubmission,
      event: e.target.value,
    });
  };

  // Handle uploading multiple image files
  const handleUploadImages = (files) => {
    setImageFiles(files);
    setContributionSubmission((prevData) => ({
      ...prevData,
      images: files,
    }));
  };

  // Handle uploading multiple document files
  const handleUploadDocuments = (files) => {
    setDocumentFiles(files);
    setContributionSubmission((prevData) => ({
      ...prevData,
      documents: files,
    }));
  };

  const handleCheckboxChange = (e) => {
    setIsChecked(e.target.checked);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContributionSubmission({
      ...contributionSubmission,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    setContributionSubmission((prevData) => ({
      ...prevData,
      titleError: "",
      eventError: "",
      checkboxError: "",
    }));

    console.log("Check?", isChecked);

    const { title, event } = contributionSubmission;

    const titleError = UserValidation.requiredField(title);
    const eventError = !event ? "Event is required" : "";
    const checkboxError = !isChecked
      ? "You must agree to the terms and conditions"
      : "";

    if (titleError || eventError || checkboxError) {
      setContributionSubmission((prevData) => ({
        ...prevData,
        titleError,
        eventError,
        checkboxError,
      }));
      setIsSubmitting(false);
      return;
    } else {
      try {
        const contributionForm = new FormData();

        contributionForm.append("id", contribution.id);
        contributionForm.append("title", contributionSubmission.title);
        contributionForm.append("event", contributionSubmission.event._id);
        // Loop through image files and append them
        for (const image of [...new Set(contributionSubmission.images)]) {
          contributionForm.append("image", image.file);
        }

        // Loop through document files and append them
        for (const document of [...new Set(contributionSubmission.documents)]) {
          contributionForm.append("document", document.file);
        }
        contributionForm.append("submitter", currentAuthenticatedUser.id);

        await contributionService.editContribution(contributionForm);
        await fetchContributions();
        toast.success("Update Contribution successfully");
        setImageFiles([]);
        setDocumentFiles([]);
        close();
      } catch (error) {
        console.log(error);
        setError(error.response.data.error);
        toast.error("Failed to update contribution");
        setContributionSubmission((prevData) => ({
          ...prevData,
        }));

        setIsSubmitting(false);
        return;
      }
    }
  };

  return (
    <Modal show={open} onHide={close}>
      {/* <ToastContainer /> */}
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title10">Edit Contribution</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <MDBRow className="align-items-center pt-4 pb-3">
            <MDBCol md="3" className="ps-5">
              <h6 className="mb-0">Select event</h6>
            </MDBCol>

            <MDBCol md="9" className="pe-5">
              <Select fullWidth onChange={(e) => handleSelectEvent(e)}>
                <MenuItem value="" disabled>
                  <em>Select an event</em>
                </MenuItem>
                {events.map((event) => (
                  <MenuItem key={event.id} value={event}>
                    {event.name}
                  </MenuItem>
                ))}
              </Select>
              {contributionSubmission.eventError && (
                <Alert variant="danger">
                  {contributionSubmission.eventError}
                </Alert>
              )}
            </MDBCol>
          </MDBRow>

          <hr className="mx-n3" />

          <MDBRow className="align-items-center pt-4 pb-3">
            <MDBCol md="3" className="ps-5">
              <h6 className="mb-0">Name title</h6>
            </MDBCol>

            <MDBCol md="9" className="pe-5">
              <MDBInput
                label="Title"
                size="lg"
                id="form1"
                type="text"
                name="title"
                value={contributionSubmission.title}
                onChange={handleChange}
                validations={contributionSubmission.titleError}
              />
              {contributionSubmission.titleError && (
                <div className="error-message">
                  {contributionSubmission.titleError}
                </div>
              )}
            </MDBCol>
          </MDBRow>

          <hr className="mx-n3" />

          <MDBRow className="align-items-center pt-4 pb-3">
            <MDBCol md="3" className="ps-5">
              <h6 className="mb-0">Upload Image</h6>
            </MDBCol>

            <MDBCol md="9" className="pe-5">
              <Dropzone
                onChange={(files) => handleUploadImages(files)}
                multiple
                accept="image/*"
              >
                {imageFiles.map((file) => (
                  <FileMosaic {...file} preview />
                ))}
              </Dropzone>
            </MDBCol>
          </MDBRow>

          <hr className="mx-n3" />

          <MDBRow className="align-items-center pt-4 pb-3">
            <MDBCol md="3" className="ps-5">
              <h6 className="mb-0">Upload Document</h6>
            </MDBCol>

            <MDBCol md="9" className="pe-5">
              <Dropzone
                onChange={(files) => handleUploadDocuments(files)}
                multiple
                accept=".doc,.docx"
              >
                {documentFiles.map((file) => (
                  <FileMosaic {...file} preview />
                ))}
              </Dropzone>
            </MDBCol>
          </MDBRow>

          <hr className="mx-n3" />

          <div className="d-flex flex-row justify-content-center mb-4">
            <MDBCheckbox
              name="flexCheck"
              id="flexCheckDefault"
              checked={isChecked}
              onChange={(e) => handleCheckboxChange(e)}
              label={
                <span>
                  I agree to the <u>Terms and Conditions</u>
                </span>
              }
            />
          </div>

          {contributionSubmission.checkboxError && (
            <Alert variant="danger">
              {contributionSubmission.checkboxError}
            </Alert>
          )}

          <hr className="mx-n3" />

          {error && <Alert variant="danger">{error}</Alert>}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={close}>
            Close
          </Button>
          <Button variant="primary" type="submit">
            {isSubmitting ? "Updating..." : "Save changes"}
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default StudentUpdateContributionForm;
