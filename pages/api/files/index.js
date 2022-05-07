import { MongoClient } from "mongodb";
const { MONGODB_URI } = require("../../../secrets.json");

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { filename, filetype } = req.body;

    if (
      !filename ||
      filename.trim() === "" ||
      !filetype ||
      filetype.trim() === ""
    ) {
      res.status(422).json({ success: false, message: "Invalid input data" });
      return;
    }

    const client = await MongoClient.connect(MONGODB_URI);

    const newFile = {
      id: new Date().getTime().toString(),
      filename,
      filetype: "." + filetype,
    };

    const db = client.db();

    await db.collection("files").insertOne(newFile);

    // newFile.id = result.insertedId;

    return res.status(201).json({
      success: true,
      message: "File successfully created",
      file: newFile,
    });
  }
  if (req.method === "GET") {
    const client = await MongoClient.connect(MONGODB_URI);

    const db = client.db();

    const documents = await db
      .collection("files")
      .find()
      .sort({ _id: -1 })
      .toArray();

    return res.status(200).json({
      success: true,
      message: "File(s) successfully read",
      files: documents,
    });
  }
  if (req.method === "DELETE") {
    const client = await MongoClient.connect(MONGODB_URI);

    const db = client.db();
    db.collection("files").deleteMany();

    // client.close();

    return res
      .status(200)
      .json({ success: true, message: "All files successfully deleted" });
  } else {
    return res.status(400).json({ message: "Unsupported request method" });
  }
}
