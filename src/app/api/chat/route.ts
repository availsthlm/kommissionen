import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

// Helper function to clean the text while preserving markdown
function cleanResponse(text: string): string {
  // Remove citations like 【4:0†source】 but preserve markdown
  return text.replace(/【[^】]+】/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();
    const thread = await openai.beta.threads.create();

    // Add the message to the thread
    await openai.beta.threads.messages.create(thread.id, {
      role: "user",
      content: message,
    });

    // Run the assistant
    const run = await openai.beta.threads.runs.create(thread.id, {
      assistant_id: process.env.ASSISTANT_ID!,
    });

    // Create a new ReadableStream
    const stream = new ReadableStream({
      async start(controller) {
        let runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );

        while (runStatus.status !== "completed") {
          if (runStatus.status === "failed") {
            controller.error("Run failed");
            break;
          }

          await new Promise((resolve) => setTimeout(resolve, 500));
          runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
          );
        }

        // Once completed, get the messages
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];

        if (lastMessage.role === "assistant") {
          const content = lastMessage.content[0];
          if (content.type === "text") {
            // Clean the response but keep markdown intact
            const cleanedText = cleanResponse(content.text.value);
            const words = cleanedText.split(" ");

            for (const word of words) {
              const chunk = new TextEncoder().encode(word + " ");
              controller.enqueue(chunk);
              // Add a small delay between words for a more natural effect
              await new Promise((resolve) => setTimeout(resolve, 20)); // Reduced delay for better markdown rendering
            }
          }
        }

        controller.close();
      },
    });

    return new Response(stream, {
      headers: {
        "Content-Type": "text/markdown; charset=utf-8",
      },
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
