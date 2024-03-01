import express from "express";
import CategoryController from "../controllers/CategoryController.js";
const router = express.Router();

router.post("/addCategory", CategoryController.addCategory);
router.get("/search/:name", CategoryController.searchCategoryByName);

export default router;
