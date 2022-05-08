import { connectDB, getDocuments } from "../../../util-functions";

export default async function handler(req, res) {
  if (req.method === "GET") {
    try {
      const documents = await getDocuments(client, "files", { _id: -1 });

      return res.status(200).json({
        success: true,
        message: "File(s) successfully read",
        files: documents,
      });
    } catch (error) {
      return res
        .status(500)
        .json({ success: false, message: "Getting files failed" });
    }
  }

  if (req.method === "POST") {
    const { filename, filetype } = req.body;

    if (
      !filename ||
      filename.trim() === "" ||
      !filetype ||
      filetype.trim() === ""
    ) {
      res.status(422).json({ success: false, message: "Invalid input data" });
      client.close();
      return;
    }

    try {
      const client = await connectDB();
      const newFile = {
        id: new Date().getTime().toString(),
        filename,
        filetype: "." + filetype,
      };

      const db = client.db();
      await db.collection("files").insertOne(newFile);

      return res.status(201).json({
        success: true,
        message: "File successfully created",
        file: newFile,
      });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Inserting files into the database failed",
      });
    }
  }

  if (req.method === "DELETE") {
    try {
      const client = await connectDB();
      const db = client.db();
      db.collection("files").deleteMany();

      return res
        .status(200)
        .json({ success: true, message: "All files successfully deleted" });
    } catch (error) {
      return res.status(500).json({
        success: false,
        message: "Deleting files from the database failed",
      });
    }
  } else {
    res.status(400).json({ message: "Unsupported request method" });
  }
  client.close();
}
