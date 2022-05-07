import { MongoClient } from "mongodb";
const { MONGODB_URI } = require("../../../secrets.json");

export default async function handler(req, res) {
  if (req.method === "DELETE") {
    const fileId = req.body.fileID;

    const client = await MongoClient.connect(MONGODB_URI);

    const db = client.db();

    db.collection("files").deleteOne({ _id: fileId });

    res.status(200).json({
      success: true,
      message: "File successfully deleted",
    });
  } else {
    res.status(400).json({ message: "Unsupported request method" });
  }
}
