import { Message, useChatStore } from "@/lib/store";
import { cn } from "@/lib/utils";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { WelcomeScreen } from "./welcome-screen";

function StatusMessage({ message }: { message: string }) {
  const [loadingIndicator, setLoadingIndicator] = useState("⣾");

  useEffect(() => {
    const loadingIndicators = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];
    let i = 0;

    const interval = setInterval(() => {
      setLoadingIndicator(loadingIndicators[i]);
      i = (i + 1) % loadingIndicators.length;
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex gap-3">
      <div className="leading-relaxed">
        <div className="flex items-center gap-2">
          <span className="inline-block w-4 animate-spin">
            {loadingIndicator}
          </span>
          <span className="text-muted-foreground">{message}</span>
        </div>
      </div>
    </div>
  );
}

function ChatMessage({ message }: { message: Message }) {
  if (message.content.length === 0) {
    return null;
  }
  return (
    <div
      key={message.id}
      className={cn(
        "flex w-full gap-3 rounded-lg px-4 py-4",
        message.role === "assistant" ? "bg-secondary" : "bg-slate-100"
      )}
    >
      <div className="flex w-full gap-3 rounded-lg px-4 py-4">
        <div className="flex-1">
          <ReactMarkdown>{message.content}</ReactMarkdown>
        </div>
      </div>
    </div>
  );
}

export function ChatMessages() {
  const messages = useChatStore((state) => state.messages);
  const statusMessage = useChatStore((state) => state.statusMessage);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, statusMessage]);

  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div className="relative mx-auto max-w-2xl px-4">
      <div className="space-y-4 pb-20">
        {messages.map((message, i) => (
          <ChatMessage key={message.id ?? i} message={message} />
        ))}
        {statusMessage && statusMessage.length > 0 && (
          <div className="flex w-full items-center gap-3 rounded-lg bg-secondary px-4 py-4">
            <div className="flex-1">
              <StatusMessage message={statusMessage} />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
    </div>
  );
}
