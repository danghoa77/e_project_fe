export interface Message {
  id: number;
  sender: "user" | "admin";
  text: string;
}

export interface ChatUser {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  messages: Message[];
}
