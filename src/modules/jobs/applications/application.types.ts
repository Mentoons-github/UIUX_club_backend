import { Types } from "mongoose";
import { APPLICATION_STATUSES } from "./application.constants";

export interface IJobApplication {
  user: Types.ObjectId;
  job: Types.ObjectId;
  email: string;
  age: number;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  country: string;
  state: string;
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
  resume: string;
  portfolioLink?: string;
  status:
    | "pending"
    | "reviewed"
    | "shortlisted"
    | "accepted"
    | "rejected"
    | "interview";
  createdAt: Date;
  updatedAt: Date;
}

export interface Experience {
  company: string;
  role: string;
  startDate: string;
  endDate?: string;
  currentlyWorking: boolean;
  description?: string;
}

export interface ScreeningAnswer {
  questionId: string;
  question: string;
  type: "text" | "yes-no" | "multiple-choice";
  answer: string;
}

export interface ApplyJobData {
  email: string;
  age: number;
  gender: "male" | "female" | "non-binary" | "prefer-not-to-say";
  country: string;
  state: string;
  city: string;
  phoneNumber: string;
  whatsappNumber: string;
  resume: string;
  portfolioLink?: string;

  totalExperienceYears?: number;
  experience: Experience[];

  screeningAnswers: ScreeningAnswer[];
}

export type ApplicationStatusValue = (typeof APPLICATION_STATUSES)[number];
