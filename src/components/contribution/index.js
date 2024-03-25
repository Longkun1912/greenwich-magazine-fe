
import React, { useEffect, useMemo, useState, useCallback } from "react";
import { MaterialReactTable, useMaterialReactTable } from "material-react-table";
import ContributionService from "../../services/contribution.service";
import { MdEdit, MdDelete } from "react-icons/md";
import "../../css/Faculty.css";
import ModalCreateContribution from './CreateContribution';
import ModalEditContribution from './EditContribution';

const ContributionManagement = () => {
  const [contributions, setContributions] = useState([]);
  const [isShowModalCreateContribution, setIsShowModalCreateContribution] = useState(false);
  const [isShowModalEditContribution, setIsShowModalEditContribution] = useState(false);
  const [selectedContribution, setSelectedContribution] = useState(null);

  const fetchContributions = useCallback(async () => {
    try {
      const response = await ContributionService.getAllContribution();
      setContributions(response.data);
    } catch (error) {
      console.error('Error fetching contributions:', error);
    }
  }, []);

  useEffect(() => {
    fetchContributions();
  }, [fetchContributions]);

  const handleDelete = useCallback(async (id) => {
    try {
      await ContributionService.deleteContribution(id);
      fetchContributions(); // Sau khi xóa, cập nhật lại danh sách đóng góp
    } catch (error) {
      console.error('Error deleting contribution:', error);
    }
  }, [fetchContributions]);

  const confirmDelete = useCallback((id) => {
    if (window.confirm("Are you sure you want to delete this contribution?")) {
      handleDelete(id);
    }
  }, [handleDelete]);

  const handleEditContribution = (contribution) => {
    setSelectedContribution(contribution);
    setIsShowModalEditContribution(true);
  };

  const columns = useMemo(
    () => [
      {
        accessorKey: "_id",
        header: "ID",
        size: 100,
      },
      {
        accessorKey: "image",
        header: "Image",
        size: 200,
        Cell: ({ cell }) => <img src={cell.row.original.image} alt="Contribution" style={{ width: '100px', height: 'auto' }} />,
      },
      {
        accessorKey: "title",
        header: "Title",
        size: 100,
      },
      {
        accessorKey: "content",
        header: "Content",
        size: 100,
      },
      {
        accessorKey: "document",
        header: "Document",
        size: 100,
      },
      {
        accessorKey: "status",
        header: "Status",
        size: 100,
      },
      {
        accessorKey: "submitter",
        header: "submitter",
        size: 100,
      },
      {
        accessorKey: "event",
        header: "Event",
        size: 100,
      },
      
      {
        header: "Actions",
        size: 100,
        Cell: ({ row }) => (
          <div>
            <button onClick={() => handleEditContribution(row.original)}><MdEdit /></button> 
            <button onClick={() => confirmDelete(row.original._id)}><MdDelete /></button>
          </div>
        ),
      },
    ],
    [confirmDelete]
  );

  const table = useMaterialReactTable({
    columns,
    data: contributions,
  });

  const handleCloseModals = () => {
    setIsShowModalCreateContribution(false);
    setIsShowModalEditContribution(false);
    setSelectedContribution(null);
  };

  return (
    <div className="content-container">
      <h1>Contribution Management</h1>
      <div className="contribution-index">
        <button className="btn btn-success" onClick={() => setIsShowModalCreateContribution(true)}>
          Add New Contribution
        </button>
        <ModalCreateContribution
          show={isShowModalCreateContribution}
          handleClose={handleCloseModals}
        />
        <ModalEditContribution
          show={isShowModalEditContribution}
          contribution={selectedContribution}
          handleClose={handleCloseModals}
        />
        <MaterialReactTable table={table} />
      </div>
    </div>
  );
};

export default ContributionManagement;

