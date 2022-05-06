import fs from "fs";
import { buildFilesPath } from "../../_helper-functions";

export default function handler(_, res) {
  const filePath = buildFilesPath();

  fs.writeFileSync(filePath, "[]");

  res
    .status(200)
    .json({ success: true, message: "All files successfully deleted" });
}
