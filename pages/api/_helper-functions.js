import fs from "fs";
import path from "path";

export const buildFilesPath = () => {
  return path.join(process.cwd(), "data", "files.json");
};

export const extractFiles = (filePath) => {
  const fileData = fs.readFileSync(filePath);
  const data = JSON.parse(fileData);
  return data;
};
