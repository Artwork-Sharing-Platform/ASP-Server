import { Art } from "../models/Art.js";
import { Comment } from "../models/Comment.js";
import { ReplyComment } from "../models/ReplyComment.js";
import { User } from "../models/User.js";
import { Payment } from "../models/Payment.js";
import { Package } from "../models/Package.js";
import { Feature } from "../models/Feature.js";

class AdminService {
  async getAllData() {
    try {
      const [users, arts, totalAmountResult] = await Promise.all([
        //lấy dữ liệu từ các bảng
        User.find(),
        Art.find(),
        Payment.aggregate([
          {
            $group: {
              _id: null,
              totalAmount: { $sum: "$amount" },
            },
          },
          {
            $project: {
              _id: 0,
              totalAmount: 1,
            },
          },
        ]),
      ]);
      let totalCountAllComments = 0;
      const commentCount = await Comment.aggregate([
        //tính số lượng comment
        { $project: { commentCount: { $size: "$comments" } } },
        { $group: { _id: null, totalCount: { $sum: "$commentCount" } } },
        { $project: { _id: 0, totalCount: 1 } },
      ]);
      totalCountAllComments +=
        commentCount.length > 0 ? commentCount[0].totalCount : 0;
      const comments = await Comment.find();
      for (const comment of comments) {
        //tính số lượng reply comment
        for (const commentId of comment.comments) {
          const replyComments = await ReplyComment.find({ commentId });
          for (const replyComment of replyComments) {
            totalCountAllComments += replyComment.replyComments.length;
          }
        }
      }
      let totalAmount =
        totalAmountResult.length > 0 ? totalAmountResult[0].totalAmount : 0;
      totalAmount = parseFloat(totalAmount.toString().replace(/\.?0+$/, ""));
      return {
        totalUsers: users.length,
        totalArts: arts.length,
        totalCountAllComments,
        totalAmount,
      };
    } catch (error) {
      throw error;
    }
  }

  async countPackage() {
    try {
      const packages = await Package.find({
        name: { $in: ["Basic", "Business", "Enterprise"] },
      });
      const featureCounts = await Promise.all(
        packages.map(async (pkg) => {
          const features = await Feature.find({ packageId: pkg._id });
          return features.length;
        })
      );

      return featureCounts;
    } catch (error) {
      throw error;
    }
  }

  async getListUser() {
    try {
      const userList = await User.find();

      return userList;
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

  async updateStatus(id, updateStatus) {
    try {
      const user = await User.findOne({ _id: id });
      if (!user) {
        throw new Error("User not found");
      }
      user.status = updateStatus.status;
      const updatedUser = await user.save();
      return updatedUser;
    } catch (error) {
      throw error;
    }
  }

  async updateArtworkStatus(art) {
    try {
      const artwork = await Art.findById({ _id: art.key });
      if (!artwork) {
        throw new Error("Artwork not found");
      }
      artwork.status = true;
      artwork.countReport = 0;
      await artwork.save();
      await NotificationService.sendUnlockArtworkNotification(art);
      return artwork;
    } catch (error) {
      throw new Error(`Error updating artwork: ${error.message}`);
    }
  }
}

export default new AdminService();
