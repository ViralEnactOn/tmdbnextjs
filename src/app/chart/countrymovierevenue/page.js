"use client";
import PieChart from "@/app/components/chart/PieChart";
import Heading from "@/app/components/movie/Heading";
import config from "@/app/config/config";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";
Chart.register(CategoryScale);

function countryWiseMovieRevenue() {
  const [chartData, setChartData] = useState([]);

  useEffect(() => {
    fetchChartDetails();
  }, []);

  const fetchChartDetails = async () => {
    try {
      const response = await fetch(
        `${config.app.base_url}/chart/country_revenue`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ country: ["IN", "US", "CN", "JP", "CA"] }),
        }
      );

      if (response.ok) {
        const data = await response.json();
        setChartData({
          label: data.county_revenue.map((item) => `Country : ${item.country}`),
          datasets: [
            {
              label: "Country Revenue ",
              fill: true,
              data: data.county_revenue.map((item) => item.revenue),

              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(201, 203, 207, 0.2)",
              ],
              borderColor: [
                "rgb(255, 99, 132)",
                "rgb(255, 159, 64)",
                "rgb(255, 205, 86)",
                "rgb(75, 192, 192)",
                "rgb(54, 162, 235)",
                "rgb(153, 102, 255)",
                "rgb(201, 203, 207)",
              ],
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
        <div className="flex justify-center col-md-10 h-[500px] w-[500px]">
          {chartData.length !== 0 && (
            <PieChart datasets={chartData.datasets} labels={chartData.label} />
          )}
        </div>
      </div>
    </div>
  );
}

export default countryWiseMovieRevenue;
