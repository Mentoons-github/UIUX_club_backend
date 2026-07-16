import { PutObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import s3 from "../../config/s3";
import AppError from "../../utils/AppError";
import { UploadFileResponse } from "./media.types";
import { env } from "../../config/env";
import pLimit from "p-limit";

export const uploadFile = async (
  file: Express.Multer.File,
  userId: string,
): Promise<UploadFileResponse> => {
  try {
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

export const uploadFiles = async (
  files: Express.Multer.File[],
  userId: string,
  concurrency = 3,
) => {
  if (!files?.length) return [];

  const limit = pLimit(concurrency);

  const uploaded = await Promise.all(
    files.map((file) => limit(() => uploadFile(file, userId))),
  );

  return uploaded.map((file) => ({
    url: file.url,
    type: file.mimetype.startsWith("video") ? "video" : "image",
  }));
};

export const uploadResume = async (
  file: Express.Multer.File,
  userId: string,
  username: string,
) => {
  try {
    const fileExtension = file.originalname.split(".").pop();

    const uniqueFileName = `${username}-${Date.now()}.${fileExtension}`;

    const key = `resumes/${userId}/${uniqueFileName}`;

    const params = {
      Bucket: env.AWS_BUCKET_NAME,
      Key: key,
      Body: file.buffer,
      ContentType: file.mimetype,

      Metadata: {
        userId,
        originalFileName: file.originalname,
        uploadType: "resume",
      },
    };

    const command = new PutObjectCommand(params);

    await s3.send(command);

    const fileUrl = `https://${env.AWS_BUCKET_NAME}.s3.${env.AWS_REGION}.amazonaws.com/${key}`;

    return {
      url: fileUrl,
      key,
      originalName: file.originalname,
      mimetype: file.mimetype,
    };
  } catch (error) {
    console.error(error);

    throw new AppError("Resume Upload Failed", 500);
  }
};

export const uploadResumeService = async (
  file: Express.Multer.File,
  userId: string,
  username: string,
) => {
  const uploadedResume = await uploadResume(file, userId, username);

  return uploadedResume.url;
};
// export const deleteMediaFrom3
