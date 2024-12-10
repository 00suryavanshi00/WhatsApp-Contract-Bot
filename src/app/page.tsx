"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { FaFileContract, FaChartLine, FaEnvelope } from "react-icons/fa";
import { MdSend } from "react-icons/md";
import { FaRegMessage } from "react-icons/fa6";
import {
  ExtendedMotionDiv,
  ExtendedMotionh1,
} from "@/components/tags/custommotiontags";
import { useFetchDashboard } from "@/hooks/useFetchDashboard";
import Loader from "@/components/loader";
import ErrorComponent from "@/components/error";

export default function Dashboard() {
  const { messages, contracts, loading, error } = useFetchDashboard();
  const router = useRouter();

  const [selectedMessage, setSelectedMessage] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = (message) => {
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
              {messages.slice(0, 5).map((msg, index) => (
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
              {contracts.slice(0, 5).map((contract, index) => (
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

{/* model for showing extracted keywords */}
{isModalOpen && selectedMessage && (
  <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
    <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 max-w-lg w-full shadow-lg relative animate-fadeIn">
      <button
        onClick={closeModal}
        className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 transition">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth="2"
          stroke="currentColor"
          className="w-6 h-6">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>

      <h2 className="text-2xl font-extrabold text-gray-800 mb-6 text-center">
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
          Extracted Keywords
        </span>
      </h2>

      <div className="bg-white rounded-xl shadow-inner p-4">
        <ul className="list-disc pl-6 space-y-2">
          {selectedMessage.extractedData.keywords.map((keyword, index) => (
            <li key={index} className="text-gray-700 font-medium">
              {keyword}
            </li>
          ))}
        </ul>
      </div>

      <button
        onClick={closeModal}
        className="mt-6 w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 rounded-xl font-semibold shadow-md hover:shadow-lg hover:opacity-90 transition">
        Close
      </button>
    </div>
  </div>
)}

    </div>
  );
}
