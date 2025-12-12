import s3 from "@/config/s3.js";
import { AppError } from "@/utils/AppError.js";
import { DeleteObjectCommand } from "@aws-sdk/client-s3";

export const deletePhoto = async (key: string) => {
  try {
    await s3.send(
      new DeleteObjectCommand({
        Bucket: process.env.BUCKET,
        Key: key,
      }),
    );
  } catch (err) {
    throw new AppError(`Ошибка при удалении файла в S3 хранилище`, 500);
  }
};
