import Message from "@/models/Message";
import {
  ContractResponseStrategy,
  GenericMessageStrategy,
} from "@/services/message/strategy/message-processing-strategy";
import Database from "./db";
import mongoose from "mongoose";
import ContractService from "@/services/contract/contract-service";

class WhatsAppHandler {
  private db: mongoose.Connection | null;
  private contractService: ContractService

  constructor(contractService: ContractService) {
    const connection = Database.getInstance().getConnection();
    if (!connection) {
      throw new Error("Database connection is not initialized.");
    }

    this.db = connection
    this.contractService = contractService;
  }
  async processIncomingMessage(phoneNumber: string, message: string) {

    const processingStrategy =
      message.toLowerCase().includes("contract") ||
      message.toLowerCase().includes("status")
        ? new ContractResponseStrategy(this.contractService)
        : new GenericMessageStrategy();


    const processedMessage = await processingStrategy.processMessage(phoneNumber, message);

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


    // create contact 


    await Promise.all([incomingMessage.save(), outgoingMessage.save()]);


    return {
      processedMessage,
      incomingMessage,
      outgoingMessage,
    };
  }
}

export default WhatsAppHandler;
