import { z } from "zod";
import { db } from "../db";
import { ObjectId } from "mongodb";

export interface IProduct {
  name: string;
  description: string;
  category: {
    _id?: any;
    name?: string;
  };
  price: number;
  available: number;
}

export const productSchema = z.object({
  name: z.string().min(1, "Nombre de producto inválido"),
  description: z.string(),
  category: z.object({
    _id: z
      .any()
      .refine(ObjectId.isValid, { message: "ID de categoría inválido" })
      .transform((id) => new ObjectId(id)),
  }),
  price: z.number().nonnegative("Precio inválido"),
  available: z
    .number()
    .int("Cantidad inválida")
    .nonnegative("Cantidad inválida"),
});

export const Products = db.collection<IProduct>("products");
