const body = document.body;
const themeToggle = document.getElementById("themeToggle");
const navToggle = document.getElementById("navToggle");
const navLinks = document.getElementById("navLinks");
const typingText = document.getElementById("typingText");
const yearElement = document.getElementById("year");

const roles = ["Data Analyst", "Software Developer", "Problem Solver"];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function setTheme(theme) {
  body.classList.toggle("light", theme === "light");
  const icon = themeToggle.querySelector("i");
  icon.className = theme === "light" ? "fa-solid fa-sun" : "fa-solid fa-moon";
  localStorage.setItem("theme", theme);
}

(function initTheme() {
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme) {
    setTheme(savedTheme);
    return;
  }

  const prefersLight = window.matchMedia("(prefers-color-scheme: light)").matches;
  setTheme(prefersLight ? "light" : "dark");
})();

themeToggle.addEventListener("click", () => {
  const nextTheme = body.classList.contains("light") ? "dark" : "light";
  setTheme(nextTheme);
});

function typeAnimation() {
  const currentRole = roles[roleIndex];

  if (isDeleting) {
    charIndex -= 1;
  } else {
    charIndex += 1;
  }

  typingText.textContent = currentRole.slice(0, charIndex);

  let speed = isDeleting ? 50 : 95;

  if (!isDeleting && charIndex === currentRole.length) {
    speed = 1400;
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    roleIndex = (roleIndex + 1) % roles.length;
    speed = 380;
  }

  setTimeout(typeAnimation, speed);
}

typeAnimation();

yearElement.textContent = new Date().getFullYear();

navToggle.addEventListener("click", () => {
  navLinks.classList.toggle("open");
});

document.querySelectorAll(".nav-links a").forEach((link) => {
  link.addEventListener("click", () => navLinks.classList.remove("open"));
});

const sections = [...document.querySelectorAll("main section[id]")];
const navAnchors = [...document.querySelectorAll(".nav-links a")];

function updateActiveLink() {
  const scrollY = window.scrollY + 110;
  let currentSection = sections[0]?.id;

  sections.forEach((section) => {
    if (scrollY >= section.offsetTop) {
      currentSection = section.id;
    }
  });

  navAnchors.forEach((anchor) => {
    const active = anchor.getAttribute("href") === `#${currentSection}`;
    anchor.classList.toggle("active", active);
  });
}

window.addEventListener("scroll", updateActiveLink);
updateActiveLink();

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
  const progress = scrollHeight > 0 ? (scrollTop / scrollHeight) * 100 : 0;
  document.body.style.setProperty("--scroll-progress", `${progress}%`);
}

window.addEventListener("scroll", updateScrollProgress, { passive: true });
updateScrollProgress();

const revealElements = document.querySelectorAll(".reveal");
const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const delay = Number(entry.target.getAttribute("data-delay") || 0);
        setTimeout(() => entry.target.classList.add("show"), delay);
        observer.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.18 }
);

revealElements.forEach((element) => observer.observe(element));

const interactiveCards = document.querySelectorAll(
  ".card, .project-card, .stat-card, .timeline-item, .highlight"
);

interactiveCards.forEach((card) => {
  card.addEventListener("mousemove", (event) => {
    if (window.innerWidth <= 760) {
      return;
    }

    const rect = card.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    const rotateY = ((x / rect.width) - 0.5) * 6;
    const rotateX = (0.5 - (y / rect.height)) * 6;

    card.style.setProperty("--tilt-x", `${rotateX}deg`);
    card.style.setProperty("--tilt-y", `${rotateY}deg`);
  });

  card.addEventListener("mouseleave", () => {
    card.style.setProperty("--tilt-x", "0deg");
    card.style.setProperty("--tilt-y", "0deg");
  });
});

const counterElements = document.querySelectorAll(".stat-card h3[data-count]");
const bgParticles = document.getElementById("bgParticles");

function animateCounter(element) {
  const target = Number(element.getAttribute("data-count"));
  const hasDecimals = String(target).includes(".");
  const duration = 1300;
  const start = performance.now();

  function step(timestamp) {
    const progress = Math.min((timestamp - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    const value = target * eased;

    element.textContent = hasDecimals ? value.toFixed(2) : Math.round(value);

    if (progress < 1) {
      requestAnimationFrame(step);
    }
  }

  requestAnimationFrame(step);
}

const counterObserver = new IntersectionObserver(
  (entries, obs) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        obs.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.45 }
);

counterElements.forEach((counter) => counterObserver.observe(counter));

function initBackgroundParticles() {
  if (!bgParticles) {
    return;
  }

  const particleCount = window.innerWidth > 980 ? 34 : 20;

  for (let i = 0; i < particleCount; i += 1) {
    const particle = document.createElement("span");
    particle.className = "particle";

    const x = `${Math.random() * 100}%`;
    const size = `${Math.random() * 6 + 4}px`;
    const dur = `${Math.random() * 9 + 11}s`;
    const delay = `${Math.random() * -18}s`;
    const travel = `${Math.random() * 70 - 35}px`;

    particle.style.setProperty("--x", x);
    particle.style.setProperty("--size", size);
    particle.style.setProperty("--dur", dur);
    particle.style.setProperty("--delay", delay);
    particle.style.setProperty("--travel", travel);

    bgParticles.appendChild(particle);
  }
}

initBackgroundParticles();
