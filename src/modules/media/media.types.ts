export interface UploadFileResponse {
  url: string;
  key: string;
  originalName: string;
  mimetype: string;
  uploadedAt: string;
  userId: string;
  fileSize: number;
}
