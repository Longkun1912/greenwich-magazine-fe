import React, { useState, useEffect } from 'react';
import { MaterialReactTable, useMaterialReactTable } from 'material-react-table';
import FacultyService from '../../services/faculty.service';
import ContributionService from '../../services/contribution.service';
import "../../css/IndexForCoordinator.css";

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
    // Bỏ comment lại sau khi xử lý hàm updateContributionStatus
    {
      accessor: "State",
      header: "State",
      // Cell: ({ cell }) => (
      //   <button className={`public-button ${cell.value ? 'green' : ''}`} onClick={() => updateContributionStatus(cell.row.original._id, !cell.value)}>
      //     {cell.value ? 'Private' : 'Public'}
      //   </button>
      // ),
      Cell: ({ cell }) => (
        <button className= 'public-button'>Public</button>
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
      <h2>View Contribution By FacultyID:</h2> <br/>
      {loading && <div>Loading...</div>}
      <MaterialReactTable table={table} />
    </div>
  );
};

export default IndexForCoordinator;
