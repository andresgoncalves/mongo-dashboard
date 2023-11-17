"use client";

import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import Select from "@/components/forms/Select";
import { useToast } from "@/lib/hooks/useToast";
import {
  createCustomer,
  findCustomer,
  updateCustomer,
} from "@/lib/server/customer/customer.actions";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function CustomerPage() {
  const { notify } = useToast();

  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id !== "new") {
        const res = await findCustomer(id);
        if (res.status === "success") {
          setFormData({
            ...res.data.customer,
            dni: String(res.data.customer.dni),
          });
        } else {
          notify(
            res.status,
            res.errors.map((error) => error.message),
          );
          router.replace("/customers");
        }
      }
      setLoading(false);
    })();
  }, [id, notify, router]);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    dni: "",
    gender: "",
    email: "",
    phone: "",
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
    const data = { ...formData, dni: Number(formData.dni) };

    if (id === "new") {
      const result = await createCustomer(data);
      if (result.status === "success") {
        notify(result.status, result.data.message);
        router.replace(`${result.data._id}`);
      } else {
        notify(
          result.status,
          result.errors.map((error) => error.message),
        );
      }
    } else {
      const result = await updateCustomer(id, data);
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
        <div className="skeleton h-12"></div>
        <div className="skeleton h-12"></div>
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
          <Link className="btn" href="/customers">
            Cancelar
          </Link>
        </>
      }
    >
      <Input
        label="Nombre"
        placeholder="Ingrese el nombre del cliente"
        type="text"
        name="firstName"
        value={formData.firstName}
        onChange={handleFormChange}
        required
      />
      <Input
        label="Apellido"
        placeholder="Ingrese el apellido del cliente"
        type="text"
        name="lastName"
        value={formData.lastName}
        onChange={handleFormChange}
        required
      />
      <Input
        label="Cédula"
        placeholder="Ingrese la cédula del cliente"
        type="number"
        name="dni"
        value={formData.dni}
        onChange={handleFormChange}
        required
      />
      <Select
        label="Género"
        placeholder="Seleccione el género del cliente"
        name="gender"
        value={formData.gender}
        onChange={handleFormChange}
        required
      >
        <option value="M">Masculino</option>
        <option value="F">Femenino</option>
        <option value="Other">Otro</option>
      </Select>
      <Input
        label="Correo electrónico"
        placeholder="Ingrese el correo electrónico del cliente"
        type="email"
        name="email"
        value={formData.email}
        onChange={handleFormChange}
        required
      />
      <Input
        label="Número de teléfono"
        placeholder="Ingrese el número de teléfono del cliente"
        type="phone"
        name="phone"
        value={formData.phone}
        onChange={handleFormChange}
        required
      />
    </Form>
  );
}
