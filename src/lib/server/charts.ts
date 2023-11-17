"use server";

import { Categories } from "./category/category.model";
import { Products } from "./product/product.model";
import { sendData } from "./utils";
import { ObjectId } from "mongodb";

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
