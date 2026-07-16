import { Role } from "../../types/auth.types";
import { JwtPayload } from "../auth";
import { getEmployerById } from "../employer";
import { getSubEmployerById } from "../subEmployer";
import { findUserById } from "../user";

export const getUserAndModelType = async (userData: JwtPayload) => {
  let user;
  let receiverModel: Role;
  switch (userData.role) {
    case "user":
      user = await findUserById(userData.id);
      receiverModel = "User";
      break;
    case "employer":
      user = await getEmployerById(userData.id);
      receiverModel = "Employer";
      break;
    case "sub_employer":
      user = await getSubEmployerById(userData.id);
      receiverModel = "SubEmployer";
      break;
    default:
      throw new Error("Invalid role");
  }

  return { user, receiverModel };
};
