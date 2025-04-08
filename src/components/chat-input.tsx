import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/lib/store";
import { track } from "@vercel/analytics";
import { SendHorizontal } from "lucide-react";
import { useEffect, useState } from "react";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [statusMessage, setStatusMessage] = useState("");
  const [loadingIndicator, setLoadingIndicator] = useState("⣾");
  const { addMessage, setTyping, updateLastMessage } = useChatStore();

  // Animate the loading indicator
  useEffect(() => {
    if (!statusMessage) return;

    const loadingIndicators = ["⣾", "⣽", "⣻", "⢿", "⡿", "⣟", "⣯", "⣷"];
    let i = 0;

    const interval = setInterval(() => {
      setLoadingIndicator(loadingIndicators[i]);
      i = (i + 1) % loadingIndicators.length;
    }, 100);

    return () => clearInterval(interval);
  }, [statusMessage]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    track("query", {
      value: message,
    });
    setInput("");
    setIsLoading(true);
    setTyping(true);
    setStatusMessage(""); // Reset status message

    // Add user message
    addMessage({ content: message, role: "user" });

    try {
      // Add an empty assistant message that we'll stream into
      addMessage({ content: "", role: "assistant" });

      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let responseText = "";
      let currentParagraph = "";

      if (reader) {
        try {
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });

            // Process the chunk line by line
            const lines = chunk.split("\n");
            for (const line of lines) {
              // Check if it's a status message
              if (line.startsWith("STATUS: ")) {
                const status = line.substring(8);
                setStatusMessage(status);
              }
              // Check if we're done with status messages
              else if (line === "DONE" || line === "ERROR") {
                setStatusMessage(""); // Clear status message
              }
              // Otherwise it's actual content
              else if (line.trim() !== "") {
                // Accumulate content
                currentParagraph += line + "\n";

                // Check if we have a complete paragraph or content chunk
                if (line === "" && currentParagraph.trim()) {
                  responseText += currentParagraph;
                  updateLastMessage(responseText);
                  currentParagraph = "";
                }
              }
            }

            // Update with any remaining content
            if (currentParagraph.trim()) {
              responseText += currentParagraph;
              updateLastMessage(responseText);
            }
          }
        } finally {
          reader.releaseLock();
          setStatusMessage(""); // Ensure status is cleared when done
        }
      }
    } catch (error) {
      console.error("Error:", error);
      updateLastMessage("Oj, något gick fel. Försök igen senare.");
      setStatusMessage(""); // Clear status message on error
    } finally {
      setIsLoading(false);
      setTyping(false);
    }
  };

  return (
    <div className="flex flex-col gap-2">
      {statusMessage && (
        <div className="text-sm text-muted-foreground animate-pulse flex items-center gap-2">
          <span className="inline-block w-4">{loadingIndicator}</span>
          <span>{statusMessage}</span>
        </div>
      )}
      <form onSubmit={handleSubmit} className="flex gap-2">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ställ en fråga..."
          className="flex-1"
          disabled={isLoading}
        />
        <Button type="submit" size="icon" disabled={isLoading}>
          <SendHorizontal className="h-4 w-4" />
        </Button>
      </form>
    </div>
  );
}
