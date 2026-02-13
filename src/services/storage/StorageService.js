import fs from "fs";
import path from "path";

class StorageService {
  constructor(folder) {
    this._folder = folder;

    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  }

  writeFile(file, meta) {
    const filename = +new Date() + meta.filename;
    const filePath = path.join(this._folder, filename);

    const fileStream = fs.createWriteStream(filePath);

    return new Promise((resolve, reject) => {
      fileStream.on("error", (error) => reject(error));
      fileStream.on("finish", () => resolve(filename));

      fileStream.write(file.buffer);
      fileStream.end();
    });
  }
}

export default StorageService;
