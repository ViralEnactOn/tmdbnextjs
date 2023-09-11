import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ datasets, labels }) {
  return (
    <Pie
      data={{
        labels: labels,
        datasets: datasets,
      }}
      options={{
        plugins: {
         
        },
      }}
    />
  );
}

export default PieChart;
