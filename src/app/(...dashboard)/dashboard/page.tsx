"use client";

import {
  BarElement,
  CategoryScale,
  Chart,
  ChartData,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";
import { useMemo, useState } from "react";
import { Bar } from "react-chartjs-2";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);

export default function DashboardPage() {
  const [timeFrame, setTimeFrame] = useState<"week" | "trimester" | "year">(
    "week",
  );

  const totalSalesChartData = useMemo<ChartData<"bar">>(() => {
    switch (timeFrame) {
      case "week":
        return {
          labels: [
            "Lunes",
            "Martes",
            "Miércoles",
            "Jueves",
            "Viernes",
            "Sábado",
            "Domingo",
          ],
          datasets: [
            {
              data: [1, 2, 3, 4, 5, 6, 7],
            },
          ],
        };
      case "trimester":
        return {
          labels: [
            "Enero I",
            "Enero II",
            "Enero III",
            "Enero IV",
            "Febrero I",
            "Febrero II",
            "Febrero III",
            "Febrero IV",
            "Marzo I",
            "Marzo II",
            "Marzo III",
            "Marzo IV",
          ],
          datasets: [
            {
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            },
          ],
        };
      case "year":
        return {
          labels: [
            "Enero",
            "Febrero",
            "Marzo",
            "Abril",
            "Mayo",
            "Junio",
            "Julio",
            "Agosto",
            "Septiembre",
            "Octubre",
            "Noviembre",
            "Diciembre",
          ],
          datasets: [
            {
              data: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12],
            },
          ],
        };
    }
  }, [timeFrame]);

  const salesByProductChartData = useMemo<ChartData<"bar">>(() => {
    switch (timeFrame) {
      case "week":
        return {
          labels: [
            "Maquillaje",
            "Pintura de uñas",
            "Tinte de cabello",
            "Mascarillas",
          ],
          datasets: [
            {
              data: [16, 8, 4, 2],
            },
          ],
        };
      case "trimester":
        return {
          labels: [
            "Tinte de cabello",
            "Maquillaje",
            "Mascarillas",
            "Pintura de uñas",
          ],
          datasets: [
            {
              data: [12, 10, 6, 4],
            },
          ],
        };
      case "year":
        return {
          labels: [
            "Tinte de cabello",
            "Maquillaje",
            "Mascarillas",
            "Pintura de uñas",
          ],
          datasets: [
            {
              data: [48, 40, 28, 20],
            },
          ],
        };
    }
  }, [timeFrame]);

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="mx-4 text-xl font-medium">Resumen semanal</h1>
        <div className="stats stats-vertical shadow sm:stats-horizontal">
          <div className="stat gap-2">
            <div className="stat-title">Ingresos totales</div>
            <div className="stat-value">$ 12345,79</div>
          </div>
          <div className="stat gap-2">
            <div className="stat-title">Ventas totales</div>
            <div className="stat-value">100</div>
          </div>
        </div>
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex">
          <div className="mx-4 text-xl font-medium">Resumen</div>
          <div className="join ml-auto">
            <input
              className="btn join-item btn-sm"
              type="radio"
              aria-label="Semana"
              checked={timeFrame === "week"}
              onChange={() => setTimeFrame("week")}
            />
            <input
              className="btn join-item btn-sm"
              type="radio"
              aria-label="Trimestre"
              checked={timeFrame === "trimester"}
              onChange={() => setTimeFrame("trimester")}
            />
            <input
              className="btn join-item btn-sm"
              type="radio"
              aria-label="Año"
              checked={timeFrame === "year"}
              onChange={() => setTimeFrame("year")}
            />
          </div>
        </div>
        <div className="grid grid-cols-1 gap-x-8 gap-y-4 md:grid-cols-2">
          <div className="card bg-neutral-50 p-4 shadow">
            <Bar
              data={totalSalesChartData}
              options={{
                plugins: {
                  title: {
                    display: true,
                    font: { size: 20, weight: "400" },
                    text: `Ventas totales por ${
                      timeFrame === "week"
                        ? "día"
                        : timeFrame === "trimester"
                          ? "semana"
                          : "mes"
                    }`,
                  },
                },
              }}
            />
          </div>
          <div className="card bg-neutral-50 p-4 shadow">
            <Bar
              data={salesByProductChartData}
              options={{
                indexAxis: "y",
                plugins: {
                  title: {
                    display: true,
                    font: { size: 20, weight: "400" },
                    text: `Productos más vendidos`,
                  },
                },
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
