"use client";

import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import TextArea from "@/components/forms/TextArea";
import { useToast } from "@/lib/hooks/useToast";
import { findAllCategories } from "@/lib/server/category/category.actions";
import { ICategory } from "@/lib/server/category/category.model";
import {
  createProduct,
  findProduct,
  updateProduct,
} from "@/lib/server/product/product.actions";
import { WithId } from "mongodb";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function ProductPage() {
  const { notify } = useToast();

  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  const [categories, setCategories] = useState<WithId<ICategory>[]>([]);

  useEffect(() => {
    (async () => {
      if (id !== "new") {
        const res = await findProduct(id);
        if (res.status === "success") {
          setFormData({
            ...res.data.product,
            category: res.data.product.category._id,
            price: String(res.data.product.price),
            available: String(res.data.product.available),
          });
        } else {
          notify(
            res.status,
            res.errors.map((error) => error.message),
          );
          router.replace("/products");
        }
      }

      const categoriesResult = await findAllCategories();
      if (categoriesResult.status === "success") {
        setCategories(categoriesResult.data.categories);
      }

      setLoading(false);
    })();
  }, [id, notify, router]);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    price: "",
    available: "",
  });

  function handleFormChange(
    event: ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) {
    setFormData((data) => ({
      ...data,
      [event.target.name]: event.target.value,
    }));
  }

  async function handleFormSubmit() {
    if (id === "new") {
      const result = await createProduct({
        ...formData,
        category: { _id: formData.category },
        price: Number(formData.price),
        available: Number(formData.available),
      });
      if (result.status === "success") {
        notify(result.status, result.data.message);
      } else {
        notify(
          result.status,
          result.errors.map((error) => error.message),
        );
      }
    } else {
      const result = await updateProduct(id, {
        ...formData,
        category: { _id: formData.category },
        price: Number(formData.price),
        available: Number(formData.available),
      });
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
        <div className="skeleton h-12"></div>
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
          <Link className="btn" href="/products">
            Cancelar
          </Link>
        </>
      }
    >
      <Input
        label="Nombre"
        placeholder="Ingrese el nombre del producto"
        type="text"
        name="name"
        value={formData.name}
        onChange={handleFormChange}
        required
      />
      <Select
        label="Categoría"
        placeholder="Seleccione la categoría del producto"
        name="category"
        value={formData.category}
        onChange={handleFormChange}
        required
      >
        {categories.map(({ _id, name }) => (
          <option key={`${_id}`} value={`${_id}`}>
            {name}
          </option>
        ))}
      </Select>
      <Input
        label="Precio"
        placeholder="Ingrese el precio del producto"
        type="number"
        name="price"
        value={formData.price}
        onChange={handleFormChange}
        required
      />
      <Input
        label="Cantidad disponible"
        placeholder="Ingrese la disponibilidad del producto"
        type="number"
        name="available"
        value={formData.available}
        onChange={handleFormChange}
        required
      />
      <TextArea
        className="col-span-full"
        label="Descripción"
        placeholder="Ingrese la descripción del producto"
        name="description"
        value={formData.description}
        onChange={handleFormChange}
        required
      />
    </Form>
  );
}
