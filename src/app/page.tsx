"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useChatStore } from "@/lib/store";

export default function Home() {
  const messages = useChatStore((state) => state.messages);
  const hasMessages = messages.length > 0;

  return (
    <div className="min-h-screen bg-background bg-[url('/background.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="mx-auto w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] h-screen flex flex-col px-2 py-4">
        <Card className="flex h-full flex-col gap-1 bg-background/90 backdrop-blur-sm">
          {hasMessages ? (
            <>
              <ScrollArea className="flex-1 py-8 px-2 sm:px-4">
                <ChatMessages />
              </ScrollArea>
              <div className="border-t p-3 sm:p-4">
                <ChatInput />
              </div>
            </>
          ) : (
            <div className="flex flex-col h-full">
              <div className="flex-1 flex items-center justify-center">
                <ChatMessages />
              </div>
              <div className="border-t p-3 sm:p-4">
                <ChatInput />
              </div>
              <p className="px-2 text-center text-xs leading-normal text-muted-foreground sm:block">
                Det här är en AI-tjänst, såna kan ha fel. Överväg att
                kontrollera viktig information.
              </p>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
