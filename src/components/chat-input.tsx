import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useChatStore } from "@/lib/store";
import { SendHorizontal } from "lucide-react";
import { useState } from "react";

export function ChatInput() {
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const addMessage = useChatStore((state) => state.addMessage);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const message = input.trim();
    setInput("");
    setIsLoading(true);

    // Add user message
    addMessage({ content: message, role: "user" });

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message }),
      });

      const data = await response.json();

      if (!response.ok) throw new Error(data.error);

      // Add assistant response
      addMessage({ content: data.response, role: "assistant" });
    } catch (error) {
      console.error(error);
      // Handle error (you might want to show an error message to the user)
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <Input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Type your message..."
        className="flex-1"
        disabled={isLoading}
      />
      <Button type="submit" size="icon" disabled={isLoading}>
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}
