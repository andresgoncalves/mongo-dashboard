"use server";

import { ObjectId } from "mongodb";
import { sendData, sendError, sendMessage } from "../utils";
import { IProduct, Products, productSchema } from "./product.model";
import { revalidatePath } from "next/cache";

export async function findAllProducts() {
  const products = await Products.find().toArray();
  return sendData({ products });
}

export async function findProduct(id: any) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de producto inválido");
  }

  const product = await Products.findOne({ _id: new ObjectId(id) });
  if (!product) {
    return sendError("Producto no encontrado");
  }
  return sendData({ product });
}

export async function createProduct(data: IProduct) {
  const validation = productSchema.safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const product = validation.data;
  const result = await Products.insertOne(product);

  if (!result.acknowledged) {
    return sendError("Error al registrar producto");
  }

  revalidatePath("/products");
  revalidatePath(`/products/[id]`);
  return sendMessage("Producto registrado exitosamente");
}

export async function updateProduct(id: any, data: Partial<IProduct>) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de producto inválido");
  }

  const validation = productSchema.partial().safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const product = validation.data;
  const result = await Products.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...product } },
  );

  if (!result.acknowledged) {
    return sendError("Error al actualizar producto");
  } else if (result.matchedCount === 0) {
    return sendError("Producto no encontrado");
  }

  revalidatePath("/products");
  revalidatePath("/products/[id]");
  return sendMessage("Producto actualizado exitosamente");
}
