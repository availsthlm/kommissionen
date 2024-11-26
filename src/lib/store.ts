import { create } from "zustand";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

type ChatStore = {
  messages: Message[];
  addMessage: (message: Omit<Message, "id">) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: Math.random().toString() },
      ],
    })),
}));
