export function TypingIndicator() {
  return (
    <div className="flex gap-3 text-sm">
      <div className="rounded-lg bg-muted p-3 w-16">
        <div className="flex gap-1 items-center justify-center">
          <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.3s]" />
          <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:-0.15s]" />
          <div className="w-1.5 h-1.5 bg-muted-foreground/60 rounded-full animate-bounce" />
        </div>
      </div>
    </div>
  );
}
