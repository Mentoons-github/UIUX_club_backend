export const successResponse = (
  res: any,
  statusCode: number,
  message: string,
  data?: any,
) => {
  return res.status(statusCode).json({
    success: true,
    message,
    data: data || null,
  });
};
