import { useChatStore } from "@/lib/store";

export function ChatMessages() {
  const messages = useChatStore((state) => state.messages);

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <div
          key={message.id}
          className={`flex gap-3 text-sm ${
            message.role === "user" ? "justify-end" : ""
          }`}
        >
          <div
            className={`rounded-lg p-3 ${
              message.role === "user"
                ? "bg-primary text-primary-foreground"
                : "bg-muted"
            }`}
          >
            <p>{message.content}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
