import React from "react";
import { Bar } from "react-chartjs-2";

function BarChart({ datasets, labels }) {
  return (
    <Bar
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

export default BarChart;
