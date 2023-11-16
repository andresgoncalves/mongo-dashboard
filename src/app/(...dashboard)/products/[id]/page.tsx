"use client";

import Toast from "@/components/Toast";
import { useToast } from "@/lib/hooks/useToast";
import { createProduct } from "@/lib/server/product/product.actions";
import Link from "next/link";
import { ChangeEvent, useState } from "react";

export default function ProductPage() {
  const [toast, notify] = useToast();

  const [formData, setFormData] = useState({
    name: "",
    code: "",
    description: "",
  });

  function handleFormChange(
    event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleFormSubmit() {
    const result = await createProduct(formData);
    if (result.status === "success") {
      notify(result.status, result.data.message);
    } else {
      notify(
        result.status,
        result.errors.map((error) => error.message),
      );
    }
  }

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
            name="name"
            placeholder="Ingrese el nombre del producto"
            value={formData.name}
            onChange={handleFormChange}
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
            name="code"
            placeholder="Ingrese el código del producto"
            value={formData.code}
            onChange={handleFormChange}
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
            name="description"
            value={formData.description}
            onChange={handleFormChange}
          />
        </label>
        <div className="col-span-full flex justify-end gap-4">
          <button className="btn btn-primary" onClick={handleFormSubmit}>
            Guardar
          </button>
          <Link className="btn" href="/products">
            Cancelar
          </Link>
        </div>
      </div>
      <Toast data={toast} />
    </div>
  );
}
