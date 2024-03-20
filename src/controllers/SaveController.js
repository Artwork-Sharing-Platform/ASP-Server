import saveService from "../services/SaveServices.js";

class SaveController {
  //[POST] /api/v1/save/saveArtwork
  async saveArtToBookmark(req, res) {
    try {
      const { userID, artID } = req.body;
      const savedArtwork = await saveService.saveArtToBookmark(userID, artID);
      res.status(200).json(savedArtwork);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
  //[GET] /api/v1/save/getAllArts/:userId
  async getAllArtIDsForUser(req, res) {
    try {
      const { userId } = req.params;
      const artIDs = await saveService.getAllArtIDsForUser(userId);

      res.status(200).json(artIDs);
    } catch (error) {
      res.status(500).json({  message: error.message });
    }
  }
  //[DELETE] /api/v1/save
  async removeArtFromBookmark(req, res) {
    try {
      const data = await saveService.removeArtFromBookmark(
        req.query.userID,
        req.query.artID
      );
      res.status(200).json({ message: "Success" });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
}

export default new SaveController();
