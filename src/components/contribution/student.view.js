import React, { useEffect, useState } from "react";
import ContributionService from "../../services/contribution.service";
const StudentContributionIndex = () => {
  const [contributions, setContributions] = useState([]);

  const fetchContributionsInFaculty = async () => {
    try {
      const response = await ContributionService.viewContributionsInFaculty();
      setContributions(response.data);
    } catch (error) {
      console.error("Error fetching contributions:", error);
    }
  };

  useEffect(() => {
    fetchContributionsInFaculty();
  }, []);
  return (
    <div>
      <h1>Contribution Index</h1>
    </div>
  );
};

export default StudentContributionIndex;
