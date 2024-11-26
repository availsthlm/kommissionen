"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div className="flex h-screen flex-col p-4">
      <Card className="flex h-full flex-col gap-4">
        <div className="flex items-center justify-between  p-4">
          <h1 className="text-xl font-bold">Chat Interface</h1>
        </div>

        <ScrollArea className="flex-1 p-4">
          <ChatMessages />
        </ScrollArea>

        <div className="border-t p-4">
          <ChatInput />
        </div>
      </Card>
    </div>
  );
}
