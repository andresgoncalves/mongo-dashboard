"use server";

import { number } from "zod";
import { Categories } from "./category/category.model";
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
  currentDate.setHours(0);
  console.log(currentDate);
  const daysOfWeek = Array(7)
    .fill(0)
    .map((_, key) => {
      const start = new Date(currentDate);
      start.setDate(start.getDate() - key);
      const end = new Date(currentDate);
      end.setDate(currentDate.getDate() - key + 1);
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
        {
          $set: {
            date: start,
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
