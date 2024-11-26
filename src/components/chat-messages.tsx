import { useChatStore } from "@/lib/store";
import ReactMarkdown from "react-markdown";
import { TypingIndicator } from "./typing-indicator";

export function ChatMessages() {
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);

  return (
    <div className="mt-8 mb-8 space-y-4">
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
            {message.role === "user" ? (
              <p>{message.content}</p>
            ) : (
              <ReactMarkdown
                className="prose prose-sm dark:prose-invert max-w-none"
                components={{
                  // Ensure code blocks are properly styled
                  pre: ({ node, ...props }) => (
                    <pre className="bg-muted-foreground/10 p-2 rounded-lg overflow-x-auto">
                      {props.children}
                    </pre>
                  ),
                  // Style inline code
                  code: ({ node, ...props }) => (
                    <code className="bg-muted-foreground/10 rounded px-1">
                      {props.children}
                    </code>
                  ),
                }}
              >
                {message.content}
              </ReactMarkdown>
            )}
          </div>
        </div>
      ))}
      {isTyping && <TypingIndicator />}
    </div>
  );
}
