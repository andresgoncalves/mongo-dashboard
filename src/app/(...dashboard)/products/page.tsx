import Link from "next/link";

export default function ProductsPage() {
  return (
    <div className="m-auto flex flex-col items-center gap-4">
      <div className="text-xl">Productos</div>
      <Link className="btn btn-primary" href="/products/new">
        Agregar producto
      </Link>
    </div>
  );
}
