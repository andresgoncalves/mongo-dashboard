"use server";

import { number } from "zod";
import { Categories, ICategory } from "./category/category.model";
import { Products } from "./product/product.model";
import { Sales } from "./sale/sale.model";
import { sendData } from "./utils";
import { ObjectId } from "mongodb";

export async function getSaleStats() {
  const saleStats = await Sales.aggregate<{
    totalEarnings: number;
    salesCount: number;
  }>([
    {
      $group: {
        _id: "saleStats",
        totalEarnings: {
          $sum: "$total",
        },
        salesCount: {
          $count: {},
        },
      },
    },
  ]).next();

  if (!saleStats) {
    return sendData({
      saleStats: {
        totalEarnings: 0,
        salesCount: 0,
      },
    });
  }

  return sendData({ saleStats });
}

export async function getProductCountByCategory() {
  const productCountByCategory = await Categories.aggregate<{
    _id: ObjectId;
    name: string;
    count: number;
  }>([
    {
      $lookup: {
        from: Products.collectionName,
        localField: "_id",
        foreignField: "category._id",
        as: "products",
      },
    },
    {
      $project: {
        name: 1,
        count: {
          $size: "$products",
        },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]).toArray();

  return sendData({ productCountByCategory });
}

export async function getTotalSalesByPeriod() {
  const currentDate = new Date();
  currentDate.setUTCHours(24 - 4, 0, 0, 0);

  const daysOfWeek = Array(7)
    .fill(0)
    .map((_, key) => {
      const start = new Date(currentDate);
      start.setUTCDate(start.getUTCDate() - key - 1);
      const end = new Date(start);
      end.setUTCDate(start.getUTCDate() + 1);

      return {
        start,
        end,
      };
    });

  const totalSalesByWeek = await Promise.all(
    daysOfWeek.map(({ start, end }) =>
      Sales.aggregate<{
        _id: string;
        date: Date;
        count: number;
      }>([
        {
          $match: {
            datetime: {
              $gte: start,
              $lt: end,
            },
          },
        },
        {
          $group: {
            _id: "totalSalesByWeek",
            count: { $count: {} },
          },
        },
      ])
        .next()
        .then((result) => ({ date: start, count: result?.count || 0 })),
    ),
  ).then((sales) =>
    sales.reduce<
      {
        date: Date;
        count: number;
      }[]
    >((prev, sale) => [...prev, sale], []),
  );

  return sendData({ totalSalesByWeek });
}

export async function getTotalEarningsByPeriod() {
  const currentDate = new Date();
  currentDate.setUTCHours(24 - 4, 0, 0, 0);

  const daysOfWeek = Array(7)
    .fill(0)
    .map((_, key) => {
      const start = new Date(currentDate);
      start.setUTCDate(start.getUTCDate() - key - 1);
      const end = new Date(start);
      end.setUTCDate(start.getUTCDate() + 1);

      return {
        start,
        end,
      };
    });

  const totalEarningsByWeek = await Promise.all(
    daysOfWeek.map(({ start, end }) =>
      Sales.aggregate<{
        date: Date;
        total: number;
      }>([
        {
          $match: {
            datetime: {
              $gte: start,
              $lt: end,
            },
          },
        },
        {
          $group: {
            _id: "totalSalesByWeek",
            total: { $sum: "$total" },
          },
        },
      ])
        .next()
        .then((result) => ({ date: start, total: result?.total || 0 })),
    ),
  ).then((sales) =>
    sales.reduce<
      {
        date: Date;
        total: number;
      }[]
    >((prev, sale) => [...prev, sale], []),
  );

  console.log(totalEarningsByWeek);

  return sendData({ totalEarningsByWeek });
}

export async function getTotalSalesByCategory() {
  const totalSalesByCategory = await Categories.aggregate<{
    name: number;
    count: number;
  }>([
    {
      $lookup: {
        from: Products.collectionName,
        localField: "_id",
        foreignField: "category._id",
        as: "products",
      },
    },
    {
      $lookup: {
        from: Sales.collectionName,
        localField: "products._id",
        foreignField: "items.product._id",
        as: "sales",
      },
    },
    {
      $project: {
        name: 1,
        count: { $size: "$sales" },
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]).toArray();

  return sendData({ totalSalesByCategory });
}

export async function getAverageAmountByPaymentMethod() {
  const methodNames = {
    cash: "Efectivo",
    debit: "Tarjeta de Débito",
    credit: "Tarjeta de Crédito",
    "pago-movil": "Pago Móvil",
    zelle: "Zelle",
  };

  const averageAmountByPaymentMethod = await Sales.aggregate<{
    method: "cash" | "debit" | "credit" | "pago-movil" | "zelle";
    average: number;
  }>([
    {
      $group: {
        _id: "$payment.method",
        average: {
          $avg: "$total",
        },
      },
    },
    {
      $project: {
        method: "$_id",
        average: 1,
      },
    },
    {
      $sort: {
        average: -1,
      },
    },
  ]).toArray();

  return sendData({
    averageAmountByPaymentMethod: averageAmountByPaymentMethod.map(
      ({ method, average }) => ({
        method: methodNames[method],
        average,
      }),
    ),
  });
}

export async function getTotalSalesByPaymentMethod() {
  const methodNames = {
    cash: "Efectivo",
    debit: "Tarjeta de Débito",
    credit: "Tarjeta de Crédito",
    "pago-movil": "Pago Móvil",
    zelle: "Zelle",
  };

  const totalSalesByPaymentMethod = await Sales.aggregate<{
    method: "cash" | "debit" | "credit" | "pago-movil" | "zelle";
    count: number;
  }>([
    {
      $group: {
        _id: "$payment.method",
        count: { $count: {} },
      },
    },
    {
      $project: {
        method: "$_id",
        count: 1,
      },
    },
    {
      $sort: {
        count: -1,
      },
    },
  ]).toArray();

  return sendData({
    totalSalesByPaymentMethod: totalSalesByPaymentMethod.map(
      ({ method, count }) => ({
        method: methodNames[method],
        count,
      }),
    ),
  });
}
