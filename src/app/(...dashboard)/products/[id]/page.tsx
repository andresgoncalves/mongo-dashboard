"use client";

import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import TextArea from "@/components/forms/TextArea";
import { useToast } from "@/lib/hooks/useToast";
import {
  createProduct,
  findProduct,
  updateProduct,
} from "@/lib/server/product/product.actions";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductPage() {
  const { notify } = useToast();

  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id !== "new") {
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
      }
      setLoading(false);
    })();
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
      <Form>
        <div className="skeleton h-12"></div>
        <div className="skeleton h-12"></div>
        <div className="skeleton col-span-full h-16"></div>
      </Form>
    );
  }

  return (
    <Form
      actions={
        <>
          <button className="btn btn-primary" onClick={handleFormSubmit}>
            Guardar
          </button>
          <Link className="btn" href="/products">
            Cancelar
          </Link>
        </>
      }
    >
      <Input
        label="Nombre del producto"
        placeholder="Ingrese el nombre del producto"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleFormChange}
        required
      />
      <Input
        label="Código del producto"
        placeholder="Ingrese el código del producto"
        type="text"
        name="code"
        value={formData.code}
        onChange={handleFormChange}
        required
      />
      <TextArea
        label="Descripción del producto"
        placeholder="Ingrese la descripción del producto"
        name="description"
        value={formData.description}
        onChange={handleFormChange}
        required
      />
    </Form>
  );
}
