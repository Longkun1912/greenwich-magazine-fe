import React, { useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import FacultyService from '../../services/faculty.service';
import ContributionService from '../../services/contribution.service';
import "../../css/IndexForCoordinator.css";
import ModalEditContribution from "./coordinator.edit";
import { MdEdit } from "react-icons/md";

// Component thẻ của mỗi khoa
const FacultyCard = ({ faculty, onFacultySelect }) => {
  return (
    <div className="card" style={{ width: '18rem' }} onClick={() => onFacultySelect(faculty._id)}>
      <img className="card-img-top" src={faculty.image} alt={faculty.name} />
      <div className="card-body">
        <h5 className="card-title">{faculty.name}</h5>
        <p className="card-text">{faculty.description}</p>
      </div>
    </div>
  );
};

const IndexForCoordinator = () => {
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [contributions, setContributions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isShowModalEditForCoordinator, setIsShowModalEditForCoordinator] = useState(false);
  const [dataEditForCoordinator, setDataEditForCoordinator] = useState({});

  useEffect(() => {
    const fetchFaculties = async () => {
      try {
        const response = await FacultyService.getAllFaculties();
        setFaculties(response.data);
      } catch (error) {
        console.error('Error fetching faculties:', error);
      }
    };

    fetchFaculties();
  }, [selectedFacultyId]);

  const handleFacultySelect = async (facultyId) => {
    setSelectedFacultyId(facultyId);
    try {
      setLoading(true);
      setContributions([]);
  
      const response = await ContributionService.getAllContributionByFaculty(facultyId);
      setContributions(response.data);
  
      setLoading(false);
    } catch (error) {
      setLoading(false);
      console.error('Error fetching contributions by faculty:', error);
    }
  };  


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
      <div className="faculties-container">
        {faculties.map(faculty => (
          <div key={faculty._id} className="faculty-card">
            <FacultyCard faculty={faculty} onFacultySelect={handleFacultySelect} />
          </div>
        ))}
      </div>
      {loading && <div>Loading...</div>}
      <ModalEditContribution
        show={isShowModalEditForCoordinator}
        dataEditForCoordinator={dataEditForCoordinator} 
        handleClose={handleClose}
        contributionId={dataEditForCoordinator.id}
      />
      <MaterialReactTable table={table} />
    </div>
  );
};

export default IndexForCoordinator;
