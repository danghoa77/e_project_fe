// src/components/shared/FloatingChatButton.tsx
import { useState, useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import Talk from "talkjs";
import { useAuthStore } from "@/store/authStore";
import { customerApi } from "@/pages/customer/api";

export const FloatingChatButton = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const sessionRef = useRef<Talk.Session | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const { user } = useAuthStore();

  const getAdmin1st = async () => {
    const res = await customerApi.getAdmin1st();
    setAdmin(res);
  };
  const toggleChat = async () => {
    if (!isChatOpen && !admin) {
      await getAdmin1st();
    }
    setIsChatOpen(!isChatOpen);
  };

  useEffect(() => {
    if (isChatOpen && user && admin) {
      Talk.ready.then(() => {
        const me = new Talk.User({
          id: user._id,
          name: user.email,
          email: user.email,
          role: "customer",
          locale: "en-US",
        });

        if (!sessionRef.current) {
          sessionRef.current = new Talk.Session({
            appId: "tmEsNmUd",
            me: me,
          });
        }

        const session = sessionRef.current;

        const other = new Talk.User({
          id: admin._id,
          name: admin.email,
          email: admin.email,
          role: "admin",
        });

        const conversationId = Talk.oneOnOneId(me, other);
        const conversation = session.getOrCreateConversation(conversationId);
        conversation.setParticipant(me);
        conversation.setParticipant(other);
        const chatbox = session.createChatbox(conversation, {
          showChatHeader: true,
        });
        chatbox.mount(chatContainerRef.current!);
      });
    }

    return () => {
      if (sessionRef.current) {
        sessionRef.current.destroy();
        sessionRef.current = null;
      }
    };
  }, [isChatOpen, user]);

  return isChatOpen ? (
    <div className="fixed bottom-8 right-8 z-50 w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col">
      <div className="flex justify-between items-center p-4 bg-gray-800 text-white rounded-t-lg">
        <h3 className="font-bold text-lg">Chat Box</h3>
        <button onClick={toggleChat} className="hover:text-gray-300">
          &times;
        </button>
      </div>
      <div ref={chatContainerRef} className="flex-1 overflow-hidden" />
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
