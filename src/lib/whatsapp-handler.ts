import Message from "@/models/Message";
import {
  ContractResponseStrategy,
  GenericMessageStrategy,
} from "@/services/message/strategy/message-processing-strategy";
import Database from "./db";
import mongoose from "mongoose";

class WhatsAppHandler {
  private db: mongoose.Connection | null;

  constructor() {
    const connection = Database.getInstance().getConnection();
    if (!connection) {
      throw new Error("Database connection is not initialized.");
    }

    this.db = connection
  }
  async processIncomingMessage(phoneNumber: string, message: string) {

    const processingStrategy =
      message.toLowerCase().includes("contract") ||
      message.toLowerCase().includes("status")
        ? new ContractResponseStrategy()
        : new GenericMessageStrategy();


    const processedMessage = await processingStrategy.processMessage(message);

    // saving incoming and outgoing messages
    const incomingMessage = new Message({
      phoneNumber,
      content: message,
      type: "incoming",
      extractedData: {
        // keywords: processingStrategy.extractKeywords(message),
        keywords: processedMessage.extractedKeywords,
        actionType: processedMessage.actionType,
      },
    });

    const outgoingMessage = new Message({
      phoneNumber,
      content: processedMessage.reply,
      type: "outgoing",
    });


    await Promise.all([incomingMessage.save(), outgoingMessage.save()]);


    return {
      processedMessage,
      incomingMessage,
      outgoingMessage,
    };
  }
}

export default WhatsAppHandler;
