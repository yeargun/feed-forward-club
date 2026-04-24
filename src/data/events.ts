import calendar from "./calendar.json";

export type EventKind = "meet" | "session" | "demo" | "social";

export type EventSpotlight = {
  speaker: string;
  title?: string;
  summary?: string;
};

export type Event = {
  slug: string;
  title: string;
  kind: EventKind;
  /** ISO date (YYYY-MM-DD) or ISO datetime. */
  date: string;
  city?: string;
  country?: string;
  blurb?: string;
  /** Slug of the chapter or topic this event belongs to. Optional. */
  group?: string;
  /** Freeform labels; lowercase or short phrases work. */
  tags?: string[];
  /** Optional talk or deck. Most meets have no formal spotlight. */
  spotlight?: EventSpotlight;
};

export type NewsItem = {
  slug: string;
  /** ISO date. */
  date: string;
  headline: string;
  blurb?: string;
  link?: string;
};

type CalendarFile = { schemaVersion: number; events: Event[] };

export const events: Event[] = (calendar as CalendarFile).events;

export const news: NewsItem[] = [
  {
    slug: "ankara-taking-members",
    date: "2026-04-20",
    headline: "Ankara chapter is taking new members.",
    blurb: "Sessions run every two weeks. Apply to join the room.",
    link: "/apply",
  },
  {
    slug: "ai-ml-circle-forming",
    date: "2026-04-08",
    headline: "AI / ML founders' circle is forming.",
    blurb: "Enough interest to pilot a remote-first topical circle alongside chapters.",
    link: "/groups#topics",
  },
  {
    slug: "supporters-announcement",
    date: "2026-03-27",
    headline: "Cloud credits via AWS, Google and Microsoft programs.",
    blurb: "Members can now apply to partner startup programs directly through us.",
    link: "/#supporters",
  },
  {
    slug: "istanbul-chapter",
    date: "2026-03-12",
    headline: "Istanbul chapter is gathering interest.",
    blurb: "Looking for a local host. Write us if that is you.",
    link: "/contact",
  },
];

// — helpers -----------------------------------------------------------------

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

export function formatEventDate(iso: string): string {
  const [y, m, d] = iso.split("T")[0].split("-").map((n) => parseInt(n, 10));
  if (!m || !d) return iso;
  return `${MONTHS[m - 1]} ${d}, ${y}`;
}

export function upcomingEvents(now = new Date()): Event[] {
  const today = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.date.slice(0, 10) >= today)
    .sort((a, b) => a.date.localeCompare(b.date));
}

export function pastEvents(now = new Date()): Event[] {
  const today = now.toISOString().slice(0, 10);
  return events
    .filter((e) => e.date.slice(0, 10) < today)
    .sort((a, b) => b.date.localeCompare(a.date));
}

export const kindLabel: Record<EventKind, string> = {
  meet: "Meet",
  session: "Session",
  demo: "Demo",
  social: "Social",
};
