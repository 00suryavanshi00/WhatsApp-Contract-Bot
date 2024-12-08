export interface MessageProcessingStrategy {
  extractKeywords(message: string): string[];

  processMessage(
    phoneNumber: string,
    message: string
  ): Promise<{
    reply: string;
    actionType?: string;
    extractedKeywords?: string[];
  }>;
}

export class ContractResponseStrategy implements MessageProcessingStrategy {
  extractKeywords(message: string): string[] {
    const keywords: string[] = [];

    // these can be further divided into their own strategies
    if (message.toLowerCase().includes("generate contract")) {
      keywords.push("contract_generation");
    }

    if (message.toLowerCase().includes("status update")) {
      keywords.push("status_check");
    }

    return keywords;

  }

  async processMessage(
    message: string
  ): Promise<{
    reply: string;
    actionType?: string;
    extractedKeywords?: string[];
  }> {
    const extractedKeywords = this.extractKeywords(message);

    if (extractedKeywords.includes("contract_generation")) {
      return {
        reply: "Contract creation initiated. Please provide details.",
        actionType: "contract_generation",
        extractedKeywords,
      };
    }

    if (extractedKeywords.includes("status_check")) {
      return {
        reply: "Please provide the specific contract you want to check.",
        actionType: "status_check",
        extractedKeywords,
      };
    }

    return {
      reply: "I couldn't understand your contract-related request.",
      actionType: "unknown",
      extractedKeywords,
    };
  }
}


// this is for the remaning generic messages something like help / info etc

export class GenericMessageStrategy implements MessageProcessingStrategy {
  extractKeywords(message: string): string[] {

    const keywords: string[] = [];

    const commonKeywords = ["help", "info", "support", "query"];
    commonKeywords.forEach((keyword) => {
      if (message.toLowerCase().includes(keyword)) {
        keywords.push(keyword);
      }
    });

    return keywords;
  }

  async processMessage(message: string) {
    const extractedKeywords = this.extractKeywords(message);

    return {
      reply: "Thank you for your message. How can I assist you today?",
      actionType: "generic_response",
      extractedKeywords,
    };
  }
}
