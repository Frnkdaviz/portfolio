/* ─────────────────────────────────────────────────────
   FRANK DAVIS NARH — PORTFOLIO APP
   ───────────────────────────────────────────────────── */

const LS_KEY     = "fdn_portfolio_v2";
const LS_THEME   = "fdn_theme_v2";
const LS_SIDEBAR = "fdn_sidebar_v2";

// NAV ICONS per section id
const NAV_ICONS = {
  home:          `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>`,
  projects:      `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>`,
  simulations:   `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>`,
  skills:        `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>`,
  experience:    `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/></svg>`,
  certifications:`<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>`,
  contact:       `<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`
};

// ── DATA ─────────────────────────────────────────────
let D = loadData();

function loadData() {
  try { const s = localStorage.getItem(LS_KEY); if (s) return JSON.parse(s); } catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function persist() { localStorage.setItem(LS_KEY, JSON.stringify(D)); }

// Ensure sections config exists (handles old data without sections key)
function getSections() {
  if (!D.sections) D.sections = JSON.parse(JSON.stringify(DEFAULT_DATA.sections));
  return D.sections;
}

// ── BUILD PAGE ───────────────────────────────────────
// Inject sections into DOM in order, only if visible
function buildSections() {
  const container = gel("sectionsContainer");
  container.innerHTML = "";
  getSections().forEach(sec => {
    if (!sec.visible) return;
    const tpl = document.getElementById("tpl-" + sec.id);
    if (!tpl) return;
    const clone = tpl.content.cloneNode(true);
    container.appendChild(clone);
  });
}

// ── BUILD NAV ────────────────────────────────────────
function buildNav() {
  const sidebarNav = gel("sidebarNav");
  const topbarNav  = gel("topbarNav");
  const visible    = getSections().filter(s => s.visible);

  sidebarNav.innerHTML = visible.map((s, i) => `
    <a class="nav-link${i === 0 ? " active" : ""}" data-section="${s.id}">
      ${NAV_ICONS[s.id] || ""}
      <span class="nav-label">${s.label}</span>
    </a>`).join("");

  topbarNav.innerHTML = visible.map(s =>
    `<a href="#${s.id}-section">${s.label}</a>`).join("");

  // Re-attach scroll tracking
  attachNavListeners();
}

function attachNavListeners() {
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", () => {
      const sec = link.dataset.section;
      gel(sec + "-section")?.scrollIntoView({ behavior: "smooth" });
    });
  });
}

// ── RENDER ALL ───────────────────────────────────────
function render() {
  buildSections();
  buildNav();

  const p = D.profile;
  setText("sb-name",            p.name);
  setText("sb-role",            p.title);
  setText("hero-tag",           p.heroBadge);
  setHTML("hero-headline",      p.heroHeadline.replace(/\n/g,"<br/>"));
  setText("hero-sub",           p.heroSub);
  setText("stat-exp",           p.yearsExperience);
  setText("stat-nodes",         p.nodesManaged);
  setText("stat-certs-count",   p.certCount);
  setText("ongoingText2",       p.ongoingLearning);
  setText("contact-photo-name", p.name);
  setText("contact-photo-role", p.title);

  renderTools();
  renderProjects();
  renderSimulations();
  renderSkillBoxes();
  renderRoles();
  renderCareer();
  renderExpFull();
  renderCertsFull();
  renderContact();

  setTimeout(animateBars, 150);
  attachScrollSpy();
}

// ── TOOLS ────────────────────────────────────────────
function renderTools() {
  const g = gel("toolsGrid"); if (!g) return;
  g.innerHTML = D.monitoringTools.map(t => {
    const darkBg = t.logoDark === true;
    return `
    <div class="tool-card">
      <div class="tool-logo-wrap${darkBg ? " darkbg-wrap" : ""}">
        <img class="${darkBg ? "tool-logo-darkbg" : "tool-logo"}" src="${esc(t.logo)}" alt="${esc(t.name)}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
        <span class="tool-logo-fallback" style="display:none">${esc(t.name)}</span>
      </div>
      <div class="tool-name">${esc(t.name)}</div>
      <div class="tool-desc">${esc(t.desc)}</div>
    </div>`;
  }).join("");
}

