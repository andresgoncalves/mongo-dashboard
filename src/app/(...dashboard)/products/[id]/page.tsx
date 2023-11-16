import Link from "next/link";

export default function ProductPage() {
  function handleCancel() {}

  return (
    <div className="flex flex-col gap-8 p-8">
      <div className="card m-auto grid w-full max-w-[80ch] grid-cols-1 gap-8 p-8 shadow md:grid-cols-[1fr_1fr]">
        <label className="form-control">
          <div className="label">
            <div className="label-text space-x-1">
              <span>Nombre del producto</span>
              <span className="text-error">*</span>
            </div>
          </div>
          <input
            className="input input-bordered"
            type="text"
            placeholder="Ingrese el nombre del producto"
          />
        </label>
        <label className="form-control">
          <div className="label">
            <div className="label-text space-x-1">
              <span>Código del producto</span>
              <span className="text-error">*</span>
            </div>
          </div>
          <input
            className="input input-bordered"
            type="text"
            placeholder="Ingrese el código del producto"
          />
        </label>
        <label className="form-control col-span-full">
          <div className="label">
            <div className="label-text space-x-1">
              <span>Descripción del producto</span>
              <span className="text-error">*</span>
            </div>
          </div>
          <textarea
            className="textarea textarea-bordered"
            placeholder="Ingrese la descripción del producto"
          />
        </label>
        <div className="col-span-full flex justify-end gap-4">
          <button className="btn btn-primary">Guardar</button>
          <Link className="btn" href="/products">
            Cancelar
          </Link>
        </div>
      </div>
    </div>
  );
}
