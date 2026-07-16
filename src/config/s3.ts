import { env } from "./env";
import { S3Client } from "@aws-sdk/client-s3";

const s3 = new S3Client({
  region: env.AWS_REGION,
  credentials: {
    accessKeyId: env.AWS_ACCESS_ID,
    secretAccessKey: env.AWS_SECRET_KEY,
  },
});

export default s3;
