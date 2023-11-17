"use client";

import SaleStats from "@/components/charts/SaleStats";
import ProductCountByCategoryChart from "@/components/charts/ProductCountByCategoryChart";
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
import TotalSalesByWeekChart from "@/components/charts/TotalSalesByWeekChart";
import TotalSalesByCategoryChart from "@/components/charts/TotalSalesByCategoryChart";
import TotalEarningsByWeekChart from "@/components/charts/TotalEarningsByWeekChart";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);
Chart.defaults.plugins.title = {
  ...Chart.defaults.plugins.title,
  font: { size: 20, weight: "400" },
};

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

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="mx-4 text-xl font-medium">Resumen histórico</h1>
        <SaleStats />
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
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <TotalSalesByWeekChart />
          <TotalEarningsByWeekChart />
          <TotalSalesByCategoryChart />
          <ProductCountByCategoryChart />
        </div>
      </div>
    </div>
  );
}
