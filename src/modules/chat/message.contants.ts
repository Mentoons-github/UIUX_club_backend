import { ParticipantType, SenderRole } from "./message.types";

export const ROLE_TO_PARTICIPANT_TYPE: Record<string, ParticipantType> = {
  user: "User",
  employer: "Employer",
  sub_employer: "Employer",
};

export const ROLE_TO_SENDER_TYPE: Record<string, SenderRole> = {
  user: "User",
  employer: "Employer",
  sub_employer: "SubEmployer",
};