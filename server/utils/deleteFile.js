import s3 from "../config/s3.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

const deleteFile = async (key) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET,
        Key: key,
      }),
    );
  } catch (err) {
    throw new Error(`Ошибка при удалении файла в S3 хранилище: ${err.message}`);
  }
};

export default deleteFile;
