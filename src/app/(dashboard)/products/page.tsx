import CardGrid from "@/components/CardGrid";
import { findAllProducts } from "@/lib/server/product/product.actions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ProductsPage() {
  const {
    data: { products },
  } = await findAllProducts();

  return (
    <CardGrid
      title="Productos"
      actions={
        <Link className="btn btn-primary" href="/products/new">
          Agregar
        </Link>
      }
    >
      {products.map((product) => (
        <div key={`${product._id}`} className="card card-bordered flex-row">
          <div className="card-body">
            <div className="card-title">{product.name}</div>
            <div>{product.description}</div>
          </div>
          <div className="card-body flex-none justify-center">
            <Link
              href={`/products/${product._id}`}
              aria-label={`Editar producto ${product.name}`}
            >
              <PencilSquareIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      ))}
    </CardGrid>
  );
}
