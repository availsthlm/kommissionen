import { useChatStore } from "@/lib/store";
import ReactMarkdown from "react-markdown";
import { TypingIndicator } from "./typing-indicator";
import { WelcomeScreen } from "./welcome-screen";
interface MessageProps {
  content: string;
}

function UserMessage({ content }: MessageProps) {
  return (
    <div className="flex gap-3 text-sm justify-end">
      <div className="rounded-lg p-3 bg-primary text-primary-foreground">
        <p>{content}</p>
      </div>
    </div>
  );
}

function AssistantMessage({ content }: MessageProps) {
  if (content.length === 0) {
    return null;
  }

  return (
    <div className="flex gap-3 text-sm">
      <div className="rounded-lg p-3 bg-muted">
        <ReactMarkdown
          className="prose prose-sm dark:prose-invert max-w-none"
          components={{
            pre: (props: React.HTMLAttributes<HTMLPreElement>) => (
              <pre
                className="bg-muted-foreground/10 p-2 rounded-lg overflow-x-auto"
                {...props}
              />
            ),
            code: (props) => (
              <code
                className="bg-muted-foreground/10 rounded px-1"
                {...props}
              />
            ),
          }}
        >
          {content}
        </ReactMarkdown>
      </div>
    </div>
  );
}

export function ChatMessages() {
  const messages = useChatStore((state) => state.messages);
  const isTyping = useChatStore((state) => state.isTyping);

  const hasContent = messages.length === 2 && messages[1].content.length > 0;

  if (messages.length === 0) {
    return <WelcomeScreen />;
  }

  return (
    <div className="w-full space-y-4">
      {messages.map((message) =>
        message.role === "user" ? (
          <UserMessage key={message.id} content={message.content} />
        ) : (
          <AssistantMessage key={message.id} content={message.content} />
        )
      )}
      {isTyping && !hasContent && <TypingIndicator />}
    </div>
  );
}
