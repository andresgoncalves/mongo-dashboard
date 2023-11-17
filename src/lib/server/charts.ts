"use server";

import { Categories } from "./category/category.model";
import { Products } from "./product/product.model";
import { Sales } from "./sale/sale.model";
import { sendData, sendError } from "./utils";
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
