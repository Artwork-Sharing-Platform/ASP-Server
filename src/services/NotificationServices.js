import { User } from "../models/User.js";
import { Art } from "../models/Art.js";
import { Follow } from "../models/Follow.js";
import { Comment } from "../models/Comment.js";
import { Notification } from "../models/Notification.js";

class NotificationService {
  async sendPostArtworkNotificationToFollowers(newArt) {
    try {
      const user = await User.findById(newArt.userId);

      if (!user) {
        console.error("User not found");
        return;
      }
      const followers = await Follow.find({ followingId: newArt.userId });
      followers.forEach(async (follower) => {
        const followerUser = await User.findById(follower.followerId);
        const notificationData = {
          receiverId: followerUser._id,
          senderId: user._id,
          senderAvatar: user.avatar,
          type: "new_art_posted",
          content: `<span style="font-weight: 600">${user.userName}</span> added new Artwork: <span style="font-weight: 600">${newArt.title}</span>`,
          hyperLink: `/pin/${newArt._id}`,
        };

        // Save notification to Notification table
        await this.saveNotification(notificationData);
      });
    } catch (error) {
      throw error;
    }
  }

  async sendFollowNotificationToFollowers(followerId, followingId) {
    try {
      // Fetch the user information based on userId
      const user = await User.findById(followingId);

      if (!user) {
        console.error("User not found");
        return;
      }
      const follower = await Follow.findOne({
        followerId: followerId,
        followingId: followingId,
      });
      const followerUser = await User.findById(follower.followerId);
      const notificationData = {
        receiverId: user._id,
        senderId: followerUser._id,
        senderAvatar: followerUser.avatar,
        type: "new_follow",
        content: `<span style="font-weight: 600">${followerUser.userName}</span> started following you`,
        hyperLink: `/creator/${followerUser._id}`,
      };
      // // Save notification to Notification table
      await this.saveNotification(notificationData);
    } catch (error) {
      throw error;
    }
  }

  async sendCommentNotificationToFollowers(commentData) {
    try {
      const art = await Art.findById(commentData.artId);
      const creator = await User.findById(art.userId);
      if (!creator) {
        console.error("Creator not found");
        return;
      }
      const sender = await User.findById(commentData.author.userId);
      if (creator._id.toString() !== sender._id.toString()) {
        const notificationData = {
          receiverId: creator._id,
          senderId: sender._id,
          senderAvatar: sender.avatar,
          type: "new_comment",
          content: `<span style="font-weight: 600">${sender.userName}</span> commented on your post: <span style="font-weight: 600">${art.title}</span>`,
          hyperLink: `/pin/${art._id}`,
        };
        // Save notification to Notification table
        await this.saveNotification(notificationData);
      }
    } catch (error) {
      throw error;
    }
  }

  async sendReplyCommentNotificationToFollowers(replyCommentData) {
    try {
      const comments = await Comment.findOne({
        "comments._id": replyCommentData.commentId,
      });
      const comment = comments.comments[0];
      const art = await Art.findById(comments.artId);
      const receiver = await User.findById(comment.author.userId);
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const sender = await User.findById(replyCommentData.author.userId);
      if (receiver._id.toString() !== sender._id.toString()) {
        const notificationData = {
          receiverId: receiver._id,
          senderId: sender._id,
          senderAvatar: sender.avatar,
          type: "new_reply_comment",
          content: `<span style="font-weight: 600">${sender.userName}</span> has responded to your post: <span style="font-weight: 600">${art.title}</span>`,
          hyperLink: `/pin/${art._id}`,
        };
        // // Save notification to Notification table
        await this.saveNotification(notificationData);
      }
    } catch (error) {
      throw error;
    }
  }

  async sendReactionNotificationToFollowers(artId, userId, reaction) {
    try {
      const art = await Art.findById(artId);
      const receiver = await User.findById(art.userId);
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const sender = await User.findById(userId);
      if (receiver._id.toString() !== sender._id.toString()) {
        const notificationData = {
          receiverId: receiver._id,
          senderId: sender._id,
          senderAvatar: sender.avatar,
          type: `new_react_${reaction}`,
          content: `<span style="font-weight: 600">${sender.userName}</span> expressed his feelings about your post: <span style="font-weight: 600">${art.title}</span>`,
          hyperLink: `/pin/${art._id}`,
        };

        // Save notification to Notification table
        await this.saveNotification(notificationData);
      }
    } catch (error) {
      throw error;
    }
  }

  async sendPaymentPackageNotification(userId, type, amount) {
    try {
      const receiver = await User.findById(userId);
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const notificationData = {
        receiverId: receiver._id,
        senderId: null,
        senderAvatar:
          "https://firebasestorage.googleapis.com/v0/b/singular-ally-415014.appspot.com/o/logo.png?alt=media&token=106100e5-1115-4286-9070-b211d735f197",
        type: `new_payment_package`,
        content: `<span style="font-weight: 600">Thanks a bunch!</span> Your purchase of <span style="font-weight: 600">${type} for ${
          amount / 1000
        } VND</span> is confirmed. We're gearing up to ship it your way. Appreciate you choosing Pesterin!`,
        hyperLink: "",
      };

      // Save notification to Notification table
      await this.saveNotification(notificationData);
    } catch (error) {
      throw error;
    }
  }

