"use server";

import { ObjectId } from "mongodb";
import { sendData, sendError, sendMessage } from "../utils";
import { Customers, ICustomer, customerSchema } from "./customer.model";
import { revalidatePath } from "next/cache";

export async function findAllCustomers() {
  const customers = await Customers.find().toArray();
  return sendData({ customers });
}

export async function findCustomer(id: any) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de cliente inválido");
  }

  const customer = await Customers.findOne({ _id: new ObjectId(id) });
  if (!customer) {
    return sendError("Cliente no encontrado");
  }
  return sendData({ customer });
}

export async function createCustomer(data: ICustomer | any) {
  const validation = customerSchema.safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const customer = validation.data;
  const result = await Customers.insertOne(customer);

  if (!result.acknowledged) {
    return sendError("Error al registrar cliente");
  }

  revalidatePath("/customers");
  revalidatePath("/customers/[id]");
  return sendMessage("Cliente registrado exitosamente");
}

export async function updateCustomer(id: any, data: Partial<ICustomer> | any) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de cliente inválido");
  }

  const validation = customerSchema.partial().safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const customer = validation.data;
  const result = await Customers.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...customer } },
  );

  if (!result.acknowledged) {
    return sendError("Error al actualizar cliente");
  } else if (result.matchedCount === 0) {
    return sendError("Cliente no encontrado");
  }

  revalidatePath("/customers");
  revalidatePath("/customers/[id]");
  return sendMessage("Cliente actualizado exitosamente");
}
