(function (g) {
  const kindMap = { meet: "Meet", session: "Session", demo: "Demo", social: "Social" };
  const months = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  function esc(s) {
    if (s == null || s === "") return "";
    const d = document.createElement("div");
    d.textContent = String(s);
    return d.innerHTML;
  }
  function formatDate(iso) {
    const [y, m, d] = iso.split("T")[0].split("-").map((n) => parseInt(n, 10));
    if (!m || !d) return iso;
    return months[m - 1] + " " + d + ", " + y;
  }
  function upcomingFrom(list, limit) {
    const today = new Date().toISOString().slice(0, 10);
    const sorted = list
      .filter((e) => e.date.slice(0, 10) >= today)
      .sort((a, b) => a.date.localeCompare(b.date));
    if (typeof limit === "number" && limit > 0) return sorted.slice(0, limit);
    return sorted;
  }
  function rowHome(e) {
    const kind = kindMap[e.kind] || e.kind;
    const where =
      e.city || e.country
        ? '<span class="row-where">' +
          esc(e.city || "") +
          (e.country ? "<span>, " + esc(e.country) + "</span>" : "") +
          "</span>"
        : "";
    var tags = "";
    if (e.tags && e.tags.length) {
      tags =
        '<div class="ev-chips" aria-label="Tags">' +
        e.tags.map((t) => '<span class="ev-chip">' + esc(t) + "</span>").join("") +
        "</div>";
    }
    var spot = "";
    if (e.spotlight) {
      var sp = e.spotlight;
      var inner = esc(sp.speaker);
      if (sp.title)
        inner +=
          '<span class="spotlight-sep"> · </span><span class="spotlight-title">' + esc(sp.title) + "</span>";
      if (sp.summary)
        inner +=
          '<span class="spotlight-sep"> — </span><span class="spotlight-summary">' + esc(sp.summary) + "</span>";
      spot = '<p class="row-spotlight">' + inner + "</p>";
    }
    return (
      "<li><div class=\"row-meta\"><time datetime=\"" +
      esc(e.date.slice(0, 10)) +
      '">' +
      esc(formatDate(e.date)) +
      '</time><span class="tag">' +
      esc(kind) +
      '</span></div><div class="row-body"><span class="row-title">' +
      esc(e.title) +
      "</span>" +
      where +
      tags +
      spot +
      "</div></li>"
    );
  }
  function rowPage(e) {
    const kind = kindMap[e.kind] || e.kind;
    var where =
      '<div class="where">' +
      esc(e.city || "") +
      (e.country ? "<span>, " + esc(e.country) + "</span>" : "") +
      "</div>";
    var tags = "";
    if (e.tags && e.tags.length) {
      tags =
        '<div class="ev-chips" aria-label="Tags">' +
        e.tags.map((t) => '<span class="ev-chip">' + esc(t) + "</span>").join("") +
        "</div>";
    }
    var spot = "";
    if (e.spotlight) {
      var sp = e.spotlight;
      var inner = '<span class="spotlight-name">' + esc(sp.speaker) + "</span>";
      if (sp.title)
        inner +=
          '<span class="spotlight-sep"> · </span><span class="spotlight-title">' + esc(sp.title) + "</span>";
      if (sp.summary)
        inner +=
          '<span class="spotlight-sep"> — </span><span class="spotlight-summary">' + esc(sp.summary) + "</span>";
      spot = '<p class="spotlight">' + inner + "</p>";
    }
    var blurb = e.blurb ? '<p class="b">' + esc(e.blurb) + "</p>" : "";
    return (
      "<li><div class=\"meta\"><time datetime=\"" +
      esc(e.date.slice(0, 10)) +
      '">' +
      esc(formatDate(e.date)) +
      '</time><span class="tag">' +
      esc(kind) +
      "</span></div><h3>" +
      esc(e.title) +
      "</h3>" +
      where +
      tags +
      spot +
      blurb +
      "</li>"
    );
  }
  function runRefresh(endpoint, listId, emptyId, limit, asPage) {
    const ul = document.getElementById(listId);
    if (!ul) return;
    const emptyMsg = emptyId ? document.getElementById(emptyId) : null;
    fetch(endpoint, { cache: "no-cache" })
      .then(function (res) {
        if (!res.ok) return;
        return res.json();
      })
      .then(function (data) {
        if (!data) return;
        const list = Array.isArray(data.events) ? data.events : [];
        const rows = upcomingFrom(list, asPage ? undefined : limit);
        if (rows.length === 0) {
          ul.innerHTML = "";
          if (emptyMsg) emptyMsg.hidden = false;
          return;
        }
        if (emptyMsg) emptyMsg.hidden = true;
        const html = asPage ? rows.map(rowPage) : rows.map(rowHome);
        ul.innerHTML = html.join("");
      })
      .catch(function () {});
  }
  g.ffcCalendarRefresh = {
    mountHome: function (opts) {
      const o = opts || {};
      function go() {
        runRefresh(o.endpoint || "/calendar.json", o.listId, o.emptyId, o.limit, false);
      }
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
      else go();
    },
    mountPage: function (opts) {
      const o = opts || {};
      function go() {
        runRefresh(o.endpoint || "/calendar.json", o.listId, o.emptyId, undefined, true);
      }
      if (document.readyState === "loading") document.addEventListener("DOMContentLoaded", go);
      else go();
    },
  };
})(typeof globalThis !== "undefined" ? globalThis : window);
