import React from "react";
import { Line } from "react-chartjs-2";

function LineChart({ datasets, labels }) {
  return (
    <Line
      data={{
        labels: labels,
        datasets: datasets,
      }}
      options={{
        scales: {
          y: {
            beginAtZero: true,
          },
        },
      }}
    />
  );
}

export default LineChart;
