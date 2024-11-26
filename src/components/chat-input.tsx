import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SendHorizontal } from "lucide-react";

export function ChatInput() {
  return (
    <form className="flex gap-2">
      <Input placeholder="Type your message..." className="flex-1" />
      <Button type="submit" size="icon">
        <SendHorizontal className="h-4 w-4" />
      </Button>
    </form>
  );
}
