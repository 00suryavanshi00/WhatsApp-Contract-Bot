"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { FaPhoneAlt, FaFileContract } from "react-icons/fa";
import { MdMailOutline, MdSend } from "react-icons/md";

interface Message {
  phoneNumber: string;
  content: string;
  type: "incoming" | "outgoing";
  createdAt: Date;
}

interface Contract {
  clientName: string;
  amount: number;
  status: string;
  phoneNumber: string;
  createdAt: Date;
}

export default function Dashboard() {
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

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen bg-gray-100">
        <motion.div
          className="text-xl font-bold text-blue-500"
          animate={{ scale: 2 }}
          transition={{ repeat: Infinity, duration: 1 }}
        >
          Loading...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 text-center mt-6 font-semibold">
        {error}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-gray-800 p-6">
      <h1 className="text-3xl font-bold text-center mb-8 text-blue-600">
        Dashboard Overview
      </h1>


      <section className="mb-8">
        <h2 className="text-2xl font-semibold mb-4">Recent Messages</h2>
        <div className="space-y-4">
          {messages.slice(0, 5).map((msg, index) => (
            <motion.div
              key={index}
              className={`flex items-center gap-4 p-4 rounded-xl shadow-md ${
                msg.type === "incoming"
                  ? "bg-blue-50 border-l-4 border-blue-400"
                  : "bg-green-50 border-l-4 border-green-400"
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl">
                {msg.type === "incoming" ? <MdSend /> : <MdMailOutline />}
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {msg.phoneNumber}
                </p>
                <p className="text-sm">{msg.content}</p>
                <small className="text-xs text-gray-500">
                  {new Date(msg.createdAt).toLocaleString()}
                </small>
              </div>
            </motion.div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
          View All Messages
        </button>
      </section>


      <section>
        <h2 className="text-2xl font-semibold mb-4">Recent Contracts</h2>
        <div className="space-y-4">
          {contracts.slice(0, 5).map((contract, index) => (
            <motion.div
              key={index}
              className="flex items-center gap-4 p-4 rounded-xl shadow-md bg-gray-50 border-l-4 border-gray-300"
              whileHover={{ scale: 1.02 }}
            >
              <div className="text-2xl text-blue-500">
                <FaFileContract />
              </div>
              <div>
                <p className="font-semibold text-gray-800">
                  {contract.clientName} (${contract.amount.toFixed(2)})
                </p>
                <p className="text-sm">
                  Status:{" "}
                  <span
                    className={`px-2 py-1 rounded text-white ${
                      contract.status === "completed"
                        ? "bg-green-500"
                        : contract.status === "in_progress"
                        ? "bg-yellow-500"
                        : "bg-red-500"
                    }`}
                  >
                    {contract.status}
                  </span>
                </p>
                <small className="text-xs text-gray-500">
                  {new Date(contract.createdAt).toLocaleString()}
                </small>
              </div>
            </motion.div>
          ))}
        </div>
        <button className="mt-4 px-4 py-2 rounded-xl bg-blue-500 text-white font-semibold hover:bg-blue-600">
          View All Contracts
        </button>
      </section>
    </div>
  );
}