// ── PROJECTS ─────────────────────────────────────────
function renderProjects() {
  const g = gel("projectsGrid"); if (!g) return;
  if (!D.projects || !D.projects.length) {
    g.innerHTML = `<p style="color:var(--text2);font-size:.88rem">No projects yet — add them in the admin panel.</p>`;
    return;
  }
  g.innerHTML = D.projects.map((p, i) => {
    // prefer uploaded base64, fall back to URL, fall back to placeholder
    const mediaSrc = p.imageData || p.image || "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80";
    const isVideo  = (p.imageType||"").startsWith("video/");
    const mediaEl  = isVideo
      ? `<video class="project-img" src="${mediaSrc}" autoplay muted loop playsinline></video>`
      : `<img class="project-img" src="${mediaSrc}" alt="${esc(p.title)}"
            onerror="this.src='https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&q=80'"/>`;
    return `
    <div class="project-card">
      <div class="project-img-wrap">${mediaEl}</div>
      <div class="project-body">
        <div class="project-title">${esc(p.title)}</div>
        <div class="project-desc-wrap" id="pdesc-${i}">
          <div class="project-desc project-desc-clamped" id="pdesc-text-${i}">${esc(p.desc)}</div>
          <button class="project-expand-btn" id="pdesc-btn-${i}" onclick="toggleProjectDesc(${i})">
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg>
            Read more
          </button>
        </div>
        <div class="project-tags">${(p.tags||[]).map(t=>`<span class="project-tag">${esc(t)}</span>`).join("")}</div>
        ${p.link ? `<a class="project-link" href="${esc(p.link)}" target="_blank" rel="noopener">
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
          View Project</a>` : ""}
      </div>
    </div>`;
  }).join("");
}

function toggleProjectDesc(i) {
  const text = gel(`pdesc-text-${i}`);
  const btn  = gel(`pdesc-btn-${i}`);
  if (!text) return;
  const expanded = text.classList.toggle("project-desc-expanded");
  text.classList.toggle("project-desc-clamped", !expanded);
  btn.innerHTML = expanded
    ? `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="18 15 12 9 6 15"/></svg> Show less`
    : `<svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"/></svg> Read more`;
}

// ── SIMULATIONS ───────────────────────────────────────
function renderSimulations() {
  const g = gel("simsGrid"); if (!g) return;
  if (!D.simulations || !D.simulations.length) {
    g.innerHTML = `<p style="color:var(--text2);font-size:.88rem">No simulations yet — add them in the admin panel.</p>`;
    return;
  }
  g.innerHTML = D.simulations.map(s => `
    <div class="sim-card">
      <div class="sim-header">
        <div class="sim-icon">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M12 1v4M12 19v4M4.22 4.22l2.83 2.83M16.95 16.95l2.83 2.83M1 12h4M19 12h4M4.22 19.78l2.83-2.83M16.95 7.05l2.83-2.83"/></svg>
        </div>
        <div class="sim-title">${esc(s.title)}</div>
      </div>
      <div class="sim-desc">${esc(s.desc)}</div>
      <div class="project-tags">${(s.tags||[]).map(t=>`<span class="project-tag">${esc(t)}</span>`).join("")}</div>
      ${s.link ? `<a class="project-link sim-link" href="${esc(s.link)}" target="_blank" rel="noopener">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
        View Simulation</a>` : `<span class="sim-no-link">Link coming soon</span>`}
    </div>`).join("");
}

// ── SKILL SIGNAL BARS ────────────────────────────────
// Network signal strength bars — perfect for a NOC engineer
// 5 bars, filled based on level bands
function renderSkillBoxes() {
  const c = gel("skillsBoxes"); if (!c) return;

  // Map 0-100 to 1-5 bars + colour
  const bars = lvl => Math.ceil((lvl / 100) * 5);
  const tierLabel = lvl => lvl >= 92 ? "Full Signal" : lvl >= 84 ? "Strong"  : lvl >= 74 ? "Good" : lvl >= 60 ? "Fair" : "Weak";
  const tierColor = lvl => lvl >= 92 ? "#22c55e"   : lvl >= 84 ? "#3B82F6" : lvl >= 74 ? "#06B6D4" : lvl >= 60 ? "#f59e0b" : "#ef4444";

  c.innerHTML = D.skills.map((s, i) => {
    const filled = bars(s.level);
    const col    = tierColor(s.level);
    const lbl    = tierLabel(s.level);

    // Build 5 bars of increasing height
    const barHtml = [1,2,3,4,5].map(n => {
      const heights = ["10px","14px","18px","22px","27px"];
      const active  = n <= filled;
      return `<div class="ssb-bar ${active ? "ssb-bar-on" : "ssb-bar-off"}"
        style="height:${heights[n-1]};${active ? `background:${col};box-shadow:0 0 6px ${col}55` : ""};transition-delay:${(i * 40) + (n * 60)}ms"
        data-filled="${active ? 1 : 0}"></div>`;
    }).join("");

    return `
    <div class="skill-signal-card reveal-ready" data-level="${s.level}">
      <div class="ssc-top">
        <div class="ssc-name">${esc(s.name)}</div>
        <div class="ssc-pct" style="color:${col}" data-target="${s.level}">0%</div>
      </div>
      <div class="ssc-bars-row">
        <div class="ssc-bars">${barHtml}</div>
        <div class="ssc-tier" style="color:${col};border-color:${col}22;background:${col}11">${lbl}</div>
      </div>
    </div>`;
  }).join("");
}

