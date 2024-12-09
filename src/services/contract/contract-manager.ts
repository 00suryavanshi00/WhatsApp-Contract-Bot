import { ContractInterface } from "@/models/Contract";
import ContractService from "./contract-service";
import {
  ContractGenerationStrategy,
  StandardContractGenerationStrategy,
} from "./strategy/contract-generation-strategy";

export class ContractGenerationStrategyManager {
  private strategies: ContractGenerationStrategy[];
  private contractService: ContractService;

  constructor(contractService?: ContractService) {
    this.strategies = [
      new StandardContractGenerationStrategy(), // can add more strategies later here
    ];
    this.contractService = contractService || new ContractService();
  }

  // this will be much more usefull when more than one strategies are there
  findAptStrategy(message: string): ContractGenerationStrategy | null {
    return this.strategies.find((strat) => strat.canHandle(message)) || null;
  }

  async createContract(
    phoneNumber: string,
    message: string
  ): Promise<{
    success: boolean;
    contract?: ContractInterface;
    error?: string;
  }> {
    const strategy = this.findAptStrategy(message);

    if (!strategy) {
      return {
        success: false,
        error: "No apt contract generation strategy found",
      };
    }

    const { clientName, contractAmount } =
      strategy.extractContractDetails(message);

    if (!clientName || !contractAmount) {
      return {
        success: false,
        error: "Incomplete contract information",
      };
    }


    try{
        const contract = await this.contractService.createContract(
            phoneNumber, clientName, contractAmount
        );

        return {success: true, contract: contract}
    }
    catch(error){
        return {success: false, error: error instanceof Error ? error.message : "Something went wrong buddy!"}
    }
  }
}
