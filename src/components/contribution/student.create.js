import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import {
  MDBBtn,
  MDBCard,
  MDBCardBody,
  MDBCol,
  MDBContainer,
  MDBFile,
  MDBInput,
  MDBRow,
  MDBTextArea,
} from "mdb-react-ui-kit";
import { useEffect, useState } from "react";
import eventService from "../../services/event.service";

const StudentContributionForm = () => {
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

  return (
    <MDBContainer fluid>
      <MDBRow className="d-flex justify-content-center align-items-center">
        <MDBCol lg="9" className="my-5">
          <h1 class="text-black mb-4">Contribution Form</h1>

          <MDBCard>
            <MDBCardBody className="px-4">
              <MDBRow className="align-items-center pt-4 pb-3">
                <MDBCol md="3" className="ps-5">
                  <h6 className="mb-0">Select event</h6>
                </MDBCol>

                <MDBCol md="9" className="pe-5">
                  <Select
                    fullWidth
                    //   onChange={(e) => handleSelectEvent(e)}
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
                </MDBCol>
              </MDBRow>

              <hr className="mx-n3" />

              <MDBRow className="align-items-center pt-4 pb-3">
                <MDBCol md="3" className="ps-5">
                  <h6 className="mb-0">Name title</h6>
                </MDBCol>

                <MDBCol md="9" className="pe-5">
                  <MDBInput label="Title" size="lg" id="form1" type="text" />
                </MDBCol>
              </MDBRow>

              <hr className="mx-n3" />

              <MDBRow className="align-items-center pt-4 pb-3">
                <MDBCol md="3" className="ps-5">
                  <h6 className="mb-0">Write content</h6>
                </MDBCol>

                <MDBCol md="9" className="pe-5">
                  <MDBTextArea label="Content" id="textAreaExample" rows={5} />
                </MDBCol>
              </MDBRow>

              <hr className="mx-n3" />

              <MDBRow className="align-items-center pt-4 pb-3">
                <MDBCol md="3" className="ps-5">
                  <h6 className="mb-0">Upload Image</h6>
                </MDBCol>

                <MDBCol md="9" className="pe-5">
                  <MDBFile size="lg" id="customFile" accept="image/*" />
                  <div className="small text-muted mt-2">
                    Upload your image here
                  </div>
                </MDBCol>
              </MDBRow>

              <hr className="mx-n3" />

              <MDBRow className="align-items-center pt-4 pb-3">
                <MDBCol md="3" className="ps-5">
                  <h6 className="mb-0">Upload Document</h6>
                </MDBCol>

                <MDBCol md="9" className="pe-5">
                  <MDBFile size="lg" id="customFile" accept=".doc,.docx" />
                  <div className="small text-muted mt-2">
                    Upload your document here
                  </div>
                </MDBCol>
              </MDBRow>

              <hr className="mx-n3" />

              <MDBBtn className="my-4" size="lg">
                Submit
              </MDBBtn>
            </MDBCardBody>
          </MDBCard>
        </MDBCol>
      </MDBRow>
    </MDBContainer>
  );
};

export default StudentContributionForm;
