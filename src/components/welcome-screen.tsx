export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        Nationella provet - biologi
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
        Välkommen till din guide genom nationella provet i biologi. Ställ frågor
        och få insikter om nationella provet i biologi.
      </p>
    </div>
  );
}
