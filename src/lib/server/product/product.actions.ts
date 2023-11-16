"use server";

import { sendError, sendMessage } from "../utils";
import { IProduct, Product, productSchema } from "./product.model";

export async function createProduct(_product: IProduct) {
  const validation = productSchema.safeParse(_product);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const product = validation.data;
  const result = await Product.insertOne(product);

  if (!result.acknowledged) {
    return sendError("Error al registrar producto");
  }

  return sendMessage("Producto registrado exitosamente");
}
