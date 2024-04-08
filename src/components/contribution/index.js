import { faDownload } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import Box from "@mui/material/Box";
import Skeleton from "@mui/material/Skeleton";
import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
  MaterialReactTable,
  useMaterialReactTable,
} from "material-react-table";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { AiFillEdit } from "react-icons/ai";
import { GrView } from "react-icons/gr";
import { MdDelete } from "react-icons/md";
import "../../css/ContributionForAdmin.css";
import auth from "../../services/auth.service";
import ContributionService from "../../services/contribution.service";
import ModalCreateContribution from "./CreateContribution";
import ModalEditContribution from "./EditContribution";
import ContributionInfo from "./coordinator.ViewDetailContribution";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

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
        toast.error("Failed to delete faculty" , error);

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

  // Handle download document
  const handleDownloadDocument = async (documentName) => {
    try {
      console.log("Downloading document:", documentName);
      // Send file to download
      const response = await ContributionService.downloadDocument(documentName);
      const zip = new JSZip();
      zip.file(documentName, response.data);
      const content = await zip.generateAsync({ type: "blob" });
      saveAs(content, `${documentName}.zip`);
    } catch (error) {
      console.error("Error downloading document:", error);
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
        accessorKey: "image",
        header: "Image",
        size: 100,
        Cell: ({ cell }) => (
          <img
            src={cell.row.original.image}
            alt="Contribution"
            style={{ width: "15vh", height: "15vh", borderRadius: "3vh" }}
          />
        ),
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 100,
      },
      {
        accessorKey: "document",
        header: "Document",
        size: 100,
        Cell: ({ cell }) =>
          cell.row.original.document && (
            <button
              className="btn btn-AdminDownload"
              onClick={() => handleDownloadDocument(cell.row.original.document)}
            >
              <FontAwesomeIcon icon={faDownload} className="fa-solid" />
              Download
            </button>
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
      ...(currentUser.role === "admin"
        ? [
            {
              header: "Actions",
              size: 120,
              Cell: ({ row }) => (
                <div className="action-buttons">
                  <GrView
                    className="act-btn"
                    onClick={() => handleViewDetailContribution(row.original)}
                  />
                  <AiFillEdit
                    className="act-btn"
                    onClick={() => handleEditContribution(row.original)}
                  />
                  <MdDelete
                    className="act-btn"
                    onClick={() => confirmDelete(row.original.id)}
                  />
                </div>
              ),
            },
          ]
        : []),
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
