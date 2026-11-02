const toggle = document.querySelector(".nav-toggle");
const sidebar = document.querySelector(".sidebar");
const navLinks = document.querySelectorAll(".nav a");
const year = document.getElementById("year");
const themeSelect = document.getElementById("theme-select");
const themeColor = document.getElementById("theme-color");
const avatarInput = document.getElementById("avatar-input");
const avatarButton = document.getElementById("avatar-button");
const avatarPhoto = document.getElementById("avatar-photo");
const avatarFallback = document.getElementById("avatar-fallback");
const avatarRemove = document.getElementById("avatar-remove");
const avatarWrap = document.querySelector(".avatar");
const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

if (year) {
  year.textContent = new Date().getFullYear();
}

const setTheme = (theme) => {
  const next = theme === "light" ? "light" : "dark";
  document.documentElement.setAttribute("data-theme", next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {}
  if (themeColor) {
    themeColor.setAttribute("content", next === "light" ? "#eef6fa" : "#04111c");
  }
  if (themeSelect) themeSelect.value = next;
};

themeSelect?.addEventListener("change", () => setTheme(themeSelect.value));
themeSelect?.addEventListener("click", (event) => event.stopPropagation());

setTheme(document.documentElement.getAttribute("data-theme") || "dark");

const showAvatar = (src) => {
  if (!avatarPhoto || !avatarFallback) return;
  if (!src) {
    avatarPhoto.hidden = true;
    avatarPhoto.removeAttribute("src");
    avatarFallback.hidden = false;
    avatarButton?.classList.remove("has-photo");
    avatarWrap?.classList.remove("show-remove");
    if (avatarRemove) avatarRemove.hidden = true;
    return;
  }
  avatarPhoto.src = src;
  avatarPhoto.hidden = false;
  avatarFallback.hidden = true;
  avatarButton?.classList.add("has-photo");
  if (avatarRemove) avatarRemove.hidden = false;
};

const saveAvatar = (dataUrl) => {
  try {
    localStorage.setItem("avatar", dataUrl);
  } catch (e) {}
  showAvatar(dataUrl);
};

const loadAvatar = () => {
  try {
    const stored = localStorage.getItem("avatar");
    if (stored) {
      showAvatar(stored);
      return;
    }
  } catch (e) {}
  const fallback = "assets/profile.jpg";
  const probe = new Image();
  probe.onload = () => showAvatar(fallback);
  probe.onerror = () => showAvatar(null);
  probe.src = fallback;
};

avatarButton?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  const canHover = window.matchMedia("(hover: hover)").matches;
  if (avatarButton.classList.contains("has-photo") && !canHover && !avatarWrap?.classList.contains("show-remove")) {
    avatarWrap?.classList.add("show-remove");
    return;
  }
  avatarInput?.click();
});

avatarRemove?.addEventListener("click", (event) => {
  event.preventDefault();
  event.stopPropagation();
  try {
    localStorage.removeItem("avatar");
  } catch (e) {}
  showAvatar(null);
});

avatarInput?.addEventListener("change", () => {
  const file = avatarInput.files?.[0];
  if (!file || !file.type.startsWith("image/")) return;
  const reader = new FileReader();
  reader.onload = () => {
    const image = new Image();
    image.onload = () => {
      const size = 256;
      const canvas = document.createElement("canvas");
      canvas.width = size;
      canvas.height = size;
      const ctx = canvas.getContext("2d");
      const min = Math.min(image.width, image.height);
      const sx = (image.width - min) / 2;
      const sy = (image.height - min) / 2;
      ctx.drawImage(image, sx, sy, min, min, 0, 0, size, size);
      saveAvatar(canvas.toDataURL("image/jpeg", 0.86));
    };
    image.src = String(reader.result);
  };
  reader.readAsDataURL(file);
  avatarInput.value = "";
});

loadAvatar();

const setMenu = (open) => {
  sidebar.classList.toggle("open", open);
  toggle?.setAttribute("aria-expanded", String(open));
  if (toggle) toggle.textContent = open ? "Close" : "Menu";
};

