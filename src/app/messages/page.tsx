"use client";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  FaEnvelope,
  FaCalendarDay,
  FaCalendarAlt,
} from "react-icons/fa";
import { MdSend } from "react-icons/md";
import {
  ExtendedMotionDiv,
  ExtendedMotionh1,
  ExtendedMotionSection,
} from "@/components/tags/custommotiontags";
import { FaRegMessage } from "react-icons/fa6";
import { Message } from "@/interfaces/Message";
import { useFetchDashboard } from "@/hooks/useFetchDashboard";
import Loader from "@/components/loader";
import ErrorComponent from "@/components/error";

export default function MessagePage() {
  const { messages, loading, error } = useFetchDashboard();

  if (loading) {
    return <Loader Icon={FaEnvelope} loadingtext={"Loading Messages"}/>
  }

  if (error) {
    return <ErrorComponent error={error} Icon={FaEnvelope}/>
  }


  const isToday = (date: Date) => {
    const today = new Date();
    const messageDate = new Date(date);
    return (
      messageDate.getDate() === today.getDate() &&
      messageDate.getMonth() === today.getMonth() &&
      messageDate.getFullYear() === today.getFullYear()
    );
  };


  const todaysMessages = messages.filter((msg) =>
    isToday(new Date(msg.createdAt))
  );
  const previousMessages = messages.filter(
    (msg) => !isToday(new Date(msg.createdAt))
  );


  const renderMessageCard = (msg: Message, index: number) => (
    <ExtendedMotionDiv
      key={index}
      className={`p-5 rounded-2xl shadow-lg transition-all duration-300 
        ${
          msg.type === "incoming"
            ? "bg-blue-50 hover:bg-blue-100 border-l-4 border-blue-500"
            : "bg-green-50 hover:bg-green-100 border-l-4 border-green-500"
        }`}
      whileHover={{ scale: 1.02 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}>
      <div className="flex items-center space-x-4">
        <div className="text-2xl">
          {msg.type === "incoming" ? (
            <MdSend className="text-blue-500" />
          ) : (
            <FaRegMessage className="text-green-500" />
          )}
        </div>
        <div className="flex-grow">
          <div className="flex justify-between items-center mb-1">
            <p className="font-semibold text-gray-800">{msg.phoneNumber}</p>
            <small className="text-xs text-gray-500">
              {new Date(msg.createdAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </small>
          </div>
          <p className="text-sm text-gray-700 mb-1">{msg.content}</p>
          <small className="text-xs text-gray-500">
            {new Date(msg.createdAt).toLocaleDateString()}
          </small>
        </div>
      </div>
    </ExtendedMotionDiv>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <ExtendedMotionh1
          className="text-4xl font-extrabold text-center mb-12 text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}>
          My Messages
        </ExtendedMotionh1>


        {todaysMessages.length > 0 && (
          <motion.section
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}>
            <div className="flex items-center mb-6">
              <FaCalendarDay className="mr-3 text-blue-500 text-2xl" />
              <h2 className="text-2xl font-bold text-gray-800">Today</h2>
            </div>
            <div className="space-y-4">
              {todaysMessages.map(renderMessageCard)}
            </div>
          </motion.section>
        )}


        {previousMessages.length > 0 && (
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
              {previousMessages.map(renderMessageCard)}
            </div>
          </ExtendedMotionSection>
        )}


        {messages.length === 0 && (
          <div className="text-center py-12 bg-white rounded-2xl shadow-lg">
            <FaEnvelope className="mx-auto text-6xl text-gray-300 mb-4" />
            <p className="text-xl text-gray-600">No messages yet</p>
          </div>
        )}
      </div>
    </div>
  );
}
