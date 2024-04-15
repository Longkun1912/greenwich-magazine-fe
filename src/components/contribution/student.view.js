import { Ripple, initMDB } from "mdb-ui-kit";
import React, { useEffect, useState } from "react";
import { FaRegEdit } from "react-icons/fa";
import { GrView } from "react-icons/gr";
import { ImFolderDownload } from "react-icons/im";
import { MdOutlineFeedback } from "react-icons/md";
import { RiDeleteBin5Line } from "react-icons/ri";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/ContributionForStudent.css";
import auth from "../../services/auth.service";
import ContributionService from "../../services/contribution.service";
import StudentUpdateContributionForm from "./student.update";
import StudentViewComment from "./student.view.comment";
import StudentContributionDetails from "./student.view.detail";
const StudentContributionIndex = () => {
  const currentAuthenticatedUser = auth.getCurrentUser();
  const [contributions, setContributions] = useState([]);
  const [isShowModalViewContribution, setIsShowModalViewContribution] =
    useState(false);
  const [isShowModalEditContribution, setIsShowModalEditContribution] =
    useState(false);
  const [isShowModalViewFeedback, setIsShowModalViewFeedback] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchContributionsInFaculty = async () => {
    try {
      setLoading(true);
      const response = await ContributionService.viewContributionsInFaculty();
      setContributions(response.data);
    } catch (error) {
      console.error("Error fetching contributions:", error);
      toast.error("Failed to fetch contributions!");
    }
    setLoading(false);
  };

  // Handle download document
  const handleDownloadContribution = async (contribution) => {
    try {
      const response = await ContributionService.downloadFiles(
        contribution.documents,
        contribution.images
      );

      const blob = await response.data; // Get the blob data from response
      const url = window.URL.createObjectURL(blob); // Create a temporary URL for the blob

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", contribution.title); // Set download filename
      link.style.display = "none"; // Hide the link element

      document.body.appendChild(link); // Temporarily append to body
      link.click(); // Simulate a click to trigger download
      toast.success("Downloaded successfully");

      // Cleanup: Remove the temporary link
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document");
    }
  };

  // Handle view contribution
  const handleViewContribution = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalViewContribution(true);
  };

  const handleCloseModalViewContribution = () => {
    setIsShowModalViewContribution(false);
  };

  // Handle edit contribution
  const handleEditContribution = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalEditContribution(true);
  };

  const handleCloseModalEditContribution = () => {
    setIsShowModalEditContribution(false);
  };

  //handle view feedback
  const handleViewFeedback = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalViewFeedback(true);
  };

  const handleCloseModalViewFeedback = () => {
    setIsShowModalViewFeedback(false);
  };

  // Handle delete contribution
  const handleDeleteContribution = async (id) => {
    try {
      await ContributionService.removeContribution(id);
      fetchContributionsInFaculty();
      toast.success("Contribution deleted successfully!");
    } catch (error) {
      console.error("Error deleting contribution:", error);
      toast.error("Failed to delete contribution!");
    }
  };

  useEffect(() => {
    fetchContributionsInFaculty();
    initMDB({ Ripple });
  }, []);

  // Paginate contributions
  const totalPages = 100;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contributions.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="student-contribution-container">
      <ToastContainer />
      <div className="header">
        <h1>
          Contributions in your <span>{currentAuthenticatedUser.faculty}</span>
        </h1>
      </div>
      <div className="student-content">
        {currentItems.map((contribution) => (
          <div className="card" id="contribution-info" key={contribution.id}>
            <div
              className="bg-image hover-overlay"
              data-mdb-ripple-init
              data-mdb-ripple-color="light"
            >
              <img
                src="https://newjerseylawyernow.com/wp-content/uploads/2020/06/quill-pen-writing-scaled.jpg"
                className="student-contribution-image"
                alt="Nature"
              />

              <a href="#!">
                <div
                  className="mask"
                  style={{ backgroundColor: "rgba(251, 251, 251, 0.15)" }}
                ></div>
              </a>
            </div>
            <div className="card-body">
              <h5 className="card-title">{contribution.title}</h5>
              <p className="card-text">
                Submitted by: {contribution.submitter}
              </p>
              <div className="versatile-actions">
                <button
                  className="btn btn-studentview"
                  onClick={() => handleViewContribution(contribution)}
                >
                  <GrView className="action-icon" />
                </button>
                <button
                  className="btn btn-download"
                  onClick={() => handleDownloadContribution(contribution)}
                >
                  <ImFolderDownload className="action-icon" />
                </button>
              </div>
              {currentAuthenticatedUser.email === contribution.submitter && (
                <div className="only-actions">
                  <button
                    className="btn btn-feedback"
                    style={{ marginRight: "2vh" }}
                    onClick={() => handleViewFeedback(contribution)}
                  >
                    <MdOutlineFeedback className="action-icon" />
                  </button>
                  <button
                    className="btn btn-warning"
                    style={{ marginRight: "2vh" }}
                    onClick={() => handleEditContribution(contribution)}
                  >
                    <FaRegEdit className="action-icon" />
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteContribution(contribution.id)}
                  >
                    <RiDeleteBin5Line className="action-icon" />
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="pagination" id="contribution-paging">
        {[1, currentPage - 1, currentPage, currentPage + 1, totalPages]
          .filter((v, i, a) => a.indexOf(v) === i && v >= 1 && v <= totalPages)
          .map((page) => (
            <React.Fragment key={page}>
              <button
                onClick={() => setCurrentPage(page)}
                disabled={page === currentPage}
              >
                {page}
              </button>
              {page < totalPages && <span>...</span>}
            </React.Fragment>
          ))}
      </div>
      {isShowModalEditContribution && (
        <StudentUpdateContributionForm
          open={isShowModalEditContribution}
          close={handleCloseModalEditContribution}
          contribution={selectedContribution}
          fetchContributions={fetchContributionsInFaculty}
        />
      )}
      {isShowModalViewContribution && (
        <StudentContributionDetails
          contribution={selectedContribution}
          open={isShowModalViewContribution}
          close={handleCloseModalViewContribution}
        />
      )}
      {isShowModalViewFeedback && (
        <StudentViewComment
          contribution={selectedContribution}
          open={isShowModalViewFeedback}
          close={handleCloseModalViewFeedback}
        />
      )}
    </div>
  );
};

export default StudentContributionIndex;
