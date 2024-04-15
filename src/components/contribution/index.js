import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "../../css/ContributionForAdmin.css";
import auth from "../../services/auth.service";
import ContributionService from "../../services/contribution.service";
import ModalCreateContribution from "./CreateContribution";
import ModalEditContribution from "./EditContribution";
import ContributionInfo from "./coordinator.ViewDetailContribution";

const ContributionManagement = () => {
  const currentUser = auth.getCurrentUser();
  const [contributions, setContributions] = useState([]);
  const [isShowModalCreateContribution, setIsShowModalCreateContribution] =
    useState(false);
  const [isShowModalEditContribution, setIsShowModalEditContribution] =
    useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);
  const [
    isShowModalViewDetailContribution,
    setIsShowModalViewDetailContribution,
  ] = useState(false);
  const [loading, setLoading] = useState(true);

  const fetchContributions = useCallback(async () => {
    setLoading(true);
    try {
      const response = await ContributionService.getAllContribution();
      setContributions(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching contributions:", error);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const handleDelete = useCallback(
    async (id) => {
      try {
        await ContributionService.deleteContribution(id);
        fetchContributions(); // Sau khi xóa, cập nhật lại danh sách đóng góp
        toast.success("Faculty deleted successfully");
      } catch (error) {
        console.error("Error deleting contribution:", error);
        toast.error("Failed to delete faculty", error);
      }
    },
    [fetchContributions]
  );

  const confirmDelete = useCallback(
    (id) => {
      if (
        window.confirm("Are you sure you want to delete this contribution?")
      ) {
        handleDelete(id);
      }
    },
    [handleDelete]
  );

  //handle View Detail Contribiton
  const handleViewDetailContribution = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalViewDetailContribution(true);
  };

  //Handle Edit Contribution
  const handleEditContribution = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalEditContribution(true);
  };

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

  let columns = useMemo(
    () => [
      {
        accessorKey: "id",
        header: "ID",
        size: 200,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 200,
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
        size: 70,
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
        accessorKey: "submitter",
        header: "submitter",
        size: 70,
      },
      {
        header: "Actions",
        size: 120,
        Cell: ({ row }) => (
          <div className="action-buttons">
            <GrView
              className="act-btn"
              onClick={() => handleViewDetailContribution(row.original)}
            />
            {currentUser.role === "admin" && (
              <>
                <AiFillEdit
                  className="act-btn"
                  onClick={() => handleEditContribution(row.original)}
                />
                <MdDelete
                  className="act-btn"
                  onClick={() => confirmDelete(row.original.id)}
                />
              </>
            )}
          </div>
        ),
      },
    ],
    [currentUser.role, confirmDelete]
  );

  const table = useMaterialReactTable({
    columns,
    data: contributions,
  });

  const handleCloseModals = () => {
    setIsShowModalCreateContribution(false);
    setIsShowModalEditContribution(false);
    setSelectedContribution(null);
    setIsShowModalViewDetailContribution(false);
  };

  return (
    <div className="content-container">
      <ToastContainer />
      <h1>Contribution Management</h1>
      <div className="contribution-index">
        {currentUser.role === "admin" && (
          <div>
            <button
              className="btn btn-success"
              onClick={() => setIsShowModalCreateContribution(true)}
            >
              Create Contribution
            </button>
            <ModalCreateContribution
              show={isShowModalCreateContribution}
              handleClose={handleCloseModals}
              fetchContributions={fetchContributions}
            />
          </div>
        )}

        {selectedContribution && (
          <ModalEditContribution
            show={isShowModalEditContribution}
            contribution={selectedContribution}
            fetchContributions={fetchContributions}
            handleClose={handleCloseModals}
          />
        )}
        {selectedContribution && isShowModalViewDetailContribution && (
          <ContributionInfo
            open={isShowModalViewDetailContribution}
            close={handleCloseModals}
            contribution={selectedContribution}
          />
        )}
        <div className="contribution-table">
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
    </div>
  );
};

export default ContributionManagement;
