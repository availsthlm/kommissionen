"use client";

import { ChatInput } from "@/components/chat-input";
import { ChatMessages } from "@/components/chat-messages";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

export default function Home() {
  return (
    <div className="min-h-screen bg-background bg-[url('/background.png')] bg-cover bg-center bg-no-repeat bg-fixed">
      <div className="mx-auto w-full max-w-[90%] sm:max-w-[600px] md:max-w-[700px] lg:max-w-[800px] xl:max-w-[900px] h-screen flex flex-col px-2 py-4">
        <Card className="flex h-full flex-col gap-1 bg-background/80 backdrop-blur-sm">
          <div className="flex items-center justify-between p-4 sm:p-6 lg:p-8">
            <h1 className="text-lg sm:text-xl font-bold">
              AI kommisionen under lupp
            </h1>
          </div>

          <ScrollArea className="flex-1 px-2 sm:px-4">
            <ChatMessages />
          </ScrollArea>

          <div className="border-t p-3 sm:p-4">
            <ChatInput />
          </div>
        </Card>
      </div>
    </div>
  );
}
