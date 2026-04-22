// Groups = sub-organizations inside FeedForwardClub.
// Two shapes: chapters (geographic) and topics (area of focus).

export type GroupStatus = "active" | "forming" | "planned";

export type Chapter = {
  kind: "chapter";
  slug: string;
  name: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  status: GroupStatus;
  note?: string;
  memberCount?: number;
};

export type Topic = {
  kind: "topic";
  slug: string;
  name: string;
  blurb: string;
  status: GroupStatus;
  interestedCount?: number;
};

export type Group = Chapter | Topic;

// Geographic chapters. One active (Ankara, home base). Others are signal,
// not promise: we'd like to start meetings in these cities as interest grows.
export const chapters: Chapter[] = [
  {
    kind: "chapter",
    slug: "ankara",
    name: "Ankara",
    city: "Ankara",
    country: "TR",
    lat: 39.9334,
    lon: 32.8597,
    status: "active",
    note: "Home base. Sessions running.",
    memberCount: 6,
  },
  {
    kind: "chapter",
    slug: "istanbul",
    name: "Istanbul",
    city: "Istanbul",
    country: "TR",
    lat: 41.0082,
    lon: 28.9784,
    status: "forming",
    note: "Expression of interest open.",
  },
  {
    kind: "chapter",
    slug: "berlin",
    name: "Berlin",
    city: "Berlin",
    country: "DE",
    lat: 52.52,
    lon: 13.405,
    status: "planned",
  },
  {
    kind: "chapter",
    slug: "london",
    name: "London",
    city: "London",
    country: "GB",
    lat: 51.5074,
    lon: -0.1278,
    status: "planned",
  },
  {
    kind: "chapter",
    slug: "san-francisco",
    name: "San Francisco",
    city: "San Francisco",
    country: "US",
    lat: 37.7749,
    lon: -122.4194,
    status: "planned",
  },
];

// Topical groups: circles organized around what members build, not where.
// Signal again: "forming" means someone has raised their hand; "planned" means
// we have it earmarked.
export const topics: Topic[] = [
  {
    kind: "topic",
    slug: "ai-ml",
    name: "AI / ML Founders",
    blurb: "Model training, inference, applied ML, agent systems.",
    status: "forming",
  },
  {
    kind: "topic",
    slug: "consumer",
    name: "Consumer",
    blurb: "Apps, social, creator tools, community products.",
    status: "forming",
  },
  {
    kind: "topic",
    slug: "devtools",
    name: "Developer Tools",
    blurb: "IDEs, CI/CD, observability, package infra, runtimes.",
    status: "forming",
  },
  {
    kind: "topic",
    slug: "b2b-saas",
    name: "B2B SaaS",
    blurb: "Sales motion, ICP, pricing, enterprise and mid-market playbooks.",
    status: "forming",
  },
  {
    kind: "topic",
    slug: "bootstrappers",
    name: "Bootstrappers & Indie",
    blurb: "Profitability first, small teams, owning your own ceiling.",
    status: "forming",
  },
  {
    kind: "topic",
    slug: "open-source",
    name: "Open Source Founders",
    blurb: "OSS projects becoming companies. Licenses, monetization, governance.",
    status: "planned",
  },
  {
    kind: "topic",
    slug: "hardware",
    name: "Hardware & Robotics",
    blurb: "PCBs, firmware, manufacturing, supply chain, physical products.",
    status: "planned",
  },
  {
    kind: "topic",
    slug: "fintech",
    name: "Fintech",
    blurb: "Payments, infra, lending, regulated markets, identity.",
    status: "planned",
  },
  {
    kind: "topic",
    slug: "climate",
    name: "Climate Tech",
    blurb: "Hardware, carbon accounting, grid software, materials.",
    status: "planned",
  },
  {
    kind: "topic",
    slug: "health",
    name: "Health Tech",
    blurb: "Clinical products, care delivery, health data, medical devices.",
    status: "planned",
  },
  {
    kind: "topic",
    slug: "marketplace",
    name: "Marketplaces",
    blurb: "Two-sided platforms, liquidity, trust and safety.",
    status: "planned",
  },
  {
    kind: "topic",
    slug: "creator",
    name: "Creator Economy",
    blurb: "Tools for creators, monetization, distribution, audience.",
    status: "planned",
  },
];

export const groups: Group[] = [...chapters, ...topics];

// — derived ------------------------------------------------------------------

export const chapterCount = chapters.length;
export const activeChapters = chapters.filter((c) => c.status === "active");
export const formingChapters = chapters.filter((c) => c.status === "forming");
export const plannedChapters = chapters.filter((c) => c.status === "planned");

export const statusLabel: Record<GroupStatus, string> = {
  active: "Active",
  forming: "Forming",
  planned: "Planned",
};

export const statusNote: Record<GroupStatus, string> = {
  active: "Meetings happening.",
  forming: "Gathering interest.",
  planned: "On our map, waiting on a local host.",
};

// Colors used by the globe for each chapter marker, in cobe's RGB-0-1 format.
export const chapterMarkerColor: Record<GroupStatus, [number, number, number]> = {
  active:  [0.122, 0.227, 0.408], // #1F3A68 prussian (brand accent)
  forming: [0.38, 0.52, 0.72],    // softer blue-gray
  planned: [0.55, 0.55, 0.5],     // near-neutral, recedes
};
