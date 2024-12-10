import { ActionType } from "@/enums";
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
    actionType?: ActionType;
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
    const lowercaseMessage = message.toLowerCase();
    return [
      lowercaseMessage.includes("generate contract") && "contract_generation_res",
      lowercaseMessage.includes("status update") && "status_check",
      (lowercaseMessage.includes("client") || lowercaseMessage.includes("amount")) && "contract_generation"
    ].filter(Boolean) as string[];
  }


  async processMessage(phoneNumber: string, message: string): Promise<{
    reply: string;
    actionType?: ActionType;
    extractedKeywords?: string[];
    contract?: ContractInterface
  }> {
    try {
      const extractedKeywords = this.extractKeywords(message);

      const handlers = {
        'contract_generation': () => this.handleContractGeneration(phoneNumber, message, extractedKeywords),
        'contract_generation_res': () => this.handleContractGenerationInitiation(),
        'status_check': () => this.handleStatusCheck(phoneNumber, extractedKeywords)
      };

      const handler = Object.entries(handlers).find(([key]) => 
        extractedKeywords.includes(key)
      )?.[1];

      return handler 
        ? await handler() 
        : {
            reply: "I couldn't understand your contract-related request.",
            actionType: ActionType.Unknown,
            extractedKeywords,
          };
    } catch (error) {
      console.error('Message processing error:', error);
      return {
        reply: "An unexpected error occurred. Please try again.",
        actionType: ActionType.Unknown,
        extractedKeywords: []
      };
    }
  }


  private async handleContractGeneration(phoneNumber: string, message: string, extractedKeywords: string[]) {
    const contractCreation = await this.contractGenerationManager.createContract(phoneNumber, message);

    return contractCreation.success
      ? {
          reply: `Contract created successfully for ${contractCreation.contract?.clientName}. Status: ${contractCreation.contract?.status}`,
          actionType: ActionType.ContractGeneration,
          extractedKeywords,
          contract: contractCreation.contract
        }
      : {
          reply: contractCreation.error || "Unable to create contract. Please provide complete details like this 'Generate contract. Client name: John Doe. Contract amount: 5000'",
          actionType: ActionType.ContractGenerationError,
          extractedKeywords
        };
  }


  private handleContractGenerationInitiation() {
    return {
      reply: "Contract creation initiated. Please provide details.",
      actionType: ActionType.ContractGenerationResponse,
    };
  }


  private async handleStatusCheck(phoneNumber: string, extractedKeywords: string[]) {
    try {
      const contracts = await this.contractService.getContractsByPhoneNumber(phoneNumber);
      
      if (contracts.length === 0) {
        return {
          reply: "No contracts found for this phone number.",
          actionType: ActionType.StatusCheckNoContracts,
          extractedKeywords
        };
      }

      if (contracts.length === 1) {
        const contract = contracts[0];
        return {
          reply: `Contract Status: ${contract.status}. Client: ${contract.clientName}. Amount: ${contract.amount}. Created On: ${contract.createdAt}`,
          actionType: ActionType.StatusCheckSingle,
          extractedKeywords,
          contract
        };
      }

      const contractSummary = contracts.map(
        (contract, index) => 
          `• Contract ${index + 1}:\n  Status: ${contract.status}\n  Client: ${contract.clientName}`
      ).join('\n');

      return {
        reply: `Multiple contracts found:\n${contractSummary}\n`,
        actionType: ActionType.StatusCheckMultiple,
        extractedKeywords
      };
    } catch (error) {
      return {
        reply: "Error retrieving contract status. Please try again later.",
        actionType: ActionType.StatusCheckError,
        extractedKeywords
      };
    }
  }
}

// Generic message strategy is for simple questions like queries
export class GenericMessageStrategy implements MessageProcessingStrategy {

  extractKeywords(message: string): string[] {
    const lowercaseMessage = message.toLowerCase();
    const commonKeywords = ["help", "info", "support", "query"];
    return commonKeywords.filter(keyword => lowercaseMessage.includes(keyword));
  }


  async processMessage(phoneNumber: string, message: string) {
    const extractedKeywords = this.extractKeywords(message);

    return {
      reply: "Thank you for your message. How can I assist you today?",
      actionType: ActionType.Unknown,
      extractedKeywords,
    };
  }
}