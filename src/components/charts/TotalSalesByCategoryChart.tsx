"use client";

import { getTotalSalesByCategory } from "@/lib/server/charts";
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

export default function TotalSalesByCategoryChart() {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  useEffect(() => {
    (async () => {
      const result = await getTotalSalesByCategory();
      if (result.status === "success") {
        const rawData = result.data.totalSalesByCategory;
        console.log(rawData);
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
          indexAxis: "y",
          scales: {
            x: {
              ticks: {
                stepSize: 1,
              },
            },
          },
          plugins: {
            title: {
              display: true,
              text: "Ventas totales por categoría",
            },
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  if (tooltipItem.raw === 1) {
                    return `${tooltipItem.raw} venta`;
                  }
                  return `${tooltipItem.raw} ventas`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
