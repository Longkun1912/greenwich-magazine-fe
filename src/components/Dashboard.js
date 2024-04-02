import { BarChart } from "@mui/x-charts/BarChart";
import React, { useCallback, useEffect, useState } from "react";
import "../css/Dashboard.css";
import DashboardService from "../services/dashboard.service";

const Dashboard = () => {
  const [contributions, setContributions] = useState([]);
  const fetchContributionSeries = useCallback(async () => {
    try {
      const response = await DashboardService.viewNumberOfContributions();
      setContributions(response.data);
    } catch (error) {
      console.error("Error fetching contribution series:", error);
    }
  }, []);

  useEffect(() => {
    fetchContributionSeries();
  }, [fetchContributionSeries]);

  // First, get a list of all unique faculties
  const faculties = [
    ...new Set(
      contributions.flatMap((event) =>
        event.contributions.map((contribution) => contribution.faculty)
      )
    ),
  ];

  // Then, create a dataset for each faculty
  const chartData = faculties.map((faculty) => {
    return {
      label: faculty,
      data: contributions.map((event) => {
        const contribution = event.contributions.find(
          (c) => c.faculty === faculty
        );
        return contribution ? contribution.contributions : 0;
      }),
    };
  });

  const xAxisLabels =
    contributions.length > 0
      ? contributions.map((contribution) => contribution.event)
      : [];

  return (
    <div className="dashboard-content">
      <div className="header">
        <h1>Dashboard</h1>
      </div>
      <div className="dashboards">
        <div className="contribution-number">
          <h2 id="dashboard-1-intro">
            Number of contributions per faculty for each event
          </h2>
          <BarChart
            series={chartData}
            height={290}
            xAxis={[
              {
                data: xAxisLabels,
                scaleType: "band",
              },
            ]}
            margin={{ top: 10, bottom: 30, left: 40, right: 10 }}
          />
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
