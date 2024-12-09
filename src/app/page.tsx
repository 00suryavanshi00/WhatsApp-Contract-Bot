"use client";
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

  if (loading) {
    return <Loader Icon={FaChartLine} loadingtext={"Loading Dashboard"}/>
  }

  if (error) {
    return <ErrorComponent error={error} Icon={FaChartLine}/>
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
                  whileHover={{ scale: 1.02 }}>
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
    </div>
  );
}
