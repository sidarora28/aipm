import { notFound } from "next/navigation";
import { getEvent, allEventSlugs } from "@/lib/events";
import { PageShell, SectionDivider } from "@/components/PageShell";
import { TrackingProvider } from "@/components/TrackingProvider";
import { AddToCalendar } from "@/components/AddToCalendar";
import {
  GiveawaySection,
  HostBioSection,
  VideosSection,
  TestimonialsSection,
  InboxSection,
  Footer,
} from "@/components/Sections";

export function generateStaticParams() {
  return allEventSlugs().map((event) => ({ event }));
}

export default function ConfirmedPage({ params }: { params: { event: string } }) {
  const ev = getEvent(params.event);
  if (!ev) notFound();

  return (
    <>
      <TrackingProvider page={`confirmed:${ev.slug}`} />
      <PageShell>
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-navy sm:text-4xl">{ev.confirmedHeadline}</h1>
          <p className="mx-auto mt-4 max-w-md text-slate-600">
            <span className="font-bold">[NEXT STEP]</span> {ev.nextStepText}
          </p>
          <AddToCalendar ev={ev} />
        </div>

        <GiveawaySection ev={ev} />
        <SectionDivider />
        <HostBioSection ev={ev} />
        <VideosSection ev={ev} />
        <TestimonialsSection ev={ev} />
        <InboxSection />
        <Footer />
      </PageShell>
    </>
  );
}
