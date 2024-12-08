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
    // Choose strategy based on message content
    const processingStrategy =
      message.toLowerCase().includes("contract") ||
      message.toLowerCase().includes("status")
        ? new ContractResponseStrategy()
        : new GenericMessageStrategy();

    // Process the message
    const processedMessage = await processingStrategy.processMessage(message);

    // Explicitly save incoming and outgoing messages
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

    // Save messages
    await Promise.all([incomingMessage.save(), outgoingMessage.save()]);

    // Return the processing result and saved messages
    return {
      processedMessage,
      incomingMessage,
      outgoingMessage,
    };
  }
}

export default WhatsAppHandler;