toggle?.addEventListener("click", (event) => {
  event.stopPropagation();
  setMenu(!sidebar.classList.contains("open"));
});

navLinks.forEach((link) => {
  link.addEventListener("click", () => setMenu(false));
});

document.addEventListener("click", (event) => {
  if (!sidebar.contains(event.target)) setMenu(false);
  if (avatarWrap && !avatarWrap.contains(event.target)) {
    avatarWrap.classList.remove("show-remove");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") setMenu(false);
});

const setActive = () => {
  const fromTop = window.scrollY + 120;
  const visible = [...document.querySelectorAll("section[id]")].filter((section) => !section.hidden);
  let current = visible[0]?.id;
  for (const section of visible) {
    if (section.offsetTop <= fromTop) current = section.id;
  }
  navLinks.forEach((link) => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
};

window.addEventListener("scroll", setActive, { passive: true });
setActive();

const bindFlip = () => {
  document.querySelectorAll(".flip-card").forEach((card) => {
    card.onclick = (event) => {
      if (event.target.closest("a")) return;
      card.classList.toggle("is-flipped");
    };
    card.onkeydown = (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        card.classList.toggle("is-flipped");
      }
    };
    card.tabIndex = 0;
  });
};

const bindTilt = () => {
  if (reduceMotion) return;
  document.querySelectorAll("[data-tilt]").forEach((card) => {
    card.onmousemove = (event) => {
      const rect = card.getBoundingClientRect();
      const x = (event.clientX - rect.left) / rect.width - 0.5;
      const y = (event.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `translateY(-8px) rotateX(${(-y * 10).toFixed(2)}deg) rotateY(${(x * 12).toFixed(2)}deg) scale(1.03)`;
    };
    card.onmouseleave = () => {
      card.style.transform = "";
    };
  });
};

const canvas = document.getElementById("particles");
if (canvas && !reduceMotion) {
  const ctx = canvas.getContext("2d");
  const dots = [];
  const count = 46;

  const resize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  };

  const seed = () => {
    dots.length = 0;
    for (let i = 0; i < count; i += 1) {
      dots.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 1.8 + 0.4,
        s: Math.random() * 0.35 + 0.08,
        a: Math.random() * 0.45 + 0.12,
      });
    }
  };

  const draw = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const light = document.documentElement.getAttribute("data-theme") === "light";
    dots.forEach((dot) => {
      dot.y -= dot.s;
      if (dot.y < -4) {
        dot.y = canvas.height + 4;
        dot.x = Math.random() * canvas.width;
      }
      ctx.beginPath();
      ctx.fillStyle = light ? `rgba(15, 80, 100, ${dot.a})` : `rgba(186, 244, 255, ${dot.a})`;
      ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2);
      ctx.fill();
    });
    requestAnimationFrame(draw);
  };

  resize();
  seed();
  draw();
  window.addEventListener("resize", () => {
    resize();
    seed();
  });
}

const STORAGE_KEY = "siteData";
const EDITOR_KEY = "siteEditor";
const editorRoot = document.getElementById("editor-root");
const editorStatus = document.getElementById("editor-status");
const updateSection = document.getElementById("update");
const updateNav = document.getElementById("update-nav");
let site = {};
let editorReady = false;

const readEditorFlag = () => {
  const editParam = new URLSearchParams(window.location.search).get("edit");
  if (editParam === "0" || editParam === "false") {
    try {
      localStorage.removeItem(EDITOR_KEY);
    } catch (e) {}
    return false;
  }
  if (editParam === "1" || editParam === "true") {
    try {
      localStorage.setItem(EDITOR_KEY, "1");
    } catch (e) {}
    return true;
  }
  try {
    return localStorage.getItem(EDITOR_KEY) === "1";
  } catch (e) {
    return false;
  }
};

