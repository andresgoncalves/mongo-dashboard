"use client";

import {
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  LinearScale,
  Tooltip,
} from "chart.js";
import { Bar } from "react-chartjs-2";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip);

export default function DashboardPage() {
  const data: ChartData<"bar"> = {
    labels: [
      "Lunes",
      "Martes",
      "Miercoles",
      "Jueves",
      "Viernes",
      "Sábado",
      "Domingo",
    ],
    datasets: [
      {
        label: "Producto A",
        data: [1, 2, 3, 4, 5, 6, 7],
        backgroundColor: "#ff8080",
      },
      {
        label: "Producto B",
        data: [7, 6, 5, 4, 3, 2, 1],
        backgroundColor: "#8080ff",
      },
    ],
  };

  return (
    <div className="flex min-h-screen">
      <div className="m-auto flex w-full max-w-lg justify-center rounded-box border border-slate-200 bg-slate-50 p-4">
        <Bar data={data} />
      </div>
    </div>
  );
}
