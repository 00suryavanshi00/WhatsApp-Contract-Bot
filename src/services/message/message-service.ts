import Message, { MessageInterface } from "@/models/Message";

class MessageService {
    async getMessageLog(limit: number = 50): Promise<MessageInterface[]> {
      return await Message.find()
        .sort({ createdAt: -1 })
        .limit(limit);
    }
  }
  
  export default MessageService;