import React, { useState, useEffect, useRef, memo } from "react";
import { SendIcon, UserIcon } from "../icon";
import HideScrollbarStyle from "@/components/shared/HideScrollbar";
import adminApi from "../api";
import { useAuthStore } from "@/store/authStore";
import { Message } from "@/types/user";
import { customerApi } from "@/pages/customer/api";

const ChatListItem = memo(
  ({
    conversation,
    onSelect,
  }: {
    conversation: any;
    onSelect: (conversation: any) => void;
  }) => (
    <div
      className={`flex items-center h-18 p-3 cursor-pointer hover:bg-gray-200`}
      onClick={() => onSelect(conversation)}
    >
      <UserIcon className="w-12 h-12 mr-4" />
      <div className="flex-grow">
        <div className="flex justify-between">
          <h3 className="font-semibold">{conversation.name}</h3>
          <span className="text-xs text-gray-500">{conversation.time}</span>
        </div>
        <p className="text-sm text-gray-600 truncate">
          {conversation.lastMessage}
        </p>
      </div>
    </div>
  )
);

export const AdminChattingPage = () => {
  const [conversations, setConversations] = useState<any[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<any | null>(
    null
  );
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState<string>("");

  const { user } = useAuthStore();
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchConversations = async () => {
      try {
        const res = await adminApi.getListConversations();
        const mappedConversations = res.data.map((conv: any) => {
          const customerId = conv.id.split("-")[1];
          return {
            id: conv.id,
            name: `Customer ${customerId}`,
            lastMessage: "No message yet",
            time: new Date().toLocaleTimeString(),
          };
        });
        setConversations(mappedConversations);
      } catch (err: any) {
        console.error("Failed to fetch conversations:", err);
      }
    };

    fetchConversations();
  }, [user]);

  useEffect(() => {
    if (!selectedConversation) return;

    const fetchMessages = async () => {
      try {
        const customerId = selectedConversation.id.split("-")[1];
        const res = await adminApi.getConversation(customerId);
        const sortedMessages = [...res.messages.data].sort(
          (a: any, b: any) => a.createdAt - b.createdAt
        );
        setMessages(sortedMessages);
      } catch (err: any) {
        console.error("Failed to fetch messages:", err);
      }
    };

    fetchMessages();
  }, [selectedConversation]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    const messageToSend = newMessage.trim();
    if (messageToSend === "" || !selectedConversation || !user) return;

    const tempMessage: Message = {
      id: `temp-${Date.now()}`,
      text: messageToSend,
      senderId: user._id,
      createdAt: Date.now(),
    };
    setMessages((prevMessages) => [...prevMessages, tempMessage]);
    setNewMessage("");

    try {
      await customerApi.sendMessage(selectedConversation.id, messageToSend);
    } catch (error) {
      console.error("Send message failed:", error);
      setMessages((prevMessages) =>
        prevMessages.filter((msg) => msg.id !== tempMessage.id)
      );
    }
  };

  return (
    <>
      <HideScrollbarStyle />
      <div className="flex h-full bg-white font-sans">
        <div className="w-1/3 border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h2 className="text-xl font-bold">Conversations</h2>
          </div>
          <div className="flex-grow overflow-y-auto no-scrollbar">
            {conversations.map((conv: any) => (
              <ChatListItem
                key={conv.id}
                conversation={conv}
                onSelect={setSelectedConversation}
              />
            ))}
          </div>
        </div>

        <div className="w-2/3 flex flex-col">
          {selectedConversation ? (
            <>
              <header className="h-20 flex items-center p-4 border-b border-gray-200 shadow-sm">
                <UserIcon className="w-12 h-12 mr-4" />
                <div>
                  <h3 className="text-lg font-semibold">
                    {selectedConversation.name}
                  </h3>
                </div>
              </header>

              <main className="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 no-scrollbar">
                {messages.map((msg) => {
                  const isMine = msg.senderId === user?._id;
                  return (
                    <div
                      key={msg.id}
                      className={`flex items-start gap-3 ${
                        isMine ? "justify-end" : ""
                      }`}
                    >
                      {!isMine && <UserIcon className="w-8 h-8" />}
                      <div
                        className={`${
                          isMine
                            ? "bg-blue-500 text-white"
                            : "bg-gray-200 text-black"
                        } p-3 rounded-lg max-w-xs`}
                      >
                        <p>{msg.text}</p>
                      </div>
                      {isMine && user?.name && (
                        <img
                          className="w-8 h-8 rounded-full"
                          src={`https://ui-avatars.com/api/?name=${encodeURIComponent(
                            user.name
                          )}&background=random`}
                          alt="Avatar"
                        />
                      )}
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </main>

              <footer className="p-4 border-t border-gray-200 bg-white">
                <div className="flex items-center">
                  <input
                    type="text"
                    placeholder="Enter a message..."
                    className="flex-1 border border-gray-300 rounded-full py-2 px-4 focus:outline-none focus:ring-2 focus:ring-blue-400"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => {
                      if (e.key === "Enter") {
                        handleSendMessage();
                      }
                    }}
                  />
                  <button
                    onClick={handleSendMessage}
                    className="ml-4 p-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-400"
                  >
                    <SendIcon />
                  </button>
                </div>
              </footer>
            </>
          ) : (
            <div className="flex items-center justify-center h-full text-gray-500">
              <p>No conversation here</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
};
