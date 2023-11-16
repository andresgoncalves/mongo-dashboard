import { z } from "zod";
import { db } from "../db";

export interface IProduct {
  name: string;
  code: string;
  description: string;
}

export const productSchema = z.object({
  name: z.string(),
  code: z.string(),
  description: z.string(),
});

export const Products = db.collection<IProduct>("products");
