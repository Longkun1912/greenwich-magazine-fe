import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import { useCallback, useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { AiFillEdit } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdAddComment } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "../../css/IndexForCoordinator.css";
import auth from "../../services/auth.service";
import ContributionService from "../../services/contribution.service";
import ContributionInfo from "./coordinator.ViewDetailContribution";
import ModalCommentContribution from "./coordinator.comment";
import ModalEditContribution from "./coordinator.edit";

const IndexForCoordinator = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShowModalEditForCoordinator, setIsShowModalEditForCoordinator] =
    useState(false);
  const [dataEditForCoordinator, setDataEditForCoordinator] = useState({});
  const [
    isShowModalViewDetailContribution,
    setIsShowModalViewDetailContribution,
  ] = useState(false);
  const [isShowModalCommentContribution, setIsShowModalCommentContribution] =
    useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const currentUser = auth.getCurrentUser();

  const fetchContributions = useCallback(async () => {
    try {
      const currentUser = auth.getCurrentUser();
      setLoading(true);
      const response = await ContributionService.getAllContributionByFaculty(
        currentUser.id
      );
      setContributions(response.data);
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error("Error fetching contributions:", error);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  //handle View Detail Contribiton
  const handleViewDetailContribution = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalViewDetailContribution(true);
  };

  //handle Edit Contribiton
  const handleEditForCoordinator = (contribution) => {
    console.log("Selected contribution:", contribution);
    setDataEditForCoordinator(contribution);
    setIsShowModalEditForCoordinator(true);
  };

  //handle Comment Contribution
  const handleCommentContribution = (contribution) => {
    console.log("Selected contribution:", contribution);
    setDataEditForCoordinator(contribution);
    setIsShowModalCommentContribution(true);
  };

  //handle Close
  const handleClose = () => {
    setIsShowModalEditForCoordinator(false);
    setIsShowModalCommentContribution(false);
    setSelectedContribution(null);
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

  //sử dụng để chỉnh màu cho status
  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "status-pending";
      case "approved":
        return "status-approved";
      case "rejected":
        return "status-rejected";
      case "modified":
        return "status-modified";
      default:
        return "";
    }
  };

  //sử dụng để chỉnh màu cho state
  const getStateColor = (state) => {
    switch (state) {
      case "public":
        return "status-public";
      case "private":
        return "status-private";
      default:
        return "";
    }
  };

  const columns = [
    {
      accessorKey: "id",
      header: "ID",
      size: 200,
    },
    {
      accessorKey: "title",
      header: "Title",
      size: 100,
    },
    {
      header: "Download",
      Cell: ({ cell }) => (
        <div style={{ maxWidth: "10vh" }}>
          {cell.row.original.documents || cell.row.original.images ? (
            <Button
              className="btn btn-success"
              onClick={() => handleDownloadContribution(cell.row.original)}
            >
              Available
            </Button>
          ) : (
            <Button className="btn btn-danger">Unavailable</Button>
          )}
        </div>
      ),
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      Cell: ({ cell }) => (
        <button
          className={`btn btn-Status ${getStatusColor(
            cell.row.original.status
          )}`}
        >
          {cell.row.original.status}
        </button>
      ),
    },
    {
      accessorKey: "faculty",
      header: "Faculty",
      size: 100,
    },
    {
      accessorKey: "state",
      header: "State",
      size: 100,
      Cell: ({ cell }) => (
        <button
          className={`btn btn-State ${getStateColor(cell.row.original.state)}`}
        >
          {cell.row.original.state}
        </button>
      ),
    },

    {
      accessor: "Action",
      header: "Action",
      size: 100,
      Cell: ({ row }) => (
        <div>
          <GrView
            className="act-btn"
            onClick={() => handleViewDetailContribution(row.original)}
          />
          <AiFillEdit
            className="act-btn"
            onClick={() => handleEditForCoordinator(row.original)}
          />
          <MdAddComment
            className="act-btn"
            onClick={() => handleCommentContribution(row.original)}
          />
        </div>
      ),
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: contributions,
  });

  return (
    <div className="content-container">
      <ToastContainer />
      <h1>
        All Contribution In <span>{currentUser.faculty}</span>
      </h1>
      {selectedContribution && isShowModalViewDetailContribution && (
        <ContributionInfo
          open={isShowModalViewDetailContribution}
          close={handleClose}
          contribution={selectedContribution}
        />
      )}
      <ModalEditContribution
        show={isShowModalEditForCoordinator}
        dataEditForCoordinator={dataEditForCoordinator}
        handleClose={handleClose}
        contributionId={dataEditForCoordinator.id}
        fetchContributions={fetchContributions}
      />
      <ModalCommentContribution
        show={isShowModalCommentContribution}
        dataEditForCoordinator={dataEditForCoordinator}
        handleClose={handleClose}
        contributionId={dataEditForCoordinator.id}
        fetchContributions={fetchContributions}
      />
      <div className="Coordinatorcontribution-table">
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
          <MaterialReactTable table={table} />
        )}
      </div>
    </div>
  );
};

export default IndexForCoordinator;
