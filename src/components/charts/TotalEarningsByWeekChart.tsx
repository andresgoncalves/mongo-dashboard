"use client";

import { getTotalEarningsByPeriod } from "@/lib/server/charts";
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

export default function TotalEarningsByWeekChart() {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  useEffect(() => {
    (async () => {
      const result = await getTotalEarningsByPeriod();
      if (result.status === "success") {
        const rawData = result.data.totalEarningsByWeek.reverse();
        setChartData({
          labels: rawData.map(({ date }) => [
            Intl.DateTimeFormat("es-ve", { weekday: "long" })
              .format(new Date(date))
              .split("")
              .map((char, index) => (index === 0 ? char.toUpperCase() : char))
              .join(""),
            Intl.DateTimeFormat("es-ve", { dateStyle: "short" }).format(
              new Date(date),
            ),
          ]),
          datasets: [
            {
              data: rawData.map(({ total }) => total),
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
          plugins: {
            title: {
              display: true,
              text: "Ingresos totales esta semana",
            },
            tooltip: {
              callbacks: {
                label(tooltipItem) {
                  return `$ ${(tooltipItem.raw as Number).toFixed(2)}`;
                },
              },
            },
          },
        }}
      />
    </div>
  );
}
