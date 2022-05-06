import fs from "fs";
import { buildFilesPath, extractFiles } from "../../_helper-functions";

export default function handler(req, res) {
  if (req.method === "DELETE") {
    const fileId = req.query.fileID;
    const filePath = buildFilesPath();

    const data = extractFiles(filePath);

    const selectedFile = data.find((item) => item.id === fileId);

    if (!selectedFile) {
      return res
        .status(404)
        .json({ success: false, message: `Error: No file with id ${id}` });
    }

    const newFiles = data.filter((item) => item.id !== fileId);

    if (fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, JSON.stringify(newFiles));
    }

    res.status(200).json({
      success: true,
      message: "File successfully deleted",
      file: newFiles,
    });
  } else {
    res.status(400).json({ message: "Unsupported request method" });
  }
}
