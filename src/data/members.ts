export type Stage = "idea" | "pre-mvp" | "mvp" | "live" | "scaling";

export type Member = {
  name: string;
  handle?: string;
  city: string;
  country: string;      // ISO-ish 2-letter
  lat: number;
  lon: number;
  working_on: string;
  stage: Stage;
  tags: string[];
  winner?: boolean;
  website?: string;
  linkedin?: string;
  instagram?: string;
  github?: string;
};

export function externalUrl(url: string | undefined): string {
  if (!url?.trim()) return "";
  const u = url.trim();
  if (/^https?:\/\//i.test(u)) return u;
  return `https://${u.replace(/^\/+/, "")}`;
}

// All Ankara for now. Add members here — everything downstream derives from this.
export const members: Member[] = [
  {
    name: "Placeholder Member",
    handle: "@member1",
    city: "Ankara", country: "TR", lat: 39.9334, lon: 32.8597,
    working_on: "Tooling for solo devs who ship alone.",
    stage: "mvp",
    tags: ["devtools", "b2b"],
    website: "https://example.com",
    github: "https://github.com",
  },
  {
    name: "Placeholder Member",
    handle: "@member2",
    city: "Ankara", country: "TR", lat: 39.9334, lon: 32.8597,
    working_on: "Marketplace for second-hand musical instruments.",
    stage: "pre-mvp",
    tags: ["marketplace", "consumer"],
    linkedin: "https://www.linkedin.com",
    instagram: "https://www.instagram.com",
  },
  {
    name: "Placeholder Member",
    handle: "@member3",
    city: "Ankara", country: "TR", lat: 39.9334, lon: 32.8597,
    working_on: "B2B agent that reads procurement RFPs end to end.",
    stage: "live",
    tags: ["ai", "b2b"],
    winner: true,
    website: "https://example.com",
    linkedin: "https://www.linkedin.com",
    github: "https://github.com",
  },
  {
    name: "Placeholder Member",
    handle: "@member4",
    city: "Ankara", country: "TR", lat: 39.9334, lon: 32.8597,
    working_on: "Still figuring it out. Obsessed with offline-first UX.",
    stage: "idea",
    tags: ["consumer"],
    github: "https://github.com",
  },
  {
    name: "Placeholder Member",
    handle: "@member5",
    city: "Ankara", country: "TR", lat: 39.9334, lon: 32.8597,
    working_on: "Regional logistics SaaS, Turkey & MENA.",
    stage: "scaling",
    tags: ["logistics", "b2b"],
    winner: true,
    website: "https://example.com",
  },
  {
    name: "Placeholder Member",
    handle: "@member6",
    city: "Ankara", country: "TR", lat: 39.9334, lon: 32.8597,
    working_on: "Writing software for small indie game studios.",
    stage: "mvp",
    tags: ["gaming", "devtools"],
    github: "https://github.com",
    instagram: "https://www.instagram.com",
  },
];

// — Derived -------------------------------------------------------------------

export const memberCount = members.length;

export type CityBucket = {
  key: string;
  city: string;
  country: string;
  lat: number;
  lon: number;
  count: number;
};

export const cities: CityBucket[] = Object.values(
  members.reduce<Record<string, CityBucket>>((acc, m) => {
    const key = `${m.lat.toFixed(4)},${m.lon.toFixed(4)}`;
    if (!acc[key]) {
      acc[key] = { key, city: m.city, country: m.country, lat: m.lat, lon: m.lon, count: 0 };
    }
    acc[key].count += 1;
    return acc;
  }, {})
);

export const cityCount = cities.length;

// Markers in the shape cobe expects: { location: [lat, lon], size }
// Size scales a little with member count per city.
export type GlobeMarker = {
  location: [number, number];
  size: number;
  label: string;
  count: number;
};

export const markers: GlobeMarker[] = cities.map((c) => ({
  location: [c.lat, c.lon],
  size: 0.06 + Math.min(0.05, c.count * 0.006),
  label: `${c.city}, ${c.country}`,
  count: c.count,
}));

// Per-country tally (used by the globe panel). Flag is derived from the
// 2-letter country code via regional indicator symbols.
export type CountryBucket = {
  code: string;
  name: string;
  flag: string;
  count: number;
};

const countryName: Record<string, string> = {
  TR: "Turkey",
  US: "United States",
  GB: "United Kingdom",
  DE: "Germany",
  NL: "Netherlands",
  FR: "France",
  JP: "Japan",
  SG: "Singapore",
};

function flagFor(code: string): string {
  if (code.length !== 2) return "";
  const A = 0x1f1e6;
  return String.fromCodePoint(
    A + code.charCodeAt(0) - 65,
    A + code.charCodeAt(1) - 65,
  );
}

export const countries: CountryBucket[] = Object.values(
  members.reduce<Record<string, CountryBucket>>((acc, m) => {
    if (!acc[m.country]) {
      acc[m.country] = {
        code: m.country,
        name: countryName[m.country] ?? m.country,
        flag: flagFor(m.country),
        count: 0,
      };
    }
    acc[m.country].count += 1;
    return acc;
  }, {}),
).sort((a, b) => b.count - a.count);

export const countryCount = countries.length;

export const stageLabel: Record<Stage, string> = {
  idea: "Idea",
  "pre-mvp": "Pre-MVP",
  mvp: "MVP",
  live: "Live",
  scaling: "Scaling",
};
