import CardGrid from "@/components/CardGrid";
import { findAllCustomers } from "@/lib/server/customer/customer.actions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CustomerPage() {
  const {
    data: { customers },
  } = await findAllCustomers();

  return (
    <CardGrid
      title="Clientes"
      actions={
        <Link className="btn btn-primary" href="/customers/new">
          Agregar
        </Link>
      }
    >
      {customers.map((customer, key) => (
        <div key={`${customer._id}`} className="card card-bordered flex-row">
          <div className="card-body">
            <div className="card-title">
              {customer.firstName} {customer.lastName}
            </div>
            <div>{customer.email}</div>
          </div>
          <div className="card-body flex-none justify-center">
            <Link
              href={`/customers/${customer._id}`}
              aria-label={`Editar cliente ${customer.firstName} ${customer.lastName}`}
            >
              <PencilSquareIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      ))}
    </CardGrid>
  );
}
