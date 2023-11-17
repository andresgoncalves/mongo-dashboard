"use server";

import { ObjectId, WithId } from "mongodb";
import { sendData, sendError, sendMessage } from "../utils";
import { IProduct, Products, productSchema } from "./product.model";
import { revalidatePath } from "next/cache";
import { Categories } from "../category/category.model";

export async function findAllProducts() {
  const products = await Products.aggregate<WithId<IProduct>>([
    {
      $lookup: {
        from: Categories.collectionName,
        localField: "category._id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
  ]).toArray();
  return sendData({ products });
}

export async function findProduct(id: any) {
  if (!ObjectId.isValid(id)) {
    console.log(id);
    return sendError("ID de producto inválido");
  }

  const product = await Products.aggregate<WithId<IProduct>>([
    { $match: { _id: new ObjectId(id) } },
    {
      $lookup: {
        from: Categories.collectionName,
        localField: "category._id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
  ]).next();

  if (!product) {
    return sendError("Producto no encontrado");
  }

  return sendData({ product });
}

export async function findProductByCode(code: string) {
  const validation = productSchema.shape.code.safeParse(code);
  if (!validation.success) {
    return sendError("Código de producto inválido");
  }

  const product = await Products.aggregate<WithId<IProduct>>([
    { $match: { code: validation.data } },
    {
      $lookup: {
        from: Categories.collectionName,
        localField: "category._id",
        foreignField: "_id",
        as: "category",
      },
    },
    { $unwind: "$category" },
  ]).next();

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

  const category = await Categories.findOne({
    _id: product.category._id,
  });
  if (!category) {
    return sendError("Categoría no encontrada");
  }

  const result = await Products.insertOne(product);

  if (!result.acknowledged) {
    return sendError("Error al registrar producto");
  }

  revalidatePath("/(dashboard)/products");
  return sendData(
    { _id: result.insertedId },
    "Producto registrado exitosamente",
  );
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

  if (product.category) {
    const category = await Categories.findOne({
      _id: product.category._id,
    });
    if (!category) {
      return sendError("Categoría no encontrada");
    }
  }

  const result = await Products.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...product } },
  );

  if (!result.acknowledged) {
    return sendError("Error al actualizar producto");
  } else if (result.matchedCount === 0) {
    return sendError("Producto no encontrado");
  }

  revalidatePath("/(dashboard)/products");
  return sendMessage("Producto actualizado exitosamente");
}
