import { Ripple, initMDB } from "mdb-ui-kit";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/Contribution.css";
import auth from "../../services/auth.service";
import ContributionService from "../../services/contribution.service";
import StudentUpdateContributionForm from "./student.update";
import StudentContributionDetails from "./student.view.detail";

const StudentContributionIndex = () => {
  const currentAuthenticatedUser = auth.getCurrentUser();
  const [contributions, setContributions] = useState([]);
  const [isShowModalViewContribution, setIsShowModalViewContribution] =
    useState(false);
  const [isShowModalEditContribution, setIsShowModalEditContribution] =
    useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);

  const fetchContributionsInFaculty = async () => {
    try {
      const response = await ContributionService.viewContributionsInFaculty();
      setContributions(response.data);
    } catch (error) {
      console.error("Error fetching contributions:", error);
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

  return (
    <div className="student-contribution-container">
      <ToastContainer />
      <div className="header">
        <h1>Contributions in your faculty</h1>
      </div>
      <div className="student-content">
        {contributions.map((contribution) => (
          <div className="card" id="contribution-info">
            <div
              className="bg-image hover-overlay"
              data-mdb-ripple-init
              data-mdb-ripple-color="light"
            >
              <img
                src={contribution.image}
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
                  className="btn btn-primary"
                  style={{ marginRight: "2vh" }}
                  onClick={() => handleViewContribution(contribution)}
                >
                  View
                </button>
                <a href={contribution.document.replace(/^http:/, "https:")}>
                  <button className="btn btn-success">Download</button>
                </a>
              </div>
              {currentAuthenticatedUser.email === contribution.submitter && (
                <div className="only-actions">
                  <button
                    className="btn btn-warning"
                    style={{ marginRight: "2vh" }}
                    onClick={() => handleEditContribution(contribution)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={() => handleDeleteContribution(contribution.id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          </div>
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
    </div>
  );
};

export default StudentContributionIndex;
