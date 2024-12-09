import { useState, useEffect } from "react";
import { Message } from "@/interfaces/Message";
import { Contract } from "@/interfaces/Contract";

interface DashboardData {
  messages: Message[];
  contracts: Contract[];
  loading: boolean;
  error: string | null;
}

export function useFetchDashboard(): DashboardData {
  const [messages, setMessages] = useState<Message[]>([]);
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setMessages(data.messages);
        setContracts(data.contracts);
      } catch (error) {
        console.error("Dashboard data fetch failed", error);
        setError("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  return { messages, contracts, loading, error };
}