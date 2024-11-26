export function ChatMessages() {
  return (
    <div className="space-y-4">
      <div className="flex gap-3 text-sm">
        <div className="rounded-lg bg-muted p-3">
          <p>Hello! How can I help you today?</p>
        </div>
      </div>

      <div className="flex gap-3 text-sm justify-end">
        <div className="rounded-lg bg-primary text-primary-foreground p-3">
          <p>Hi! I have a question about Next.js</p>
        </div>
      </div>
    </div>
  );
}
