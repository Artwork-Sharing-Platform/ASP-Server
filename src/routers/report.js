import express from "express";
const router = express.Router();

import reportController from "../controllers/ReportController.js";

router.post("/createReport", reportController.createReport);
router.get("/getListReport", reportController.getListReport);
router.get("/:artID", reportController.getReportByArtId);
router.put("/:reportID", reportController.updateReportStatus);
router.post("/sendWarning", reportController.sendWarning);

export default router;
