import type { Request, Response } from "express";
import asyncHandler from "express-async-handler";
import {
  createCompanyUpdateRequest,
  getCompanyUpdateRequestsForEmployer,
} from "./company.service";

export const requestCompanyUpdate = asyncHandler(
  async (req: Request, res: Response) => {
    const employerId = req.user!.id;
    const {
      companyName,
      companyAbout,
      companySize,
      industry,
      workLocation,
      turnover,
      perks,
      website,
      jobTitle,
      location,
      jobType,
      designation,
    } = req.body;

    const update = await createCompanyUpdateRequest(employerId, {
      companyName,
      companyAbout,
      companySize,
      industry,
      workLocation,
      turnover,
      perks,
      website,
      jobTitle,
      location,
      jobType,
      designation,
    });

    res.status(201).json({
      message: "Company update request submitted for review",
      data: update,
    });
  },
);

export const listCompanyUpdateRequests = asyncHandler(
  async (req: Request, res: Response) => {
    const employerId = req.user!.id;

    const updates = await getCompanyUpdateRequestsForEmployer(employerId);

    res.json({ data: updates });
  },
);
