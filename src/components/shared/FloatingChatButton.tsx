// src/components/shared/FloatingChatButton.tsx
import { useState, useEffect, useRef, useCallback } from "react";
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
  const [mode, setMode] = useState<string>("");

  const getAdmin1st = async () => {
    const res = await customerApi.getAdmin1st();
    setAdmin(res);
  };

  const toggleChat = async () => {
    if (!isChatOpen && !admin) {
      await getAdmin1st();
    }
    setIsChatOpen((prev) => !prev);
  };

  // gọi API khi có tin nhắn (chỉ khi bot mode)
  const handelAskofUser = useCallback(
    async (conversationId: string, message: string) => {
      try {
        if (mode === "bot") {
          await customerApi.handleMessage(conversationId, message);
        }
      } catch (error) {
        console.error("Error fetching mode:", error);
      }
    },
    [mode]
  );

  // handler giữ tham chiếu ổn định
  const messageHandlerRef = useRef<any>(null);

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
            me,
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

        if (!messageHandlerRef.current) {
          messageHandlerRef.current = (event: any) => {
            if (event.sender?.id === user._id && mode === "bot") {
              handelAskofUser(conversationId, event.body);
            }
          };
          session.on("message", messageHandlerRef.current);
        }

        const chatbox = session.createChatbox(conversation, {
          showChatHeader: true,
        });
        chatbox.mount(chatContainerRef.current!);
      });
    }

    return () => {
      if (sessionRef.current && messageHandlerRef.current) {
        sessionRef.current.off("message", messageHandlerRef.current);
        messageHandlerRef.current = null;
        sessionRef.current.destroy();
        sessionRef.current = null;
      }
    };
  }, [isChatOpen, user, admin, handelAskofUser]);

  const handleModeChat = async (mode: string) => {
    try {
      await customerApi.setMode(mode);
      console.log("Mode updated:", mode);
    } catch (err) {
      console.error("Error updating mode:", err);
    }
  };

  const toggleMode = () => {
    const newMode = mode === "bot" ? "admin" : "bot";
    setMode(newMode);
    handleModeChat(newMode);
  };

  const checkModeCurrent = async () => {
    try {
      const res = await customerApi.getMode();
      setMode(res.mode);
    } catch (error) {
      console.error("Error fetching mode:", error);
    }
  };

  useEffect(() => {
    checkModeCurrent();
  }, [isChatOpen, user]);

  return isChatOpen ? (
    <div className="fixed bottom-8 right-8 z-50 w-80 h-[28rem] bg-white rounded-lg shadow-2xl flex flex-col">
      <div className="flex items-center justify-between p-3 bg-gray-800 text-white rounded-t-lg">
        <h3 className="font-bold text-lg">Chat Box</h3>
        <button
          onClick={toggleMode}
          className="px-2 py-1 text-xs font-medium bg-gray-700 rounded hover:bg-gray-600 transition"
        >
          {mode === "bot" ? "Try chat with Admin" : "Chat with Bot"}
        </button>
        <button
          onClick={toggleChat}
          className="ml-2 text-gray-300 hover:text-white transition"
        >
          ✕
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
