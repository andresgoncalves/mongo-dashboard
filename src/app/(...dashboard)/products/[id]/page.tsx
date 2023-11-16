"use client";

import { useToast } from "@/lib/hooks/useToast";
import {
  createProduct,
  findProduct,
  updateProduct,
} from "@/lib/server/product/product.actions";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useMemo, useState } from "react";

export default function ProductPage() {
  const { notify } = useToast();

  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    if (id !== "new") {
      (async () => {
        const res = await findProduct(id);
        if (res.status === "success") {
          setFormData(res.data.product);
        } else {
          notify(
            res.status,
            res.errors.map((error) => error.message),
          );
          router.replace("/products");
        }
      })();
    }
    setLoading(false);
  }, [id, notify, router]);

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
    if (id === "new") {
      const result = await createProduct(formData);
      if (result.status === "success") {
        notify(result.status, result.data.message);
      } else {
        notify(
          result.status,
          result.errors.map((error) => error.message),
        );
      }
    } else {
      const result = await updateProduct(id, formData);
      if (result.status === "success") {
        notify(result.status, result.data.message);
      } else {
        notify(
          result.status,
          result.errors.map((error) => error.message),
        );
      }
    }
  }

  if (isLoading) {
    return (
      <div className="flex flex-col gap-8 p-8">
        <div className="card m-auto grid w-full max-w-[80ch] grid-cols-1 gap-8 p-8 shadow md:grid-cols-[1fr_1fr]">
          <div className="skeleton h-6"></div>
          <div className="skeleton h-6"></div>
          <div className="skeleton col-span-2 h-12"></div>
        </div>
      </div>
    );
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
    </div>
  );
}
