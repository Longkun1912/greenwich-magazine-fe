import { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postCreateFaculty } from "../../services/faculty.service";

const CreateFaculty = (props) => {
  const { show, handleClose, fetchFaculties } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSaveFaculty = async () => {
    setIsSubmitting(true);
    try {
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
      toast.error("Failed to create faculty");
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
<ToastContainer />
