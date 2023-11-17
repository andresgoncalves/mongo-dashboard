import CardGrid from "@/components/CardGrid";
import { findAllSales } from "@/lib/server/sale/sale.actions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function SalesPage() {
  const {
    data: { sales },
  } = await findAllSales();

  return (
    <CardGrid
      title="Productos"
      actions={
        <Link className="btn btn-primary" href="/sales/new">
          Agregar
        </Link>
      }
    >
      {sales.map((sale) => (
        <div key={`${sale._id}`} className="card card-bordered flex-row">
          <div className="card-body">
            <div className="card-title">
              {sale.customer.firstName} {sale.customer.lastName}
            </div>
            <div className="text-xl">
              ${" "}
              {Intl.NumberFormat("es-ve", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(sale.total || 0)}
            </div>
            <div>
              {sale.datetime &&
                Intl.DateTimeFormat("es-ve", {
                  dateStyle: "short",
                  timeStyle: "short",
                }).format(new Date(sale.datetime))}
            </div>
          </div>
          <div className="card-body flex-none justify-center">
            <Link
              href={`/sales/${sale._id}`}
              aria-label={`Editar venta #${sale._id}`}
            >
              <PencilSquareIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      ))}
    </CardGrid>
  );
}
