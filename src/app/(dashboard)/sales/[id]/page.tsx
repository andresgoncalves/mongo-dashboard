"use client";

import Form from "@/components/forms/Form";
import Input from "@/components/forms/Input";
import { useToast } from "@/lib/hooks/useToast";
import { findCustomerByDni } from "@/lib/server/customer/customer.actions";
import {
  findProduct,
  findProductByCode,
} from "@/lib/server/product/product.actions";
import {
  createSale,
  findSale,
  updateSale,
} from "@/lib/server/sale/sale.actions";
import { ISale } from "@/lib/server/sale/sale.model";
import {
  MinusCircleIcon,
  MinusIcon,
  PlusIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { ChangeEvent, useEffect, useState } from "react";

export default function SalePage() {
  const { notify } = useToast();

  const { id } = useParams();
  const router = useRouter();

  const [isLoading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      if (id !== "new") {
        const res = await findSale(id);
        if (res.status === "success") {
          setFormData({
            customerId: `${res.data.sale.customer._id}`,
            customerDni: `${res.data.sale.customer.dni}`,
            customerName: `${res.data.sale.customer.firstName} ${res.data.sale.customer.lastName}`,
            productCode: "",
          });

          console.log(res.data.sale.items);
          setItems(res.data.sale.items);
        } else {
          notify(
            res.status,
            res.errors.map((error) => error.message),
          );
          router.replace("/sales");
        }
      }

      setLoading(false);
    })();
  }, [id, notify, router]);

  const [items, setItems] = useState<ISale["items"]>([]);

  const [formData, setFormData] = useState({
    customerId: "",
    customerDni: "",
    customerName: "",
    productCode: "",
  });

  useEffect(() => {
    if (formData.customerDni) {
      const timeoutId = setTimeout(async () => {
        console.log(formData.customerDni);
        const res = await findCustomerByDni(Number(formData.customerDni));
        if (res.status === "success") {
          setFormData((formData) => ({
            ...formData,
            customerId: `${res.data.customer._id}`,
            customerName: `${res.data.customer.firstName} ${res.data.customer.lastName}`,
          }));
        } else {
          setFormData((formData) => ({
            ...formData,
            customerId: "",
            customerName: "",
          }));
          notify(
            res.status,
            res.errors.map((error) => error.message),
          );
        }
      }, 1000);
      return () => clearTimeout(timeoutId);
    } else {
      setFormData((formData) => ({
        ...formData,
        customerId: "",
        customerName: "",
      }));
    }
  }, [formData.customerDni, notify]);

  async function handleFormChange(
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
      const result = await createSale({
        customer: { _id: formData.customerId },
        items: items.map((item) => ({
          product: item.product,
          amount: Number(item.amount),
        })),
      });
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
      const result = await updateSale(id, {
        customer: { _id: formData.customerId },
        items: items.map((item) => ({
          product: item.product,
          amount: Number(item.amount),
        })),
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

  async function handleAddItem() {
    if (items.find((item) => item.product.code === formData.productCode)) {
      return notify("error", "El producto ya fue agregado");
    }

    const res = await findProductByCode(formData.productCode);
    if (res.status === "error") {
      return notify(
        res.status,
        res.errors.map((error) => error.message),
      );
    }

    const item = {
      product: res.data.product,
      amount: 1,
    };

    setItems((items) => [item, ...items]);
  }

  async function handleRemoveItem(productId: string) {
    setItems((items) =>
      items.filter((item) => `${item.product._id}` !== productId),
    );
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

  function handleIncreaseAmount(productId: string, increment: 1 | -1) {
    setItems((items) => {
      const index = items.findIndex(
        (item) => `${item.product._id}` === productId,
      );
      if (index >= 0) {
        return [
          ...items.slice(0, index),
          {
            ...items[index],
            amount: items[index].amount + increment,
          },
          ...items.slice(index + 1),
        ];
      }
      return items;
    });
  }

  return (
    <div className="flex flex-col">
      <Form
        actions={
          <>
            <button className="btn btn-primary" onClick={handleFormSubmit}>
              Guardar
            </button>
            <Link className="btn" href="/sales">
              Cancelar
            </Link>
          </>
        }
      >
        <Input
          label="Cédula del cliente"
          placeholder="Ingrese la cédula del cliente"
          type="number"
          name="customerDni"
          value={formData.customerDni}
          onChange={handleFormChange}
          required
        />
        <Input
          label="Nombre del cliente"
          type="text"
          value={formData.customerName}
          readOnly
        />
      </Form>
      <Form>
        <div className="col-span-full flex items-end gap-4">
          <Input
            label="Código del producto"
            placeholder="Ingrese el código del producto"
            type="text"
            name="productCode"
            value={formData.productCode}
            onChange={handleFormChange}
            required
          />
          <button className="btn btn-primary" onClick={handleAddItem}>
            Agregar
          </button>
        </div>
      </Form>
      <Form>
        {items.map((item) => (
          <div
            key={`${item.product._id}`}
            className="col-span-full flex gap-12"
          >
            <div className="col-span-2 mr-auto">{item.product.name}</div>
            <div className="flex items-center gap-4">
              <button
                onClick={() => handleIncreaseAmount(`${item.product._id}`, -1)}
                aria-label={`Incrementar cantidad de ${item.product.name}`}
              >
                <MinusIcon className="h-6 w-6" />
              </button>
              <div className="text-xl font-medium">{item.amount}</div>
              <button
                onClick={() => handleIncreaseAmount(`${item.product._id}`, 1)}
                aria-label={`Disminuir cantidad de ${item.product.name}`}
              >
                <PlusIcon className="h-6 w-6" />
              </button>
            </div>
            <button
              onClick={() => handleRemoveItem(`${item.product._id}`)}
              aria-label={`Eliminar ${item.product.name}`}
            >
              <TrashIcon className="h-6 w-6 text-error" />
            </button>
          </div>
        ))}
      </Form>
    </div>
  );
}
