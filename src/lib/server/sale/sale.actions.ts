"use server";

import { ObjectId, WithId } from "mongodb";
import { revalidatePath } from "next/cache";
import { Products } from "../product/product.model";
import { sendData, sendError, sendMessage } from "../utils";
import { ISale, Sales, saleSchema } from "./sale.model";

export async function findAllSales() {
  const sales = await Sales.aggregate<WithId<ISale>>([
    {
      $lookup: {
        from: "customers",
        localField: "customer._id",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product._id",
        foreignField: "_id",
        as: "items.product",
      },
    },
    {
      $unwind: "$items.product",
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$items",
        },
        root: { $first: "$$ROOT" },
      },
    },
    {
      $replaceWith: {
        $mergeObjects: ["$root", { items: "$items" }],
      },
    },
  ]).toArray();

  return sendData({ sales });
}

export async function findSale(id: any) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de venta inválido");
  }

  const sale = await Sales.aggregate<WithId<ISale>>([
    {
      $match: {
        _id: new ObjectId(id),
      },
    },
    {
      $lookup: {
        from: "customers",
        localField: "customer._id",
        foreignField: "_id",
        as: "customer",
      },
    },
    {
      $unwind: "$customer",
    },
    {
      $unwind: "$items",
    },
    {
      $lookup: {
        from: "products",
        localField: "items.product._id",
        foreignField: "_id",
        as: "items.product",
      },
    },
    {
      $unwind: "$items.product",
    },
    {
      $group: {
        _id: "$_id",
        items: {
          $push: "$items",
        },
        root: { $first: "$$ROOT" },
      },
    },
    {
      $replaceWith: {
        $mergeObjects: ["$root", { items: "$items" }],
      },
    },
  ]).next();
  if (!sale) {
    return sendError("Venta no encontrada");
  }

  return sendData({ sale });
}

export async function createSale(data: ISale) {
  const validation = saleSchema.safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const sale = validation.data;

  try {
    const items = await Promise.all(
      sale.items.map(async (item) => {
        const product = await Products.findOne({ _id: item.product._id });
        if (!product) {
          throw "Producto no encontrado";
        }
        return {
          ...item,
          price: product.price,
        };
      }),
    );

    const subtotal = items.reduce(
      (prev, item) => prev + item.price * item.amount,
      0,
    );
    const taxes = subtotal * 0.16;
    const total = subtotal + taxes;

    Object.assign(sale, {
      items,
      subtotal,
      taxes,
      total,
      datetime: new Date(),
    });
  } catch (error) {
    return sendError(error);
  }

  const result = await Sales.insertOne(sale);

  if (!result.acknowledged) {
    return sendError("Error al registrar venta");
  }

  revalidatePath("/(dashboard)/sales");
  return sendData({ _id: result.insertedId }, "Venta registrada exitosamente");
}

export async function updateSale(id: any, data: Partial<ISale>) {
  if (!ObjectId.isValid(id)) {
    return sendError("ID de venta inválido");
  }

  const validation = saleSchema.partial().safeParse(data);
  if (!validation.success) {
    return sendError(validation.error);
  }

  const sale = validation.data;

  if (sale.items) {
    try {
      const items = await Promise.all(
        sale.items.map(async (item) => {
          const product = await Products.findOne({ _id: item.product._id });
          if (!product) {
            throw "Producto no encontrado";
          }
          return {
            ...item,
            price: product.price,
          };
        }),
      );

      const subtotal = items.reduce(
        (prev, item) => prev + item.price * item.amount,
        0,
      );
      const taxes = subtotal * 0.16;
      const total = subtotal + taxes;

      Object.assign(sale, {
        items,
        subtotal,
        taxes,
        total,
      });
    } catch (error) {
      return sendError(error);
    }
  }

  const result = await Sales.updateOne(
    { _id: new ObjectId(id) },
    { $set: { ...sale } },
  );

  if (!result.acknowledged) {
    return sendError("Error al actualizar venta");
  } else if (result.matchedCount === 0) {
    return sendError("Venta no encontrada");
  }

  revalidatePath("/(dashboard)/sales");
  return sendMessage("Venta actualizada exitosamente");
}
