import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ContributionService from "../../services/contribution.service";
import "../../css/ContributionForGuest.css";
import StudentContributionDetails from "./student.view.detail";

const ContributionForGuest = () => {
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [isShowModalViewContribution, setIsShowModalViewContribution] = useState(false);

  const fetchAllContributionsForGuest = async () => {
    try {
      const response = await ContributionService.getAllContributionForGuest();
      setContributions(response.data);
    } catch (error) {
      console.error("Error fetching contributions for guest:", error);
      toast.error("Failed to fetch contributions for guest!");
    }
  };

  useEffect(() => {
    fetchAllContributionsForGuest();
  }, []);

  const handleViewContribution = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalViewContribution(true);
  };

  const handleCloseModalViewContribution = () => {
    setIsShowModalViewContribution(false);
  };

  return (
    <div className="guest-contribution-container">
      <ToastContainer />
      <div className="header">
        <h1>All Public Contributions</h1>
      </div>
      <div className="guest-content">
        {contributions.map((contribution) => (
          <div className="card" id="contribution-info" key={contribution.id}>
            <div className="bg-image hover-overlay">
              <img src={contribution.image} className="guest-contribution-image" alt="Contribution" />
            </div>
            <div className="card-body">
              <h5 className="card-title">{contribution.title}</h5>
              <p className="card-text">Submitted by: {contribution.submitter}</p>
              <div className="versatile-actions">
                <button className="btn btn-primary" onClick={() => handleViewContribution(contribution)}>
                  View
                </button>
                <a href={contribution.document.replace(/^http:/, "https:")} target="_blank" rel="noopener noreferrer">
                  <button className="btn btn-success">Download</button>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
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

export default ContributionForGuest;

