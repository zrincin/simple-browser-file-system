import { writeFileSync } from "fs";
import { buildFilesPath, extractFiles } from "../_helper-functions";

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

    res.status(201).json({
      success: true,
      message: "File successfully created",
      file: newFile,
    });
  } else if (req.method === "GET") {
    const filePath = buildFilesPath();
    const files = extractFiles(filePath);

    res.status(200).json({
      success: true,
      message: "File(s) successfully read",
      files,
    });
  } else {
    res.status(400).json({ message: "Unsupported request method" });
  }
}
