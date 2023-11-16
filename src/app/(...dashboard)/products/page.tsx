import { findAllProducts } from "@/lib/server/product/product.actions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export default async function ProductsPage() {
  const {
    data: { products },
  } = await findAllProducts();

  return (
    <div className="flex flex-col items-center gap-8 p-8">
      <div className="flex w-full max-w-3xl flex-col gap-8">
        <div className="flex items-center">
          <div className="mx-4 text-xl font-medium">Productos</div>
          <div className="ml-auto flex gap-4">
            <Link className="btn btn-primary" href="/products/new">
              Agregar
            </Link>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-[1fr_1fr]">
          {products.map((product, key) => (
            <div
              key={`${key}_${product.code}`}
              className="card card-bordered flex-row"
            >
              <div className="card-body">
                <div className="card-title">{product.name}</div>
                <div>{product.description}</div>
              </div>
              <div className="card-body flex-none justify-center">
                <Link
                  href={`/products/${product._id}`}
                  aria-label={`Editar ${product.name}`}
                >
                  <PencilSquareIcon className="h-6 w-6 " />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
