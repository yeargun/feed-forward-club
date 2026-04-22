// Single source of truth for addresses, endpoints and public URLs.
// Site URL and public mailboxes come from PUBLIC_* env — Astro exposes them
// at build time. See .env.example for the list.

const defaultSiteUrl = "https://feedforwardclub.com";
const defaultContactEmail = "hi@feedforwardclub.com";
const defaultApplyEmail = "contact@feedforwardclub.com";

export const siteName = "FeedForwardClub";
export const siteUrl = import.meta.env.PUBLIC_SITE_URL || defaultSiteUrl;
export const siteTagline = "Get feedback. Learn from the best builders. Share your expertise.";
export const siteDescription =
  "A global founders' circle where you share what you're building, get candid feedback from people who've been there, and find your next move. Chapters by city. Circles by obsession.";

export const contactEmail =
  import.meta.env.PUBLIC_CONTACT_EMAIL || defaultContactEmail;
export const applyEmail = import.meta.env.PUBLIC_APPLY_EMAIL || defaultApplyEmail;

// Form POST endpoints — loaded from env at build time. Falsy values cause
// forms to surface a polite "please email us directly" message instead of
// silently failing.
export const applyEndpoint =
  import.meta.env.PUBLIC_APPLY_ENDPOINT ?? "";
export const contactEndpoint =
  import.meta.env.PUBLIC_CONTACT_ENDPOINT ?? "";

// Internal nav targets.
export const applyPath = "/apply";
export const contactPath = "/contact";

// Mailto fallbacks (used on the form pages, and as raw email links).
export const applyMailto =
  `mailto:${applyEmail}` +
  `?subject=${encodeURIComponent("Apply to FeedForwardClub")}`;
export const contactMailto =
  `mailto:${contactEmail}` +
  `?subject=${encodeURIComponent("FeedForwardClub — hello")}`;