function animateBars() {
  const cards = document.querySelectorAll(".skill-signal-card");
  if (!cards.length) return;

  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const card   = e.target;
      const target = parseInt(card.dataset.level);
      const pctEl  = card.querySelector(".ssc-pct");
      const barEls = card.querySelectorAll(".ssb-bar-on");

      // Animate bars popping in
      barEls.forEach((bar, bi) => {
        bar.style.opacity = "0";
        bar.style.transform = "scaleY(0)";
        bar.style.transformOrigin = "bottom";
        setTimeout(() => {
          bar.style.transition = "opacity .35s ease, transform .35s cubic-bezier(.34,1.56,.64,1)";
          bar.style.opacity = "1";
          bar.style.transform = "scaleY(1)";
        }, 120 + bi * 90);
      });

      // Count up percentage
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 900, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        pctEl.textContent = Math.round(ease * target) + "%";
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);

      card.classList.add("revealed");
      obs.unobserve(card);
    });
  }, { threshold: 0.2 });

  cards.forEach(c => obs.observe(c));
}

// ── CERTIFICATIONS ───────────────────────────────────
function renderCertsFull() {
  const g = gel("certsFullGrid"); if (!g) return;
  g.innerHTML = D.certifications.map(c => `
    <div class="cert-card-full">
      <div class="cert-logo-wrap">
        <img class="cert-logo" src="${esc(c.logo)}" alt="${esc(c.issuer)}"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'"/>
        <span class="cert-logo-fallback" style="display:none">${esc(c.issuer)}</span>
      </div>
      <div class="cert-full-name">${esc(c.name)}</div>
      <div class="cert-full-issuer">${esc(c.issuer)}</div>
      ${c.duration ? `<div class="cert-duration">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
        ${esc(c.duration)}</div>` : ""}
      <div class="cert-verified">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
        Verified
      </div>
    </div>`).join("");
}

// ── ROLES ─────────────────────────────────────────────
function renderRoles() {
  const rc = gel("rolesChips"); if (!rc) return;
  rc.innerHTML = D.roles.map(r => `
    <div class="role-chip">
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
      ${esc(r)}
    </div>`).join("");
}

// ── CAREER ────────────────────────────────────────────
function renderCareer() {
  const ct = gel("careerTrack"); if (!ct) return;
  if (!D.experience.length) { ct.innerHTML = ""; return; }
  const first = D.experience[0];
  let html = careerCard(first);
  if (D.experience.length > 1) {
    const rest = D.experience.slice(1).map(careerCard).join("");
    html += `<div id="careerMore" style="display:none;flex-direction:column;gap:12px;align-items:center;width:100%">${rest}</div>
      <button class="career-toggle-btn" id="careerToggle" onclick="toggleCareer(this)">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg>
        Show More Experience</button>`;
  }
  ct.innerHTML = html;
}
function careerCard(e) {
  return `<div class="career-card">
    <div class="career-card-period">${esc(e.period)}</div>
    <div class="career-card-role">${esc(e.role)}</div>
    <div class="career-card-company">${esc(e.company)}</div>
    <ul class="career-bullets">${e.bullets.map(b=>`<li>${esc(b)}</li>`).join("")}</ul>
  </div>`;
}
function toggleCareer(btn) {
  const more = gel("careerMore"); if (!more) return;
  const open = more.style.display === "flex";
  more.style.display = open ? "none" : "flex";
  btn.innerHTML = open
    ? `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="6 9 12 15 18 9"/></svg> Show More Experience`
    : `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="18 15 12 9 6 15"/></svg> Show Less`;
}

