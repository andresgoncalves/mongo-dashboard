"use client";

import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import TextArea from "@/components/forms/TextArea";
import { useToast } from "@/lib/hooks/useToast";
import {
  createCategory,
  findCategory,
  updateCategory,
} from "@/lib/server/category/category.actions";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function CategoryPage() {
  const { notify } = useToast();

  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id !== "new") {
        const res = await findCategory(id);
        if (res.status === "success") {
          setFormData(res.data.category);
        } else {
          notify(
            res.status,
            res.errors.map((error) => error.message),
          );
          router.replace("/categories");
        }
      }
      setLoading(false);
    })();
  }, [id, notify, router]);

  const [formData, setFormData] = useState({
    name: "",
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
      const result = await createCategory(formData);
      if (result.status === "success") {
        notify(result.status, result.data.message);
      } else {
        notify(
          result.status,
          result.errors.map((error) => error.message),
        );
      }
    } else {
      const result = await updateCategory(id, formData);
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
          <Link className="btn" href="/categories">
            Cancelar
          </Link>
        </>
      }
    >
      <Input
        label="Nombre de la categoría"
        placeholder="Ingrese el nombre del categoría"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleFormChange}
        required
      />
    </Form>
  );
}
