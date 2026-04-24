const CALENDAR_PATH = "/calendar.json";
const KV_KEY = "data";

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    if (url.pathname === CALENDAR_PATH && request.method === "GET" && env.CALENDAR) {
      try {
        const body = await env.CALENDAR.get(KV_KEY);
        if (body) {
          return new Response(body, {
            headers: {
              "content-type": "application/json; charset=utf-8",
              "cache-control": "public, max-age=30, s-maxage=30",
            },
          });
        }
      } catch {
        /* fall through to static */
      }
    }
    return env.ASSETS.fetch(request);
  },
};
