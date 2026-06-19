"use client";

import type { EventConfig } from "@/lib/events";
import { googleCalendarUrl, icsDataUri } from "@/lib/calendar";
import { track } from "@/lib/analytics";

/** AddEvent-style calendar card from the reference page. */
export function AddToCalendar({ ev }: { ev: EventConfig }) {
  const { calendar } = ev;

  return (
    <div className="mx-auto mt-6 max-w-md rounded-xl border border-slate-200 p-6 text-left shadow-sm">
      <h3 className="text-xl font-bold text-navy">{calendar.eventTitle}</h3>

      <p className="mt-3 flex items-center gap-2 text-slate-600">
        <span aria-hidden>🕒</span>
        <span>{calendar.dateTimeLabel}</span>
      </p>
      <p className="ml-6 text-xs text-slate-400">Time shown in {calendar.timezoneLabel}</p>

      <a
        href={googleCalendarUrl(ev)}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => track("add_to_calendar", { event: ev.slug, method: "google" })}
        className="mt-5 inline-block rounded-lg bg-brandblue px-6 py-3 font-semibold text-white transition hover:brightness-95"
      >
        Add to Calendar
      </a>

      <div className="mt-6 space-y-3 border-t border-slate-100 pt-4 text-sm">
        <p className="flex items-start gap-2">
          <span aria-hidden>📍</span>
          <a
            href={calendar.locationUrl}
            className="break-all text-brandblue underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            {calendar.locationUrl}
          </a>
        </p>
        <p className="flex items-center gap-2 text-slate-600">
          <span aria-hidden>👤</span>
          <span>
            {calendar.organizerName},{" "}
            <a href={`mailto:${calendar.organizerEmail}`} className="text-brandblue underline">
              {calendar.organizerEmail}
            </a>
          </span>
        </p>
      </div>

      {/* Multi-app add-to-calendar row (placeholder icons). */}
      <div className="mt-6 border-t border-slate-100 pt-4 text-center">
        <p className="text-sm font-semibold text-slate-700">Add event to calendar</p>
        <div className="mt-3 flex justify-center gap-4 text-2xl">
          <a href={icsDataUri(ev)} download={`${ev.slug}.ics`} title="Apple"></a>
          <a href={googleCalendarUrl(ev)} target="_blank" rel="noopener noreferrer" title="Google">📆</a>
          <a href={icsDataUri(ev)} download={`${ev.slug}.ics`} title="Outlook">📧</a>
          <a href={icsDataUri(ev)} download={`${ev.slug}.ics`} title="Office 365">🗂️</a>
          <a href={icsDataUri(ev)} download={`${ev.slug}.ics`} title="Yahoo">🟣</a>
        </div>
      </div>
    </div>
  );
}
