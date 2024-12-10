export interface ContractGenerationStrategy {
  canHandle(message: string): boolean;
  extractContractDetails(message: string): {
    clientName: string | null;
    contractAmount: number | null;
  };
}

// this is one is for when the entire msg is just sent in one shot "Generate Contract Client name: John Doe. Contract amount: 1000"
export class StandardContractGenerationStrategy implements ContractGenerationStrategy {
    canHandle(message: string): boolean {
      console.log('inside canhandle standard')
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
      console.log('inside extract standard')
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


  export class DirectContractGenerationStrategy implements ContractGenerationStrategy{
    canHandle(message: string): boolean {
      console.log('inside canhandle direct')
      return (
        this.extractContractDetails(message).clientName !== null &&
        this.extractContractDetails(message).contractAmount !== null
      )
    }

    extractContractDetails(message: string): {
      clientName: string | null;
      contractAmount: number | null;
    } {
      console.log('inside extract direct')
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




  

