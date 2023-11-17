import { z } from "zod";
import { db } from "../db";
import { IProduct } from "../product/product.model";
import { ICustomer } from "../customer/customer.model";
import { ObjectId } from "mongodb";

export interface ISale {
  customer: {
    _id?: any;
  } & Partial<ICustomer>;
  items: {
    product: {
      _id?: any;
    } & Partial<IProduct>;
    amount: number;
    price?: number;
  }[];
  datetime?: string;
  subtotal?: number;
  taxes?: number;
  total?: number;
}

export const saleSchema = z.object({
  customer: z.object({
    _id: z
      .any()
      .refine(ObjectId.isValid, "ID de cliente inválido")
      .transform((id) => new ObjectId(id)),
  }),
  items: z.array(
    z.object({
      product: z.object({
        _id: z
          .any()
          .refine(ObjectId.isValid, "ID de producto inválido")
          .transform((id) => new ObjectId(id)),
      }),
      amount: z.coerce.number().positive("Cantidad inválida"),
    }),
  ),
});

export const Sales = db.collection<ISale>("sales");
