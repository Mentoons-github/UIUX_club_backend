import SubEmployerModel from "../../subEmployer/subEmployer.model";
import AppError from "../../../utils/AppError";
import { ROLES } from "../../../constants/roles.constants";

export const resolveEmployerId = async (user: {
  id: string;
  role: string;
}): Promise<string> => {
  if (user.role === ROLES.EMPLOYER) {
    return user.id;
  }

  if (user.role === ROLES.SUB_EMPLOYER) {
    const subEmployer = await SubEmployerModel.findById(user.id).select(
      "assignedBy",
    );
    if (!subEmployer) {
      throw new AppError("Sub-employer not found", 404);
    }
    return subEmployer.assignedBy.toString();
  }

  throw new AppError("Invalid role", 403);
};
