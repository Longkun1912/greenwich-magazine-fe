import { BarChart } from "@mui/x-charts/BarChart";
import { PieChart, pieArcLabelClasses } from "@mui/x-charts/PieChart";
import React, { useCallback, useEffect, useState } from "react";
import "../css/Dashboard.css";
import DashboardService from "../services/dashboard.service";

const Dashboard = () => {
  const [contributions, setContributions] = useState([]);
  const [percentageOfContributions, setPercentageOfContributions] = useState(
    []
  );
  const [numberOfContributors, setNumberOfContributors] = useState([]);

  // Fetch the number of contributions per faculty for each event (First chart)
  const fetchContributionSeries = useCallback(async () => {
    try {
      const response = await DashboardService.viewNumberOfContributions();
      setContributions(response.data);
    } catch (error) {
      console.error("Error fetching contribution series:", error);
    }
  }, []);

  // Fetch the percentage of contributions by each faculty (Second chart)
  const fetchContributionPercentage = useCallback(async () => {
    try {
      const response =
        await DashboardService.viewPercentageOfContributionsInFaculties();
      setPercentageOfContributions(response.data);
    } catch (error) {
      console.error("Error fetching contribution percentage:", error);
    }
  }, []);

  // Fetch the number of contributors for each faculty (Third chart)
  const fetchContributors = useCallback(async () => {
    try {
      const response =
        await DashboardService.viewNumberOfContributorsForEachFaculty();
      setNumberOfContributors(response.data);
    } catch (error) {
      console.error("Error fetching number of contributors:", error);
    }
  }, []);

  useEffect(() => {
    fetchContributionSeries();
    fetchContributionPercentage();
    fetchContributors();
  }, [fetchContributionSeries, fetchContributionPercentage, fetchContributors]);

  // First, get a list of all unique faculties (for the first chart)
  const faculties = [
    ...new Set(
      contributions.flatMap((event) =>
        event.contributions.map((contribution) => contribution.faculty)
      )
    ),
  ];

  // Then, create a dataset for each faculty (for the first chart)
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

  // Map the response data to the format required by BarChart (for the first chart)
  const xAxisLabels =
    contributions.length > 0
      ? contributions.map((contribution) => contribution.event)
      : [];

  // Map the response data to the format required by PieChart (for the second chart)
  const firstPieChartData = percentageOfContributions.map((item) => ({
    value: item.percentage,
    label: item.faculty,
  }));

  const secondPieChartData = numberOfContributors.map((item) => ({
    value: item.contributors,
    label: item.faculty,
  }));

  // Define the size of the pie chart
  const pieChartSize = {
    width: 600,
    height: 250,
  };

  return (
    <div className="dashboard-content">
      <div className="header">
        <h1 className="dashboard-title">Dashboard</h1>
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
        <div className="contribution-percentage">
          <h2 id="dashboard-2-intro">
            Percentage of contributions by each faculty
          </h2>
          <div className="pie-chart">
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}%`,
                  arcLabelMinAngle: 55,
                  data: firstPieChartData,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              {...pieChartSize}
            />
          </div>
        </div>
        <div className="contribution-percentage">
          <h2 id="dashboard-2-intro">Number of contributors per faculty</h2>
          <div className="pie-chart">
            <PieChart
              series={[
                {
                  arcLabel: (item) => `${item.value}`,
                  arcLabelMinAngle: 55,
                  data: secondPieChartData,
                },
              ]}
              sx={{
                [`& .${pieArcLabelClasses.root}`]: {
                  fill: "white",
                  fontWeight: "bold",
                },
              }}
              {...pieChartSize}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Dashboard;
