"use server";

import { ObjectId } from "mongodb";
import { sendData, sendError, sendMessage } from "../utils";
import { ICategory, Categories, categorySchema } from "./category.model";
import { revalidatePath } from "next/cache";

export async function findAllCategories() {
  const categories = await Categories.find().toArray();
  return sendData({ categories });
}

export async function findCategory(id: any) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de categoría inválido");
  }

  const category = await Categories.findOne({ _id: new ObjectId(id) });
  if (!category) {
    return sendError("Categoría no encontrada");
  }
  return sendData({ category });
}

export async function createCategory(data: ICategory) {
  const validation = categorySchema.safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const category = validation.data;
  const result = await Categories.insertOne(category);

  if (!result.acknowledged) {
    return sendError("Error al registrar categoría");
  }

  revalidatePath("/(dashboard)/categories");
  return sendData(
    { _id: result.insertedId },
    "Categoría registrada exitosamente",
  );
}

export async function updateCategory(id: any, data: Partial<ICategory>) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de categoría inválido");
  }

  const validation = categorySchema.partial().safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const category = validation.data;
  const result = await Categories.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...category } },
  );

  if (!result.acknowledged) {
    return sendError("Error al actualizar categoría");
  } else if (result.matchedCount === 0) {
    return sendError("Categoría no encontrada");
  }

  revalidatePath("/(dashboard)/categories");
  return sendMessage("Categoría actualizada exitosamente");
}
