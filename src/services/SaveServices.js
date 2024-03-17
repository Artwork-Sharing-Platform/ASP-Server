import { Save } from "../models/Save.js";
import { User } from "../models/User.js";
import { Feature } from "../models/Feature.js";
class SaveService {
  async saveArtToBookmark(userID, artID) {
    try {
      let save = await Save.findOne({ userID });
      let feature = await Feature.findOne({ userId: userID });
      if (!save) {
        save = new Save({
          userID,
          arts: [{ artID }],
        });
      } else {
        save.arts.push({ artID });
      }
      if (feature && feature.countSave > 0) {
        feature.countSave -= 1;
        await feature.save();
      }
      await save.save();
      return { save, feature };
    } catch (error) {
      console.error("Error saving artwork:", error);
      throw error;
    }
  }

  async getAllArtIDsForUser(userId) {
    try {
      const save = await Save.findOne({ userID: userId });

      if (!save) {
        return [];
      }

      const artIDs = save.arts.map((art) => art.artID.toString());
      return artIDs;
    } catch (error) {
      throw error;
    }
  }

  async removeArtFromBookmark(userID, artID) {
    try {
      const result = await Save.findOneAndDelete({ userID, artID });
      return result;
    } catch (error) {
      throw error;
    }
  }
}

export default new SaveService();
