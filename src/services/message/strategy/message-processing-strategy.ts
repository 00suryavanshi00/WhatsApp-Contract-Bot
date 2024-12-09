import { ContractInterface } from "@/models/Contract";
import { ContractGenerationStrategyManager } from "@/services/contract/contract-manager";
import ContractService from "@/services/contract/contract-service";

export interface MessageProcessingStrategy {
  extractKeywords(message: string): string[];

  processMessage(
    phoneNumber: string,
    message: string
  ): Promise<{
    reply: string;
    actionType?: string;
    extractedKeywords?: string[];
    contract?: ContractInterface
  }>;
}

export class ContractResponseStrategy implements MessageProcessingStrategy {
  private contractGenerationManager: ContractGenerationStrategyManager;

  constructor(contractService: ContractService){
    this.contractGenerationManager = new ContractGenerationStrategyManager(contractService)
  }

  extractKeywords(message: string): string[] {
    const keywords: string[] = [];

    // these can be further divided into their own strategies
    if (message.toLowerCase().includes("generate contract")) {
      keywords.push("contract_generation");
    }

    if (message.toLowerCase().includes("status update")) {
      keywords.push("status_check");
    }

    // // Look for potential client name and contract amount
    // const clientNameMatch = message.match(/client\s+name:\s*(\w+)/i);
    // const contractAmountMatch = message.match(/contract\s+amount:\s*(\d+)/i);

    // if (clientNameMatch) {
    //   keywords.push("client_name");
    // }

    // if (contractAmountMatch) {
    //   keywords.push("contract_amount");
    // }

    return keywords;
  }

  async processMessage(phoneNumber:string ,message: string): Promise<{
    reply: string;
    actionType?: string;
    extractedKeywords?: string[];
    contract?: ContractInterface
  }> {
    const extractedKeywords = this.extractKeywords(message);

    if (extractedKeywords.includes("contract_generation")) {


      const contractCreation = await this.contractGenerationManager.createContract(phoneNumber, message);

      if ( contractCreation.success){
        return {
          reply: `Contract created successfully for ${contractCreation.contract?.clientName}. Status: ${contractCreation.contract?.status}`,
          actionType: "contract_generation",
          extractedKeywords,
          contract: contractCreation.contract
        };
      }

      else{
        return{
          reply: contractCreation.error || "Unable to create contract. Please provide complete details like this 'Generate contract. Client name: John Doe. Contract amount: 5000'",
          actionType: "contract_generation_error",
          extractedKeywords
        }
      }
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
