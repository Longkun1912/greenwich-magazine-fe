import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postCreateFaculty } from "../../services/faculty.service";

const CreateFaculty = (props) => {
  const { show, handleClose, fetchFaculties } = props;
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState(false); 
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [imageError, setImageError] = useState(false); 
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleSaveFaculty = async () => {
    setIsSubmitting(true);
    try {
      // Check if Name and Image are provided
      if (!name || !image) {
        setNameError(!name);
        setImageError(!image);
        throw new Error("Please provide Name and Image.");
      }

      let res = await postCreateFaculty(name, description, image);
      await fetchFaculties();
      if (res && res.id) {
        setName("");
        setDescription("");
        setImage("");
      }
      handleClose();
      toast.success("Faculty created successfully");
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error creating faculty:", error);
      if (error.response && error.response.data) {
        if (error.response.data) {
          toast.error("Faculty with this name already exists.");
          return; 
        }
      }
      toast.error(error.message);
    }
  };
  
  // Function to handle image upload
  const handleImageChange = (event) => {
    const file = event.target.files[0]; // Assuming only one file is selected
    setImage(file);
  };

  return (
    <>
      <Modal show={show} onHide={handleClose}>
        <Modal.Header closeButton>
          <Modal.Title className="modal-title10">Add New Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new-faculty">
            <div>
              <form>
              <div className="mb-3">
                  <label className="form-label" style={{color: nameError ? 'red' : 'initial'}}>Name</label>
                  <input
                    type="text"
                    className={`form-control ${nameError ? 'border border-danger' : ''}`}
                    value={name}
                    onChange={(event) => {
                      setName(event.target.value);
                      setNameError(false); // Reset Name error when typing in the input
                    }}
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
                  <label className="form-label" style={{color: imageError ? 'red' : 'initial'}}>Image</label>
                  <input
                    type="file"
                    className={`form-control ${imageError ? 'border border-danger' : ''}`}
                    accept="image/*"
                    onChange={(e) => handleImageChange(e)}
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
            {isSubmitting ? "Saving..." : "Save changes"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};
export default CreateFaculty;
