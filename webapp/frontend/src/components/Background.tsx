// Engineering-style backdrop: blueprint grid + soft gradient mesh.
// Calm in light mode, deep slate-teal in dark mode.
export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden bg-paper-50 dark:bg-ink-950 transition-colors duration-500">
      {/* blueprint grid */}
      <div className="absolute inset-0 bg-grid-faint [background-size:42px_42px] [mask-image:radial-gradient(ellipse_at_center,black_40%,transparent_85%)]" />

      {/* soft gradient mesh */}
      <div className="absolute -top-48 left-1/2 -translate-x-1/2 h-[40rem] w-[60rem] rounded-full bg-sky-300/20 dark:bg-sky-600/15 blur-[120px] animate-float-slow" />
      <div
        className="absolute top-1/2 -right-40 h-[34rem] w-[34rem] rounded-full bg-teal-300/20 dark:bg-teal-600/12 blur-[120px] animate-float-slow"
        style={{ animationDelay: "5s" }}
      />
      <div
        className="absolute -bottom-48 -left-32 h-[32rem] w-[32rem] rounded-full bg-indigo-300/15 dark:bg-indigo-700/12 blur-[120px] animate-float-slow"
        style={{ animationDelay: "10s" }}
      />

      {/* top sheen */}
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-sky-400/40 to-transparent" />
    </div>
  );
}
