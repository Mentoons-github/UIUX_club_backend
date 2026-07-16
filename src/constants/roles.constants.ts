export const ROLES = {
  USER: "user",
  EMPLOYER: "employer",
  ADMIN: "admin",
  SUB_EMPLOYER: "sub_employer",
} as const;

export const MODEL_MAP = {
  user: "User",
  employer: "Employer",
  sub_employer: "SubEmployer",
  admin: "Admin",
} as const;
