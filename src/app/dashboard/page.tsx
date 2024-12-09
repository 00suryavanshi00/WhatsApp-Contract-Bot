"use client"
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import React, { useState, useEffect } from 'react';

interface Message {
  phoneNumber: string;
  content: string;
  type: 'incoming' | 'outgoing';
  createdAt: Date;
}

interface Contract {
  clientName: string;
  amount: number;
  status: string;
  phoneNumber: string;
}

export default function Dashboard() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch('/api/dashboard');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setMessages(data.messages);
        setContracts(data.contracts);
      } catch (error) {
        console.error('Dashboard data fetch failed', error);
        setError('Failed to load dashboard data.');
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  if (loading) return <div className="flex justify-center items-center h-screen"><div className="loader">Loading...</div></div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;

  return (
    <div className="container mx-auto p-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Message Log</CardTitle>
          </CardHeader>
          <CardContent>
            {messages.length === 0 ? (
              <p>No messages available.</p>
            ) : (
              messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`p-2 rounded-lg mb-2 transition duration-200 ${
                    msg.type === 'incoming' 
                      ? 'bg-blue-100 hover:bg-blue-200' 
                      : 'bg-green-100 hover:bg-green-200'
                  }`}
                >
                  <p><strong>{msg.phoneNumber}</strong>: {msg.content}</p>
                  <small>{new Date(msg.createdAt).toLocaleString()}</small>
                </div>
              ))
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Contract Status</CardTitle>
          </CardHeader>
          <CardContent>
            {contracts.length === 0 ? (
              <p>No contracts available.</p>
            ) : (
              contracts.map((contract, index) => (
                <div 
                  key={index} 
                  className="p-2 border-b last:border-b-0 hover:bg-gray-100"
                >
                  <p><strong>Client:</strong> {contract.clientName}</p>
                  <p><strong>Amount:</strong> ${contract.amount.toFixed(2)}</p>
                  <p><strong>Status:</strong> {contract.status}</p>
                  <p><strong>Phone:</strong> {contract.phoneNumber}</p>
                </div>
              ))
            )}
          </CardContent>
        </Card>

      </div>
    </div>
  );
}