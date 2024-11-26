import { create } from "zustand";

type Message = {
  id: string;
  content: string;
  role: "user" | "assistant";
};

type ChatStore = {
  messages: Message[];
  isTyping: boolean;
  addMessage: (message: Omit<Message, "id">) => void;
  updateLastMessage: (content: string) => void;
  setTyping: (typing: boolean) => void;
};

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  addMessage: (message) =>
    set((state) => ({
      messages: [
        ...state.messages,
        { ...message, id: Math.random().toString() },
      ],
    })),
  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, index) =>
        index === state.messages.length - 1 ? { ...msg, content } : msg
      ),
    })),
  setTyping: (typing) => set({ isTyping: typing }),
}));
