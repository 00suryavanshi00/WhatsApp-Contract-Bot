export enum ActionType {
    ContractGeneration = 'contract_generation',
    ContractGenerationError = 'contract_generation_error',
    ContractGenerationResponse = 'contract_generation_res',
    StatusCheck = 'status_check',
    StatusCheckNoContracts = 'status_check_no_contracts',
    StatusCheckSingle = 'status_check_single',
    StatusCheckMultiple = 'status_check_multiple',
    StatusCheckError = 'status_check_error',
    Unknown = 'unknown'
  }