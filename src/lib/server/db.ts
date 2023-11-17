import { MongoClient } from "mongodb";

if (!process.env.MONGO_URI) {
  throw Error("MONGO_URI no configurado");
}

const client = new MongoClient(process.env.MONGO_URI);

const db = client.db();

export { db };