// ── EXPERIENCE ────────────────────────────────────────
function renderExpFull() {
  const el = gel("expList"); if (!el) return;
  el.innerHTML = D.experience.map(e => `
    <div class="exp-item">
      <div class="exp-header">
        <div class="exp-role">${esc(e.role)}</div>
        <span class="exp-period-badge">${esc(e.period)}</span>
      </div>
      <div class="exp-company">${esc(e.company)} · ${esc(e.location)}</div>
      <ul class="career-bullets">${e.bullets.map(b=>`<li>${esc(b)}</li>`).join("")}</ul>
    </div>`).join("");
}

// ── CONTACT ───────────────────────────────────────────
function renderContact() {
  const c = D.contact;
  const ci = gel("contactItems");
  if (ci) ci.innerHTML = [
    { icon: emailIcon(),    lbl: "Email",        val: c.email },
    { icon: phoneIcon(),    lbl: "Phone",        val: c.phone },
    { icon: locationIcon(), lbl: "Location",     val: c.location },
    { icon: clockIcon(),    lbl: "Availability", val: c.availability },
  ].map(item => `
    <div class="contact-item">
      <div class="contact-icon">${item.icon}</div>
      <div><div class="contact-lbl">${item.lbl}</div><div class="contact-val">${esc(item.val)}</div></div>
    </div>`).join("");

  const sl = gel("socialLinks");
  if (sl) sl.innerHTML = `
    <a href="${esc(c.linkedin)}" target="_blank" rel="noopener" class="social-btn social-linkedin">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>LinkedIn</a>
    <a href="${esc(c.github)}" target="_blank" rel="noopener" class="social-btn social-github">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"/></svg>GitHub</a>`;
}

function sendEmail() {
  const name    = gel("contactName").value.trim();
  const from    = gel("contactEmail").value.trim();
  const subject = gel("contactSubject").value.trim();
  const message = gel("contactMessage").value.trim();
  if (!name || !message) { alert("Please fill in your name and message."); return; }
  const body   = `From: ${name} <${from}>\n\n${message}`;
  const mailto = `mailto:${D.contact.email}?subject=${encodeURIComponent(subject||"Portfolio Enquiry")}&body=${encodeURIComponent(body)}`;
  window.location.href = mailto;
}

// ── THEME ─────────────────────────────────────────────
let isDark = localStorage.getItem(LS_THEME) === "dark";

function applyTheme() {
  document.body.classList.toggle("dark", isDark);
  localStorage.setItem(LS_THEME, isDark ? "dark" : "light");
  applyThemeTokens();
}

function applyThemeTokens() {
  const t = D.theme;
  if (!t) return;
  const mode = isDark ? t.dark : t.light;
  if (!mode) return;
  const r = document.documentElement.style;
  r.setProperty("--bg",      mode.bg      || "");
  r.setProperty("--card",    mode.card    || "");
  r.setProperty("--accent",  mode.accent  || "");
  r.setProperty("--accent2", mode.accent2 || "");
  r.setProperty("--text",    mode.text    || "");
  r.setProperty("--text2",   mode.text2   || "");
}

gel("themeBtn")?.addEventListener("click", () => { isDark = !isDark; applyTheme(); });
applyTheme();

// ── SIDEBAR COLLAPSE ──────────────────────────────────
let sidebarCollapsed = localStorage.getItem(LS_SIDEBAR) === "1";
function applySidebar() {
  gel("sidebar").classList.toggle("sidebar-collapsed", sidebarCollapsed);
  gel("main").classList.toggle("sidebar-collapsed", sidebarCollapsed);
  localStorage.setItem(LS_SIDEBAR, sidebarCollapsed ? "1" : "0");
}
gel("sidebarToggle")?.addEventListener("click", () => { sidebarCollapsed = !sidebarCollapsed; applySidebar(); });
applySidebar();
gel("mobileMenuBtn")?.addEventListener("click", () => { gel("sidebar").classList.toggle("mobile-open"); });

// ── SCROLL REVEAL ─────────────────────────────────────
function initScrollReveal() {
  const revealEls = document.querySelectorAll(
    ".tool-card, .project-card, .cert-card-full, .exp-item, .stat-card, .skill-gauge-card, .career-card, .contact-item, .role-chip, .section-heading"
  );

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add("revealed");
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.1, rootMargin: "0px 0px -40px 0px" });

  revealEls.forEach((el, i) => {
    el.classList.add("reveal-ready");
    // stagger siblings in same parent
    const siblings = el.parentElement ? [...el.parentElement.children] : [];
    const idx = siblings.indexOf(el);
    el.style.transitionDelay = `${Math.min(idx * 80, 400)}ms`;
    obs.observe(el);
  });
}

