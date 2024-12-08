import Database from '@/lib/db';
import ContractService from '@/services/message/contract-service';
import MessageService from '@/services/message/message-service';
import type { NextApiRequest, NextApiResponse } from 'next';


export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {
  // Ensure database connection
  await Database.getInstance().connect();

  const messageService = new MessageService();


  try {
    const messages = await messageService.getMessageLog();
    const contracts = await Promise.all(
      messages
        .filter(msg => msg.extractedData?.contractId)
        .map(msg => 
          ContractService.getLatestContract(msg.phoneNumber)
        )
    );

    return res.status(200).json({ 
      messages, 
      contracts: contracts.filter(Boolean) 
    });
  } catch (error) {
    console.error('Dashboard data fetch error:', error);
    return res.status(500).json({ error: 'Internal server error' });
  }
}