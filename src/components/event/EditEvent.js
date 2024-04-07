import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { putUpdateEvent } from '../../services/event.service';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import '../../css/Event.css'; 

const EditEvent = (props) => {
  const { show, handleClose, dataEventEdit ,fetchEvents } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [firstDeadLineDate, setFirstDeadLineDate] = useState("");
  const [nameError, setNameError] = useState(false);
  const [descriptionError, setDescriptionError] = useState(false);
  const [dateError, setDateError] = useState(false);

  useEffect(() => {
    if (show && dataEventEdit) {
      setName(dataEventEdit.name);
      setDescription(dataEventEdit.description);
      setFirstDeadLineDate(new Date(dataEventEdit.firstDeadLineDate));
    }
  }, [dataEventEdit, show]);

  const handleEditEvent = async () => {
    if (!name) {
      setNameError(true);
      return;
    }
    if (!description) {
      setDescriptionError(true);
      return;
    }
    if (!firstDeadLineDate) {
      setDateError(true);
      return;
    }

    try {
      const updatedEvent = {
        id: dataEventEdit._id,
        name,
        description,
        firstDeadLineDate,
      };

      await putUpdateEvent(updatedEvent);
      await fetchEvents();
      setTimeout(() => {
        handleClose();
      }, 2000);
      toast.success("Event updated successfully");
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    }
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Edit Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='body-add-new-Event'>
            <div>
              <form>
                <div className="mb-3">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className={`form-control ${nameError ? 'is-invalid' : ''}`}
                    value={name}
                    onChange={(event) => { setName(event.target.value); setNameError(false) }}
                  />
                  {nameError && <div className="invalid-feedback name-error"><i className="fas fa-exclamation-circle"></i> Name is required</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">Description</label>
                  <input
                    type="text"
                    className={`form-control ${descriptionError ? 'is-invalid' : ''}`}
                    value={description}
                    onChange={(event) => { setDescription(event.target.value); setDescriptionError(false) }}
                  />
                  {descriptionError && <div className="invalid-feedback name-error"><i className="fas fa-exclamation-circle"></i> Description is required</div>}
                </div>
                <div className="mb-3">
                  <label className="form-label">First Deadline Date</label> <br/>
                  <DatePicker
                    className={`form-control ${dateError ? 'is-invalid' : ''}`}
                    selected={firstDeadLineDate}
                    onChange={(date) => { setFirstDeadLineDate(date); setDateError(false) }}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                  />
                  {(dateError && !firstDeadLineDate) && <div className="invalid-feedback"><i className="fas fa-exclamation-circle"></i> Deadline is required</div>}
                </div>
              </form>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>
            Close
          </Button>
          <Button variant="primary" onClick={handleEditEvent}>
            Save Changes
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

export default EditEvent;
<ToastContainer />

