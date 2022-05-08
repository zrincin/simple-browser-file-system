import { MongoClient, ObjectId } from "mongodb";
const { MONGODB_URI } = require("../../../secrets.json");

export default async function handler(req, res) {
  if (req.method === "GET") {
    const fileId = req.query.fileID;

    const client = await MongoClient.connect(MONGODB_URI);

    const db = client.db();

    const document = await db
      .collection("files")
      .findOne({ _id: ObjectId(fileId) });

    client.close();

    return res.status(200).json({
      success: true,
      message: `File with an ID ${fileId} successfully read`,
      file: document,
    });
  }

  if (req.method === "DELETE") {
    const fileId = req.query.fileID;

    const client = await MongoClient.connect(MONGODB_URI);

    const db = client.db();

    await db.collection("files").deleteOne({ _id: ObjectId(fileId) });

    client.close();

    return res.status(200).json({
      success: true,
      message: `File with an ID ${fileId} successfully deleted`,
    });
  } else {
    res.status(400).json({ message: "Unsupported request method" });
  }
}
