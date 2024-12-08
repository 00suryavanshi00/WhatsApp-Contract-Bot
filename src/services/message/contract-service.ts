import Database from '@/lib/db';
import Contract, { ContractInterface } from '@/models/Contract';

import mongoose from 'mongoose';


class ContractService {
  private db: mongoose.Connection;

  constructor() {
    this.db = Database.getInstance().getConnection()!;
  }

  async createContract(
    phoneNumber: string, 
    clientName: string, 
    amount: number
  ): Promise<ContractInterface> {
    const contract = new Contract({
      phoneNumber,
      clientName,
      amount,
      status: 'draft'
    });

    return await contract.save();
  }

    static async getLatestContract(phoneNumber: string): Promise<ContractInterface | null> {
    return await Contract.findOne({ phoneNumber })
      .sort({ createdAt: -1 });
  }

  async updateContractStatus(
    contractId: string, 
    status: 'draft' | 'in_progress' | 'completed' | 'cancelled'
  ): Promise<ContractInterface | null> {
    return await Contract.findByIdAndUpdate(
      contractId, 
      { status }, 
      { new: true }
    );
  }
}

export default ContractService;