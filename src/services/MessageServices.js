import { Conversation } from "../models/Conversation.js";
import { Message } from "../models/Message.js";
import ConversationServices from "./ConversationServices.js";
class MessageService {
  async newMessage(newMessage) {
    try {
      const { conversationId, message, type, senderId } = newMessage;

      await Promise.all([
        Message.create(newMessage),
        Conversation.findByIdAndUpdate(
          conversationId,
          {
            lastMessage:
              type === "text" ? message : type === "link" ? "link" : "image",
          },
          { new: true }
        ),
      ]);

      await this.markMessagesAsSeen(conversationId, senderId);

      // Concurrently fetch conversations
      const conversations = await ConversationServices.getConversation(
        senderId
      );

      return { conversations };
    } catch (error) {
      console.error("Error new message", error);
      throw error;
    }
  }

  async getMessage(conversationId) {
    try {
      const messages = await Message.find({ conversationId: conversationId });
      return messages;
    } catch (error) {
      console.error("Error new message", error);
      throw error;
    }
  }

  async getUnseenMessages(userId) {
    try {
      const userConversations = await ConversationServices.getConversation(
        userId
      );
      const conversationsWithUnseenMessages = [];

      for (const conversation of userConversations) {
        const conversationId = conversation._id;
        const unseenMessages = await Message.find({
          conversationId,
          senderId: { $ne: userId },
          seen: false,
        });

        if (unseenMessages.length > 0) {
          conversationsWithUnseenMessages.push(unseenMessages);
        }
      }
      return conversationsWithUnseenMessages;
    } catch (error) {
      console.error("Error retrieving conversations and messages:", error);
      throw error;
    }
  }

  async markMessagesAsSeen(conversationId, userId) {
    try {
      await Message.updateMany(
        { conversationId, seen: false, senderId: { $ne: userId } },
        { $set: { seen: true } }
      );
    } catch (error) {
      console.error("Error updating messages:", error);
      throw error;
    }
  }
}

export default new MessageService();
