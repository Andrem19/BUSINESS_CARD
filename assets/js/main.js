const THEME_STORAGE_KEY = "theme";

const statusLabels = {
  planned: "Planned",
  in_progress: "In progress",
  live: "Live"
};

const statusOrder = {
  planned: 1,
  in_progress: 2,
  live: 3
};

const setTheme = (theme) => {
  const root = document.documentElement;
  if (theme) {
    root.setAttribute("data-theme", theme);
  } else {
    root.removeAttribute("data-theme");
  }
};

const getPreferredTheme = () => {
  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === "light" || stored === "dark") {
    return stored;
  }
  return window.matchMedia("(prefers-color-scheme: dark)").matches
    ? "dark"
    : "light";
};

const updateThemeButton = (button, theme) => {
  const isDark = theme === "dark";
  button.setAttribute("aria-pressed", String(isDark));
  button.textContent = isDark ? "Theme: dark" : "Theme: light";
};

const createChip = (label) => {
  const chip = document.createElement("span");
  chip.className = "chip";
  chip.textContent = label;
  return chip;
};

const createProjectCard = (project) => {
  const card = document.createElement("article");
  card.className = "project-card";
  card.setAttribute("role", "listitem");

  const title = document.createElement("h3");
  title.textContent = project.title;

  const tagline = document.createElement("p");
  tagline.textContent = project.tagline;

  const desc = document.createElement("p");
  desc.textContent = project.description;

  const meta = document.createElement("div");
  meta.className = "project-meta";

  const status = document.createElement("span");
  status.className = "status";
  status.textContent = statusLabels[project.status] || "Planned";

  meta.appendChild(status);

  project.stack.forEach((item) => meta.appendChild(createChip(item)));

  const links = document.createElement("div");
  links.className = "project-links";

  if (project.links.live) {
    const liveLink = document.createElement("a");
    liveLink.href = project.links.live;
    liveLink.textContent = "Live";
    liveLink.target = "_blank";
    liveLink.rel = "noopener noreferrer";
    links.appendChild(liveLink);
  }

  if (project.links.repo) {
    const repoLink = document.createElement("a");
    repoLink.href = project.links.repo;
    repoLink.textContent = "Repo";
    repoLink.target = "_blank";
    repoLink.rel = "noopener noreferrer";
    links.appendChild(repoLink);
  }

  card.append(title, tagline, desc, meta);
  if (links.children.length) {
    card.appendChild(links);
  }

  return card;
};

const renderProjects = (container, items) => {
  container.innerHTML = "";
  const sorted = [...items].sort(
    (a, b) => (statusOrder[a.status] || 99) - (statusOrder[b.status] || 99)
  );

  sorted.forEach((project) => container.appendChild(createProjectCard(project)));
};

const setupThemeToggle = () => {
  const button = document.querySelector(".theme-toggle");
  if (!button) return;

  const initialTheme = getPreferredTheme();
  setTheme(initialTheme);
  updateThemeButton(button, initialTheme);

  button.addEventListener("click", () => {
    const currentTheme =
      document.documentElement.getAttribute("data-theme") || "light";
    const nextTheme = currentTheme === "dark" ? "light" : "dark";
    setTheme(nextTheme);
    localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
    updateThemeButton(button, nextTheme);
  });
};

const setupYear = () => {
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
};

const setupCopyEmail = () => {
  const button = document.querySelector(".copy-email");
  if (!button) return;

  button.addEventListener("click", async () => {
    const email = button.dataset.email;
    if (!email) return;

    try {
      await navigator.clipboard.writeText(email);
      button.textContent = "Copied";
      setTimeout(() => {
        button.textContent = "Copy email";
      }, 1500);
    } catch (error) {
      button.textContent = "Failed";
      setTimeout(() => {
        button.textContent = "Copy email";
      }, 1500);
    }
  });
};

const initProjects = () => {
  const featuredContainer = document.getElementById("featured-projects");
  const allContainer = document.getElementById("all-projects");
  if (!featuredContainer || !allContainer || !Array.isArray(projects)) return;

  const featured = projects.filter((project) => project.featured);
  renderProjects(featuredContainer, featured);
  renderProjects(allContainer, projects);
};

document.addEventListener("DOMContentLoaded", () => {
  setupThemeToggle();
  setupYear();
  setupCopyEmail();
  initProjects();
});
