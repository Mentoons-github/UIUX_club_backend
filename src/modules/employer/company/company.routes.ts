import express from "express";
import {
  sendEmailVerification,
  confirmEmailVerification,
} from "../../emailVerification";
import { verifyAuth } from "../../../middleware/auth.middleware";
import {
  listCompanyUpdateRequests,
  requestCompanyUpdate,
} from "./company.controller";
import { validate } from "../../../middleware/validate.middleware";
import { companyUpdateSchema } from "./company.validation";

const router = express.Router();

router.post("/email/send-verification", verifyAuth, sendEmailVerification);
router.get("/email/confirm-verification", confirmEmailVerification);

router
  .route("/company-update")
  .post(verifyAuth, validate(companyUpdateSchema), requestCompanyUpdate)
  .get(verifyAuth, listCompanyUpdateRequests);

export default router;
