import { z } from "zod";
import { db } from "../db";

export interface ICategory {
  name: string;
}

export const categorySchema = z.object({
  name: z.string().min(1, "Nombre de categoría inválido"),
});

export const Categories = db.collection<ICategory>("categories");