const setEditorVisible = (open) => {
  if (updateSection) updateSection.hidden = !open;
  if (updateNav) updateNav.hidden = !open;
  try {
    if (open) localStorage.setItem(EDITOR_KEY, "1");
    else localStorage.removeItem(EDITOR_KEY);
  } catch (e) {}
  if (open && !editorReady && window.SITE_DEFAULTS) {
    buildEditor();
    bindEditor();
    editorReady = true;
  }
  if (open && window.location.hash === "#update") {
    updateSection?.scrollIntoView();
  }
};

const clone = (value) => JSON.parse(JSON.stringify(value));

const escapeHtml = (value) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const formatText = (value) =>
  escapeHtml(value).replace(/\*\*(.+?)\*\*/g, "<strong>$1</strong>");

const splitList = (value) =>
  String(value || "")
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter(Boolean);

const setText = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.textContent = value ?? "";
};

const setHtml = (id, value) => {
  const el = document.getElementById(id);
  if (el) el.innerHTML = formatText(value ?? "");
};

const setHref = (id, href) => {
  const el = document.getElementById(id);
  if (el && href != null) el.setAttribute("href", href);
};

const displayUrl = (url) =>
  String(url || "")
    .replace(/^https?:\/\/(www\.)?/i, "")
    .replace(/\/$/, "");

const loadSite = () => {
  const defaults = clone(window.SITE_DEFAULTS || {});
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) return JSON.parse(stored);
  } catch (e) {}
  return defaults;
};

const persistSite = (data) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (e) {
    showStatus("Could not save in this browser. Download data.js instead.", true);
  }
};

const showStatus = (message, isError) => {
  if (!editorStatus) return;
  editorStatus.hidden = false;
  editorStatus.textContent = message;
  editorStatus.classList.toggle("is-error", Boolean(isError));
};

const emptyProject = () => ({
  kicker: "",
  title: "New project",
  summary: "",
  backTitle: "",
  details: "",
  tags: [],
  status: "",
  links: [
    { label: "GitHub", url: "" },
    { label: "Live / Play Store", url: "" },
  ],
});

