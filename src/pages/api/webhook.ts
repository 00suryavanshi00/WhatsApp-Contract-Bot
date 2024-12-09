import type { NextApiRequest, NextApiResponse } from 'next';
import WhatsAppHandler from '../../lib/whatsapp-handler';
import Database from '@/lib/db';
import ContractService from '@/services/contract/contract-service';


export default async function handler(
  req: NextApiRequest, 
  res: NextApiResponse
) {

    // initializing
  await Database.getInstance().connect();

  if (req.method === 'POST') {
    const { phoneNumber, message } = req.body;

    if (!phoneNumber || !message) {
      return res.status(400).json({ error: 'Missing phone number or message' });
    }

    try {

      const contractService = new ContractService();
      const whatsappHandler = new WhatsAppHandler(contractService);
      const response = await whatsappHandler.processIncomingMessage(
        phoneNumber, 
        message
      );

      return res.status(200).json({ 
        message: 'Message processed', 
        response 
      });
    } catch (error) {
      console.error('Webhook processing error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }

  res.setHeader('Allow', ['POST']);
  res.status(405).end(`Method ${req.method} Not Allowed`);
}