import multer from "multer";
import { Request } from "express"
const storage = multer.memoryStorage();
const fileFilter = (req: Request, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  if (file.mimetype.split("/")[1] === "pdf") {
    cb(null, true);
  } else {
    cb(new multer.MulterError("LIMIT_UNEXPECTED_FILE"));
  }
};
const limits = {
  fileSize: 5000000000
}
export const upload = multer({storage, fileFilter, limits: limits})