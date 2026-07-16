import { JOB_STATUS_ENUM } from "./jobs.contants";

export type JobCategory = "internship" | "uiux" | "freelancers";
export type JobType =
  | "Full-time"
  | "Hybrid"
  | "On-site"
  | "Contract"
  | "Project"
  | "Ongoing"
  | "Remote";

export type ScreeningQuestionType = "text" | "yes-no" | "multiple-choice";

export interface IJobCompany {
  name: string;
  logo: string;
}

export interface IScreeningQuestion {
  question: string;
  type: ScreeningQuestionType;
  options?: string[];
  required: boolean;
}

export type JobStatus = (typeof JOB_STATUS_ENUM)[number];

export interface IJob {
  _id?: string;
  category: JobCategory;
  title: string;
  tag?: string;
  skills: string[];
  description: string;
  role: string;
  company: IJobCompany;
  location: string;
  type: JobType;
  salary: string;
  experienceRequired?: string;
  tags: string[];
  paid: boolean;
  employerId: string;
  status: JobStatus;
  isFreePost: boolean;
  jobOrder?: string | null;
  expiresAt: Date;
  screeningQuestions?: IScreeningQuestion[];
  benefits?: string[];
  responsibilities?: string[];
  requirements?: string[];
  preferredQualifications?: string[];
  featured?: boolean;
  featuredUntil?: Date;
  createdAt: Date;
  updatedAt: Date;
}
