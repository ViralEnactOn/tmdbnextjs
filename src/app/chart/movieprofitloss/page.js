"use client";
import BarChart from "@/app/components/Chart/BarChart";
import Heading from "@/app/components/Movie/Heading";
import config from "@/app/config/config";
import { CategoryScale } from "chart.js";
import Chart from "chart.js/auto";
import React, { useEffect, useState } from "react";

Chart.register(CategoryScale);
function movieProfitLoss() {
  const [chartData, setChartData] = useState([]);
  useEffect(() => {
    fetchChartDetails();
  }, []);

  const fetchChartDetails = async () => {
    try {
      const response = await fetch(`${config.app.base_url}/chart/revenue`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const data = await response.json();
        const newData = await data.revenue.slice(0, 50);
        setChartData({
          label: newData.map(
            (item) => `Movie : ${item.title} , Result :${item.result}`
          ),
          datasets: [
            {
              label: "Movie Revenue ",
              fill: true,
              data: newData.map((item) => item.profit_loss),
              backgroundColor: [
                "rgba(255, 99, 132, 0.2)",
                "rgba(255, 159, 64, 0.2)",
                "rgba(255, 205, 86, 0.2)",
                "rgba(75, 192, 192, 0.2)",
                "rgba(54, 162, 235, 0.2)",
                "rgba(153, 102, 255, 0.2)",
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
        <div className="col-md-10">
          {chartData.length !== 0 && (
            <BarChart datasets={chartData.datasets} labels={chartData.label} />
          )}
        </div>
      </div>
    </div>
  );
}

export default movieProfitLoss;
