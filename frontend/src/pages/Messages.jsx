import React, { useState } from "react";
import Navbar from "../components/Navbar";
import {
  PaperAirplaneIcon,
  PaperClipIcon,
  FaceSmileIcon,
  MagnifyingGlassIcon,
  EllipsisHorizontalIcon,
  PhoneIcon,
  VideoCameraIcon,
  ArrowPathIcon,
} from "@heroicons/react/24/outline";

const Messages = () => {
  const [message, setMessage] = useState("");
  const [activeChat, setActiveChat] = useState(0);

  const handleSendMessage = (e) => {
    e.preventDefault();
    // Handle message sending logic here
    setMessage("");
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-6">
        <div className="bg-white rounded-xl shadow-lg overflow-hidden h-[calc(100vh-120px)] flex">
          {/* Conversations List */}
          <div className="w-80 border-r border-gray-200 bg-gray-50">
            <div className="p-4 border-b border-gray-200 bg-white">
              <div className="relative">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search conversations"
                  className="w-full pl-10 pr-4 py-2.5 bg-gray-100 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all duration-200"
                />
              </div>
            </div>
            <div className="overflow-y-auto h-[calc(100%-73px)]">
              <div className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Recent Conversations
              </div>
              {conversations.map((conv, index) => (
                <div
                  key={index}
                  className={`flex items-center p-4 cursor-pointer border-l-4 transition-all duration-200 ${
                    activeChat === index
                      ? "border-l-blue-600 bg-blue-50"
                      : "border-l-transparent hover:bg-gray-100"
                  }`}
                  onClick={() => setActiveChat(index)}
                >
                  <div className="relative">
                    <img
                      src={conv.avatar}
                      alt={conv.name}
                      className="w-12 h-12 rounded-full object-cover border border-gray-200"
                    />
                    {conv.online && (
                      <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 rounded-full border-2 border-white"></span>
                    )}
                  </div>
                  <div className="ml-3 flex-1 overflow-hidden">
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-medium text-gray-900 truncate">
                        {conv.name}
                      </h3>
                      <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-gray-100 text-gray-600">
                        {conv.time}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500 truncate">
                      {conv.lastMessage}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Window */}
          <div className="flex-1 flex flex-col">
            {/* Chat Header */}
            <div className="px-6 py-3 border-b border-gray-200 flex items-center justify-between bg-white shadow-sm">
              <div className="flex items-center">
                <img
                  src="/default-avatar.png"
                  alt="Chat recipient"
                  className="w-10 h-10 rounded-full object-cover border border-gray-200"
                />
                <div className="ml-3">
                  <h2 className="font-medium text-gray-900">John Doe</h2>
                  <p className="text-xs text-gray-500 flex items-center">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-1.5"></span>
                    Online • Software Engineer at Tech Corp
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <PhoneIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <VideoCameraIcon className="h-5 w-5 text-gray-500" />
                </button>
                <button className="p-2 rounded-full hover:bg-gray-100 transition-colors">
                  <EllipsisHorizontalIcon className="h-5 w-5 text-gray-500" />
                </button>
              </div>
            </div>

            {/* Chat Date */}
            <div className="flex justify-center py-4">
              <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
                Today
              </span>
            </div>

            {/* Messages Area */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6 bg-gray-50">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${
                    msg.sent ? "justify-end" : "justify-start"
                  }`}
                >
                  {!msg.sent && (
                    <img
                      src="/default-avatar.png"
                      alt="Sender"
                      className="h-8 w-8 rounded-full mr-2 self-end mb-1"
                    />
                  )}
                  <div
                    className={`max-w-[65%] rounded-2xl p-4 shadow-sm ${
                      msg.sent
                        ? "bg-blue-600 text-white"
                        : "bg-white text-gray-800"
                    }`}
                  >
                    <p className="text-sm">{msg.content}</p>
                    <div className="flex justify-between items-center mt-1">
                      <p
                        className={`text-xs ${
                          msg.sent ? "text-blue-200" : "text-gray-400"
                        }`}
                      >
                        {msg.time}
                      </p>
                      {msg.sent && (
                        <span className="text-blue-200 text-xs ml-2">
                          {msg.status === "read" ? "Read" : "Delivered"}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Message Input */}
            <div className="p-4 border-t border-gray-200 bg-white">
              <form
                onSubmit={handleSendMessage}
                className="flex items-center space-x-2 bg-gray-100 rounded-full px-4 py-2"
              >
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <PaperClipIcon className="h-5 w-5" />
                </button>
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border-0 focus:ring-0 text-sm text-gray-700 placeholder-gray-400"
                />
                <button
                  type="button"
                  className="text-gray-400 hover:text-gray-600 transition-colors"
                >
                  <FaceSmileIcon className="h-5 w-5" />
                </button>
                <button
                  type="submit"
                  disabled={!message.trim()}
                  className={`rounded-full p-2 ${
                    message.trim()
                      ? "bg-blue-600 text-white"
                      : "bg-gray-300 text-gray-500"
                  }`}
                >
                  <PaperAirplaneIcon className="h-5 w-5 transform rotate-90" />
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
    online: true,
  },
  {
    name: "Sarah Wilson",
    avatar: "/default-avatar.png",
    lastMessage: "When can we schedule the meeting?",
    time: "1h",
    online: true,
  },
  {
    name: "Mike Johnson",
    avatar: "/default-avatar.png",
    lastMessage: "The project looks great!",
    time: "2h",
    online: false,
  },
  {
    name: "Emily Davis",
    avatar: "/default-avatar.png",
    lastMessage: "Let me check and get back to you",
    time: "3h",
    online: false,
  },
  {
    name: "Alex Thompson",
    avatar: "/default-avatar.png",
    lastMessage: "Can you share the document?",
    time: "1d",
    online: false,
  },
  {
    name: "Jessica Miller",
    avatar: "/default-avatar.png",
    lastMessage: "Great job on the presentation!",
    time: "2d",
    online: false,
  },
];

const messages = [
  {
    content: "Hi, how are you?",
    time: "10:00 AM",
    sent: false,
    status: "read",
  },
  {
    content: "I'm good, thanks! How about you?",
    time: "10:02 AM",
    sent: true,
    status: "read",
  },
  {
    content: "Just wanted to follow up on the project status",
    time: "10:03 AM",
    sent: false,
    status: "read",
  },
  {
    content: "Everything is on track. I'll send you the details shortly.",
    time: "10:05 AM",
    sent: true,
    status: "read",
  },
  {
    content:
      "Great! By the way, did you get a chance to review the latest design mockups I sent yesterday?",
    time: "10:07 AM",
    sent: false,
    status: "read",
  },
  {
    content:
      "Yes, I did. They look fantastic! I especially like the new navigation system you proposed. It's much more intuitive than what we had before.",
    time: "10:10 AM",
    sent: true,
    status: "delivered",
  },
];

export default Messages;
