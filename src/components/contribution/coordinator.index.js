import { useState, useEffect } from 'react'; 
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import ContributionService from '../../services/contribution.service';
import "../../css/IndexForCoordinator.css";
import ModalEditContribution from "./coordinator.edit";
import { MdEdit } from "react-icons/md";
import auth from '../../services/auth.service'; 
import { ToastContainer } from 'react-toastify';

const IndexForCoordinator = () => {
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShowModalEditForCoordinator, setIsShowModalEditForCoordinator] = useState(false);
  const [dataEditForCoordinator, setDataEditForCoordinator] = useState({});

  useEffect(() => {
    const fetchContributions = async () => {
      try {
        const currentUser = auth.getCurrentUser();
        setLoading(true);
        const response = await ContributionService.getAllContributionByFaculty(currentUser.id);
        setContributions(response.data);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error('Error fetching contributions:', error);
      }
    };
  
    fetchContributions();
  }, []);

  const handleEditForCoordinator = (contribution) => {
    console.log("Selected contribution:", contribution);
    setDataEditForCoordinator(contribution); 
    setIsShowModalEditForCoordinator(true);
  };

  const handleClose = () => {
    setIsShowModalEditForCoordinator(false);
  };

  const columns = [
    {
      accessorKey: "image",
      header: "Image",
      size: 200,
      Cell: ({ cell }) => (
        <img
          src={cell.row.original.image}
          alt="Contribution"
          style={{ width: "15vh", height: "15vh" }}
        />
      ),
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
      Cell: ({ cell }) =>
        cell.row.original.document && (
          <a href={cell.row.original.document.replace(/^http:/, "https:")}>
            <button>Download</button>
          </a>
        ),
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
      accessorKey: "faculty",
      header: "Faculty",
      size: 100,
    },
    {
      accessorKey: "state",
      header: "State",
      size: 100,
    },
    
    {
      accessor: "Action",
      header: "Action",
      Cell: ({ row }) => (
        <div>
          <button onClick={() => handleEditForCoordinator(row.original)}>
            <MdEdit />
          </button>
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
      <h2>All Contribution For Faculty</h2>
      {loading && <div>Loading...</div>}
      <ModalEditContribution
        show={isShowModalEditForCoordinator}
        dataEditForCoordinator={dataEditForCoordinator} 
        handleClose={handleClose}
        contributionId={dataEditForCoordinator.id}
      />
      <MaterialReactTable table={table} />
      <ToastContainer /> {/* Component này sẽ render ra nơi bạn muốn hiển thị toast */}
    </div>
  );
};

export default IndexForCoordinator;