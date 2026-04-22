import type { APIRoute } from "astro";
import { siteUrl } from "../data/config";

export const GET: APIRoute = () => {
  const sitemap = new URL("sitemap-index.xml", siteUrl).href;
  const body = `User-agent: *
Allow: /

Sitemap: ${sitemap}
`;
  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
};
