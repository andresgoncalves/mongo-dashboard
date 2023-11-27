"use client";

import { getSaleStats } from "@/lib/server/charts";
import { useEffect, useState } from "react";

export default function SaleStats() {
  const [stats, setStats] = useState({
    totalEarnings: 0,
    salesCount: 0,
  });

  useEffect(() => {
    (async () => {
      const result = await getSaleStats();
      if (result.status === "success") {
        setStats(result.data.saleStats);
      }
    })();
  }, []);

  return (
    <div className="stats stats-vertical shadow sm:stats-horizontal">
      <div className="stat gap-2">
        <div className="stat-title">Ingresos totales</div>
        <div className="stat-value">$ {stats.totalEarnings.toFixed(2)}</div>
      </div>
      <div className="stat gap-2">
        <div className="stat-title">Ventas totales</div>
        <div className="stat-value">{stats.salesCount}</div>
      </div>
    </div>
  );
}
