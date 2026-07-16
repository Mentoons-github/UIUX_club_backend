import express from "express";
import {
  createJob,
  editJobs,
  extendJobExpiry,
  getAllJobs,
  getEmployerJobs,
  getJobById,
  getJobsByType,
  getSuggestedJobs,
} from "./jobs.controller";
import { validate } from "../../middleware/validate.middleware";
import {
  applyJob,
  applyJobSchema,
  getApplicantById,
  getEmployerApplicants,
  updateApplicationStatus,
} from "./applications";
import { upload } from "../media/media.middleware";
import { verifyAuth, optionalAuth } from "../../middleware/auth.middleware";
import { saveJob, unsaveJob } from "./savedJobs/savedJob.controller";
import { ensureUserExists } from "../../middleware/ensureUserExists.middleware";
import { createJobSchema } from "./validations/jobs.validation";
import { requireRole } from "../../middleware/requireRole.middleware";
import { ROLES } from "../../constants/roles.constants";
import { recordView } from "./jobViews/jobView.controller";
import { requirePermission } from "../../middleware/requirePermission.middleware";
import { SUB_EMPLOYER_PERMISSIONS } from "../subEmployer/subEmployer.constants";
import { extendJobExpiryDateSchema } from "./validations/extendJobExpiry.validation";

const router = express.Router();

router
  .route("/")
  .get(optionalAuth, getAllJobs)
  .post(
    verifyAuth,
    ensureUserExists,
    requireRole(ROLES.EMPLOYER),
    validate(createJobSchema),
    createJob,
  );
router.get("/suggested", verifyAuth, getSuggestedJobs);
router.get("/type/:type", optionalAuth, getJobsByType);

router.get(
  "/my-jobs",
  verifyAuth,
  requirePermission(SUB_EMPLOYER_PERMISSIONS.VIEW_APPLICANTS),
  getEmployerJobs,
);

router.get(
  "/:jobId/applicants",
  verifyAuth,
  requirePermission(SUB_EMPLOYER_PERMISSIONS.VIEW_APPLICANTS),
  getEmployerApplicants,
);

router.get(
  "/applicants/:applicationId",
  verifyAuth,
  requirePermission(SUB_EMPLOYER_PERMISSIONS.VIEW_APPLICANTS),
  getApplicantById,
);

router.patch(
  "/:applicationId/status",
  verifyAuth,
  requirePermission(SUB_EMPLOYER_PERMISSIONS.CHANGE_APPLICATION_STATUS),
  updateApplicationStatus,
);

router.patch(
  "/:jobId/extend-date",
  verifyAuth,
  validate(extendJobExpiryDateSchema),
  extendJobExpiry,
);

router
  .route("/:jobId")
  .get(optionalAuth, getJobById)
  .put(verifyAuth, ensureUserExists, validate(createJobSchema), editJobs);

router.post(
  "/:jobId/apply",
  verifyAuth,
  upload.single("resume"),
  validate(applyJobSchema),
  applyJob,
);

router.post("/:jobId/save", verifyAuth, saveJob);
router.delete("/:jobId/unsave", verifyAuth, unsaveJob);
router.post("/:jobId/view", verifyAuth, recordView);

export default router;
