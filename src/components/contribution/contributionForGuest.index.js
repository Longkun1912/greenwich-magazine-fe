import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/ContributionForGuest.css";
import auth from "../../services/auth.service"; // Import auth service để lấy thông tin về tài khoản đang đăng nhập
import ContributionService from "../../services/contribution.service";
import ContributionForGuestDetails from "./contributionForGuest.view.detail";

const ContributionForGuest = () => {
  const [loading, setLoading] = useState(false);
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [isShowModalViewContribution, setIsShowModalViewContribution] =
    useState(false);
  const currentUser = auth.getCurrentUser();

  const fetchContributionsForGuest = async () => {
    try {
      setLoading(true);
      const currentUser = auth.getCurrentUser();
      // Gửi yêu cầu đến backend chỉ lấy ra các đóng góp theo faculty của khách
      const response = await ContributionService.getAllContributionForGuest(
        currentUser.id
      );

      setContributions(response.data);
    } catch (error) {
      console.error("Error fetching contributions for guest:", error);
      toast.error("Failed to fetch contributions for guest!");
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchContributionsForGuest();
  }, []);

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

  // Tính index của đóng góp đầu tiên và cuối cùng trên trang hiện tại
  const totalPages = 50;
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = contributions.slice(indexOfFirstItem, indexOfLastItem);

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
        <h1>
          View All Contribution In <span>{currentUser.faculty}</span>
        </h1>
      </div>
      {loading ? (
        <Box>
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
          <Skeleton animation="wave" />
          <Skeleton />
          <Skeleton animation={false} />
          <Skeleton animation="wave" />
          <Skeleton />
          <Skeleton animation={false} />
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
          <Skeleton />
          <Skeleton animation="wave" />
          <Skeleton animation={false} />
        </Box>
      ) : (
        <div className="guest-content">
          {currentItems.map((contribution) => (
            <div className="card" id="contribution-info" key={contribution.id}>
              <div className="bg-image hover-overlay">
                <img
                  src="https://newjerseylawyernow.com/wp-content/uploads/2020/06/quill-pen-writing-scaled.jpg"
                  className="guest-contribution-image"
                  alt="Contribution"
                />
              </div>
              <div className="card-body">
                <h5 className="card-title">{contribution.title}</h5>
                <p className="card-text">
                  Submitted by: {contribution.submitter.username}
                </p>
                <p className="card-text">
                  Faculty: {contribution.faculty.name}
                </p>
                <p className="card-text">Event: {contribution.event.name}</p>
                <div className="versatile-actions">
                  <button
                    className="btn btn-view"
                    onClick={() => handleViewContribution(contribution)}
                  >
                    View
                  </button>
                  <button
                    className="btn btn-download"
                    onClick={() => handleDownloadContribution(contribution)}
                  >
                    Download
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

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
      {isShowModalViewContribution && (
        <ContributionForGuestDetails
          contribution={selectedContribution}
          open={isShowModalViewContribution}
          close={handleCloseModalViewContribution}
        />
      )}
    </div>
  );
};

export default ContributionForGuest;
