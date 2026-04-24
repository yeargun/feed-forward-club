const DENSE_AT = 10;
const LEAVE_MS = 140;
const MOBILE_BREAKPOINT = 760;
const FULL_WIDTH_MAX = 1280;
const DENSE_WIDTH_MAX = 960;
const DENSE_RADIUS = 15;
const HEADER_EASING = "cubic-bezier(0.22, 1, 0.36, 1)";
const HEADER_DURATION = 280;
const DENSE_SHADOW = "0 10px 28px rgba(17, 21, 28, 0.1)";
const REST_SHADOW = "0 0 0 rgba(17, 21, 28, 0)";

type DropdownRoot = HTMLElement & {
  _leaveTimer?: ReturnType<typeof setTimeout>;
  _onDocClick?: (e: MouseEvent) => void;
};

type HeaderShellStyle = {
  width: string;
  borderRadius: string;
  boxShadow: string;
};

function setExpanded(trigger: HTMLElement, open: boolean) {
  trigger.setAttribute("aria-expanded", open ? "true" : "false");
}

function closeSiblingDropdowns(except: HTMLElement) {
  document.querySelectorAll<DropdownRoot>("[data-nav-dropdown].is-open").forEach(
    (el) => {
      if (el !== except) {
        el.classList.remove("is-open");
        const t = el.querySelector<HTMLElement>("[data-dropdown-trigger]");
        if (t) setExpanded(t, false);
      }
    },
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function getHeaderShellStyle(dense: boolean): HeaderShellStyle {
  const gutter = clamp(window.innerWidth * 0.04, 20, 40);
  const fullWidth = Math.min(window.innerWidth - gutter * 2, FULL_WIDTH_MAX);
  const canFloat = window.innerWidth > MOBILE_BREAKPOINT;
  const denseWidth = canFloat ? Math.min(fullWidth, DENSE_WIDTH_MAX) : fullWidth;

  return {
    width: `${Math.round(dense ? denseWidth : fullWidth)}px`,
    borderRadius: `${dense && canFloat ? DENSE_RADIUS : 0}px`,
    boxShadow: dense && canFloat ? DENSE_SHADOW : REST_SHADOW,
  };
}

function applyHeaderShellStyle(shell: HTMLElement, style: HeaderShellStyle) {
  shell.style.width = style.width;
  shell.style.borderRadius = style.borderRadius;
  shell.style.boxShadow = style.boxShadow;
  shell.style.removeProperty("margin-top");
}

function initDenseHeader(header: HTMLElement) {
  const shell = header.querySelector<HTMLElement>("[data-header-shell]");
  if (!shell) return;

  let isDense = false;
  let currentAnimation: Animation | null = null;

  const syncDenseState = (dense: boolean, animate = true) => {
    const nextStyle = getHeaderShellStyle(dense);
    header.classList.toggle("is-dense", dense);

    if (!animate) {
      applyHeaderShellStyle(shell, nextStyle);
      isDense = dense;
      return;
    }

    if (dense === isDense) {
      applyHeaderShellStyle(shell, nextStyle);
      return;
    }

    isDense = dense;
    currentAnimation?.cancel();
    currentAnimation = null;

    if (
      typeof shell.animate !== "function" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      applyHeaderShellStyle(shell, nextStyle);
      return;
    }

    const current = getComputedStyle(shell);
    currentAnimation = shell.animate(
      [
        {
          width: current.width,
          borderRadius: current.borderRadius,
          boxShadow: current.boxShadow,
        },
        nextStyle,
      ],
      {
        duration: HEADER_DURATION,
        easing: HEADER_EASING,
        fill: "forwards",
      },
    );

    currentAnimation.addEventListener(
      "finish",
      () => {
        applyHeaderShellStyle(shell, nextStyle);
        currentAnimation = null;
      },
      { once: true },
    );
  };

  const onScroll = () => {
    syncDenseState(window.scrollY > DENSE_AT);
  };

  const onResize = () => {
    syncDenseState(isDense, false);
  };

  syncDenseState(window.scrollY > DENSE_AT, false);
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", onResize, { passive: true });
}

function initDropdowns() {
  const roots = document.querySelectorAll<DropdownRoot>("[data-nav-dropdown]");
  const fineHover = window.matchMedia("(hover: hover) and (pointer: fine)");

  roots.forEach((root) => {
    const trigger = root.querySelector<HTMLElement>("[data-dropdown-trigger]");
    if (!trigger) return;

    const open = () => {
      clearTimeout(root._leaveTimer);
      closeSiblingDropdowns(root);
      root.classList.add("is-open");
      setExpanded(trigger, true);
    };

    const close = () => {
      root._leaveTimer = setTimeout(() => {
        root.classList.remove("is-open");
        setExpanded(trigger, false);
      }, LEAVE_MS);
    };

    if (fineHover.matches) {
      root.addEventListener("pointerenter", open);
      root.addEventListener("pointerleave", close);
    } else {
      const toggle = (e: Event) => {
        if ((e.target as HTMLElement).closest("a[href]")) return;
        e.stopPropagation();
        if (root.classList.contains("is-open")) {
          root.classList.remove("is-open");
          setExpanded(trigger, false);
        } else {
          open();
        }
      };
      trigger.addEventListener("click", toggle);
    }
  });

  if (!fineHover.matches) {
    document.addEventListener("click", (e) => {
      const t = e.target as Node;
      document.querySelectorAll<DropdownRoot>("[data-nav-dropdown].is-open").forEach(
        (root) => {
          if (!root.contains(t)) {
            root.classList.remove("is-open");
            const tr = root.querySelector<HTMLElement>("[data-dropdown-trigger]");
            if (tr) setExpanded(tr, false);
          }
        },
      );
    });
  }
}

function initPeopleHints() {
  const wrap = document.querySelector<HTMLElement>("[data-people-hints]");
  if (!wrap) return;

  const defaultId = wrap.dataset.peopleDefault || "groups";
  const root = wrap.closest<HTMLElement>("[data-nav-dropdown]");
  const tabs = Array.from(wrap.querySelectorAll<HTMLElement>("[data-people-tab]"));
  const panes = Array.from(wrap.querySelectorAll<HTMLElement>("[data-people-pane]"));

  const tabIds = tabs.map((t) => t.dataset.peopleTab || "");
  let curId = defaultId;

  const setActive = (nextId: string) => {
    if (nextId === curId) return;

    const curIdx  = tabIds.indexOf(curId);
    const nextIdx = tabIds.indexOf(nextId);
    const dir     = nextIdx > curIdx ? 1 : -1;

    const prev = panes.find((p) => p.dataset.peoplePane === curId);
    const next = panes.find((p) => p.dataset.peoplePane === nextId);

    if (prev && next) {
      prev.style.setProperty("--x-out", `${-dir * 16}px`);
      next.style.setProperty("--x-in",  `${dir * 16}px`);

      prev.classList.add("pane-exiting");
      next.classList.add("pane-entering", "tab-pane-active");

      prev.addEventListener("animationend", () => {
        prev.classList.remove("pane-exiting", "tab-pane-active");
        prev.style.removeProperty("--x-out");
      }, { once: true });

      next.addEventListener("animationend", () => {
        next.classList.remove("pane-entering");
        next.style.removeProperty("--x-in");
      }, { once: true });
    }

    curId = nextId;
  };

  tabs.forEach((tab) => {
    const id = tab.dataset.peopleTab;
    if (!id) return;
    tab.addEventListener("pointerenter", () => setActive(id));
    tab.addEventListener("focus",        () => setActive(id));
  });

  if (root) {
    root.addEventListener("pointerleave", () => setActive(defaultId));
  }
}

function init() {
  const header = document.querySelector<HTMLElement>(".site-header");
  if (header) initDenseHeader(header);
  initDropdowns();
  initPeopleHints();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
