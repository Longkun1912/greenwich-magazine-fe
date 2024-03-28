// import {Modal, Button} from 'react-bootstrap';
// import { useState, useEffect } from 'react';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import {putUpdateEvent} from '../../services/event.service';
// import DatePicker from "react-datepicker";
// import "react-datepicker/dist/react-datepicker.css";


// const EditEvent = (props) => {
//   const {show, handleClose, dataEventEdit} = props;
//   const [name, setName] = useState("");
//   const [description, setDescription] = useState("");
//   const [firstDeadLineDate, setfirstDeadLineDate] = useState("");
//   const [finalDeadLineDate, setfinalDeadLineDate] = useState("");


//   useEffect (()=> {
//     if(show && dataEventEdit) {
//       setName(dataEventEdit.name)
//       setDescription(dataEventEdit.description)
//       setfirstDeadLineDate(dataEventEdit.firstDeadLineDate)
//       setfinalDeadLineDate(dataEventEdit.finalDeadLineDate)
//     }
//   }, [dataEventEdit, show]);

//   const handleEditEvent = async () => {
   
//   }

//   return (
//     <>
//         <Modal show={show} onHide={handleClose}>
//         <Modal.Header closeButton>
//             <Modal.Title>Edit Event</Modal.Title>
//         </Modal.Header>
//         <Modal.Body>
//             <div className='body-add-new-Event'>
//             <div>
//             <form>
//                 <div className="mb-3">
//                 <label className="form-label">Name</label>
//                 <input 
//                     type="text" 
//                     className="form-control" 
//                     value={name} 
//                     onChange={(event) => setName(event.target.value)}
//                 />
//                 </div>
//                 <div className="mb-3">
//                 <label className="form-label">Description</label>
//                 <input 
//                     type="text" 
//                     className="form-control" 
//                     value={description} 
//                     onChange={(event) => setDescription(event.target.value)}
//                 />
//                 </div>
//                 <div className="mb-3">
//                 <label className="form-label">firstDeadLineDate</label>
//                 <DatePicker
//                     className="form-control"
//                     selected={firstDeadLineDate}
//                     onChange={(date) => setfirstDeadLineDate(date)}
//                     showTimeSelect
//                     timeFormat="HH:mm"
//                     timeIntervals={15}
//                     timeCaption="Time"
//                     dateFormat="MMMM d, yyyy h:mm aa"
//                 />
//                 </div>
//                 <div className="mb-3">
//                 <label className="form-label">finalDeadLineDate</label>
//                 <DatePicker
//                     className="form-control"
//                     selected={finalDeadLineDate}
//                     onChange={(date) => setfinalDeadLineDate(date)}
//                     showTimeSelect
//                     timeFormat="HH:mm"
//                     timeIntervals={15}
//                     timeCaption="Time"
//                     dateFormat="MMMM d, yyyy h:mm aa"
//                 />
//                 </div>

//             </form>
//             </div>
//             </div>
//         </Modal.Body>
//         <Modal.Footer>
//             <Button variant="secondary" onClick={handleClose}>
//             Close
//             </Button>
//             <Button variant="primary" onClick={handleEditEvent}>
//             Save Changes
//             </Button>
//         </Modal.Footer>
//         <ToastContainer />
//         </Modal>
//     </>
//     );

// }


// export default EditEvent;




import { Modal, Button } from 'react-bootstrap';
import { useState, useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { putUpdateEvent } from '../../services/event.service';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const EditEvent = (props) => {
  const { show, handleClose, dataEventEdit } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [firstDeadLineDate, setfirstDeadLineDate] = useState("");
  const [finalDeadLineDate, setfinalDeadLineDate] = useState("");

  useEffect(() => {
    if (show && dataEventEdit) {
      setName(dataEventEdit.name);
      setDescription(dataEventEdit.description);
      setfirstDeadLineDate(new Date(dataEventEdit.firstDeadLineDate));
      setfinalDeadLineDate(new Date(dataEventEdit.finalDeadLineDate));
    }
  }, [dataEventEdit, show]);

  const handleEditEvent = async () => {
    try {
      const updatedEvent = {
        id: dataEventEdit._id,
        name,
        description,
        firstDeadLineDate,
        finalDeadLineDate
      };

      await putUpdateEvent(updatedEvent);
      toast.success("Event updated successfully");
      handleClose();
      setTimeout(() => {
        window.location.reload();
    }, 2500);
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
                  <label className="form-label">First Deadline Date</label>
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
                  <label className="form-label">Final Deadline Date</label>
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
          <Button variant="primary" onClick={handleEditEvent}>
            Save Changes
          </Button>
        </Modal.Footer>
        <ToastContainer />
      </Modal>
    </>
  );
}

export default EditEvent;
