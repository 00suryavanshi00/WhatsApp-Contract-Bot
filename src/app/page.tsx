"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { FaFileContract, FaChartLine, FaEnvelope } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { FaRegMessage } from "react-icons/fa6";
import {
  ExtendedMotionDiv,
  ExtendedMotionh1,
} from "@/components/tags/custommotiontags";
import Loader from "@/components/loader";
import ErrorComponent from "@/components/error";
import { MessageInterface } from "@/models/Message";
import { Contract } from "@/interfaces/Contract";


interface DashboardData {
  messages: MessageInterface[];
  contracts: Contract[];
}

export default function Dashboard() {
  const router = useRouter();


  const [dashboardData, setDashboardData] = useState<DashboardData | null>(
    null
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);


  useEffect(() => {
    async function fetchDashboardData() {
      try {
        const response = await fetch("/api/dashboard"); // Assuming this is your API endpoint
        const data = await response.json();
        setDashboardData(data);
        setLoading(false);
      } catch (error) {
        setError(`Failed to load dashboard data ${error}`);
        setLoading(false);
      }
    }

    fetchDashboardData();
  }, []);

  const [selectedMessage, setSelectedMessage] =
    useState<MessageInterface | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (message: MessageInterface) => {
    setSelectedMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMessage(null);
    setIsModalOpen(false);
  };

  if (loading) {
    return <Loader Icon={FaChartLine} loadingtext={"Loading Dashboard"} />;
  }

  if (error) {
    return <ErrorComponent error={error} Icon={FaChartLine} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-6xl mx-auto">
        <ExtendedMotionh1
          className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          Dashboard Overview
        </ExtendedMotionh1>

        <div className="grid md:grid-cols-2 gap-8">
          <ExtendedMotionDiv
            className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-blue-500"
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaEnvelope className="mr-3 text-blue-500" /> Recent Messages
              </h2>
              <button
                onClick={() => router.push("/messages")}
                className="text-blue-500 hover:text-blue-700 transition">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData?.messages.slice(0, 5).map((msg, index) => (
                <ExtendedMotionDiv
                  key={index}
                  className={`p-4 rounded-xl transition-all duration-300 
                    ${
                      msg.type === "incoming"
                        ? "bg-blue-50 hover:bg-blue-100"
                        : "bg-green-50 hover:bg-green-100"
                    }`}
                  whileHover={{ scale: 1.02 }}
                  onClick={() => openModal(msg)}>
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {msg.type === "incoming" ? (
                        <MdSend className="text-blue-500" />
                      ) : (
                        <FaRegMessage className="text-green-500" />
                      )}
                    </div>
                    <div>
                      <p className="font-semibold text-gray-800">
                        {msg.phoneNumber}
                      </p>
                      <p className="text-sm text-gray-600">{msg.content}</p>
                      <small className="text-xs text-gray-500">
                        {new Date(msg.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </ExtendedMotionDiv>
              ))}
            </div>
          </ExtendedMotionDiv>

          <ExtendedMotionDiv
            className="bg-white rounded-2xl shadow-xl p-6 border-t-4 border-purple-500"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                <FaFileContract className="mr-3 text-purple-500" /> Recent
                Contracts
              </h2>
              <button
                onClick={() => router.push("/contracts")}
                className="text-purple-500 hover:text-purple-700 transition">
                View All
              </button>
            </div>
            <div className="space-y-4">
              {dashboardData?.contracts.slice(0, 5).map((contract, index) => (
                <ExtendedMotionDiv
                  key={index}
                  className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ scale: 1.02 }}>
                  <div className="flex items-center space-x-4">
                    <FaFileContract className="text-2xl text-purple-500" />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-800">
                        {contract.clientName} (${contract.amount.toFixed(2)})
                      </p>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm">Status:</span>
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold uppercase tracking-wider ${
                            contract.status === "completed"
                              ? "bg-green-100 text-green-800"
                              : contract.status === "in_progress"
                              ? "bg-yellow-100 text-yellow-800"
                              : "bg-red-100 text-red-800"
                          }`}>
                          {contract.status}
                        </span>
                      </div>
                      <small className="text-xs text-gray-500">
                        {new Date(contract.createdAt).toLocaleString()}
                      </small>
                    </div>
                  </div>
                </ExtendedMotionDiv>
              ))}
            </div>
          </ExtendedMotionDiv>
        </div>
      </div>


      {isModalOpen && selectedMessage && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-lg w-full shadow-lg relative animate-fadeIn">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-black hover:text-gray-200 transition">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
            <h2 className="text-3xl font-bold mb-4 text-gray-800">
              Message Details
            </h2>
            <p className="font-semibold text-indigo-700">
              {selectedMessage.phoneNumber}
            </p>
            <p className="text-gray-700 mt-2">{selectedMessage.content}</p>
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">
                Extracted Data:
              </h3>
              <ul className="list-disc ml-6 mt-2">
                {selectedMessage.extractedData.keywords.map(
                  (keyword, index) => (
                    <li key={index} className="text-sm text-gray-600">
                      {keyword}
                    </li>
                  )
                )}
              </ul>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
