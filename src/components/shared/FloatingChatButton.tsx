// src/components/shared/FloatingChatButton.tsx
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChatBox } from "./ChatBox";
import { customerApi } from "@/pages/customer/api";
import { Message } from "@/types/user";
import { Loader2 } from "lucide-react";

export const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [conversationId, setConversationId] = useState<string>("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const toggleChat = () => setIsChatOpen(!isChatOpen);

  useEffect(() => {
    if (isChatOpen) {
      const createConversation = async () => {
        setIsLoading(true);
        try {
          const res = await customerApi.createConversation();

          const initialMessages: Message[] =
            res.messages?.data.map((msg: any) => ({
              id: msg.id,
              text: msg.text,
              senderId: msg.senderId,
              createdAt: msg.createdAt,
            })) || [];

          setMessages(initialMessages);
          setConversationId(res.conversationId);
        } catch (error) {
          console.error("Failed to load messages:", error);
        } finally {
          setIsLoading(false);
        }
      };
      createConversation();
    }
  }, [isChatOpen]);

  return isChatOpen ? (
    <div className="fixed bottom-8 right-8 z-50 w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-lg">
        <h3 className="font-bold text-lg">Chat Box</h3>
        <button onClick={toggleChat} className="hover:text-gray-300">
          &times;
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center overflow-hidden">
        {isLoading ? (
          <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
        ) : (
          <ChatBox
            onClose={toggleChat}
            conversationId={conversationId}
            listMessage={messages}
          />
        )}
      </div>
    </div>
  ) : (
    <Button
      onClick={toggleChat}
      size="icon"
      aria-label="Open chat"
      className="fixed bottom-8 right-8 z-50 h-16 w-16 rounded-full bg-[#383131] text-white shadow-lg transition-transform duration-200 hover:scale-110 hover:bg-[#8b6b6b]"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="white"
        style={{ width: "28px", height: "28px" }}
      >
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />
      </svg>
    </Button>
  );
};
