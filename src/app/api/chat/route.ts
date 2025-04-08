import { NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const maxDuration = 30;
export const runtime = "edge";

// Helper function to clean the text while preserving markdown
function cleanResponse(text: string): string {
  // Remove citations like 【4:0†source】 but preserve markdown
  return text.replace(/【[^】]+】/g, "").trim();
}

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    // Create encoder for streaming
    const encoder = new TextEncoder();

    // Create a transform stream for handling the response
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Function to send a status message that can be updated by the client
    const sendStatusMessage = async (status: string) => {
      // Make sure the status message is clearly separated from other content
      await writer.write(encoder.encode(`STATUS:${status}\n`));
    };

    // Start processing in the background
    (async () => {
      try {
        // First send a test status to ensure client is receiving these messages
        await new Promise((resolve) => setTimeout(resolve, 300));

        const thread = await openai.beta.threads.create();

        // Add the message to the thread
        await sendStatusMessage("Bearbetar din fråga");
        await openai.beta.threads.messages.create(thread.id, {
          role: "user",
          content: message,
        });

        // Run the assistant
        const run = await openai.beta.threads.runs.create(thread.id, {
          assistant_id: process.env.ASSISTANT_ID!,
        });

        // Initial status check
        let runStatus = await openai.beta.threads.runs.retrieve(
          thread.id,
          run.id
        );
        let retries = 0;
        const maxRetries = 60; // Maximum number of status checks

        await sendStatusMessage("Retrieving information");

        while (runStatus.status !== "completed" && retries < maxRetries) {
          if (runStatus.status === "failed") {
            throw new Error("Assistant run failed");
          }

          // Update status message periodically
          if (retries % 3 === 0) {
            const statusMessages = [
              "Söker efter källor",
              "Bearbetar information",
              "Analyserar data",
              "Förbereder svar",
              "Tänker fortfarande",
            ];
            const messageIndex =
              Math.floor(retries / 3) % statusMessages.length;
            await sendStatusMessage(statusMessages[messageIndex]);
          }

          // Wait between status checks
          await new Promise((resolve) => setTimeout(resolve, 500));
          runStatus = await openai.beta.threads.runs.retrieve(
            thread.id,
            run.id
          );
          retries++;
        }

        if (retries >= maxRetries) {
          throw new Error("Assistant run timed out");
        }

        // Get the messages once completed
        await sendStatusMessage("Finalizing response");
        const messages = await openai.beta.threads.messages.list(thread.id);
        const lastMessage = messages.data[0];

        if (lastMessage.role === "assistant") {
          const content = lastMessage.content[0];
          if (content.type === "text") {
            // Signal that we're done with status updates and starting content
            // Add a clearly separated marker to ensure client catches it
            await writer.write(encoder.encode("DONE\n"));

            const cleanedText = cleanResponse(content.text.value);

            // Stream the content with small chunks to maintain streaming behavior
            // but large enough to preserve markdown formatting
            const paragraphs = cleanedText.split("\n\n");
            for (const paragraph of paragraphs) {
              await writer.write(encoder.encode(paragraph + "\n\n"));
              await new Promise((resolve) => setTimeout(resolve, 50));
            }
          }
        }
      } catch (error) {
        // Send error status and message
        await writer.write(encoder.encode("ERROR\n"));
        const errorMessage = `Error: ${
          error instanceof Error ? error.message : "Unknown error occurred"
        }`;
        await writer.write(encoder.encode(errorMessage));
      } finally {
        await writer.close();
      }
    })();

    // Return the stream immediately while processing continues in the background
    return new Response(stream.readable, {
      headers: {
        "Content-Type": "text/plain; charset=utf-8",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
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
