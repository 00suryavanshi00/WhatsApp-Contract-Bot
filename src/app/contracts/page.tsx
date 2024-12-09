"use client";
import { motion } from "framer-motion";
import {
  FaFileContract,
  FaCalendarDay,
  FaCalendarAlt,

} from "react-icons/fa";
import { MdAssignment, MdDateRange } from "react-icons/md";
import {
  ExtendedMotionDiv,
  ExtendedMotionh1,
  ExtendedMotionSection,
} from "@/components/tags/custommotiontags";
import { useFetchDashboard } from "@/hooks/useFetchDashboard";
import { Contract } from "@/interfaces/Contract";
import Loader from "@/components/loader";
import ErrorComponent from "@/components/error";

export default function EnhancedContractsPage() {
  const { contracts, loading, error } = useFetchDashboard();

  if (loading) {
    return <Loader Icon={FaFileContract} loadingtext={"Loading Contracts"}/>
  }

  if (error) {
    return <ErrorComponent error={error} Icon={FaFileContract}/>
  }

  const isToday = (date: Date) => {
    const today = new Date();
    const contractDate = new Date(date);
    return (
      contractDate.getDate() === today.getDate() &&
      contractDate.getMonth() === today.getMonth() &&
      contractDate.getFullYear() === today.getFullYear()
    );
  };

  const todaysContracts = contracts.filter((contract) =>
    isToday(new Date(contract.createdAt))
  );
  const previousContracts = contracts.filter(
    (contract) => !isToday(new Date(contract.createdAt))
  );

  const renderContractCard = (contract: Contract, index: number) => {
    const getStatusColor = () => {
      switch (contract.status.toLowerCase()) {
        case "completed":
          return "bg-green-100 text-green-800";
        case "in_progress":
          return "bg-yellow-100 text-yellow-800";
        case "pending":
          return "bg-blue-100 text-blue-800";
        default:
          return "bg-gray-100 text-gray-800";
      }
    };

    return (
      <ExtendedMotionDiv
        key={index}
        className="p-5 rounded-2xl shadow-lg bg-white hover:shadow-xl transition-all duration-300"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}>
        <div className="flex items-center space-x-4">
          <div className="text-2xl">
            {isToday(new Date(contract.createdAt)) ? (
              <MdAssignment className="text-blue-500" />
            ) : (
              <MdDateRange className="text-purple-500" />
            )}
          </div>
          <div className="flex-grow">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-bold text-lg text-gray-800">
                {contract.clientName}
              </h3>
              <span
                className={`px-2 py-1 rounded-full text-xs font-semibold uppercase ${getStatusColor()}`}>
                {contract.status}
              </span>
            </div>
            <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-700">
              <div>
                <span className="font-medium">Amount:</span>
                <span className="ml-2 text-green-600">
                  ${contract.amount.toLocaleString()}
                </span>
              </div>
              <div>
                <span className="font-medium">Phone:</span>
                <span className="ml-2">{contract.phoneNumber}</span>
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500 flex justify-between items-center">
              <span>{new Date(contract.createdAt).toLocaleDateString()}</span>
              <span>
                {new Date(contract.createdAt).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>
          </div>
        </div>
      </ExtendedMotionDiv>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <ExtendedMotionh1
          className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          My Contracts
        </ExtendedMotionh1>

        {todaysContracts.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}>
            <div className="flex items-center mb-6">
              <FaCalendarDay className="mr-3 text-blue-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">Today</h2>
            </div>
            <div className="space-y-4">
              {todaysContracts.map(renderContractCard)}
            </div>
          </motion.section>
        )}

        {previousContracts.length > 0 && (
          <ExtendedMotionSection
            className="mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}>
            <div className="flex items-center mb-6">
              <FaCalendarAlt className="mr-3 text-purple-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">Earlier</h2>
            </div>
            <div className="space-y-4">
              {previousContracts.map(renderContractCard)}
            </div>
          </ExtendedMotionSection>
        )}

        {contracts.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <FaFileContract className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No contracts yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
