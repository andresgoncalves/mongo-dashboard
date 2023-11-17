"use client";

import { getProductCountByCategory } from "@/lib/server/charts";
import {
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";

Chart.register(BarElement, CategoryScale, LinearScale, Title, Tooltip);

export default function ProductCountByCategoryChart() {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  useEffect(() => {
    (async () => {
      const result = await getProductCountByCategory();
      if (result.status === "success") {
        const rawData = result.data.productCountByCategory;
        setChartData({
          labels: rawData.map(({ name }) => name),
          datasets: [
            {
              data: rawData.map(({ count }) => count),
            },
          ],
        });
      }
    })();
  }, []);

  return (
    <div className="card card-bordered bg-neutral-50 p-4">
      <Bar
        data={chartData}
        options={{
          scales: {
            y: {
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Cantidad de productos por categoría",
            },
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  if (tooltipItem.raw === 1) {
                    return `${tooltipItem.raw} producto`;
                  }
                  return `${tooltipItem.raw} productos`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
