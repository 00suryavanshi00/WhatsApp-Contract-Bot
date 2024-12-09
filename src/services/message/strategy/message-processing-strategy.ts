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
  private contractService: ContractService;

  constructor(contractService: ContractService) {
    this.contractService = contractService;
    this.contractGenerationManager = new ContractGenerationStrategyManager(contractService);
  }

  extractKeywords(message: string): string[] {
    const keywords: string[] = [];

    // Existing keyword extraction
    if (message.toLowerCase().includes("generate contract")) {
      keywords.push("contract_generation");
    }

    if (message.toLowerCase().includes("status update")) {
      keywords.push("status_check");
    }

    return keywords;
  }

  async processMessage(phoneNumber: string, message: string): Promise<{
    reply: string;
    actionType?: string;
    extractedKeywords?: string[];
    contract?: ContractInterface
  }> {
    const extractedKeywords = this.extractKeywords(message);

    // Contract Generation Logic
    if (extractedKeywords.includes("contract_generation")) {
      const contractCreation = await this.contractGenerationManager.createContract(phoneNumber, message);

      if (contractCreation.success) {
        return {
          reply: `Contract created successfully for ${contractCreation.contract?.clientName}. Status: ${contractCreation.contract?.status}`,
          actionType: "contract_generation",
          extractedKeywords,
          contract: contractCreation.contract
        };
      } else {
        return {
          reply: contractCreation.error || "Unable to create contract. Please provide complete details like this 'Generate contract. Client name: John Doe. Contract amount: 5000'",
          actionType: "contract_generation_error",
          extractedKeywords
        };
      }
    }

    if (extractedKeywords.includes("status_check")) {
      try {

        const contracts = await this.contractService.getContractsByPhoneNumber(phoneNumber);
        console.log(contracts)
        
        if (contracts.length === 0) {
          return {
            reply: "No contracts found for this phone number.",
            actionType: "status_check_no_contracts",
            extractedKeywords
          };
        }

        if (contracts.length === 1) {
          const contract = contracts[0];
          return {
            reply: `Contract Status: ${contract.status}. Client: ${contract.clientName}. Amount: ${contract.amount}. Created On: ${contract.createdAt}`,
            actionType: "status_check_single",
            extractedKeywords,
            contract
          };
        }

        // for multiple
        const contractSummary = contracts.map(
          (contract, index) => 
            `• Contract ${index + 1}:\n  Status: ${contract.status}\n  Client: ${contract.clientName}`
        ).join('\n');
        return {
          reply: `Multiple contracts found:\n${contractSummary}\n`,
          actionType: "status_check_multiple",
          extractedKeywords
        };

      } catch (error) {
        return {
          reply: "Error retrieving contract status. Please try again later.",
          actionType: "status_check_error",
          extractedKeywords
        };
      }
    }

    // Default response for unrecognized messages
    return {
      reply: "I couldn't understand your contract-related request.",
      actionType: "unknown",
      extractedKeywords,
    };
  }
}

// Generic Message Strategy remains the same
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

  async processMessage(phoneNumber: string, message: string) {
    const extractedKeywords = this.extractKeywords(message);

    return {
      reply: "Thank you for your message. How can I assist you today?",
      actionType: "generic_response",
      extractedKeywords,
    };
  }
}