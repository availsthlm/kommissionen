import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/lib/store";
import { track } from "@vercel/analytics";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { addMessage, setTyping, updateLastMessage, setStatusMessage } =
    useChatStore();

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
      let buffer = "";

      if (reader) {
        try {
          console.log("Starting to read stream");
          while (true) {
            const { done, value } = await reader.read();
            if (done) break;

            const chunk = decoder.decode(value, { stream: true });
            console.log("Received chunk:", chunk);
            buffer += chunk;

            // Process any complete lines from the buffer
            let lineEndIndex;
            while ((lineEndIndex = buffer.indexOf("\n")) !== -1) {
              const line = buffer.substring(0, lineEndIndex).trim();
              buffer = buffer.substring(lineEndIndex + 1);

              console.log("Processing line:", line);

              // Check if it's a status message
              if (line.startsWith("STATUS:")) {
                const status = line.substring(7).trim();
                console.log("Status update:", status);
                setStatusMessage(status);
              }
              // Check if we're done with status messages
              else if (line === "DONE" || line === "ERROR") {
                console.log("Received control signal:", line);
                setStatusMessage(""); // Clear status message
              }
              // Otherwise, if it's not empty, it's content
              else if (line !== "") {
                responseText += line + "\n";
                updateLastMessage(responseText.trim());
              }
            }
          }
        } finally {
          reader.releaseLock();
          // Process any remaining content in the buffer
          if (buffer.trim()) {
            responseText += buffer;
            updateLastMessage(responseText.trim());
          }
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
  );
}
