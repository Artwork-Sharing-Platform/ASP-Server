import { Follow } from "../models/Follow.js";
import NotificationServices from "./NotificationServices.js";
class FollowService {

  async create(followerId, followingId) {
    try {
      if (!followerId || !followingId) {
        throw new Error("followerId and followingId are required");
      }

      //Check if the record exists or not
      const existingFollow = await Follow.findOne({ followerId, followingId });

      if (existingFollow) {
        console.log(`User ${followerId} is already following ${followingId}`);
        return existingFollow;
      }

      const newFollow = await Follow.create({ followerId, followingId });

      //Send notifications to followed people
      await NotificationServices.sendFollowNotificationToFollowers(
        newFollow.followerId,
        newFollow.followingId
      );
      return newFollow;
    } catch (error) {
      console.error("Error while creating follow relationship:", error.message);
      throw error;
    }
  }

  async getFollower(followingId) {
    try {
      // Find records in Follow that have the corresponding followingId
      const followers = await Follow.find({ followingId: followingId });

      // Extract followerId from found records
      const followerIds = followers.map((follower) => follower.followerId);
      return followerIds;
    } catch (error) {
      throw error;
    }
  }

  async getFollowing(followerId) {
    try {
      // Find records in Follow that have the corresponding followerId
      const followings = await Follow.find({ followerId: followerId });

      // Extract followingId from found records
      const followingIds = followings.map((following) => following.followingId);
      return followingIds;
    } catch (error) {
      throw error;
    }
  }

  async deleteFollow(followerId, followingId) {
    try {
      const result = await Follow.deleteOne({
        followerId: followerId,
        followingId: followingId,
      });

      if (result.deletedCount === 0) {
        throw new Error("Không tìm thấy bản ghi để xóa");
      }
      // console.log(`User ${followerId} is unfollow ${followingId}`);
      return { success: true, message: "Bản ghi đã được xóa thành công" };
    } catch (error) {
      throw error;
    }
  }
}

export default new FollowService();
