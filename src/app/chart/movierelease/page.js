"use client";
import LineChart from "@/app/components/chart/LineChart";
import Heading from "@/app/components/movie/Heading";
import config from "@/app/config/config";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";

Chart.register(CategoryScale);

function movieRelease() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchChartDetails();
  }, []);

  const fetchChartDetails = async () => {
    try {
      const response = await fetch(
        `${config.app.base_url}/chart/week_wise_release`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChartData({
          label: data.movie.map(
            (item) => `Week : ${item.week} , Year :${item.year}`
          ),
          datasets: [
            {
              label: "Movie Released ",
              fill: true,
              data: data.movie.map((item) => item.movie_count),

              borderColor: "rgb(75, 192, 192)",
              borderWidth: 1,
            },
          ],
        });
      } else {
        console.error("Error fetching watch list data");
      }
    } catch (error) {
      console.error("Error fetching watch list data:", error);
    }
  };
  return (
    <div className="container">
      <Heading />

      <br />
      <div className="row">
        <div className="col-md-1"></div>
        <div className="col-md-10">
          {chartData.length !== 0 && (
            <LineChart datasets={chartData.datasets} labels={chartData.label} />
          )}
        </div>
      </div>
    </div>
  );
}

export default movieRelease;
