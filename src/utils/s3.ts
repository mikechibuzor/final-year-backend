import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3"
import { v4 } from "uuid"


export const uploadFile = async (file: Express.Multer.File): Promise<any> => {
  const s3 = new S3Client({ region: "eu-north-1" });
  const fileName = `${v4()}.${file.originalname.split(".").slice(-1)[0]}`
  const params = {
    Bucket: "aws-final-year-project",
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  }
  try {
    await s3.send(new PutObjectCommand(params))
    return `https://aws-final-year-project.s3.eu-north-1.amazonaws.com/${fileName}`;
  } catch (error) {
    throw error;
  }
}