import { writeFileSync } from "fs";
import { buildFilesPath, extractFiles } from "../_helper-functions";
import fs from "fs";

export default function handler(req, res) {
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

    const newFile = {
      id: new Date().getTime().toString(),
      filename,
      filetype: "." + filetype,
    };

    const filePath = buildFilesPath();
    const data = extractFiles(filePath);
    data.push(newFile);
    writeFileSync(filePath, JSON.stringify(data));

    return res.status(201).json({
      success: true,
      message: "File successfully created",
      file: newFile,
    });
  }
  if (req.method === "GET") {
    const filePath = buildFilesPath();
    const files = extractFiles(filePath);

    return res.status(200).json({
      success: true,
      message: "File(s) successfully read",
      files,
    });
  }
  if (req.method === "DELETE") {
    const filePath = buildFilesPath();

    fs.writeFileSync(filePath, "[]");

    return res
      .status(200)
      .json({ success: true, message: "All files successfully deleted" });
  } else {
    res.status(400).json({ message: "Unsupported request method" });
  }
}
