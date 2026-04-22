export type Supporter = {
  /** Program name shown as the heading on each card. */
  name: string;
  /** Parent company or context, shown as a caption under the name. */
  program: string;
  /** Outbound link to the program's own page. */
  url: string;
  /** Short descriptor, shown as meta text on hover-capable cards. */
  note?: string;
  /** Brand-adjacent accent colour used on logo hover and details. */
  accent: string;
  /** Short label for the wordmark row (fallback if logo fails to load). */
  logomark: string;
  /** URL of the brand SVG logo (Simple Icons CDN). */
  logoUrl: string;
};

export const supporters: Supporter[] = [
  {
    name: "AWS Activate",
    program: "Amazon Web Services",
    url: "https://aws.amazon.com/activate/",
    note: "Cloud credits, infrastructure support, enterprise tooling.",
    accent: "#FF9900",
    logomark: "AWS",
    logoUrl: "https://cdn.simpleicons.org/amazonwebservices",
  },
  {
    name: "Google for Startups",
    program: "Google Cloud",
    url: "https://cloud.google.com/startup",
    note: "Cloud credits, technical mentorship, go-to-market resources.",
    accent: "#4285F4",
    logomark: "Google",
    logoUrl: "https://cdn.simpleicons.org/googlecloud",
  },
  {
    name: "Microsoft for Startups",
    program: "Azure",
    url: "https://startups.microsoft.com/",
    note: "Azure credits, developer tooling, enterprise partnerships.",
    accent: "#0078D4",
    logomark: "Microsoft",
    logoUrl: "https://cdn.simpleicons.org/microsoftazure",
  },
  {
    name: "DigitalOcean Hatch",
    program: "DigitalOcean",
    url: "https://www.digitalocean.com/hatch",
    note: "Credits, hosting support, developer community.",
    accent: "#0080FF",
    logomark: "DigitalOcean",
    logoUrl: "https://cdn.simpleicons.org/digitalocean",
  },
  {
    name: "Cloudflare for Startups",
    program: "Cloudflare",
    url: "https://www.cloudflare.com/forstartups/",
    note: "Edge, workers, and security credits.",
    accent: "#F38020",
    logomark: "Cloudflare",
    logoUrl: "https://cdn.simpleicons.org/cloudflare",
  },
  {
    name: "Vercel for Startups",
    program: "Vercel",
    url: "https://vercel.com/startups",
    note: "Platform credits, frontend observability, edge runtime.",
    accent: "#000000",
    logomark: "Vercel",
    logoUrl: "https://cdn.simpleicons.org/vercel",
  },
];
