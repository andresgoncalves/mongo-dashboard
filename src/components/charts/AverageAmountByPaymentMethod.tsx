"use client";

import { getAverageAmountByPaymentMethod } from "@/lib/server/charts";
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

export default function AverageAmountByPaymentMethodChart() {
  const [chartData, setChartData] = useState<ChartData<"bar">>({
    datasets: [],
  });

  useEffect(() => {
    (async () => {
      const result = await getAverageAmountByPaymentMethod();
      if (result.status === "success") {
        const rawData = result.data.averageAmountByPaymentMethod;
        setChartData({
          labels: rawData.map(({ method }) => method),
          datasets: [
            {
              data: rawData.map(({ average }) => average),
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
              text: "Monto promedio por tipo de pago",
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
