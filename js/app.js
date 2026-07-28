/* ==========================================================================
   app.js - core behavior
   Theme toggle, mobile nav, hero rotator, timeline accordion,
   writing data + rendering, contact form, copy email, tab-title, easter egg.
   Every feature checks that its element exists, so this file is safely
   shared across all pages.
   ========================================================================== */

/* --------------------------------------------------------------------------
   Writing data
   To publish a post: add an object here and create its HTML page in /writing.
   Categories power the filter chips on writing.html automatically.
   -------------------------------------------------------------------------- */
const POSTS = [
  {
    title: "My DJ teacher is a language model",
    excerpt: "Two weeks into teaching myself to DJ with an AI-built 12-week curriculum. Here's the plan, and what's already surprised me.",
    url: "writing/ai-dj-teacher.html",
    date: "2026-07-01",
    category: "Music",
    minutes: 5,
  },
  {
    title: "I rebuilt my entire flight history from my inbox",
    excerpt: "A weekend script, years of airline confirmation emails, and one map that explains where all my money went.",
    url: "writing/flight-history-from-inbox.html",
    date: "2026-05-10",
    category: "Travel",
    minutes: 5,
  },
];

/* Small helpers ----------------------------------------------------------- */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

const formatDate = (iso) =>
  new Date(iso + "T12:00:00").toLocaleDateString("en-US", {
    month: "short", day: "numeric", year: "numeric",
  });

/* --------------------------------------------------------------------------
   Theme toggle (initial theme is set inline in <head> to avoid flash)
   -------------------------------------------------------------------------- */
function initTheme() {
  const btn = $("#themeToggle");
  if (!btn) return;
  btn.addEventListener("click", () => {
    const root = document.documentElement;
    const dark = root.getAttribute("data-theme") === "dark";
    root.setAttribute("data-theme", dark ? "light" : "dark");
    localStorage.setItem("theme", dark ? "light" : "dark");
  });
}

/* --------------------------------------------------------------------------
   Navigation: scrolled state + mobile menu
   -------------------------------------------------------------------------- */
function initNav() {
  const nav = $("#nav");
  if (nav) {
    const onScroll = () => nav.classList.toggle("is-scrolled", scrollY > 12);
    onScroll();
    addEventListener("scroll", onScroll, { passive: true });
  }

  const btn = $("#menuBtn");
  const links = $("#navLinks");
  if (btn && links) {
    btn.addEventListener("click", () => {
      const open = links.classList.toggle("is-open");
      btn.setAttribute("aria-expanded", String(open));
    });
    // Close the menu after choosing a destination
    links.addEventListener("click", (e) => {
      if (e.target.closest("a")) {
        links.classList.remove("is-open");
        btn.setAttribute("aria-expanded", "false");
      }
    });
  }
}

/* --------------------------------------------------------------------------
   Hero rotator: one line that changes every few seconds with a soft fade
   -------------------------------------------------------------------------- */
function initRotator() {
  const el = $("#rotatorWord");
  if (!el) return;

  const words = [
    "Consultant.",
    "Builder.",
    "DJ in training.",
    "Curious about systems.",
    "Learning in public.",
    "Exploring AI.",
  ];
  let i = 0;

  // Respect reduced motion: keep the first word, skip the loop
  if (matchMedia("(prefers-reduced-motion: reduce)").matches) return;

  setInterval(() => {
    el.classList.add("is-leaving");
    setTimeout(() => {
      i = (i + 1) % words.length;
      el.textContent = words[i];
      el.classList.remove("is-leaving");
      el.classList.add("is-entering");
      // Force a frame so the entering state paints before transitioning in
      requestAnimationFrame(() =>
        requestAnimationFrame(() => el.classList.remove("is-entering"))
      );
    }, 500);
  }, 3200);
}

/* --------------------------------------------------------------------------
   Career timeline accordion (animated max-height, correct aria state)
   -------------------------------------------------------------------------- */
function initTimeline() {
  $$(".timeline__toggle").forEach((toggle) => {
    const item = toggle.closest(".timeline__item");
    const panel = item.querySelector(".timeline__panel");

    toggle.addEventListener("click", () => {
      const open = item.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(open));
      panel.style.maxHeight = open ? panel.scrollHeight + "px" : "0px";
    });
  });

  // Items marked .is-open in the HTML should start expanded
  $$(".timeline__item.is-open .timeline__panel").forEach((p) => {
    p.style.maxHeight = p.scrollHeight + "px";
  });

  // Keep open panels sized correctly if the viewport changes
  addEventListener("resize", () => {
    $$(".timeline__item.is-open .timeline__panel").forEach((p) => {
      p.style.maxHeight = p.scrollHeight + "px";
    });
  });
}

