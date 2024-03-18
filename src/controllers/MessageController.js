import messageService from "../services/MessageServices.js";

class MessageController {

  //[POST] /api/v1/message/newMessage
  async newMessage(req, res, next) {
    try {
      const newMessage = await messageService.newMessage(req.body);
      res.status(200).json(newMessage);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
      next();
    }
  }

  //[GET] /api/v1/getMessage/:conversationId
  async getMessage(req, res, next) {
    try {
      const { conversationId } = req.params;
      const result = await messageService.getMessage(conversationId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
      next();
    }
  }

  //[GET] /api/v1/getMessageUnseen/:userId
  async getMessageUnseen(req, res, next) {
    try {
      const { userId } = req.params;
      const result = await messageService.getUnseenMessages(userId);
      res.status(200).json(result);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
      next();
    }
  }

  //[GET] /api/v1/markMessagesAsSeen/:conversationId/:userId
  async markMessagesAsSeen(req, res, next) {
    try {
      const { conversationId, userId } = req.params;
      await messageService.markMessagesAsSeen(conversationId, userId);
      res.status(200);
    } catch (err) {
      res.status(500).json({ message: "Internal Server Error" });
      next();
    }
  }
}

export default new MessageController();
