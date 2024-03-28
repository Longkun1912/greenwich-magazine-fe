import {Modal, Button} from 'react-bootstrap';
import { useState } from 'react';
import { postCreateEvent } from '../../services/event.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";


const CreateEvent = (props) => {
  const {show, handleClose} = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [firstDeadLineDate, setfirstDeadLineDate] = useState("");
  const [finalDeadLineDate, setfinalDeadLineDate] = useState("");


  const handleSaveEvent = async () => {
    try {
        let res = await postCreateEvent(name, description,firstDeadLineDate,finalDeadLineDate);
        console.log(">>check res", res);
        if (res && res.id) {
          handleClose();
          setName('');
          setDescription('');
          setfirstDeadLineDate('');
          setfinalDeadLineDate('');
        }
        toast.success("Event created successfully"); // Hiển thị thông báo sau khi tạo thành công và đóng modal
          setTimeout(() => {
            window.location.reload();
        }, 2500);
      } catch (error) {
        toast.error("Failed to create Event");
        console.error("Error creating Event:", error);
      }
  }

  return (
    <>
        <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
            <Modal.Title>Add New Event</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <div className='body-add-new-Event'>
            <div>
            <form>
                <div className="mb-3">
                <label className="form-label">Name</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={name} 
                    onChange={(event) => setName(event.target.value)}
                />
                </div>
                <div className="mb-3">
                <label className="form-label">Description</label>
                <input 
                    type="text" 
                    className="form-control" 
                    value={description} 
                    onChange={(event) => setDescription(event.target.value)}
                />
                </div>
                <div className="mb-3">
                <label className="form-label">firstDeadLineDate</label>
                <DatePicker
                    className="form-control"
                    selected={firstDeadLineDate}
                    onChange={(date) => setfirstDeadLineDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                </div>
                <div className="mb-3">
                <label className="form-label">finalDeadLineDate</label>
                <DatePicker
                    className="form-control"
                    selected={finalDeadLineDate}
                    onChange={(date) => setfinalDeadLineDate(date)}
                    showTimeSelect
                    timeFormat="HH:mm"
                    timeIntervals={15}
                    timeCaption="Time"
                    dateFormat="MMMM d, yyyy h:mm aa"
                />
                </div>

            </form>
            </div>
            </div>
        </Modal.Body>
        <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
            Close
            </Button>
            <Button variant="primary" onClick={handleSaveEvent}>
            Save Changes
            </Button>
        </Modal.Footer>
        <ToastContainer />
        </Modal>
    </>
    );

}


export default CreateEvent;