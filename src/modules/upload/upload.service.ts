import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../../config/s3";
import AppError from "../../utils/AppError";
import { UploadFileResponse } from "./upload.types";
import { env } from "../../config/env";

export const uploadFile = async (
  file: Express.Multer.File,
  userId: string,
): Promise<UploadFileResponse> => {
  try {
    console.log("splitting original name");
    const fileExtension = file.originalname.split(".").pop();
    const uniqueFileName = `${uuidv4()}.${fileExtension}`;
    const key = `uploads/${userId}/${Date.now()}-${uniqueFileName}`;

    const params = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,
      Metadata: {
        userId: userId,
        originalFileName: file.originalname,
        uploadTimestamp: Date.now().toString(),
      },
    };

    const command = new PutObjectCommand(params);
    await s3.send(command);

    const fileUrl = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

    console.log("file url :", fileUrl);
    return {
      url: fileUrl,
      key: key,
      originalName: file.originalname,
      mimetype: file.mimetype,
      uploadedAt: new Date().toISOString(),
      userId: userId,
      fileSize: file.buffer.length,
    };
  } catch (error) {
    console.error(error);
    throw new AppError(`S3 Upload Failed`, 500);
  }
};