const renderSite = () => {
  const p = site.profile || {};
  document.title = `${p.name || "Portfolio"} | Software Development Engineer`;
  setText("brand-name", p.name);
  setText("brand-role", p.role);
  setText("availability-text", p.availability);
  setText("sidebar-location", p.location);
  setHref("social-linkedin", p.linkedin);
  setHref("social-github", p.github);
  setHref("social-email", `mailto:${p.email || ""}`);
  setHref("social-whatsapp", `https://wa.me/${String(p.whatsapp || "").replace(/\D/g, "")}`);
  if (avatarFallback) avatarFallback.textContent = p.initials || "MS";

  const hero = site.hero || {};
  setText("hero-eyebrow", hero.eyebrow);
  setText("hero-headline", hero.headline);
  setHtml("hero-lede", hero.lede);
  setHref("hero-resume", p.resumeUrl);
  setHref("hero-email", `mailto:${p.email || ""}`);

  const stats = document.getElementById("stats-grid");
  if (stats) {
    stats.innerHTML = (site.stats || [])
      .map(
        (item) =>
          `<div class="pop-card" data-tilt><dt>${escapeHtml(item.label)}</dt><dd>${escapeHtml(item.value)}</dd></div>`
      )
      .join("");
  }

  const about = document.getElementById("about-card");
  if (about) {
    about.innerHTML = (site.about || []).map((para) => `<p>${formatText(para)}</p>`).join("");
  }

  const skills = document.getElementById("skill-groups");
  if (skills) {
    skills.innerHTML = (site.skills || [])
      .map(
        (group) =>
          `<article class="glass pop-card" data-tilt><h3>${escapeHtml(group.group)}</h3><ul>${(group.items || [])
            .map((item) => `<li>${escapeHtml(item)}</li>`)
            .join("")}</ul></article>`
      )
      .join("");
  }

  const timeline = document.getElementById("timeline");
  if (timeline) {
    timeline.innerHTML = (site.experience || [])
      .map(
        (job) =>
          `<li class="glass pop-card"><p class="when">${escapeHtml(job.when)}</p><h3>${escapeHtml(job.title)}</h3><p class="org">${escapeHtml(job.org)}</p><p>${escapeHtml(job.body)}</p></li>`
      )
      .join("");
  }

  setText("projects-note", site.projectsNote);
  const grid = document.getElementById("project-grid");
  if (grid) {
    grid.innerHTML = (site.projects || [])
      .map((project) => {
        const links = (project.links || []).filter((link) => link.url && link.label);
        const linkHtml = links.length
          ? `<div class="project-links">${links
              .map(
                (link) =>
                  `<a class="btn btn-primary" href="${escapeHtml(link.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(link.label)}</a>`
              )
              .join("")}</div>`
          : "";
        const statusHtml = project.status
          ? `<p class="project-status">${escapeHtml(project.status)}</p>`
          : "";
        return `<article class="flip-card" aria-label="Project card, flips for details">
          <div class="flip-inner">
            <div class="flip-face flip-front">
              <p class="project-kicker">${escapeHtml(project.kicker)}</p>
              <h3>${escapeHtml(project.title)}</h3>
              <p>${escapeHtml(project.summary)}</p>
            </div>
            <div class="flip-face flip-back">
              <h3>${escapeHtml(project.backTitle || project.title)}</h3>
              <p>${escapeHtml(project.details)}</p>
              <ul class="tags">${(project.tags || []).map((tag) => `<li>${escapeHtml(tag)}</li>`).join("")}</ul>
              ${statusHtml}
              ${linkHtml}
            </div>
          </div>
        </article>`;
      })
      .join("");
  }

  const github = document.getElementById("github-list");
  if (github) {
    github.innerHTML = (site.githubRepos || [])
      .map(
        (repo) =>
          `<li><a href="${escapeHtml(repo.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(repo.name)}</a></li>`
      )
      .join("");
  }

  const education = document.getElementById("education-list");
  if (education) {
    education.innerHTML = (site.education || [])
      .map((item) => `<p>${formatText(item.line)}</p>`)
      .join("");
  }

  const certs = document.getElementById("cert-list");
  if (certs) {
    certs.innerHTML = (site.certifications || [])
      .map((item) => {
        if (item.url) {
          return `<li><a href="${escapeHtml(item.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(item.name)}</a></li>`;
        }
        return `<li>${escapeHtml(item.name)}</li>`;
      })
      .join("");
  }

  setText("contact-note", site.contactNote);
  setText("contact-email", p.email);
  setHref("contact-email", `mailto:${p.email || ""}`);
  setText("contact-phone", p.phone);
  setHref("contact-phone", `tel:${String(p.phone || "").replace(/\s/g, "")}`);
  setText("contact-whatsapp", p.phone);
  setHref("contact-whatsapp", `https://wa.me/${String(p.whatsapp || "").replace(/\D/g, "")}`);
  setText("contact-linkedin", displayUrl(p.linkedin));
  setHref("contact-linkedin", p.linkedin);
  setText("contact-github", displayUrl(p.github));
  setHref("contact-github", p.github);
  setText("contact-location", p.location);
  setHref(
    "contact-hire",
    `mailto:${p.email || ""}?subject=${encodeURIComponent("Role for " + (p.name || ""))}`
  );
  setHref("contact-resume", p.resumeUrl);
  setText("footer-name", p.name);
  setText("footer-note", p.footer);

  bindFlip();
  bindTilt();
};

const field = (label, path, value, type = "text") =>
  `<label class="editor-field"><span>${label}</span>${
    type === "textarea"
      ? `<textarea data-path="${path}" rows="4">${escapeHtml(value)}</textarea>`
      : `<input data-path="${path}" type="${type}" value="${escapeHtml(value)}" />`
  }</label>`;

