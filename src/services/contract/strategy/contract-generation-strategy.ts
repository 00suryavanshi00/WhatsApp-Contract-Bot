export interface ContractGenerationStrategy {
  canHandle(message: string): boolean;
  extractContractDetails(message: string): {
    clientName: string | null;
    contractAmount: number | null;
  };
}


export class StandardContractGenerationStrategy implements ContractGenerationStrategy {
    canHandle(message: string): boolean {
      return (
        message.toLowerCase().includes("generate contract") &&
        this.extractContractDetails(message).clientName !== null &&
        this.extractContractDetails(message).contractAmount !== null
      );
    }
  
    extractContractDetails(message: string): {
      clientName: string | null;
      contractAmount: number | null;
    } {
      const clientNameRegex = /client\s*name\s*:?\s*([a-zA-Z\s]+)/i;
      const contractAmountRegex = /contract\s*amount\s*:?\s*[\$]?(\d+(?:,\d{3})*(?:\.\d{2})?)/i;
  
      const clientNameMatch = message.match(clientNameRegex);
      const contractAmountMatch = message.match(contractAmountRegex);
  
      return {
        clientName: clientNameMatch ? clientNameMatch[1].trim() : null,
        contractAmount: contractAmountMatch 
          ? parseFloat(contractAmountMatch[1].replace(/,/g, '')) 
          : null
      };
    }
  }

