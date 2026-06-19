import { notFound } from "next/navigation";
import { getEvent, allEventSlugs } from "@/lib/events";
import { PageShell, SectionDivider } from "@/components/PageShell";
import { TrackingProvider } from "@/components/TrackingProvider";
import { OptInForm } from "@/components/OptInForm";
import { HostBioSection, VideosSection, TestimonialsSection, Footer } from "@/components/Sections";

export function generateStaticParams() {
  return allEventSlugs().map((event) => ({ event }));
}

export default function OptInPage({ params }: { params: { event: string } }) {
  const ev = getEvent(params.event);
  if (!ev) notFound();

  return (
    <>
      <TrackingProvider page={`optin:${ev.slug}`} />
      <PageShell>
        <div className="text-center">
          <p className="text-sm font-bold uppercase tracking-wide text-brandorange">{ev.eyebrow}</p>
          <h1 className="mt-3 text-3xl font-extrabold leading-tight text-navy sm:text-4xl">
            {ev.title}
          </h1>
          <p className="mx-auto mt-4 max-w-md text-lg text-slate-600">{ev.subtitle}</p>

          <p className="mt-6 font-semibold text-navy">{ev.calendar.dateTimeLabel}</p>

          <ul className="mx-auto mt-6 max-w-sm space-y-2 text-left">
            {ev.learnPoints.map((p, i) => (
              <li key={i} className="flex gap-2 text-slate-700">
                <span className="text-brandblue">✓</span>
                <span>{p}</span>
              </li>
            ))}
          </ul>

          <OptInForm slug={ev.slug} ctaLabel={ev.ctaLabel} />
        </div>

        <SectionDivider />
        <HostBioSection ev={ev} />
        <VideosSection ev={ev} />
        <TestimonialsSection ev={ev} />
        <Footer />
      </PageShell>
    </>
  );
}
