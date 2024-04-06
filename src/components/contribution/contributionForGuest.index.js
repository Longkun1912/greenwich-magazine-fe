import { saveAs } from "file-saver";
import JSZip from "jszip";
import React, { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/ContributionForGuest.css";
import auth from "../../services/auth.service"; // Import auth service để lấy thông tin về tài khoản đang đăng nhập
import ContributionService from "../../services/contribution.service";
import ContributionForGuestDetails from "./contributionForGuest.view.detail";

const ContributionForGuest = () => {
  const [contributions, setContributions] = useState([]);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [isShowModalViewContribution, setIsShowModalViewContribution] =
    useState(false);

  const fetchContributionsForGuest = async () => {
    try {
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
  };

  useEffect(() => {
    fetchContributionsForGuest();
  }, []);

  // Handle download document
  const handleDownloadDocument = async (documentName) => {
    try {
      // Gửi yêu cầu tải file về
      const response = await ContributionService.downloadDocument(documentName);
      const zip = new JSZip();
      zip.file(documentName, response.data);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${documentName}.zip`);
      toast.success("Document downloaded successfully!");
    } catch (error) {
      console.error("Error downloading document:", error);
      toast.error("Failed to download document!");
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
        <h1>View All Contribution For Guest</h1>
      </div>
      <div className="guest-content">
        {currentItems.map((contribution) => (
          <div className="card" id="contribution-info" key={contribution.id}>
            <div className="bg-image hover-overlay">
              <img
                src={contribution.image}
                className="guest-contribution-image"
                alt="Contribution"
              />
            </div>
            <div className="card-body">
              <h5 className="card-title">{contribution.title}</h5>
              <p className="card-text">
                Submitted by: {contribution.submitter.username}
              </p>
              <p className="card-text">Faculty: {contribution.faculty.name}</p>
              <p className="card-text">Event: {contribution.event.name}</p>
              <div className="versatile-actions">
                <button
                  className="btn btn-view"
                  onClick={() => handleViewContribution(contribution)}
                >
                  View
                </button>
                {contribution.document && (
                  <button
                    className="btn btn-download"
                    onClick={() =>
                      handleDownloadDocument(contribution.document)
                    }
                  >
                    Download
                  </button>
                )}
              </div>
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
