"use client";

import React, { useState } from "react";
import SellerTopNavigation from "@/components/navigation/SellerTopNavigation";
import Footer from "@/components/footer/Footer";
import {
  MagnifyingGlassIcon,
  PaperClipIcon,
  FaceSmileIcon,
  PaperAirplaneIcon,
  EllipsisVerticalIcon,
  PhoneIcon,
  InformationCircleIcon,
} from "@heroicons/react/24/outline";
import { StarIcon } from "@heroicons/react/24/solid";

type Message = {
  id: number;
  senderId: string;
  text: string;
  timestamp: Date;
  isMe: boolean;
};

type Conversation = {
  id: number;
  buyerName: string;
  buyerBusiness: string;
  buyerAvatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unread: boolean;
  unreadCount: number;
  isOnline: boolean;
  rating?: number;
  messages: Message[];
};

export default function SellerMessagesPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeConversation, setActiveConversation] = useState<number | null>(
    1
  );
  const [messageInput, setMessageInput] = useState("");
  const [showDetails, setShowDetails] = useState(false);

  // Mock conversations data
  const conversations: Conversation[] = [
    {
      id: 1,
      buyerName: "Sarah Johnson",
      buyerBusiness: "GreenLeaf Market",
      buyerAvatar:
        "https://ui-avatars.com/api/?name=Sarah+Johnson&background=407178&color=fff",
      lastMessage: "Great! I'll place the order for 50 lbs of tomatoes.",
      lastMessageTime: new Date(Date.now() - 5 * 60000),
      unread: true,
      unreadCount: 2,
      isOnline: true,
      rating: 4.8,
      messages: [
        {
          id: 1,
          senderId: "buyer",
          text: "Hi! I'm interested in ordering organic tomatoes. Do you have them in stock?",
          timestamp: new Date(Date.now() - 60 * 60000),
          isMe: false,
        },
        {
          id: 2,
          senderId: "me",
          text: "Hello Sarah! Yes, we have fresh organic Roma tomatoes available. How much are you looking to order?",
          timestamp: new Date(Date.now() - 55 * 60000),
          isMe: true,
        },
        {
          id: 3,
          senderId: "buyer",
          text: "I need about 50 lbs for this week. What's your price?",
          timestamp: new Date(Date.now() - 50 * 60000),
          isMe: false,
        },
        {
          id: 4,
          senderId: "me",
          text: "For 50 lbs, I can offer $4.50 per lb. They're freshly harvested this morning.",
          timestamp: new Date(Date.now() - 45 * 60000),
          isMe: true,
        },
        {
          id: 5,
          senderId: "buyer",
          text: "That sounds perfect! Can you deliver by Thursday?",
          timestamp: new Date(Date.now() - 10 * 60000),
          isMe: false,
        },
        {
          id: 6,
          senderId: "me",
          text: "Absolutely! Thursday morning works great. I'll have them packaged and ready.",
          timestamp: new Date(Date.now() - 7 * 60000),
          isMe: true,
        },
        {
          id: 7,
          senderId: "buyer",
          text: "Great! I'll place the order for 50 lbs of tomatoes.",
          timestamp: new Date(Date.now() - 5 * 60000),
          isMe: false,
        },
      ],
    },
    {
      id: 2,
      buyerName: "Michael Chen",
      buyerBusiness: "FreshCo Foods",
      buyerAvatar:
        "https://ui-avatars.com/api/?name=Michael+Chen&background=CB5927&color=fff",
      lastMessage: "Thank you! The last delivery was excellent.",
      lastMessageTime: new Date(Date.now() - 2 * 3600000),
      unread: false,
      unreadCount: 0,
      isOnline: false,
      rating: 5.0,
      messages: [
        {
          id: 1,
          senderId: "buyer",
          text: "Thank you! The last delivery was excellent.",
          timestamp: new Date(Date.now() - 2 * 3600000),
          isMe: false,
        },
      ],
    },
    {
      id: 3,
      buyerName: "Emma Rodriguez",
      buyerBusiness: "Urban Grocer",
      buyerAvatar:
        "https://ui-avatars.com/api/?name=Emma+Rodriguez&background=2D5F6C&color=fff",
      lastMessage: "Do you have any organic cucumbers available?",
      lastMessageTime: new Date(Date.now() - 24 * 3600000),
      unread: false,
      unreadCount: 0,
      isOnline: false,
      rating: 4.9,
      messages: [
        {
          id: 1,
          senderId: "buyer",
          text: "Do you have any organic cucumbers available?",
          timestamp: new Date(Date.now() - 24 * 3600000),
          isMe: false,
        },
      ],
    },
    {
      id: 4,
      buyerName: "David Thompson",
      buyerBusiness: "Healthy Harvest Co.",
      buyerAvatar:
        "https://ui-avatars.com/api/?name=David+Thompson&background=8B7355&color=fff",
      lastMessage: "I received the invoice, processing payment now.",
      lastMessageTime: new Date(Date.now() - 48 * 3600000),
      unread: false,
      unreadCount: 0,
      isOnline: true,
      rating: 4.7,
      messages: [
        {
          id: 1,
          senderId: "buyer",
          text: "I received the invoice, processing payment now.",
          timestamp: new Date(Date.now() - 48 * 3600000),
          isMe: false,
        },
      ],
    },
  ];

  const filteredConversations = conversations.filter(
    (conv) =>
      conv.buyerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      conv.buyerBusiness.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const activeConv = conversations.find((c) => c.id === activeConversation);

  const formatTime = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const hours = Math.floor(diff / 3600000);
    const days = Math.floor(diff / 86400000);

    if (minutes < 1) return "Just now";
    if (minutes < 60) return `${minutes}m ago`;
    if (hours < 24) return `${hours}h ago`;
    if (days < 7) return `${days}d ago`;
    return date.toLocaleDateString();
  };

  const formatMessageTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const handleSendMessage = () => {
    if (!messageInput.trim()) return;

    // Add message logic here
    console.log("Sending message:", messageInput);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="min-h-screen bg-[var(--primary-background)] flex flex-col">
      <SellerTopNavigation />

      <main className="flex-1 flex overflow-hidden">
        {/* Conversations Sidebar */}
        <div className="w-full lg:w-96 border-r border-gray-200 bg-white flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <h1 className="text-2xl font-semibold text-gray-900 mb-4">
              Messages
            </h1>

            {/* Search */}
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search conversations..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent"
              />
            </div>
          </div>

          {/* Conversations List */}
          <div className="flex-1 overflow-y-auto">
            {filteredConversations.length === 0 ? (
              <div className="p-6 text-center text-gray-500">
                No conversations found
              </div>
            ) : (
              <div>
                {filteredConversations.map((conversation) => (
                  <button
                    key={conversation.id}
                    onClick={() => setActiveConversation(conversation.id)}
                    className={`w-full p-4 flex items-start space-x-3 hover:bg-gray-50 transition-colors duration-200 border-b border-gray-100 ${
                      activeConversation === conversation.id ? "bg-gray-50" : ""
                    }`}
                  >
                    <div className="relative flex-shrink-0">
                      <img
                        src={conversation.buyerAvatar}
                        alt={conversation.buyerName}
                        className="w-12 h-12 rounded-full"
                      />
                      {conversation.isOnline && (
                        <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                      )}
                    </div>

                    <div className="flex-1 min-w-0 text-left">
                      <div className="flex items-center justify-between mb-1">
                        <h3
                          className={`text-sm font-semibold truncate ${
                            conversation.unread
                              ? "text-gray-900"
                              : "text-gray-700"
                          }`}
                        >
                          {conversation.buyerName}
                        </h3>
                        <span className="text-xs text-gray-500 ml-2 flex-shrink-0">
                          {formatTime(conversation.lastMessageTime)}
                        </span>
                      </div>

                      <p className="text-xs text-gray-600 mb-1 truncate">
                        {conversation.buyerBusiness}
                      </p>

                      <div className="flex items-center justify-between">
                        <p
                          className={`text-sm truncate ${
                            conversation.unread
                              ? "font-medium text-gray-900"
                              : "text-gray-600"
                          }`}
                        >
                          {conversation.lastMessage}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="ml-2 flex-shrink-0 bg-[var(--primary-accent2)] text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Message Thread */}
        <div className="flex-1 flex flex-col bg-white">
          {activeConv ? (
            <>
              {/* Thread Header */}
              <div className="p-4 border-b border-gray-200 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <img
                      src={activeConv.buyerAvatar}
                      alt={activeConv.buyerName}
                      className="w-10 h-10 rounded-full"
                    />
                    {activeConv.isOnline && (
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                    )}
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {activeConv.buyerName}
                    </h2>
                    <div className="flex items-center space-x-2">
                      <p className="text-sm text-gray-600">
                        {activeConv.buyerBusiness}
                      </p>
                      {activeConv.rating && (
                        <div className="flex items-center space-x-1">
                          <StarIcon className="h-4 w-4 text-yellow-400" />
                          <span className="text-sm text-gray-600">
                            {activeConv.rating}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <PhoneIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button
                    onClick={() => setShowDetails(!showDetails)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
                  >
                    <InformationCircleIcon className="h-5 w-5 text-gray-600" />
                  </button>
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200">
                    <EllipsisVerticalIcon className="h-5 w-5 text-gray-600" />
                  </button>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
                {activeConv.messages.map((message) => (
                  <div
                    key={message.id}
                    className={`flex ${
                      message.isMe ? "justify-end" : "justify-start"
                    }`}
                  >
                    <div
                      className={`flex items-end space-x-2 max-w-xl ${
                        message.isMe ? "flex-row-reverse space-x-reverse" : ""
                      }`}
                    >
                      {!message.isMe && (
                        <img
                          src={activeConv.buyerAvatar}
                          alt={activeConv.buyerName}
                          className="w-8 h-8 rounded-full flex-shrink-0"
                        />
                      )}
                      <div>
                        <div
                          className={`px-4 py-3 rounded-2xl ${
                            message.isMe
                              ? "bg-[var(--primary-accent2)] text-white rounded-br-sm"
                              : "bg-white border border-gray-200 text-gray-900 rounded-bl-sm"
                          }`}
                        >
                          <p className="text-sm leading-relaxed">
                            {message.text}
                          </p>
                        </div>
                        <p
                          className={`text-xs text-gray-500 mt-1 px-1 ${
                            message.isMe ? "text-right" : ""
                          }`}
                        >
                          {formatMessageTime(message.timestamp)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-end space-x-3">
                  <button className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 flex-shrink-0">
                    <PaperClipIcon className="h-5 w-5 text-gray-600" />
                  </button>

                  <div className="flex-1 relative">
                    <textarea
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      placeholder="Type a message..."
                      rows={1}
                      className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-2xl focus:outline-none focus:ring-2 focus:ring-[var(--primary-accent2)] focus:border-transparent resize-none"
                      style={{ minHeight: "48px", maxHeight: "120px" }}
                    />
                    <button className="absolute right-3 bottom-3 p-1 hover:bg-gray-100 rounded-full transition-colors duration-200">
                      <FaceSmileIcon className="h-5 w-5 text-gray-600" />
                    </button>
                  </div>

                  <button
                    onClick={handleSendMessage}
                    disabled={!messageInput.trim()}
                    className="p-3 bg-[var(--primary-accent2)] text-white rounded-full hover:bg-[var(--primary-accent3)] disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors duration-200 flex-shrink-0"
                  >
                    <PaperAirplaneIcon className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <ChatBubbleLeftIcon className="h-12 w-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  No conversation selected
                </h3>
                <p className="text-gray-600">
                  Choose a conversation from the sidebar to start messaging
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Details Sidebar (Optional) */}
        {showDetails && activeConv && (
          <div className="w-80 border-l border-gray-200 bg-white p-6 overflow-y-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-6">
              Details
            </h3>

            <div className="space-y-6">
              {/* Buyer Info */}
              <div className="text-center">
                <img
                  src={activeConv.buyerAvatar}
                  alt={activeConv.buyerName}
                  className="w-20 h-20 rounded-full mx-auto mb-3"
                />
                <h4 className="font-semibold text-gray-900">
                  {activeConv.buyerName}
                </h4>
                <p className="text-sm text-gray-600">
                  {activeConv.buyerBusiness}
                </p>
                {activeConv.rating && (
                  <div className="flex items-center justify-center space-x-1 mt-2">
                    <StarIcon className="h-5 w-5 text-yellow-400" />
                    <span className="font-semibold text-gray-900">
                      {activeConv.rating}
                    </span>
                    <span className="text-sm text-gray-600">(24 reviews)</span>
                  </div>
                )}
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                <button className="w-full px-4 py-2.5 bg-[var(--primary-accent2)] text-white rounded-lg font-medium hover:bg-[var(--primary-accent3)] transition-colors duration-200">
                  View Order History
                </button>
                <button className="w-full px-4 py-2.5 border border-gray-300 text-gray-700 rounded-lg font-medium hover:bg-gray-50 transition-colors duration-200">
                  Create Invoice
                </button>
              </div>

              {/* Info Sections */}
              <div className="border-t border-gray-200 pt-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">
                  Contact Information
                </h5>
                <div className="space-y-2 text-sm">
                  <p className="text-gray-600">Email: buyer@greenleaf.com</p>
                  <p className="text-gray-600">Phone: (555) 123-4567</p>
                </div>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <h5 className="text-sm font-semibold text-gray-900 mb-3">
                  Recent Orders
                </h5>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order #10234</span>
                    <span className="text-gray-900">$1,240</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order #10198</span>
                    <span className="text-gray-900">$980</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Order #10156</span>
                    <span className="text-gray-900">$1,450</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}

// Import for the icon used in empty state
import { ChatBubbleLeftIcon } from "@heroicons/react/24/outline";
