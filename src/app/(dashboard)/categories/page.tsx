import CardGrid from "@/components/CardGrid";
import { findAllCategories } from "@/lib/server/category/category.actions";
import { PencilSquareIcon } from "@heroicons/react/24/outline";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function CategoriesPage() {
  const {
    data: { categories },
  } = await findAllCategories();

  return (
    <CardGrid
      title="Categorías"
      actions={
        <Link className="btn btn-primary" href="/categories/new">
          Agregar
        </Link>
      }
    >
      {categories.map((category, key) => (
        <div
          key={`${key}_${category.name}`}
          className="card card-bordered flex-row"
        >
          <div className="card-body">
            <div className="card-title">{category.name}</div>
          </div>
          <div className="card-body flex-none justify-center">
            <Link
              href={`/categories/${category._id}`}
              aria-label={`Editar categoría ${category.name}`}
            >
              <PencilSquareIcon className="h-6 w-6" />
            </Link>
          </div>
        </div>
      ))}
    </CardGrid>
  );
}
