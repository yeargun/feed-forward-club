export type GalleryItem = {
  slug: string;
  title: string;
  /** ISO date of the session or moment. */
  date: string;
  city?: string;
  country?: string;
  /** Path to the image file. Leave empty to render an SVG placeholder. */
  src?: string;
  alt?: string;
  caption?: string;
  /** Optional: featured items render larger in the grid. */
  featured?: boolean;
};

// First entries are placeholders — replace `src` with a real image path once
// you have one in /public/gallery/.
export const gallery: GalleryItem[] = [
  {
    slug: "ankara-session-01",
    title: "Ankara · Session 01",
    date: "2026-02-12",
    city: "Ankara",
    country: "TR",
    caption: "First hot seats. Six members, one room.",
    featured: true,
  },
  {
    slug: "ankara-session-02",
    title: "Ankara · Session 02",
    date: "2026-03-05",
    city: "Ankara",
    country: "TR",
    caption: "Two demos, one pivot, a lot of notes.",
  },
  {
    slug: "ankara-social-01",
    title: "Ankara · Social",
    date: "2026-03-19",
    city: "Ankara",
    country: "TR",
    caption: "Off-the-record dinner after a long session.",
  },
  {
    slug: "ankara-session-03",
    title: "Ankara · Session 03",
    date: "2026-03-26",
    city: "Ankara",
    country: "TR",
    caption: "Commitments from last session reviewed, new ones set.",
  },
  {
    slug: "istanbul-meetup",
    title: "Istanbul · First meet-up",
    date: "2026-04-02",
    city: "Istanbul",
    country: "TR",
    caption: "Informal gathering with members and hopefuls.",
  },
  {
    slug: "ai-circle-kickoff",
    title: "AI / ML Circle · Remote kickoff",
    date: "2026-04-11",
    caption: "First remote topical circle. Six time zones, one room.",
  },
];
