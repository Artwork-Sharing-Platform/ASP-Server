import express from "express";
const router = express.Router();

import adminController from "../controllers/AdminController.js";

router.get("/getAllData", adminController.getAllData);
export default router;