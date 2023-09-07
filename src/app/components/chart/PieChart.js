import React from "react";
import { Pie } from "react-chartjs-2";

function PieChart({ chartData, options }) {
  return (
    <div className="h-52 w-52 myChart">
      <Pie
        data={chartData}
        options={{
          plugins: {
            title: {
              display: true,
              text: "Watch list genre wise",
            },
          },
        }}
      />
    </div>
  );
}

export default PieChart;
