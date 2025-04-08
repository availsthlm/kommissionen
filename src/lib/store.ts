import { nanoid } from "nanoid";
import { create } from "zustand";

export interface Message {
  id?: string;
  role: "user" | "assistant";
  content: string;
}

interface ChatStore {
  messages: Message[];
  isTyping: boolean;
  statusMessage: string;
  addMessage: (message: Message) => void;
  updateLastMessage: (content: string) => void;
  setTyping: (typing: boolean) => void;
  setStatusMessage: (status: string) => void;
}

export const useChatStore = create<ChatStore>((set) => ({
  messages: [],
  isTyping: false,
  statusMessage: "",
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, { ...message, id: nanoid() }],
    })),
  updateLastMessage: (content) =>
    set((state) => ({
      messages: state.messages.map((msg, i) =>
        i === state.messages.length - 1 ? { ...msg, content } : msg
      ),
    })),
  setTyping: (typing) => set({ isTyping: typing }),
  setStatusMessage: (status) => set({ statusMessage: status }),
}));