const buildEditor = () => {
  if (!editorRoot) return;
  const p = site.profile || {};
  const hero = site.hero || {};

  editorRoot.innerHTML = `
    <details class="editor-block" open>
      <summary>Profile and contact</summary>
      <div class="editor-grid">
        ${field("Name", "profile.name", p.name)}
        ${field("Role", "profile.role", p.role)}
        ${field("Initials", "profile.initials", p.initials)}
        ${field("Availability", "profile.availability", p.availability)}
        ${field("Location", "profile.location", p.location)}
        ${field("Email", "profile.email", p.email, "email")}
        ${field("Phone", "profile.phone", p.phone)}
        ${field("WhatsApp number", "profile.whatsapp", p.whatsapp)}
        ${field("LinkedIn URL", "profile.linkedin", p.linkedin, "url")}
        ${field("GitHub URL", "profile.github", p.github, "url")}
        ${field("Resume file / URL", "profile.resumeUrl", p.resumeUrl)}
        ${field("Footer note", "profile.footer", p.footer)}
      </div>
    </details>

    <details class="editor-block" open>
      <summary>Hero and about</summary>
      <div class="editor-grid">
        ${field("Eyebrow", "hero.eyebrow", hero.eyebrow)}
        ${field("Headline", "hero.headline", hero.headline, "textarea")}
        ${field("Intro", "hero.lede", hero.lede, "textarea")}
        ${field("Contact note", "contactNote", site.contactNote, "textarea")}
        ${field("Projects note", "projectsNote", site.projectsNote, "textarea")}
        <label class="editor-field editor-wide">
          <span>About (blank line between paragraphs). Use **bold** for emphasis.</span>
          <textarea data-about rows="10">${escapeHtml((site.about || []).join("\n\n"))}</textarea>
        </label>
      </div>
    </details>

    <details class="editor-block">
      <summary>Stats</summary>
      <div id="stats-editor">
        ${(site.stats || [])
          .map(
            (item, index) =>
              `<div class="editor-row" data-item="stat">
                <input data-key="label" value="${escapeHtml(item.label)}" placeholder="Label" />
                <input data-key="value" value="${escapeHtml(item.value)}" placeholder="Value" />
                <button type="button" class="btn btn-ghost" data-remove="stat" data-index="${index}">Remove</button>
              </div>`
          )
          .join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="add-stat">Add stat</button>
    </details>

    <details class="editor-block">
      <summary>Skills</summary>
      <div id="skills-editor">
        ${(site.skills || [])
          .map(
            (group, index) =>
              `<div class="editor-card" data-item="skill">
                <input data-key="group" value="${escapeHtml(group.group)}" placeholder="Group name" />
                <textarea data-key="items" rows="3" placeholder="Comma-separated skills">${escapeHtml((group.items || []).join(", "))}</textarea>
                <button type="button" class="btn btn-ghost" data-remove="skill" data-index="${index}">Remove group</button>
              </div>`
          )
          .join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="add-skill">Add skill group</button>
    </details>

    <details class="editor-block">
      <summary>Experience</summary>
      <div id="exp-editor">
        ${(site.experience || [])
          .map(
            (job, index) =>
              `<div class="editor-card" data-item="job">
                <input data-key="when" value="${escapeHtml(job.when)}" placeholder="Dates · tenure · location" />
                <input data-key="title" value="${escapeHtml(job.title)}" placeholder="Title" />
                <input data-key="org" value="${escapeHtml(job.org)}" placeholder="Company" />
                <textarea data-key="body" rows="3">${escapeHtml(job.body)}</textarea>
                <button type="button" class="btn btn-ghost" data-remove="job" data-index="${index}">Remove role</button>
              </div>`
          )
          .join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="add-job">Add role</button>
    </details>

    <details class="editor-block" open>
      <summary>Projects and links</summary>
      <p class="section-note">Add GitHub, Play Store, live demo, or write-up URLs for each project. Empty URLs stay hidden.</p>
      <div id="projects-editor">
        ${(site.projects || [])
          .map(
            (project, index) =>
              `<div class="editor-card" data-item="project">
                <h3>Project ${index + 1}</h3>
                <input data-key="kicker" value="${escapeHtml(project.kicker)}" placeholder="Kicker, e.g. Current · CBSL" />
                <input data-key="title" value="${escapeHtml(project.title)}" placeholder="Card title" />
                <input data-key="backTitle" value="${escapeHtml(project.backTitle)}" placeholder="Flip-side title" />
                <textarea data-key="summary" rows="2" placeholder="Front summary">${escapeHtml(project.summary)}</textarea>
                <textarea data-key="details" rows="3" placeholder="Flip-side details">${escapeHtml(project.details)}</textarea>
                <input data-key="tags" value="${escapeHtml((project.tags || []).join(", "))}" placeholder="Tags, comma-separated" />
                <input data-key="status" value="${escapeHtml(project.status)}" placeholder="Status if there is no public link" />
                <p class="editor-label">Links</p>
                ${(project.links || [])
                  .map(
                    (link) =>
                      `<div class="editor-row" data-item="link">
                        <input data-key="label" value="${escapeHtml(link.label)}" placeholder="Label, e.g. GitHub" />
                        <input data-key="url" value="${escapeHtml(link.url)}" placeholder="https://..." />
                        <button type="button" class="btn btn-ghost" data-remove-link>Remove</button>
                      </div>`
                  )
                  .join("")}
                <div class="editor-inline">
                  <button type="button" class="btn btn-ghost" data-add-link>Add link</button>
                  <button type="button" class="btn btn-ghost" data-remove="project" data-index="${index}">Remove project</button>
                </div>
              </div>`
          )
          .join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="add-project">Add project</button>
    </details>

    <details class="editor-block">
      <summary>Public GitHub repos</summary>
      <div id="repos-editor">
        ${(site.githubRepos || [])
          .map(
            (repo, index) =>
              `<div class="editor-row" data-item="repo">
                <input data-key="name" value="${escapeHtml(repo.name)}" placeholder="Repo name" />
                <input data-key="url" value="${escapeHtml(repo.url)}" placeholder="https://github.com/..." />
                <button type="button" class="btn btn-ghost" data-remove="repo" data-index="${index}">Remove</button>
              </div>`
          )
          .join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="add-repo">Add repo</button>
    </details>

    <details class="editor-block">
      <summary>Education and certifications</summary>
      <div id="edu-editor">
        ${(site.education || [])
          .map(
            (item, index) =>
              `<div class="editor-row" data-item="edu">
                <input data-key="line" value="${escapeHtml(item.line)}" placeholder="**Degree** · School · Year" />
                <button type="button" class="btn btn-ghost" data-remove="edu" data-index="${index}">Remove</button>
              </div>`
          )
          .join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="add-edu">Add education</button>
      <div id="certs-editor">
        ${(site.certifications || [])
          .map(
            (item, index) =>
              `<div class="editor-row" data-item="cert">
                <input data-key="name" value="${escapeHtml(item.name)}" placeholder="Certificate name" />
                <input data-key="url" value="${escapeHtml(item.url)}" placeholder="Certificate URL (optional)" />
                <button type="button" class="btn btn-ghost" data-remove="cert" data-index="${index}">Remove</button>
              </div>`
          )
          .join("")}
      </div>
      <button type="button" class="btn btn-ghost" id="add-cert">Add certification</button>
    </details>
  `;
};

