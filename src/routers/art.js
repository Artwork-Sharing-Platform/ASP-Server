import express from "express";
import artController from "../controllers/ArtController.js";
const router = express.Router();

router.get("/getArtwork", artController.getAllArtwork);
router.get("/getArtworkV2", artController.getAllArtworkV2);
router.get(
  "/getAllArtworkByCreatedAtArt",
  artController.getAllArtworkCreateAtArt
);
router.get("/getArtworkById/:id", artController.getAllArtworkById);
router.get("/getArtworkByIdV2/:id", artController.getAllArtworkByIdV2);
router.get("/getArtworkByUserId/:userId", artController.getAllArtworkByUserId);

router.get(
  "/get-reaction/:artId/:userId",
  artController.getReactionByUserIdAndArtId
);
router.get("/get-reaction-length/:artId", artController.getReactionLength);
router.get("/searchArtwork/:search", artController.searchArtwork);
router.get(
  "/getArtworkByCategoryId/:categoryId",
  artController.getArtworkByCategoryId
);
router.post("/postArtwork", artController.addArtwork);
router.post("/add-reaction/:artId", artController.addReaction);
router.post("/updateArtworkStatus", artController.updateArtworkStatus);
router.post("/editArtwork/:artId", artController.editArtwork);

export default router;
