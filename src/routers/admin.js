import express from "express";
const router = express.Router();

import adminController from "../controllers/AdminController.js";

router.get("/getAllData", adminController.getAllData);
router.get("/countPackage", adminController.countPackage);
router.get("/getListUser", adminController.getListUser);
router.post("/updateStatusUser/:id", adminController.updateStatusUser);
router.get("/getArtwork", adminController.getAllArtwork);
router.post("/updateArtworkStatus", adminController.updateArtworkStatus);


export default router;
