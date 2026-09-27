/* ============================================================
   Site configuration — social profile URLs used everywhere
   on the site (navbar, contact, footer): single place to edit
   ============================================================ */
const SITE_CONFIG = {
  github: "https://github.com/chadha7",
  linkedin: "https://www.linkedin.com/in/chadha-baccari-466b092b6/",
};

/* ============================================================
   Portfolio interactions
   ============================================================ */

document.addEventListener("DOMContentLoaded", () => {
  applySocialLinks();
  initTheme();
  initMobileNav();
  initScrollSpy();
  initRevealOnScroll();
  initBars();
  initNavbarScroll();
  initBackToTop();
  initContactForm();

  document.getElementById("year").textContent = new Date().getFullYear();
});

/* ---------- Social links (GitHub / LinkedIn) ---------- */
function applySocialLinks() {
  document.querySelectorAll("[data-social]").forEach((link) => {
    const url = SITE_CONFIG[link.dataset.social];
    if (url) link.href = url;
  });
}

/* ---------- Theme (dark / light) ---------- */
function initTheme() {
  const toggle = document.getElementById("theme-toggle");
  const stored = localStorage.getItem("theme");

  // Dark is the default theme
  setTheme(stored === "light" ? "light" : "dark");

  toggle.addEventListener("click", () => {
    const next =
      document.documentElement.getAttribute("data-theme") === "dark"
        ? "light"
        : "dark";
    setTheme(next);
    localStorage.setItem("theme", next);
  });

  function setTheme(theme) {
    document.documentElement.setAttribute("data-theme", theme);
  }
}

/* ---------- Mobile navigation ---------- */
function initMobileNav() {
  const hamburger = document.getElementById("hamburger");
  const navLinks = document.getElementById("nav-links");

  hamburger.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    hamburger.classList.toggle("open", open);
    hamburger.setAttribute("aria-expanded", String(open));
  });

  navLinks.querySelectorAll(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      navLinks.classList.remove("open");
      hamburger.classList.remove("open");
      hamburger.setAttribute("aria-expanded", "false");
    });
  });
}

/* ---------- Scroll spy (active nav link) ---------- */
function initScrollSpy() {
  const sections = document.querySelectorAll("section[id]");
  const navLinks = document.querySelectorAll(".nav-link");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    { rootMargin: "-40% 0px -55% 0px" }
  );

  sections.forEach((section) => observer.observe(section));
}

/* ---------- Reveal on scroll ---------- */
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");

  if (!("IntersectionObserver" in window)) {
    items.forEach((item) => item.classList.add("visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  items.forEach((item) => observer.observe(item));
}

/* ---------- Progress bars animate when visible ---------- */
function initBars() {
  const bars = document.querySelectorAll(".bar-fill");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.style.width = entry.target.dataset.width;
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.4 }
  );

  bars.forEach((bar) => observer.observe(bar));
}

/* ---------- Navbar shadow on scroll ---------- */
function initNavbarScroll() {
  const navbar = document.getElementById("navbar");

  function onScroll() {
    navbar.classList.toggle("scrolled", window.scrollY > 10);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

/* ---------- Back to top ---------- */
function initBackToTop() {
  const btn = document.getElementById("back-to-top");

  window.addEventListener(
    "scroll",
    () => {
      btn.classList.toggle("visible", window.scrollY > 500);
    },
    { passive: true }
  );

  btn.addEventListener("click", () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

/* ---------- Contact form ---------- */
function initContactForm() {
  const form = document.getElementById("contact-form");
  const status = document.getElementById("form-status");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const name = form.name.value.trim();
    const email = form.email.value.trim();
    const subject = form.subject.value.trim();
    const message = form.message.value.trim();

    if (!name || !email || !subject || !message) {
      showStatus("Please fill in all fields.", "error");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      showStatus("Please enter a valid email address.", "error");
      return;
    }

    // No backend yet: open the visitor's mail client pre-filled.
    const body = encodeURIComponent(`${message}\n\n— ${name} (${email})`);
    window.location.href =
      `mailto:bakarichadha12@gmail.com?subject=${encodeURIComponent(subject)}&body=${body}`;

    showStatus("Message ready — your email app should have opened. Thanks!", "success");
    form.reset();
  });

  function showStatus(text, type) {
    status.textContent = text;
    status.className = `form-status ${type}`;
    setTimeout(() => {
      status.textContent = "";
      status.className = "form-status";
    }, 6000);
  }
}
