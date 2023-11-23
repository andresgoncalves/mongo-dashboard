"use client";

import AverageAmountByPaymentMethodChart from "@/components/charts/AverageAmountByPaymentMethod";
import ProductCountByCategoryChart from "@/components/charts/ProductCountByCategoryChart";
import SaleStats from "@/components/charts/SaleStats";
import TotalEarningsByWeekChart from "@/components/charts/TotalEarningsByWeekChart";
import TotalSalesByCategoryChart from "@/components/charts/TotalSalesByCategoryChart";
import TotalSalesByPaymentMethodChart from "@/components/charts/TotalSalesByPaymentMethodChart";
import TotalSalesByWeekChart from "@/components/charts/TotalSalesByWeekChart";
import {
  BarElement,
  CategoryScale,
  Chart,
  LinearScale,
  Title,
  Tooltip,
} from "chart.js";

Chart.register(BarElement, CategoryScale, LinearScale, Tooltip, Title);
Chart.defaults.plugins.title = {
  ...Chart.defaults.plugins.title,
  font: { size: 20, weight: "400" },
};

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="flex flex-col gap-2">
        <h1 className="mx-4 text-xl font-medium">Resumen histórico</h1>
        <SaleStats />
      </div>
      <div className="flex flex-col gap-8">
        <div className="flex">
          <div className="mx-4 text-xl font-medium">Resumen</div>
        </div>
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
          <TotalSalesByWeekChart />
          <TotalEarningsByWeekChart />
          <TotalSalesByCategoryChart />
          <ProductCountByCategoryChart />
          <TotalSalesByPaymentMethodChart />
          <AverageAmountByPaymentMethodChart />
        </div>
      </div>
    </div>
  );
}
