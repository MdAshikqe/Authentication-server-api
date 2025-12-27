import { Response } from "express";

const sendResponse = <T>(
  res: Response,
  jsonData: {
    statuscode: number;
    sucess: boolean;
    message: string;
    metaData?: {
      page: number;
      limit: number;
      total: number;
    };
    data: T | null | undefined;
  }
) => {
  res.status(jsonData.statuscode).json({
    sucess: jsonData.sucess,
    message: jsonData.message,
    metaData: jsonData.metaData || null || undefined,
    data: jsonData.data || null || undefined,
  });
};

export default sendResponse;
