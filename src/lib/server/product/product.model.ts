import { z } from "zod";
import { db } from "../db";
import { ObjectId } from "mongodb";
import { ICategory } from "../category/category.model";

export interface IProduct {
  name: string;
  code: string;
  description: string;
  category: {
    _id?: any;
  } & Partial<ICategory>;
  price: number;
  available: number;
}

export const productSchema = z.object({
  name: z.string().min(1, "Nombre de producto inválido"),
  code: z.string().min(1, "Código de producto inválido"),
  description: z.string(),
  category: z.object({
    _id: z
      .any()
      .refine(ObjectId.isValid, "ID de categoría inválido")
      .transform((id) => new ObjectId(id)),
  }),
  price: z.number().nonnegative("Precio inválido"),
  available: z
    .number()
    .int("Cantidad inválida")
    .nonnegative("Cantidad inválida"),
});

export const Products = db.collection<IProduct>("products");
