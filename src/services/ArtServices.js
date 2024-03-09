import { Art } from "../models/Art.js";
import { Category } from "../models/Category.js";
import { Reaction } from "../models/Reaction.js";
import { User } from "../models/User.js";
import { Feature } from "../models/Feature.js";
import UserServices from "./UserServices.js";
import CategoryServices from "./CategoryServices.js";
import NotificationService from "./NotificationServices.js";

class ArtServices {
  async search(search) {
    try {
      const keyword = search.toLowerCase();
      // Fetch category names and user names concurrently
      // const [allCategories, allUsers] = await Promise.all([
      //   CategoryServices.getCategoryNames(),
      //   UserServices.getUserNames(),
      // ]);
      // const matchingCategories = allCategories
      //   .filter((category) =>
      //     category.categoryName.toLowerCase().includes(keyword.toLowerCase())
      //   )
      //   .map((category) => ({
      //     id: category.id,
      //     name: category.categoryName,
      //     type: "category",
      //   }));

      // const matchingUsers = allUsers
      //   .filter((user) =>
      //     user.userName.toLowerCase().includes(keyword.toLowerCase())
      //   )
      //   .map((user) => ({
      //     id: user.id,
      //     name: user.userName,
      //     avatar: user.avatar,
      //     type: "user",
      //   }));
      // const finalSearchResults = matchingCategories.concat(matchingUsers);
      // return finalSearchResults;
      // Perform text search for categories and users
      const keywordRegex = new RegExp(keyword, "i");
      // Fetch category names and user names concurrently
      const [matchingCategories, matchingUsers] = await Promise.all([
        Category.find({ name: { $regex: keywordRegex } })
          .limit(10)
          .lean(),
        User.find({ userName: { $regex: keywordRegex } })
          .limit(10)
          .lean(),
      ]);

      const mappedCategories = matchingCategories.map((category) => ({
        id: category._id,
        name: category.name,
        type: "category",
      }));

      const mappedUsers = matchingUsers.map((user) => ({
        id: user._id,
        name: user.userName,
        avatar: user.avatar,
        type: "user",
      }));
      const finalSearchResults = mappedUsers.concat(mappedCategories);
      return finalSearchResults;
    } catch (error) {
      throw error;
    }
  }

  async postArt(newArt) {
    try {
      const [category, feature] = await Promise.all([
        Category.findOne({ name: newArt.tag }),
        Feature.findOne({ userId: newArt.userId }),
      ]);

      if (!category) {
        throw new Error(`No category found for tag: ${newArt.tag}`);
      }

      newArt.categoryId = category._id;

      if (newArt.access === "private" && feature.countPostPrivate > 0) {
        feature.countPostPrivate -= 1;
      }

      if (newArt.isCheckedAds && feature.countAds > 0) {
        feature.countAds -= 1;
      }

      await feature.save();

      const newArtwork = new Art(newArt);
      // Send notification to followers using NotificationService
      await NotificationService.sendPostArtworkNotificationToFollowers(
        newArtwork
      );
      await newArtwork.save();
      return newArtwork;
    } catch (error) {
      throw error;
    }
  }

  async getAllArtwork() {
    try {
      const artWorks = await Art.find({});
      const sortedArtworks = artWorks.sort((a, b) => b.createdAt - a.createdAt);
      return sortedArtworks;
    } catch (error) {
      throw error;
    }
  }

  async getAllArtworkById(id) {
    try {
      const artWork = await Art.findOne({ _id: id });
      return artWork;
    } catch (error) {
      throw error;
    }
  }

  async getAllArtworkByUserId(userId) {
    try {
      const artWorks = await Art.find({ userId: userId });
      const sortedArtworks = artWorks.sort((a, b) => b.createdAt - a.createdAt);
      return sortedArtworks;
    } catch (error) {
      throw error;
    }
  }

  async addReaction(artId, userId, reaction) {
    try {
      if (
        reaction !== null &&
        !["Love", "Haha", "Thank", "GoodIdea", "Wow"].includes(reaction)
      ) {
        throw new Error("Invalid reaction");
      }

      // Check if the art exists
      const art = await Art.findById(artId);
      if (!art) {
        throw new Error("Art not found");
      }

      // Check if a Reactions document already exists for this art
      let reactions = await Reaction.findOne({ artId });

      // If no Reactions document exists, create one
      if (!reactions) {
        reactions = new Reaction({ artId });
      }

      // Check if the user has already reacted
      const existingReaction = reactions.reactions.find(
        (react) => react.userId.toString() === userId
      );

      if (existingReaction) {
        // Update the existing reaction or remove it if the new reaction is null
        if (reaction === null) {
          reactions.reactions.pull({ userId });
        } else {
          existingReaction.reaction = reaction;
        }
      } else if (reaction !== null) {
        // Add a new interaction if the reaction is not null
        reactions.reactions.push({ userId, reaction });

        //Send notification
        await NotificationService.sendReactionNotificationToFollowers(
          artId,
          userId,
          reaction
        );
      }

      await reactions.save();

      // Update the Art document with the reference to the Reactions document
      art.reactionId = reactions._id;
      await art.save();

      return art;
    } catch (error) {
      throw error;
    }
  }

  async getReactionByUserIdAndArtId(userId, artId) {
    try {
      const artReaction = await Reaction.findOne({ artId: artId });

      if (!artReaction) {
        return null;
      }

      const reaction = artReaction.reactions.find(
        (r) => r.userId && r.userId.equals(userId)
      );
      return reaction;
    } catch (error) {
      throw error;
    }
  }

  async getReactionLength(artId) {
    try {
      const reactions = await Reaction.findOne({ artId });

      if (!reactions) {
        return 0;
      }

      return reactions.reactions.length;
    } catch (error) {
      throw error;
    }
  }

  async getArtworkByCategoryId(categoryId) {
    try {
      const arts = await Art.find({ categoryId: categoryId });
      const sortedArtworks = arts.sort((a, b) => b.createdAt - a.createdAt);
      return sortedArtworks;
    } catch (error) {
      throw error;
    }
  }
}
export default new ArtServices();
