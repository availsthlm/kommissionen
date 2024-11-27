export function WelcomeScreen() {
  return (
    <div className="flex flex-col items-center justify-center text-center px-4">
      <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
        AI Kommissionen Under Lupp
      </h1>
      <p className="text-xl text-muted-foreground max-w-[600px] mb-8">
        Välkommen till din guide genom AI-kommissionens arbete. Ställ frågor och
        få insikter om Sveriges framtida AI-politik och regelverk.
      </p>

      <p className="leading-normal text-right text-muted-foreground text-sm">
        Ännu en smart tjänst från{" "}
        <a
          href="https://www.linkedin.com/company/availsthlm/"
          target="_blank"
          className="inline-flex flex-1 justify-center gap-1 leading-4 hover:underline"
        >
          <span>Avail STHLM</span>
          <svg
            aria-hidden="true"
            height="7"
            viewBox="0 0 6 6"
            width="7"
            className="opacity-70"
          >
            <path
              d="M1.25215 5.54731L0.622742 4.9179L3.78169 1.75597H1.3834L1.38936 0.890915H5.27615V4.78069H4.40513L4.41109 2.38538L1.25215 5.54731Z"
              fill="currentColor"
            ></path>
          </svg>
        </a>
      </p>
    </div>
  );
}
