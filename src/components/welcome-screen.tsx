export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        AI Kommisionen Under Lupp
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
        Välkommen till din guide genom AI-kommisionens arbete. Ställ frågor och
        få insikter om Sveriges framtida AI-politik och regelverk.
      </p>
      <div className="text-md text-muted-foreground">
        Börja med att ställa en fråga nedan ↓
      </div>
    </div>
  );
}
