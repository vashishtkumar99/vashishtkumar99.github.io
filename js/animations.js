/* ==========================================================================
   animations.js - scroll-driven animation
   IntersectionObserver reveals, lazy-image fades, and the article
   reading-progress bar. Kept separate from app.js so behavior and motion
   can evolve independently.
   ========================================================================== */

(function () {
  const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ------------------------------------------------------------------------
     Reveal on scroll
     Elements with .reveal or .reveal-stagger get .is-visible when ~15% of
     them enters the viewport. Observed once, then released for performance.
     ------------------------------------------------------------------------ */
  function initReveals() {
    const targets = document.querySelectorAll(".reveal, .reveal-stagger, .timeline__item");
    if (!targets.length) return;

    if (reducedMotion || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" }
    );

    targets.forEach((el) => observer.observe(el));
  }

  /* ------------------------------------------------------------------------
     Lazy images: fade in when loaded (pairs with CSS in animations.css)
     ------------------------------------------------------------------------ */
  function initLazyImages() {
    document.querySelectorAll('img[loading="lazy"]').forEach((img) => {
      if (img.complete) {
        img.classList.add("is-loaded");
      } else {
        img.addEventListener("load", () => img.classList.add("is-loaded"), { once: true });
      }
    });
  }

  /* ------------------------------------------------------------------------
     Reading progress bar (article pages only - needs #progressBar)
     Uses requestAnimationFrame so scroll handling stays smooth.
     ------------------------------------------------------------------------ */
  function initProgressBar() {
    const bar = document.getElementById("progressBar");
    if (!bar) return;

    let ticking = false;
    const update = () => {
      const max = document.documentElement.scrollHeight - innerHeight;
      const pct = max > 0 ? (scrollY / max) * 100 : 0;
      bar.style.width = pct.toFixed(2) + "%";
      ticking = false;
    };

    addEventListener(
      "scroll",
      () => {
        if (!ticking) {
          ticking = true;
          requestAnimationFrame(update);
        }
      },
      { passive: true }
    );
    update();
  }

  document.addEventListener("DOMContentLoaded", () => {
    initReveals();
    initLazyImages();
    initProgressBar();
  });
})();
