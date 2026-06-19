// =============================================================================
// Add-to-calendar helpers. Generates a Google Calendar URL and an .ics blob
// from an event's calendar config.
// =============================================================================

import type { EventConfig } from "./events";

function toCalStamp(iso: string): string {
  // 2026-06-24T18:00:00Z -> 20260624T180000Z
  return iso.replace(/[-:]/g, "").replace(/\.\d{3}/, "");
}

export function googleCalendarUrl(ev: EventConfig): string {
  const { calendar } = ev;
  const params = new URLSearchParams({
    action: "TEMPLATE",
    text: calendar.eventTitle,
    dates: `${toCalStamp(calendar.startUtc)}/${toCalStamp(calendar.endUtc)}`,
    details: `${calendar.description}\n\nJoin: ${calendar.locationUrl}`,
    location: calendar.locationUrl,
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
}

export function icsContent(ev: EventConfig): string {
  const { calendar } = ev;
  return [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//event-landing-pages//EN",
    "BEGIN:VEVENT",
    `UID:${ev.slug}@event-landing-pages`,
    `DTSTAMP:${toCalStamp(new Date().toISOString())}`,
    `DTSTART:${toCalStamp(calendar.startUtc)}`,
    `DTEND:${toCalStamp(calendar.endUtc)}`,
    `SUMMARY:${calendar.eventTitle}`,
    `DESCRIPTION:${calendar.description} Join: ${calendar.locationUrl}`,
    `LOCATION:${calendar.locationUrl}`,
    "END:VEVENT",
    "END:VCALENDAR",
  ].join("\r\n");
}

export function icsDataUri(ev: EventConfig): string {
  return `data:text/calendar;charset=utf-8,${encodeURIComponent(icsContent(ev))}`;
}