/* --------------------------------------------------------------------------
   Writing: render post cards (homepage preview + full index with search)
   -------------------------------------------------------------------------- */
function postCard(post) {
  return `
    <a class="post-card" href="${post.url}">
      <span>
        <h3>${post.title}</h3>
        <p>${post.excerpt}</p>
      </span>
      <span class="post-card__meta">${formatDate(post.date)}<br>${post.category} · ${post.minutes} min</span>
    </a>`;
}

function initRecentPosts() {
  const wrap = $("#recentPosts");
  if (!wrap) return;
  wrap.innerHTML = POSTS.slice(0, 3).map(postCard).join("");
}

function initWritingIndex() {
  const list = $("#postList");
  if (!list) return;

  const search = $("#postSearch");
  const chipsWrap = $("#categoryChips");
  let activeCategory = "All";

  // Build category chips from the data itself
  const categories = ["All", ...new Set(POSTS.map((p) => p.category))];
  chipsWrap.innerHTML = categories
    .map((c) => `<button class="chip${c === "All" ? " is-active" : ""}" data-cat="${c}">${c}</button>`)
    .join("");

  const render = () => {
    const q = (search.value || "").toLowerCase().trim();
    const visible = POSTS.filter((p) => {
      const matchesCat = activeCategory === "All" || p.category === activeCategory;
      const matchesQ = !q || (p.title + " " + p.excerpt).toLowerCase().includes(q);
      return matchesCat && matchesQ;
    });
    list.innerHTML = visible.length
      ? visible.map(postCard).join("")
      : `<p class="post-empty">Nothing matches that yet. Try a different word or category.</p>`;
  };

  chipsWrap.addEventListener("click", (e) => {
    const chip = e.target.closest(".chip");
    if (!chip) return;
    activeCategory = chip.dataset.cat;
    $$(".chip", chipsWrap).forEach((c) => c.classList.toggle("is-active", c === chip));
    render();
  });

  search.addEventListener("input", render);
  render();
}

/* --------------------------------------------------------------------------
   Copy email button
   -------------------------------------------------------------------------- */
function initCopyEmail() {
  const btn = $("#copyEmail");
  if (!btn) return;
  btn.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(btn.dataset.email);
      btn.textContent = "Copied";
      btn.classList.add("is-copied");
      setTimeout(() => {
        btn.textContent = "Copy";
        btn.classList.remove("is-copied");
      }, 2000);
    } catch {
      btn.textContent = "Press Ctrl+C";
    }
  });
}

/* --------------------------------------------------------------------------
   Contact form
   Swap the mailto fallback for a Formspree/Netlify endpoint when hosting.
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = $("#contactForm");
  if (!form) return;
  const status = $("#formStatus");

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    if (!form.checkValidity()) {
      status.textContent = "Add your name, a valid email, and a message first.";
      return;
    }
    const data = new FormData(form);
    const subject = encodeURIComponent(`Hello from ${data.get("name")}`);
    const body = encodeURIComponent(`${data.get("message")}\n\n- ${data.get("name")} (${data.get("email")})`);
    location.href = `mailto:vashisht99kumar@gmail.com?subject=${subject}&body=${body}`;
    status.textContent = "Opening your email app…";
  });
}

/* --------------------------------------------------------------------------
   Animated tab title when the tab loses focus
   -------------------------------------------------------------------------- */
function initTabTitle() {
  const original = document.title;
  addEventListener("visibilitychange", () => {
    document.title = document.hidden ? "◉ Still spinning…" : original;
  });
}

/* --------------------------------------------------------------------------
   Easter egg: the footer record spins when clicked
   -------------------------------------------------------------------------- */
function initVinyl() {
  const vinyl = $("#vinyl");
  if (!vinyl) return;
  vinyl.addEventListener("click", () => {
    vinyl.classList.toggle("is-spinning");
  });
}

/* --------------------------------------------------------------------------
   Loading overlay: fade out once the page is ready
   -------------------------------------------------------------------------- */
function initLoader() {
  const loader = $("#loader");
  if (!loader) return;
  addEventListener("load", () => {
    setTimeout(() => loader.classList.add("is-done"), 250);
  });
  // Safety: never trap the user behind the loader
  setTimeout(() => loader.classList.add("is-done"), 2500);
}

/* Boot -------------------------------------------------------------------- */
document.addEventListener("DOMContentLoaded", () => {
  initTheme();
  initNav();
  initRotator();
  initTimeline();
  initRecentPosts();
  initWritingIndex();
  initCopyEmail();
  initContactForm();
  initTabTitle();
  initVinyl();
  initLoader();
});