const readEditor = () => {
  const next = clone(site);
  next.profile = next.profile || {};
  next.hero = next.hero || {};
  document.querySelectorAll("[data-path]").forEach((el) => {
    const parts = el.dataset.path.split(".");
    if (parts.length === 1) {
      next[parts[0]] = el.value;
      return;
    }
    next[parts[0]] = next[parts[0]] || {};
    next[parts[0]][parts[1]] = el.value;
  });
  const about = document.querySelector("[data-about]");
  if (about) {
    next.about = about.value
      .split(/\n\s*\n/)
      .map((para) => para.trim())
      .filter(Boolean);
  }
  next.stats = [...document.querySelectorAll("[data-item='stat']")].map((row) => ({
    label: row.querySelector("[data-key='label']")?.value.trim() || "",
    value: row.querySelector("[data-key='value']")?.value.trim() || "",
  }));
  next.skills = [...document.querySelectorAll("[data-item='skill']")].map((card) => ({
    group: card.querySelector("[data-key='group']")?.value.trim() || "",
    items: splitList(card.querySelector("[data-key='items']")?.value),
  }));
  next.experience = [...document.querySelectorAll("[data-item='job']")].map((card) => ({
    when: card.querySelector("[data-key='when']")?.value.trim() || "",
    title: card.querySelector("[data-key='title']")?.value.trim() || "",
    org: card.querySelector("[data-key='org']")?.value.trim() || "",
    body: card.querySelector("[data-key='body']")?.value.trim() || "",
  }));
  next.projects = [...document.querySelectorAll("[data-item='project']")].map((card) => ({
    kicker: card.querySelector("[data-key='kicker']")?.value.trim() || "",
    title: card.querySelector("[data-key='title']")?.value.trim() || "",
    backTitle: card.querySelector("[data-key='backTitle']")?.value.trim() || "",
    summary: card.querySelector("[data-key='summary']")?.value.trim() || "",
    details: card.querySelector("[data-key='details']")?.value.trim() || "",
    tags: splitList(card.querySelector("[data-key='tags']")?.value),
    status: card.querySelector("[data-key='status']")?.value.trim() || "",
    links: [...card.querySelectorAll("[data-item='link']")].map((row) => ({
      label: row.querySelector("[data-key='label']")?.value.trim() || "",
      url: row.querySelector("[data-key='url']")?.value.trim() || "",
    })),
  }));
  next.githubRepos = [...document.querySelectorAll("[data-item='repo']")].map((row) => ({
    name: row.querySelector("[data-key='name']")?.value.trim() || "",
    url: row.querySelector("[data-key='url']")?.value.trim() || "",
  }));
  next.education = [...document.querySelectorAll("[data-item='edu']")].map((row) => ({
    line: row.querySelector("[data-key='line']")?.value.trim() || "",
  }));
  next.certifications = [...document.querySelectorAll("[data-item='cert']")].map((row) => ({
    name: row.querySelector("[data-key='name']")?.value.trim() || "",
    url: row.querySelector("[data-key='url']")?.value.trim() || "",
  }));
  return next;
};

