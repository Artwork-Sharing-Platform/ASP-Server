import express from "express";
import artController from "../controllers/ArtController.js";
const router = express.Router();

router.get("/getArtwork", artController.getAllArtwork);
router.get("/getArtworkById/:id", artController.getAllArtworkById);
router.get("/getArtworkByUserId/:userId", artController.getAllArtworkByUserId);
router.post("/postArtwork", artController.addArtwork);
router.post("/add-reaction/:artId", artController.addReaction);
router.get(
  "/get-reaction/:artId/:userId",
  artController.getReactionByUserIdAndArtId
);
router.get("/get-reaction-length/:artId", artController.getReactionLength);

router.get("/searchArtwork/:tag", artController.searchArtwork);
export default router;
