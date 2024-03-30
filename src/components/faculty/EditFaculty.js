import { useEffect, useState } from "react";
import { Button, Modal } from "react-bootstrap";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { putUpdateFaculty } from "../../services/faculty.service";

const EditFaculty = (props) => {
  const { show, handleClose, dataFacultyEdit, fetchFaculties } = props;
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [error, setError] = useState(""); // State để lưu trữ thông báo lỗi
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (show && dataFacultyEdit) {
      setName(dataFacultyEdit.name);
      setDescription(dataFacultyEdit.description);
    }
  }, [dataFacultyEdit, show]);

  const handleEditFaculty = async () => {
    setIsSubmitting(true);
    try {
      if (!image || !name || !description) {
        throw new Error("Please fill in all fields");
      }

      await putUpdateFaculty(dataFacultyEdit._id, name, description, image);
      await fetchFaculties();

      handleClose();
      toast.success("Faculty updated successfully");
      setIsSubmitting(false);
    } catch (error) {
      setIsSubmitting(false);
      console.error("Error updating faculty:", error);
      toast.error("Failed to update faculty");
      setError(error.message); // Set thông báo lỗi để hiển thị cho người dùng
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
          <Modal.Title>Edit Faculty</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="body-add-new-faculty">
            <div>
              {error && <div className="alert alert-danger">{error}</div>}{" "}
              {/* Hiển thị thông báo lỗi */}
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
          <Button variant="primary" onClick={handleEditFaculty}>
            {isSubmitting ? "Updating..." : "Save changes"}
          </Button>
        </Modal.Footer>
        <ToastContainer />
      </Modal>
    </>
  );
};

export default EditFaculty;