const applySite = (next, message) => {
  site = next;
  persistSite(site);
  renderSite();
  buildEditor();
  showStatus(message || "Saved on this browser.");
};

const downloadData = () => {
  site = readEditor();
  persistSite(site);
  renderSite();
  const blob = new Blob([`window.SITE_DEFAULTS = ${JSON.stringify(site, null, 2)};\n`], {
    type: "text/javascript",
  });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = "data.js";
  a.click();
  URL.revokeObjectURL(url);
  showStatus("Downloaded data.js. Replace portfolio/data.js, then upload to GitHub Pages.");
};

const bindEditor = () => {
  if (bindEditor.bound) return;
  bindEditor.bound = true;

  document.getElementById("editor-save")?.addEventListener("click", () => {
    applySite(readEditor(), "Saved on this browser. Download data.js when you want this live on GitHub Pages.");
  });
  document.getElementById("editor-download")?.addEventListener("click", downloadData);
  document.getElementById("editor-reset")?.addEventListener("click", () => {
    if (!confirm("Reset all edits to the original site copy?")) return;
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    applySite(clone(window.SITE_DEFAULTS), "Reset to original content.");
  });
  document.getElementById("editor-hide")?.addEventListener("click", () => {
    setEditorVisible(false);
    const url = new URL(window.location.href);
    url.searchParams.delete("edit");
    if (url.hash === "#update") url.hash = "";
    history.replaceState({}, "", url.pathname + url.search + url.hash);
  });
  document.getElementById("editor-import")?.addEventListener("change", (event) => {
    const file = event.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const text = String(reader.result).trim();
        const json = text.startsWith("{") ? text : text.replace(/^window\.SITE_DEFAULTS\s*=\s*/, "").replace(/;?\s*$/, "");
        applySite(JSON.parse(json), "Imported. Saved on this browser.");
      } catch (e) {
        showStatus("Import failed. Use a data.js or JSON file from Download.", true);
      }
    };
    reader.readAsText(file);
    event.target.value = "";
  });

  editorRoot?.addEventListener("click", (event) => {
    const addLink = event.target.closest("[data-add-link]");
    const removeLink = event.target.closest("[data-remove-link]");
    const remove = event.target.closest("[data-remove]");
    const addStat = event.target.closest("#add-stat");
    const addSkill = event.target.closest("#add-skill");
    const addJob = event.target.closest("#add-job");
    const addProject = event.target.closest("#add-project");
    const addRepo = event.target.closest("#add-repo");
    const addEdu = event.target.closest("#add-edu");
    const addCert = event.target.closest("#add-cert");

    if (addLink) {
      const card = addLink.closest("[data-item='project']");
      const index = [...editorRoot.querySelectorAll("[data-item='project']")].indexOf(card);
      site = readEditor();
      if (index >= 0) {
        site.projects[index].links = site.projects[index].links || [];
        site.projects[index].links.push({ label: "Link", url: "" });
      }
      buildEditor();
      return;
    }
    if (removeLink) {
      const row = removeLink.closest("[data-item='link']");
      const card = removeLink.closest("[data-item='project']");
      const index = [...editorRoot.querySelectorAll("[data-item='project']")].indexOf(card);
      const linkIndex = [...card.querySelectorAll("[data-item='link']")].indexOf(row);
      site = readEditor();
      if (index >= 0 && linkIndex >= 0) site.projects[index].links.splice(linkIndex, 1);
      buildEditor();
      return;
    }
    if (remove) {
      const kind = remove.getAttribute("data-remove");
      const index = Number(remove.getAttribute("data-index"));
      site = readEditor();
      const map = {
        stat: "stats",
        skill: "skills",
        job: "experience",
        project: "projects",
        repo: "githubRepos",
        edu: "education",
        cert: "certifications",
      };
      const key = map[kind];
      if (key && Array.isArray(site[key])) site[key].splice(index, 1);
      buildEditor();
      return;
    }
    if (addStat) {
      site = readEditor();
      site.stats.push({ label: "Label", value: "Value" });
      buildEditor();
    } else if (addSkill) {
      site = readEditor();
      site.skills.push({ group: "New group", items: [] });
      buildEditor();
    } else if (addJob) {
      site = readEditor();
      site.experience.push({ when: "", title: "Role", org: "Company", body: "" });
      buildEditor();
    } else if (addProject) {
      site = readEditor();
      site.projects.push(emptyProject());
      buildEditor();
    } else if (addRepo) {
      site = readEditor();
      site.githubRepos.push({ name: "repo", url: "" });
      buildEditor();
    } else if (addEdu) {
      site = readEditor();
      site.education.push({ line: "" });
      buildEditor();
    } else if (addCert) {
      site = readEditor();
      site.certifications.push({ name: "", url: "" });
      buildEditor();
    }
  });
};

if (window.SITE_DEFAULTS) {
  site = loadSite();
  renderSite();
  setEditorVisible(readEditorFlag());
} else {
  bindFlip();
  bindTilt();
}

let footerClicks = 0;
let footerTimer;
document.querySelector("footer")?.addEventListener("click", () => {
  footerClicks += 1;
  window.clearTimeout(footerTimer);
  footerTimer = window.setTimeout(() => {
    footerClicks = 0;
  }, 900);
  if (footerClicks >= 5) {
    footerClicks = 0;
    setEditorVisible(true);
    updateSection?.scrollIntoView({ behavior: "smooth" });
  }
});
