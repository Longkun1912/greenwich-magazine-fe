import React, { useState, useEffect } from 'react';
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

const ContributionTable = ({ contributions }) => {
    return (
      <div className="contribution-list">
        {contributions.length === 0 ? (
          <p className="red-text">No contributions found.</p>
        ) : (
          <table className="table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Content</th>
                <th>Document</th>
                <th>Status</th>
                <th>Submitter</th>
                <th>Event</th>
              </tr>
            </thead>
            <tbody>
              {contributions.map(contribution => (
                <tr key={contribution.id}>
                  <td>{contribution.title}</td>
                  <td>{contribution.content}</td>
                  <td>
                    {contribution.document && (
                      <a href={contribution.document} download>
                        <button>Download</button>
                      </a>
                    )}
                  </td>
                  <td>{contribution.status}</td>
                  <td>{contribution.submitter}</td>
                  <td>{contribution.event}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  };
  

const IndexForCoordinator = () => {
  const [selectedFacultyId, setSelectedFacultyId] = useState(null);
  const [faculties, setFaculties] = useState([]);
  const [contributions, setContributions] = useState([]);

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
  }, []);

  const handleFacultySelect = async (facultyId) => {
    setSelectedFacultyId(facultyId);
    try {
      const response = await ContributionService.getAllContributionByFaculty(facultyId);
      setContributions(response.data);
    } catch (error) {
      console.error('Error fetching contributions by faculty:', error);
    }
  };
  
  return (
    <div className="content-container">
      <h1>Contribution Management 2</h1>
      <div className="faculties-container">
        <div className="faculties-container">
          {faculties.map(faculty => (
            <div key={faculty._id} className="faculty-card">
              <FacultyCard faculty={faculty} onFacultySelect={handleFacultySelect} />
            </div>
          ))}
        </div>
      </div>
      <div className="contributions-container">
        <h2>Contributions</h2>
        {selectedFacultyId && <ContributionTable contributions={contributions} />}
      </div>
    </div>
  );
};

export default IndexForCoordinator;

