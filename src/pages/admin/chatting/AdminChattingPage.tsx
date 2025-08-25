// src/pages/admin/AdminChattingPage.tsx
import { useEffect, useRef, useState } from "react";
import { useAuthStore } from "@/store/authStore";
import Talk from "talkjs";
import { customerApi } from "@/pages/customer/api";

export const AdminChattingPage = () => {
  const { user } = useAuthStore();
  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const sessionRef = useRef<Talk.Session | null>(null);
  const [admin, setAdmin] = useState<any>(null);
  const getAdmin1st = async () => {
    const res = await customerApi.getAdmin1st();
    setAdmin(res);
  };
  useEffect(() => {
    getAdmin1st();
  }, []);
  useEffect(() => {
    if (!user && !admin) {
      {
        Talk.ready.then(() => {
          const me = new Talk.User({
            id: admin._id,
            name: admin.email,
            email: admin.email,
            role: "admin",
            locale: "en-US",
          });

          const session = new Talk.Session({
            appId: "tmEsNmUd",
            me,
          });

          sessionRef.current = session;
          const inbox = session.createInbox({});
          inbox.mount(chatContainerRef.current!);

          return () => session.destroy();
        });
      }
    }
  }, [admin]);

  return (
    <>
      <div className="h-full" ref={chatContainerRef} />
    </>
  );
};
