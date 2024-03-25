import {Modal, Button} from 'react-bootstrap';
import { useState } from 'react';
import { postCreateFaculty } from '../../services/faculty.service';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


const CreateFaculty = (props) => {
  const {show, handleClose} = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);

  const handleSaveFaculty = async () => {
    try {
      let res = await postCreateFaculty(name, description, image);
      console.log(">>check res", res);
      if (res && res.id) {
        handleClose();
        setName('');
        setDescription('');
        setImage('');
      }
      toast.success("Faculty created successfully"); // Hiển thị thông báo sau khi tạo thành công và đóng modal
        setTimeout(() => {
          window.location.reload();
      }, 2500);
    } catch (error) {
      console.error("Error creating faculty:", error);
      toast.error("Failed to create faculty");
    }
  }
  
  // Function to handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Assuming only one file is selected
    setImage(file);
  }

  return(
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title>Add New Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className='body-add-new-faculty'>
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
                <label className="form-label">Image</label>
                <input 
                  type="file" 
                  className="form-control" 
                  onChange={handleImageChange} 
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
          <Button variant="primary" onClick={handleSaveFaculty}>
            Save Changes
          </Button>
        </Modal.Footer>
        <ToastContainer />
      </Modal>
    </>
  );

};
export default CreateFaculty;
