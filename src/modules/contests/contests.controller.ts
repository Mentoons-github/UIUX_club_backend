import asyncHandler from "express-async-handler";
import { Request, Response } from "express";
import { getPagination, successResponse } from "../../utils";
import { getContests } from "./contests.service";

export const fetchContests = asyncHandler(
  async (req: Request, res: Response) => {
    const { page, limit } = getPagination(
      req.query.page as string,
      req.query.limit as string,
    );

    const contests = await getContests(limit, page);

    return successResponse(res, 200, "Contests fetched successfully", contests);
  },
);
