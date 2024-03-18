import express from "express";
const router = express.Router();

import userController from "../controllers/UserController.js";
import { authenticateToken } from "../middleware/AuthMiddleware.js";

// GET METHODS
router.get(
  "/getListUserByName/:userName",
  authenticateToken(["Admin"]),
  userController.getListUserByName
);

router.get(
  "/getListUser",
  authenticateToken(["Admin"]),
  userController.getListUser
);

router.get(
  "/getListUserByEmail/:email",
  authenticateToken(["Admin"]),
  userController.getListUserByEmail
);

router.get(
  "/getUserById/:id",
  authenticateToken(["Admin", "Personal", "Partnership"]),
  userController.getUserById
);

// POST METHODS
router.post(
  "/updateStatusUser/:id",
  authenticateToken(["Admin"]),
  userController.updateStatusUser
);

router.post(
  "/updateUser/:id",
  authenticateToken(["Admin", "Personal", "Partnership"]),
  userController.updateUser
);

export default router;
