import { Dropzone, FileMosaic } from "@dropzone-ui/react";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCheckbox,
  MDBCol,
  MDBContainer,
  MDBInput,
  MDBRow,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import auth from "../../services/auth.service";
import contributionService from "../../services/contribution.service";
import eventService from "../../services/event.service";
import UserValidation from "../../validation/user";

const StudentContributionForm = () => {
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
    title: "",
    event: null,
    images: [],
    documens: [],
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
        const contribution = new FormData();

        console.log("Event:", contributionSubmission.event);

        contribution.append("title", contributionSubmission.title);
        contribution.append("event", contributionSubmission.event._id);

        // Loop through image files and append them
        for (const image of [...new Set(contributionSubmission.images)]) {
          contribution.append("image", image.file); // Use image.file for actual file data
        }

        // Loop through document files and append them
        for (const document of [...new Set(contributionSubmission.documents)]) {
          contribution.append("document", document.file); // Use document.file for actual file data
        }

        contribution.append("submitter", currentAuthenticatedUser.id);

        await contributionService.submitContribution(contribution);
        toast.success("Contribution submitted successfully");
        setContributionSubmission((prevData) => ({
          ...prevData,
          title: "",
          event: null,
          images: [],
          documents: [],
        }));
        setImageFiles([]);
        setDocumentFiles([]);
        setIsSubmitting(false);
      } catch (error) {
        setError(error.response.data.error);
        toast.error("Failed to submit contribution");
        setContributionSubmission((prevData) => ({
          ...prevData,
        }));

        setIsSubmitting(false);
        return;
      }
    }
  };

  return (
    <MDBContainer>
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol lg="9" className="my-5">
          <h1 class="text-black mb-44">Contribution Form</h1>

          <form onSubmit={handleSubmit}>
            <MDBCard>
              <MDBCardBody className="px-4">
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

                <MDBBtn className="my-4" size="lg" type="submit">
                  {isSubmitting ? "Submitting..." : "Submit"}
                </MDBBtn>
              </MDBCardBody>
            </MDBCard>
          </form>
        </MDBCol>
      </MDBRow>
      <ToastContainer />
    </MDBContainer>
  );
};

export default StudentContributionForm;