  async sendFreePackageNotification(userId) {
    try {
      const receiver = await User.findById(userId);
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const notificationData = {
        receiverId: receiver._id,
        senderId: null,
        senderAvatar:
          "https://firebasestorage.googleapis.com/v0/b/singular-ally-415014.appspot.com/o/logo.png?alt=media&token=106100e5-1115-4286-9070-b211d735f197",
        type: `new_free_package`,
        content: `<span style="font-weight: 600">Thanks a bunch!</span> Your purchase of <span style="font-weight: 600">Free Trial</span> is confirmed. We're gearing up to ship it your way. Appreciate you choosing Pesterin!`,
        hyperLink: "",
      };

      // Save notification to Notification table
      await this.saveNotification(notificationData);
    } catch (error) {
      throw error;
    }
  }

  async sendReportAdminNotification(reportData) {
    try {
      const receiver = await User.findOne({ type: "Admin" });
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const art = await Art.findOne({ _id: reportData.artID });
      const sender = await User.findOne({ _id: reportData.userID });
      const notificationData = {
        receiverId: receiver._id,
        senderId: sender._id,
        senderAvatar: sender.avatar,
        type: `new_report_artwork`,
        content: `<span style="font-weight: 600">${sender.userName}</span> has just submitted a report regarding the <span style="font-weight: 600">${art.title}</span> artwork with content report <span style="font-weight: 600">${reportData.reportTitle}</span>`,
        hyperLink: "/admin/report",
      };
      // Save notification to Notification table
      await this.saveNotification(notificationData);
    } catch (error) {
      throw error;
    }
  }

  async sendWarningNotification(report, typeWarning) {
    try {
      const receiver = await User.findOne({ _id: report.creator_id });
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const art = await Art.findOne({ _id: report.art_id });
      const sender = await User.findOne({ type: "Admin" });
      const notificationData = {
        receiverId: receiver._id,
        senderId: sender._id,
        senderAvatar: sender.avatar,
        type: "new_warning_artwork",
        content:
          typeWarning === "warning"
            ? `Dear <span style="font-weight: 600">${
                receiver.userName
                  ? receiver.userName
                  : receiver.firstName + " " + receiver.lastName
              } </span>, we regret to inform you that your artwork has been reported. Please review the content to ensure compliance with our community guidelines.`
            : `Dear <span style="font-weight: 600">${
                receiver.userName
                  ? receiver.userName
                  : receiver.firstName + " " + receiver.lastName
              } </span>, we regret to inform you that your artwork has been locked due to multiple reports. Please contact our administration team to address any concerns before it can be reinstated.`,
        hyperLink: typeWarning === "warning" ? `/pin/${art._id}` : "",
      };

      // Save notification to Notification table
      await this.saveNotification(notificationData);
    } catch (error) {
      throw error;
    }
  }

  async sendUnlockArtworkNotification(art) {
    try {
      const receiver = await User.findOne({ _id: art.creator_id });
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const artResponse = await Art.findOne({ _id: art.key });
      const sender = await User.findOne({ type: "Admin" });
      const notificationData = {
        receiverId: receiver._id,
        senderId: sender._id,
        senderAvatar: sender.avatar,
        type: `new_unlock_artwork`,
        content: `Dear <span style="font-weight: 600">${
          receiver.userName
            ? receiver.userName
            : receiver.firstName + " " + receiver.lastName
        } </span>, your art has been unlocked by the admin. Please ensure careful consideration of art content for future posts to maintain community guidelines. Thank you.`,
        hyperLink: `/art/${artResponse._id}`,
      };
      // Save notification to Notification table
      await this.saveNotification(notificationData);
    } catch (error) {
      throw error;
    }
  }

  async sendPaymentUpgradePackageNotification(userId, type, amount) {
    try {
      const receiver = await User.findById(userId);
      if (!receiver) {
        console.error("Receiver not found");
        return;
      }
      const notificationData = {
        receiverId: receiver._id,
        senderId: null,
        senderAvatar:
          "https://firebasestorage.googleapis.com/v0/b/singular-ally-415014.appspot.com/o/logo.png?alt=media&token=106100e5-1115-4286-9070-b211d735f197",
        type: `new_payment_package`,
        content: `<span style="font-weight: 600">Upgrade successful!</span> Explore advanced features with our <span style="font-weight: 600">${type} package for ${
          amount / 1000
        } VND</span> . Thank you for choosing Pesterin!`,
        hyperLink: "",
      };

      // Save notification to Notification table
      await this.saveNotification(notificationData);
    } catch (error) {
      throw error;
    }
  }

  async saveNotification(notificationData) {
    try {
      const notification = new Notification(notificationData);
      await notification.save();
    } catch (error) {
      throw error;
    }
  }

  async getNotificationsByUserId(receiverId) {
    try {
      const notifications = await Notification.find({
        receiverId: receiverId,
      }).sort({ createdAt: -1 });
      return notifications;
    } catch (error) {
      throw error;
    }
  }

  async getUnreadNotifications(receiverId) {
    try {
      const notifications = Notification.find({
        receiverId: receiverId,
        status: false,
      });
      return notifications;
    } catch (error) {
      throw error;
    }
  }

  async updateAllNotificationsStatus(receiverId) {
    try {
      await Notification.updateMany(
        { receiverId: receiverId },
        { $set: { status: true } },
        { new: true }
      );

      const updatedNotifications = await Notification.find({
        receiverId: receiverId,
      }).sort({ createdAt: -1 });

      return updatedNotifications;
    } catch (error) {
      throw error;
    }
  }

  async updateNotificationStatusById(id, receiverId) {
    try {
      const updatedNotification = await Notification.findByIdAndUpdate(
        id,
        { $set: { status: true } },
        { new: true }
      );

      if (!updatedNotification) {
        throw new Error("Notification not found");
      }

      const updatedNotifications = await Notification.find({
        receiverId: receiverId,
      }).sort({ createdAt: -1 });

      return updatedNotifications;
    } catch (error) {
      throw error;
    }
  }
}

export default new NotificationService();
