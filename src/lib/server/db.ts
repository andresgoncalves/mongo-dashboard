import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw Error("MONGO_URI no configurado");
}

const mongoClient = new MongoClient(process.env.MONGO_URI);

const db = mongoClient.db();

export { mongoClient, db };
