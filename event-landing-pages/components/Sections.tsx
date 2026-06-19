import type { EventConfig } from "@/lib/events";

export function GiveawaySection({ ev }: { ev: EventConfig }) {
  return (
    <section className="mt-12 text-center">
      <h2 className="text-2xl font-extrabold text-navy">{ev.giveaway.heading}</h2>
      <p className="mx-auto mt-4 max-w-md text-slate-600">{ev.giveaway.body}</p>
    </section>
  );
}

export function HostBioSection({ ev }: { ev: EventConfig }) {
  const { hosts } = ev;
  return (
    <section className="mt-12 text-center">
      <h2 className="text-2xl font-extrabold text-navy">{hosts.intro}</h2>
      <p className="mx-auto mt-4 max-w-md text-slate-600">{hosts.bio}</p>
      <p className="mx-auto mt-4 max-w-md font-semibold text-slate-700">{hosts.socialProof}</p>
      {hosts.programLinks.length > 0 && (
        <div className="mt-4 flex flex-wrap justify-center gap-x-3 gap-y-1 text-sm">
          {hosts.programLinks.map((l) => (
            <a key={l.label} href={l.href} className="text-brandblue underline">
              {l.label}
            </a>
          ))}
        </div>
      )}
    </section>
  );
}

export function VideosSection({ ev }: { ev: EventConfig }) {
  if (!ev.videos.length) return null;
  return (
    <section className="mt-12 space-y-8">
      {ev.videos.map((v, i) => (
        <div key={i} className="text-center">
          <h3 className="mb-3 text-lg font-bold text-navy">{v.title}</h3>
          <div className="relative aspect-video w-full overflow-hidden rounded-xl">
            <iframe
              className="absolute inset-0 h-full w-full"
              src={`https://www.youtube.com/embed/${v.youtubeId}`}
              title={v.title}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>
      ))}
    </section>
  );
}

export function TestimonialsSection({ ev }: { ev: EventConfig }) {
  return (
    <section className="mt-12 text-center">
      <h2 className="text-2xl font-extrabold text-navy">{ev.testimonialsHeading}</h2>
      <div className="mt-6 space-y-3 text-left">
        {ev.testimonials.map((t, i) => (
          <div key={i} className="rounded-lg bg-slate-100 px-4 py-3">
            <p className="text-xs font-semibold text-slate-500">
              {t.name} <span className="font-normal text-slate-400">· {t.time}</span>
            </p>
            <p className="mt-1 text-slate-700">{t.text}</p>
          </div>
        ))}
      </div>
    </section>
  );
}

export function InboxSection() {
  return (
    <section className="mt-12 text-center">
      <h2 className="text-2xl font-extrabold text-navy">PS… Keep an eye on your inbox!</h2>
      <p className="mx-auto mt-4 max-w-md text-slate-600">
        Right after signing up, you should&apos;ve gotten a quick email with a link to add the event
        to your calendar. Over the coming days we&apos;ll share a few extra resources to help you get
        the most out of it — so keep an eye out for those!
      </p>
    </section>
  );
}

export function Footer() {
  return (
    <footer className="mt-12 border-t border-slate-100 pt-6 text-center text-xs text-slate-400">
      {/* TODO: company name, links, legal */}
      <p>© {new Date().getFullYear()} TODO Company. All rights reserved.</p>
    </footer>
  );
}
