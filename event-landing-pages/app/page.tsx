import Link from "next/link";
import { events } from "@/lib/events";

/** Simple index so you can click into each event during development. */
export default function Home() {
  return (
    <main className="min-h-screen bg-navy-deep px-4 py-16 text-white">
      <div className="mx-auto max-w-card">
        <h1 className="text-2xl font-bold">Event Landing Pages</h1>
        <p className="mt-2 text-slate-300">Placeholder index. Each event has an opt-in and a confirmation page.</p>
        <ul className="mt-8 space-y-4">
          {events.map((e) => (
            <li key={e.slug} className="rounded-lg bg-white/5 p-4">
              <p className="font-semibold">{e.slug}</p>
              <div className="mt-2 flex gap-4 text-sm">
                <Link href={`/${e.slug}`} className="text-brandblue underline">
                  Opt-in →
                </Link>
                <Link href={`/${e.slug}/confirmed`} className="text-brandblue underline">
                  Confirmation →
                </Link>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </main>
  );
}
