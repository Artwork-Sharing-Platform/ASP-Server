import conversationService from "../services/ConversationServices.js";

class ConversationController {
  async newConversation(req, res, next) {
    try {
      const { senderId, receiverId } = req.body;
      const newConversation = await conversationService.newConversation(
        senderId,
        receiverId
      );
      res.status(200).json(newConversation);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
      next();
    }
  }

  async getConversation(req, res, next) {
    try {
      const { userId } = req.params;
      const conversation = await conversationService.getConversation(userId);
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
      next();
    }
  }

  async getConversationById(req, res, next) {
    try {
      const { conversationId } = req.params;
      const conversation = await conversationService.getConversationById(
        conversationId
      );
      res.status(200).json(conversation);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
      next();
    }
  }
}

export default new ConversationController();
