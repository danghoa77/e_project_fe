// src/components/shared/ChatBox.tsx
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { customerApi } from "@/pages/customer/api";
import { Message } from "@/types/user";
import { SendHorizontal } from "lucide-react";
import React, { useState, useRef, useEffect } from "react";
import { useAuthStore } from "@/store/authStore";

interface ChatBoxProps {
  onClose: () => void;
  conversationId: string;
  listMessage: Message[];
}

export const ChatBox = ({
  onClose,
  conversationId,
  listMessage,
}: ChatBoxProps) => {
  const [messages, setMessages] = useState<Message[]>(
    [...listMessage].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
  );
  const [newMessage, setNewMessage] = useState("");
  const { user } = useAuthStore();

  // ref tới phần tử cuối của danh sách tin nhắn
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  // luôn scroll xuống cuối khi messages thay đổi
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim()) return;

    const temp: Message = {
      id: `temp-${Date.now()}`,
      text: newMessage,
      senderId: user?._id || "",
      createdAt: Date.now(),
    };
    setMessages((prev) =>
      [...prev, temp].sort((a, b) => (a.createdAt || 0) - (b.createdAt || 0))
    );
    setNewMessage("");

    try {
      await customerApi.sendMessage(conversationId, newMessage);
    } catch (error) {
      console.error("Send message failed:", error);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 z-50 w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col transition-all duration-300">
      {/* Header */}
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-lg">
        <h3 className="font-bold text-lg">Chat Box</h3>
        <button onClick={onClose} className="hover:text-gray-300">
          &times;
        </button>
      </div>

      {/* Messages */}
      <div className="flex-grow p-4 overflow-y-auto no-scrollbar">
        {messages.map((msg) => {
          const isCurrentUser = msg.senderId === user?._id;

          return (
            <div
              key={msg.id}
              className={`mb-4 flex ${
                isCurrentUser ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`p-3 rounded-lg max-w-[70%] ${
                  isCurrentUser ? "bg-blue-500 text-white" : "bg-gray-200"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
              </div>
            </div>
          );
        })}
        {/* div ẩn ở cuối để scroll tới */}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-4 border-t mb-0 flex gap-2">
        <Input
          type="text"
          placeholder="Enter your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-grow"
        />
        <Button onClick={handleSendMessage}>
          <SendHorizontal className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
};
