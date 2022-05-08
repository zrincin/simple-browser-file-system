import { ObjectId } from "mongodb";
import { connectDB } from "../../../util-functions";

export default async function handler(req, res) {
  const fileId = req.query.fileID;

  if (req.method === "GET") {
    try {
      const client = await connectDB();
      const db = client.db();
      const document = await db
        .collection("files")
        .findOne({ _id: ObjectId(fileId) });

      return res.status(200).json({
        success: true,
        message: `File with an ID: ${fileId} successfully read`,
        file: document,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Getting file with an ID: ${fileId} failed`,
      });
    }
  }

  if (req.method === "DELETE") {
    const fileId = req.query.fileID;

    try {
      const client = await connectDB();
      const db = client.db();
      await db.collection("files").deleteOne({ _id: ObjectId(fileId) });

      return res.status(200).json({
        success: true,
        message: `File with an ID ${fileId} successfully deleted`,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: `Deleting file with an ID: ${fileId} failed`,
      });
    }
  } else {
    res.status(400).json({ message: "Unsupported request method" });
  }
  client.close();
}
