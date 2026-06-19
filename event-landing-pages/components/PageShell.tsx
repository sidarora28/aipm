import { ReactNode } from "react";

/** Deep-navy background + centered white card. Matches the reference layout. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="min-h-screen bg-navy-deep px-4 py-10 sm:py-16">
      <div className="mx-auto w-full max-w-card rounded-2xl bg-white px-6 py-10 shadow-2xl sm:px-12 sm:py-14">
        {children}
      </div>
    </main>
  );
}

export function SectionDivider() {
  return <hr className="my-10 border-slate-200" />;
}
