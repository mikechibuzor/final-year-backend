import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3"
import { v4 } from "uuid"
import { config } from "dotenv"
config()

const s3 = new S3Client({ region: process.env.AWS_REGION });

export const uploadFile = async (file: Express.Multer.File): Promise<any> => {
  const fileName = `${v4()}.${file.originalname.split(".").slice(-1)[0]}`
  const params = {
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: fileName,
    Body: file.buffer,
    ContentType: file.mimetype,
  }
  try {
    await s3.send(new PutObjectCommand(params))
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${fileName}`;
  } catch (error) {
    throw error;
  }
}

export const deleteFile = async (url: string) => {
  if (!url) return
  try {
    const Key = url.split('/').at(-1);
    const input = {
      Bucket: process.env.AWS_BUCKET_NAME,
      Key
    }
    await s3.send(new DeleteObjectCommand(input))
  } catch (error) {
    throw error
  }
}
