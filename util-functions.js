import { MongoClient } from "mongodb";
const { MONGODB_URI } = require("./secrets.json");

export const connectDB = async () => {
  const client = await MongoClient.connect(MONGODB_URI);
  return client;
};

export const getDocuments = async (client, collection, sort) => {
  const db = client.db();
  const documents = await db.collection(collection).find().sort(sort).toArray();
  return documents;
};