// ── TYPING EFFECT for hero headline ───────────────────
function initHeroTyping() {
  const tag = gel("hero-tag");
  if (!tag) return;
  const text = tag.textContent;
  tag.textContent = "";
  tag.style.opacity = "1";
  let i = 0;
  const type = () => {
    if (i < text.length) { tag.textContent += text[i++]; setTimeout(type, 45); }
  };
  setTimeout(type, 600);
}

// ── FLOATING PARTICLES background (subtle) ────────────
function initParticles() {
  const hero = document.querySelector(".hero");
  if (!hero) return;
  const canvas = document.createElement("canvas");
  canvas.className = "hero-particles";
  canvas.style.cssText = "position:absolute;inset:0;pointer-events:none;z-index:0;opacity:.18";
  hero.style.position = "relative";
  hero.insertBefore(canvas, hero.firstChild);

  const ctx = canvas.getContext("2d");
  let W, H, pts;

  function resize() {
    W = canvas.width  = hero.offsetWidth;
    H = canvas.height = hero.offsetHeight;
  }

  function makePoints() {
    pts = Array.from({length: 28}, () => ({
      x: Math.random() * W, y: Math.random() * H,
      vx: (Math.random() - .5) * .35, vy: (Math.random() - .5) * .35,
      r: Math.random() * 2 + 1
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    const isDark = document.body.classList.contains("dark");
    const col = isDark ? "99,179,255" : "37,99,235";
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0) p.x = W; if (p.x > W) p.x = 0;
      if (p.y < 0) p.y = H; if (p.y > H) p.y = 0;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${col},.7)`;
      ctx.fill();
    });
    // draw lines between close points
    for (let i = 0; i < pts.length; i++) {
      for (let j = i + 1; j < pts.length; j++) {
        const dx = pts[i].x - pts[j].x, dy = pts[i].y - pts[j].y;
        const d = Math.sqrt(dx*dx + dy*dy);
        if (d < 90) {
          ctx.beginPath();
          ctx.moveTo(pts[i].x, pts[i].y);
          ctx.lineTo(pts[j].x, pts[j].y);
          ctx.strokeStyle = `rgba(${col},${.35 * (1 - d/90)})`;
          ctx.lineWidth = .8;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  resize(); makePoints(); draw();
  window.addEventListener("resize", () => { resize(); makePoints(); });
}

// ── COUNTER ANIMATION for stats ───────────────────────
function initStatCounters() {
  const stats = document.querySelectorAll(".stat-val");
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => {
      if (!e.isIntersecting) return;
      const el = e.target;
      const raw = el.textContent.trim();
      const num = parseInt(raw.replace(/\D/g,""));
      const suffix = raw.replace(/[\d]/g,"");
      if (isNaN(num)) return;
      let start = null;
      const step = ts => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / 1000, 1);
        const ease = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(ease * num) + suffix;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
      obs.unobserve(el);
    });
  }, { threshold: .5 });
  stats.forEach(s => obs.observe(s));
}
function attachScrollSpy() {
  const visibleIds = getSections().filter(s => s.visible).map(s => s.id + "-section");
  window.addEventListener("scroll", () => {
    let current = "";
    visibleIds.forEach(id => {
      const s = gel(id);
      if (s && window.scrollY >= s.offsetTop - 100) current = id.replace("-section","");
    });
    document.querySelectorAll(".nav-link").forEach(l =>
      l.classList.toggle("active", l.dataset.section === current));
  }, { passive: true });
}

// ── ICON HELPERS ──────────────────────────────────────
function emailIcon()    { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>`; }
function phoneIcon()    { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 13 19.79 19.79 0 0 1 1.6 4.37 2 2 0 0 1 3.57 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L7.91 9.91a16 16 0 0 0 6.16 6.16l.91-.91a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>`; }
function locationIcon() { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>`; }
function clockIcon()    { return `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>`; }

// ── DOM HELPERS ───────────────────────────────────────
function gel(id)        { return document.getElementById(id); }
function setText(id, v) { const e = gel(id); if (e) e.textContent = v || ""; }
function setHTML(id, v) { const e = gel(id); if (e) e.innerHTML  = v || ""; }
function esc(s) {
  return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
}

// ── INIT ──────────────────────────────────────────────
render();
// slight defer so DOM is painted before we measure
requestAnimationFrame(() => {
  initScrollReveal();
  initHeroTyping();
  initParticles();
  initStatCounters();
});
