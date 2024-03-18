import ArtServices from "../services/ArtServices.js";
import NotificationServices from "../services/NotificationServices.js";
import cron from "node-cron";

class ArtController {
  //[GET] /api/v1/art/searchArtwork/:search
  async searchArtwork(req, res, next) {
    try {
      const { search } = req.params;
      const searchList = await ArtServices.search(search);
      res.status(200).json(searchList);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[POST] /api/v1/art/postArtwork
  async addArtwork(req, res, next) {
    try {
      const newArt = req.body;
      const newArtwork = await ArtServices.postArt(newArt);
      res.status(200).json(newArtwork);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/getArtwork
  async getAllArtwork(req, res, next) {
    try {
      const artWorks = await ArtServices.getAllArtwork();
      res.status(200).json(artWorks);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/getArtworkV2
  async getAllArtworkV2(req, res, next) {
    try {
      const artWorks = await ArtServices.getAllArtworkV2();
      res.status(200).json(artWorks);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/getAllArtworkByCreatedAtArt
  async getAllArtworkCreateAtArt(req, res, next) {
    try {
      const artWorks = await ArtServices.getAllArtworkByCreatedAtArt();

      res.status(200).json(artWorks);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/getArtworkById/:id
  async getAllArtworkById(req, res, next) {
    try {
      const { id } = req.params;
      const artWork = await ArtServices.getAllArtworkById(id);
      res.status(200).json(artWork);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/getArtworkByIdV2/:id
  async getAllArtworkByIdV2(req, res, next) {
    try {
      const { id } = req.params;
      const artWork = await ArtServices.getAllArtworkByIdV2(id);
      res.status(200).json(artWork);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/getArtworkByUserId/:userId
  async getAllArtworkByUserId(req, res, next) {
    try {
      const { userId } = req.params;
      const artWorks = await ArtServices.getAllArtworkByUserId(userId);
      res.status(200).json(artWorks);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[POST] /api/v1/art/add-reaction/:artId
  async addReaction(req, res, next) {
    try {
      const { artId } = req.params;
      const { userId, reaction } = req.body;
      const art = await ArtServices.addReaction(artId, userId, reaction);
      res.status(200).json(art);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/get-reaction/:artId/:userId
  async getReactionByUserIdAndArtId(req, res, next) {
    try {
      const { artId, userId } = req.params;
      const reaction = await ArtServices.getReactionByUserIdAndArtId(
        userId,
        artId
      );
      res.status(200).json(reaction);
    } catch (error) {
      res.status(500).json({ message: error.message });
      next();
    }
  }

  //[GET] /api/v1/art/get-reaction-length/:artId/
  async getReactionLength(req, res) {
    try {
      const { artId } = req.params;
      if (!artId) {
        return res.status(400).json({ error: "Invalid artId" });
      }
      const reactionLength = await ArtServices.getReactionLength(artId);
      res.status(200).json({ reactionLength });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  //[GET] /api/v1/art/getArtworkByCategoryId/:categoryId/
  async getArtworkByCategoryId(req, res) {
    try {
      const { categoryId } = req.params;
      if (!categoryId) {
        return res.status(400).json({ error: "Invalid categoryId" });
      }
      const artworks = await ArtServices.getArtworkByCategoryId(categoryId);
      res.status(200).json(artworks);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  }

  //[POST] /api/v1/art/updateArtworkStatus
  async updateArtworkStatus(req, res, next) {
    try {
      const art = req.body;
      const artWork = await ArtServices.updateArtworkStatus(art);
      res.status(200).json(artWork);
    } catch (error) {
      res.status(500).json({ message: error.message });
    }
  }

  //[POST] /api/v1/art/editArtwork/:artId
  async editArtwork(req, res, next) {
    try {
      const { artId } = req.params;
      const artUpdate = req.body;

      const artUpdated = await ArtServices.updateArtworkById(artId, artUpdate);

      res.status(200).json(artUpdated);
    } catch (error) {
      res.status(500).json({ error: error.message });
      next();
    }
  }
}

export default new ArtController();
