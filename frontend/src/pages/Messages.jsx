import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
} from "@heroicons/react/24/outline";

const Messages = () => {
  const [message, setMessage] = useState("");

  const handleSendMessage = (e) => {
    e.preventDefault();
    // Handle message sending logic here
    setMessage("");
  };

  return (
    <div className="bg-gray-100 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-20">
        <div className="bg-white rounded-lg shadow h-[calc(100vh-120px)] flex">
          {/* Conversations List */}
          <div className="w-1/3 border-r">
            <div className="p-4 border-b">
              <input
                type="text"
                placeholder="Search messages"
                className="w-full px-4 py-2 bg-gray-100 rounded-full text-sm focus:outline-none"
              />
            </div>
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              {conversations.map((conv, index) => (
                <div
                  key={index}
                  className="flex items-center p-4 hover:bg-gray-50 cursor-pointer border-b"
                >
                  <img
                    src={conv.avatar}
                    alt={conv.name}
                    className="w-12 h-12 rounded-full"
                  />
                  <div className="ml-4 flex-1">
                    <h3 className="font-semibold">{conv.name}</h3>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                  <span className="text-xs text-gray-400">{conv.time}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="p-4 border-b flex items-center">
              <img
                src="/default-avatar.png"
                alt="Chat recipient"
                className="w-10 h-10 rounded-full"
              />
              <div className="ml-4">
                <h2 className="font-semibold">John Doe</h2>
                <p className="text-sm text-gray-500">
                  Software Engineer at Tech Corp
                </p>
              </div>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sent ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    className={`max-w-[70%] rounded-lg p-3 ${
                      msg.sent
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    <p>{msg.content}</p>
                    <p
                      className={`text-xs mt-1 ${
                        msg.sent ? "text-blue-100" : "text-gray-500"
                      }`}
                    >
                      {msg.time}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-4"
              >
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <PaperClipIcon className="h-6 w-6" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Write a message..."
                  className="flex-1 border-0 focus:ring-0 focus:outline-none"
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600"
                >
                  <FaceSmileIcon className="h-6 w-6" />
                </button>
                <button
                  type="submit"
                  className="text-blue-600 hover:text-blue-700"
                >
                  <PaperAirplaneIcon className="h-6 w-6" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const conversations = [
  {
    name: "John Doe",
    avatar: "/default-avatar.png",
    lastMessage: "Thanks for the update!",
    time: "2m",
  },
  {
    name: "Sarah Wilson",
    avatar: "/default-avatar.png",
    lastMessage: "When can we schedule the meeting?",
    time: "1h",
  },
  {
    name: "Mike Johnson",
    avatar: "/default-avatar.png",
    lastMessage: "The project looks great!",
    time: "2h",
  },
  // Add more conversations as needed
];

const messages = [
  {
    content: "Hi, how are you?",
    time: "10:00 AM",
    sent: false,
  },
  {
    content: "I'm good, thanks! How about you?",
    time: "10:02 AM",
    sent: true,
  },
  {
    content: "Just wanted to follow up on the project status",
    time: "10:03 AM",
    sent: false,
  },
  {
    content: "Everything is on track. I'll send you the details shortly.",
    time: "10:05 AM",
    sent: true,
  },
  // Add more messages as needed
];

export default Messages;
