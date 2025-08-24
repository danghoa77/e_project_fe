// src/pages/admin/AdminChattingPage.tsx
import { useEffect, useRef } from "react";
import { useAuthStore } from "@/store/authStore";
import Talk from "talkjs";

export const AdminChattingPage = () => {
  const { user } = useAuthStore();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const sessionRef = useRef<Talk.Session | null>(null);

  useEffect(() => {
    if (!user) return;

    Talk.ready.then(() => {
      const me = new Talk.User({
        id: user._id,
        name: user.email,
        email: user.email,
        role: "admin",
      });

      const session = new Talk.Session({
        appId: "tmEsNmUd",
        me,
      });

      sessionRef.current = session;
      const inbox = session.createInbox();
      inbox.mount(chatContainerRef.current!);

      return () => session.destroy();
    });
  }, [user]);

  return (
    <>
      <div className="h-full" ref={chatContainerRef} />
    </>
  );
};
