/* ─────────────────────────────────────────────────────
   FRANK DAVIS NARH — ADMIN PANEL
   ───────────────────────────────────────────────────── */

const ADMIN_PASSWORD = "@Poruplex*1210#$";
const LS_KEY         = "fdn_portfolio_v2";

let D = loadData();

function loadData() {
  try { const s = localStorage.getItem(LS_KEY); if (s) return JSON.parse(s); } catch(e){}
  return JSON.parse(JSON.stringify(DEFAULT_DATA));
}
function persist() { localStorage.setItem(LS_KEY, JSON.stringify(D)); }

function getSections() {
  if (!D.sections) D.sections = JSON.parse(JSON.stringify(DEFAULT_DATA.sections));
  return D.sections;
}

// ── AUTH ──────────────────────────────────────────────
function doLogin() {
  const pwd = ge("loginPwd").value;
  if (pwd === ADMIN_PASSWORD) {
    ge("loginScreen").style.display = "none";
    ge("adminApp").style.display    = "flex";
    populateAll();
  } else {
    ge("loginErr").textContent = "Incorrect password.";
    ge("loginPwd").value = "";
    setTimeout(() => ge("loginErr").textContent = "", 3000);
  }
}
function doLogout() {
  ge("adminApp").style.display    = "none";
  ge("loginScreen").style.display = "flex";
  ge("loginPwd").value = "";
}

// ── TABS ──────────────────────────────────────────────
function showTab(btn, panelId) {
  document.querySelectorAll(".admin-nav-item").forEach(b => b.classList.remove("active"));
  document.querySelectorAll(".tab-panel").forEach(p => p.classList.remove("active"));
  btn.classList.add("active");
  ge(panelId).classList.add("active");
}

// ── POPULATE ALL ──────────────────────────────────────
function populateAll() {
  const p = D.profile;
  sv("f-name",p.name); sv("f-title",p.title); sv("f-heroBadge",p.heroBadge);
  sv("f-heroHeadline",p.heroHeadline); sv("f-heroSub",p.heroSub);
  sv("f-summary",p.summary); sv("f-yoe",p.yearsExperience);
  sv("f-nodes",p.nodesManaged); sv("f-certCount",p.certCount); sv("f-learning",p.ongoingLearning);
  const c = D.contact;
  sv("f-email",c.email); sv("f-phone",c.phone); sv("f-location",c.location);
  sv("f-avail",c.availability); sv("f-linkedin",c.linkedin); sv("f-github",c.github);
  renderSkillsEd(); renderToolsEd(); renderCertsEd();
  renderRolesEd(); renderExpEd(); renderProjectsEd();
  renderSimsEd(); renderSectionsEd(); renderThemeEd();
}

// ── PROFILE ───────────────────────────────────────────
function saveProfile() {
  D.profile.name=gv("f-name"); D.profile.title=gv("f-title"); D.profile.heroBadge=gv("f-heroBadge");
  D.profile.heroHeadline=gv("f-heroHeadline"); D.profile.heroSub=gv("f-heroSub");
  D.profile.summary=gv("f-summary"); D.profile.yearsExperience=gv("f-yoe");
  D.profile.nodesManaged=gv("f-nodes"); D.profile.certCount=gv("f-certCount");
  D.profile.ongoingLearning=gv("f-learning");
  persist(); flash("msg-profile");
}

// ── SKILLS ────────────────────────────────────────────
function renderSkillsEd() {
  ge("skillsEd").innerHTML = D.skills.map((s,i) => `
    <div class="ed-skill-row">
      <div class="ed-skill-top">
        <input class="ed-field" value="${esc(s.name)}" id="sk-n-${i}" placeholder="Skill name"/>
        <span class="ed-pct-label" id="sk-pct-${i}">${s.level}%</span>
        <button class="btn-del" onclick="delSkill(${i})">×</button>
      </div>
      <input type="range" class="skill-slider" min="1" max="100" value="${s.level}"
        id="sk-l-${i}" oninput="ge('sk-pct-${i}').textContent=this.value+'%'"/>
    </div>`).join("");
}
function addSkill()   { D.skills.push({name:"New Skill",level:75}); renderSkillsEd(); }
function delSkill(i)  { D.skills.splice(i,1); renderSkillsEd(); }
function saveSkills() {
  D.skills = D.skills.map((_,i)=>({name:ge(`sk-n-${i}`).value.trim(),level:parseInt(ge(`sk-l-${i}`).value)||75})).filter(s=>s.name);
  persist(); flash("msg-skills");
}

// ── TOOLS ─────────────────────────────────────────────
function renderToolsEd() {
  ge("toolsEd").innerHTML = D.monitoringTools.map((t,i)=>`
    <div class="exp-block">
      <div class="exp-block-header">
        <span class="exp-block-label">${esc(t.name)||"Tool "+(i+1)}</span>
        <button class="btn-del" onclick="delTool(${i})">× Remove</button>
      </div>
      <div class="exp-grid">
        <div class="form-group"><label class="form-label">Name</label>
          <input class="ed-field" value="${esc(t.name)}" id="tl-n-${i}"/></div>
        <div class="form-group"><label class="form-label">Logo URL / filename</label>
          <input class="ed-field" value="${esc(t.logo||'')}" id="tl-lg-${i}" placeholder="solar.png or https://..."/></div>
      </div>
      <div class="form-group"><label class="form-label">Description</label>
        <textarea class="ed-field" id="tl-d-${i}" rows="2">${esc(t.desc)}</textarea></div>
    </div>`).join("");
}
function addTool()  { D.monitoringTools.push({name:"New Tool",desc:"",logo:""}); renderToolsEd(); }
function delTool(i) { D.monitoringTools.splice(i,1); renderToolsEd(); }
function saveTools() {
  D.monitoringTools = D.monitoringTools.map((_,i)=>({
    name:ge(`tl-n-${i}`).value.trim(),desc:ge(`tl-d-${i}`).value.trim(),logo:ge(`tl-lg-${i}`).value.trim()
  })).filter(t=>t.name);
  persist(); flash("msg-tools");
}

// ── CERTIFICATIONS ────────────────────────────────────
function renderCertsEd() {
  ge("certsEd").innerHTML = D.certifications.map((c,i)=>`
    <div class="exp-block">
      <div class="exp-block-header">
        <span class="exp-block-label">${esc(c.name)||"Cert "+(i+1)}</span>
        <button class="btn-del" onclick="delCert(${i})">× Remove</button>
      </div>
      <div class="exp-grid">
        <div class="form-group"><label class="form-label">Certification Name</label>
          <input class="ed-field" value="${esc(c.name)}" id="ct-n-${i}"/></div>
        <div class="form-group"><label class="form-label">Issuing Organisation</label>
          <input class="ed-field" value="${esc(c.issuer)}" id="ct-i-${i}"/></div>
        <div class="form-group"><label class="form-label">Duration / Valid Period</label>
          <input class="ed-field" value="${esc(c.duration||'')}" id="ct-dur-${i}" placeholder="e.g. 2023 – 2026"/></div>
        <div class="form-group"><label class="form-label">Logo URL</label>
          <input class="ed-field" value="${esc(c.logo||'')}" id="ct-lg-${i}" placeholder="https://..."/></div>
      </div>
    </div>`).join("");
}
function addCert()  { D.certifications.push({name:"New Certification",issuer:"Issuer",duration:"",logo:""}); renderCertsEd(); }
function delCert(i) { D.certifications.splice(i,1); renderCertsEd(); }
function saveCerts() {
  D.certifications = D.certifications.map((_,i)=>({
    name:ge(`ct-n-${i}`).value.trim(),issuer:ge(`ct-i-${i}`).value.trim(),
    duration:ge(`ct-dur-${i}`).value.trim(),logo:ge(`ct-lg-${i}`).value.trim()
  })).filter(c=>c.name);
  persist(); flash("msg-certs");
}

// ── ROLES ─────────────────────────────────────────────
function renderRolesEd() {
  ge("rolesEd").innerHTML = D.roles.map((r,i)=>`
    <div class="ed-row-1">
      <input class="ed-field" value="${esc(r)}" id="rl-${i}" placeholder="Role title"/>
      <button class="btn-del" onclick="delRoleItem(${i})">×</button>
    </div>`).join("");
}
function addRoleItem()  { D.roles.push("New Role"); renderRolesEd(); }
function delRoleItem(i) { D.roles.splice(i,1); renderRolesEd(); }
function saveRoles()    { D.roles=D.roles.map((_,i)=>ge(`rl-${i}`).value.trim()).filter(Boolean); persist(); flash("msg-roles"); }

// ── EXPERIENCE ────────────────────────────────────────
function renderExpEd() {
  ge("expEd").innerHTML = D.experience.map((e,ei)=>`
    <div class="exp-block">
      <div class="exp-block-header">
        <span class="exp-block-label">Job ${ei+1} — ${esc(e.company)||""}</span>
        <button class="btn-del" onclick="delExp(${ei})">× Remove</button>
      </div>
      <div class="exp-grid">
        <div class="form-group"><label class="form-label">Company</label><input class="ed-field" value="${esc(e.company)}" id="ex-co-${ei}"/></div>
        <div class="form-group"><label class="form-label">Role</label><input class="ed-field" value="${esc(e.role)}" id="ex-ro-${ei}"/></div>
        <div class="form-group"><label class="form-label">Period</label><input class="ed-field" value="${esc(e.period)}" id="ex-pe-${ei}"/></div>
        <div class="form-group"><label class="form-label">Location</label><input class="ed-field" value="${esc(e.location)}" id="ex-lo-${ei}"/></div>
      </div>
      <div class="bullets-label">Bullet Points</div>
      <div class="bullets-list" id="bullets-${ei}">
        ${e.bullets.map((b,bi)=>`<div class="bullet-row"><input class="ed-field" value="${esc(b)}" id="ex-b-${ei}-${bi}"/><button class="btn-del" onclick="delBullet(${ei},${bi})">×</button></div>`).join("")}
      </div>
      <button class="btn-add-bullet" onclick="addBullet(${ei})">+ Add bullet</button>
    </div>`).join("");
}
function addExp()         { D.experience.push({company:"Company",role:"Role",period:"Date – Present",location:"City, Country",bullets:["Key responsibility"]}); renderExpEd(); }
function delExp(ei)       { D.experience.splice(ei,1); renderExpEd(); }
function addBullet(ei)    { D.experience[ei].bullets.push("New bullet"); renderExpEd(); }
function delBullet(ei,bi) { D.experience[ei].bullets.splice(bi,1); renderExpEd(); }
function saveExp() {
  D.experience = D.experience.map((e,ei)=>({
    company:ge(`ex-co-${ei}`).value.trim(),role:ge(`ex-ro-${ei}`).value.trim(),
    period:ge(`ex-pe-${ei}`).value.trim(),location:ge(`ex-lo-${ei}`).value.trim(),
    bullets:e.bullets.map((_,bi)=>{ const el=ge(`ex-b-${ei}-${bi}`); return el?el.value.trim():""; }).filter(Boolean)
  })).filter(e=>e.company);
  persist(); flash("msg-exp");
}

// ── PROJECTS ──────────────────────────────────────────
function renderProjectsEd() {
  const ed = ge("projectsEd"); if(!ed) return;
  if(!D.projects) D.projects=[];
  ed.innerHTML = D.projects.map((p,pi)=>`
    <div class="exp-block" id="pj-block-${pi}">
      <div class="exp-block-header">
        <span class="exp-block-label">${esc(p.title)||"Project "+(pi+1)}</span>
        <button class="btn-del" onclick="delProject(${pi})">× Remove</button>
      </div>
      <div class="exp-grid">
        <div class="form-group"><label class="form-label">Title</label>
          <input class="ed-field" value="${esc(p.title)}" id="pj-t-${pi}"/></div>
        <div class="form-group"><label class="form-label">Project Link (optional)</label>
          <input class="ed-field" value="${esc(p.link||'')}" id="pj-lnk-${pi}" placeholder="https://github.com/..."/></div>
      </div>

      <!-- Media: upload OR URL -->
      <div class="form-group">
        <label class="form-label">Project Image / Video</label>
        <div class="media-tabs">
          <button class="media-tab-btn ${!p.imageData?'active':''}" onclick="switchMediaTab(${pi},'url')">🔗 Use URL</button>
          <button class="media-tab-btn ${p.imageData?'active':''}" onclick="switchMediaTab(${pi},'upload')">📁 Upload File</button>
        </div>
        <!-- URL panel -->
        <div id="pj-url-panel-${pi}" class="media-panel" style="display:${p.imageData?'none':'block'}">
          <input class="ed-field" value="${esc(p.image||'')}" id="pj-img-${pi}"
            placeholder="https://images.unsplash.com/photo-...?w=800"/>
          <p class="form-hint">Paste any public image or video thumbnail URL</p>
        </div>
        <!-- Upload panel -->
        <div id="pj-upload-panel-${pi}" class="media-panel" style="display:${p.imageData?'block':'none'}">
          <div class="upload-zone" id="pj-dropzone-${pi}"
            onclick="ge('pj-file-${pi}').click()"
            ondragover="event.preventDefault();this.classList.add('drag-over')"
            ondragleave="this.classList.remove('drag-over')"
            ondrop="handleMediaDrop(event,${pi})">
            ${p.imageData
              ? `<img src="${p.imageData}" class="upload-preview" id="pj-preview-${pi}"/>`
              : `<div class="upload-placeholder" id="pj-preview-${pi}">
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                  <span>Click to upload or drag & drop</span>
                  <span class="upload-hint">JPG, PNG, GIF, WebP, MP4 — max 5MB</span>
                </div>`
            }
          </div>
          <input type="file" id="pj-file-${pi}" accept="image/*,video/mp4,video/webm"
            style="display:none" onchange="handleMediaFile(event,${pi})"/>
          ${p.imageData ? `<button class="btn-clear-media" onclick="clearMedia(${pi})">× Clear uploaded file</button>` : ""}
        </div>
      </div>

      <div class="form-group"><label class="form-label">Description</label>
        <textarea class="ed-field" id="pj-d-${pi}" rows="4">${esc(p.desc)}</textarea></div>
      <div class="form-group"><label class="form-label">Tags (comma-separated)</label>
        <input class="ed-field" value="${esc((p.tags||[]).join(', '))}" id="pj-tags-${pi}" placeholder="MPLS, Cisco, NOC"/></div>
    </div>`).join("");
}

function switchMediaTab(pi, mode) {
  ge(`pj-url-panel-${pi}`).style.display    = mode==='url'    ? 'block' : 'none';
  ge(`pj-upload-panel-${pi}`).style.display = mode==='upload' ? 'block' : 'none';
  const block = ge(`pj-block-${pi}`);
  block.querySelectorAll('.media-tab-btn').forEach((b,i)=>b.classList.toggle('active', (i===0&&mode==='url')||(i===1&&mode==='upload')));
}

function handleMediaFile(e, pi) {
  const file = e.target.files[0]; if(!file) return;
  if(file.size > 5*1024*1024){ alert("File too large — max 5MB."); return; }
  const reader = new FileReader();
  reader.onload = ev => {
    if(!D.projects[pi]) return;
    D.projects[pi].imageData = ev.target.result;
    D.projects[pi].imageType = file.type;
    renderProjectsEd();
    // auto-switch to upload tab to show preview
    switchMediaTab(pi, 'upload');
    flash("msg-projects");
    persist();
  };
  reader.readAsDataURL(file);
}

function handleMediaDrop(e, pi) {
  e.preventDefault();
  ge(`pj-dropzone-${pi}`)?.classList.remove('drag-over');
  const file = e.dataTransfer.files[0]; if(!file) return;
  const fakeEvent = { target: { files: [file] } };
  handleMediaFile(fakeEvent, pi);
}

function clearMedia(pi) {
  if(!D.projects[pi]) return;
  delete D.projects[pi].imageData;
  delete D.projects[pi].imageType;
  persist();
  renderProjectsEd();
}

function addProject()   { D.projects=D.projects||[]; D.projects.push({title:"New Project",desc:"",tags:[],image:"",link:""}); renderProjectsEd(); }
function delProject(pi) { D.projects.splice(pi,1); renderProjectsEd(); }
function saveProjects() {
  D.projects=(D.projects||[]).map((_,pi)=>({
    title:     ge(`pj-t-${pi}`)?.value.trim()||"",
    desc:      ge(`pj-d-${pi}`)?.value.trim()||"",
    image:     ge(`pj-img-${pi}`)?.value.trim()||"",
    imageData: D.projects[pi]?.imageData||"",
    imageType: D.projects[pi]?.imageType||"",
    tags:      ge(`pj-tags-${pi}`)?.value.split(",").map(t=>t.trim()).filter(Boolean)||[],
    link:      ge(`pj-lnk-${pi}`)?.value.trim()||""
  })).filter(p=>p.title);
  persist(); flash("msg-projects");
}

// ── SIMULATIONS ───────────────────────────────────────
function renderSimsEd() {
  const ed = ge("simsEd"); if(!ed) return;
  if(!D.simulations) D.simulations=[];
  ed.innerHTML = D.simulations.map((s,si)=>`
    <div class="exp-block">
      <div class="exp-block-header">
        <span class="exp-block-label">${esc(s.title)||"Simulation "+(si+1)}</span>
        <button class="btn-del" onclick="delSim(${si})">× Remove</button>
      </div>
      <div class="form-group"><label class="form-label">Title</label><input class="ed-field" value="${esc(s.title)}" id="sm-t-${si}"/></div>
      <div class="form-group"><label class="form-label">Description</label>
        <textarea class="ed-field" id="sm-d-${si}" rows="3">${esc(s.desc)}</textarea></div>
      <div class="exp-grid">
        <div class="form-group"><label class="form-label">Tags (comma-separated)</label>
          <input class="ed-field" value="${esc((s.tags||[]).join(', '))}" id="sm-tags-${si}" placeholder="OSPF, GNS3, Cisco"/></div>
        <div class="form-group"><label class="form-label">View Link (optional)</label>
          <input class="ed-field" value="${esc(s.link||'')}" id="sm-lnk-${si}" placeholder="https://github.com/..."/></div>
      </div>
    </div>`).join("");
}
function addSim()    { D.simulations=D.simulations||[]; D.simulations.push({title:"New Simulation",desc:"",tags:[],link:""}); renderSimsEd(); }
function delSim(si)  { D.simulations.splice(si,1); renderSimsEd(); }
function saveSims() {
  D.simulations=(D.simulations||[]).map((_,si)=>({
    title:ge(`sm-t-${si}`).value.trim(),desc:ge(`sm-d-${si}`).value.trim(),
    tags:ge(`sm-tags-${si}`).value.split(",").map(t=>t.trim()).filter(Boolean),
    link:ge(`sm-lnk-${si}`).value.trim()
  })).filter(s=>s.title);
  persist(); flash("msg-sims");
}

// ── SECTIONS (visibility + drag-to-reorder) ───────────
let dragSrc = null;

function renderSectionsEd() {
  const ed = ge("sectionsEd"); if(!ed) return;
  const secs = getSections();
  ed.innerHTML = secs.map((s,i)=>`
    <div class="sec-row" id="secrow-${i}" draggable="true"
      ondragstart="onDragStart(event,${i})"
      ondragover="onDragOver(event)"
      ondrop="onDrop(event,${i})"
      ondragend="onDragEnd()">
      <div class="sec-drag-handle" title="Drag to reorder">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>
      </div>
      <span class="sec-label">${esc(s.label)}</span>
      ${s.id === "home" ? `<span class="sec-fixed-note">Always visible</span>` : `
      <label class="sec-toggle-wrap" title="${s.visible ? "Click to hide this section" : "Click to show this section"}">
        <input type="checkbox" class="sec-toggle-cb" ${s.visible?"checked":""} onchange="toggleSection(${i},this.checked)"/>
        <span class="sec-toggle-slider"></span>
        <span class="sec-toggle-label">${s.visible?"Visible":"Hidden"}</span>
      </label>`}
    </div>`).join("");
}

function toggleSection(i, checked) {
  const secs = getSections();
  if(secs[i].id === "home") return; // home always visible
  secs[i].visible = checked;
  // update label live
  const label = document.querySelector(`#secrow-${i} .sec-toggle-label`);
  if(label) label.textContent = checked ? "Visible" : "Hidden";
  persist();
  flash("msg-sections");
}

// Drag-and-drop reorder
function onDragStart(e, i) {
  dragSrc = i;
  e.dataTransfer.effectAllowed = "move";
  e.currentTarget.classList.add("dragging");
}
function onDragOver(e) {
  e.preventDefault();
  e.dataTransfer.dropEffect = "move";
  document.querySelectorAll(".sec-row").forEach(r => r.classList.remove("drag-over"));
  e.currentTarget.closest(".sec-row")?.classList.add("drag-over");
}
function onDrop(e, targetIdx) {
  e.preventDefault();
  if(dragSrc === null || dragSrc === targetIdx) return;
  const secs = getSections();
  // prevent moving home section away from first
  if(secs[dragSrc].id === "home" || secs[targetIdx].id === "home") return;
  const [moved] = secs.splice(dragSrc, 1);
  secs.splice(targetIdx, 0, moved);
  D.sections = secs;
  persist();
  renderSectionsEd();
  flash("msg-sections");
}
function onDragEnd() {
  dragSrc = null;
  document.querySelectorAll(".sec-row").forEach(r => { r.classList.remove("dragging","drag-over"); });
}

// ── THEME EDITOR ──────────────────────────────────────
const THEME_PRESETS = {
  "Default Blue":    { light:{bg:"#F9FAFB",card:"#FFFFFF",accent:"#2563EB",accent2:"#06B6D4",text:"#111827",text2:"#4B5563"}, dark:{bg:"#0B0F19",card:"#111827",accent:"#3B82F6",accent2:"#22D3EE",text:"#E5E7EB",text2:"#9CA3AF"} },
  "Emerald Green":   { light:{bg:"#F0FDF4",card:"#FFFFFF",accent:"#059669",accent2:"#0891B2",text:"#111827",text2:"#4B5563"}, dark:{bg:"#0A1A12",card:"#0F2318",accent:"#10B981",accent2:"#22D3EE",text:"#E5E7EB",text2:"#9CA3AF"} },
  "Royal Purple":    { light:{bg:"#FAF5FF",card:"#FFFFFF",accent:"#7C3AED",accent2:"#DB2777",text:"#1E1B4B",text2:"#6D28D9"}, dark:{bg:"#0D0A1F",card:"#150E2E",accent:"#8B5CF6",accent2:"#EC4899",text:"#EDE9FE",text2:"#A78BFA"} },
  "Sunset Orange":   { light:{bg:"#FFF7ED",card:"#FFFFFF",accent:"#EA580C",accent2:"#D97706",text:"#1C1917",text2:"#57534E"}, dark:{bg:"#1A0F00",card:"#1C1008",accent:"#F97316",accent2:"#F59E0B",text:"#FEF3C7",text2:"#D97706"} },
  "Slate Mono":      { light:{bg:"#F8FAFC",card:"#FFFFFF",accent:"#475569",accent2:"#0EA5E9",text:"#0F172A",text2:"#64748B"}, dark:{bg:"#0F172A",card:"#1E293B",accent:"#94A3B8",accent2:"#38BDF8",text:"#F1F5F9",text2:"#94A3B8"} },
};

function renderThemeEd() {
  if(!D.theme) D.theme = JSON.parse(JSON.stringify(DEFAULT_DATA.theme));
  const t = D.theme;
  const themeFields = mode => [
    { id:`th-${mode}-bg`,      lbl:"Background",      val:t[mode].bg      },
    { id:`th-${mode}-card`,    lbl:"Card Background", val:t[mode].card    },
    { id:`th-${mode}-accent`,  lbl:"Primary Accent",  val:t[mode].accent  },
    { id:`th-${mode}-accent2`, lbl:"Secondary Accent",val:t[mode].accent2 },
    { id:`th-${mode}-text`,    lbl:"Text Primary",    val:t[mode].text    },
    { id:`th-${mode}-text2`,   lbl:"Text Secondary",  val:t[mode].text2   },
  ];

  const colourRow = (f) => `
    <div class="theme-row">
      <label class="form-label">${f.lbl}</label>
      <div class="theme-input-wrap">
        <input type="color" class="theme-colour-swatch" value="${f.val}"
          oninput="syncThemeText('${f.id}',this.value)" id="${f.id}-swatch"/>
        <input type="text" class="ed-field theme-hex" value="${f.val}"
          id="${f.id}" maxlength="7"
          oninput="syncThemeSwatch('${f.id}',this.value)"/>
      </div>
    </div>`;

  const presetBtns = Object.keys(THEME_PRESETS).map(name=>
    `<button class="theme-preset-btn" onclick="applyPreset('${name}')">${name}</button>`
  ).join("");

  ge("themeEd").innerHTML = `
    <div class="theme-presets">
      <div class="form-label" style="margin-bottom:8px">Quick Presets</div>
      <div class="theme-presets-row">${presetBtns}</div>
    </div>
    <div class="theme-modes-grid">
      <div class="theme-mode-panel">
        <div class="theme-mode-title">☀️ Light Mode</div>
        ${themeFields("light").map(colourRow).join("")}
      </div>
      <div class="theme-mode-panel">
        <div class="theme-mode-title">🌙 Dark Mode</div>
        ${themeFields("dark").map(colourRow).join("")}
      </div>
    </div>`;
}

function syncThemeText(id, val) {
  const txt = ge(id); if(txt) txt.value = val;
}
function syncThemeSwatch(id, val) {
  if(/^#[0-9a-fA-F]{6}$/.test(val)) {
    const sw = ge(id+"-swatch"); if(sw) sw.value = val;
  }
}
function applyPreset(name) {
  const preset = THEME_PRESETS[name]; if(!preset) return;
  D.theme = JSON.parse(JSON.stringify(preset));
  persist(); renderThemeEd();
  flash("msg-theme");
}
function saveTheme() {
  const read = (id) => { const e=ge(id); return (e&&/^#[0-9a-fA-F]{6}$/.test(e.value)) ? e.value : null; };
  const modes = ["light","dark"];
  const keys  = ["bg","card","accent","accent2","text","text2"];
  if(!D.theme) D.theme={light:{},dark:{}};
  modes.forEach(m => keys.forEach(k => {
    const v = read(`th-${m}-${k}`);
    if(v) D.theme[m][k] = v;
  }));
  persist(); flash("msg-theme");
}
function resetTheme() {
  D.theme = JSON.parse(JSON.stringify(DEFAULT_DATA.theme));
  persist(); renderThemeEd(); flash("msg-theme");
}

// ── CONTACT ───────────────────────────────────────────
function saveContact() {
  D.contact.email=gv("f-email"); D.contact.phone=gv("f-phone");
  D.contact.location=gv("f-location"); D.contact.availability=gv("f-avail");
  D.contact.linkedin=gv("f-linkedin"); D.contact.github=gv("f-github");
  persist(); flash("msg-contact");
}

// ── HELPERS ───────────────────────────────────────────
function ge(id)    { return document.getElementById(id); }
function gv(id)    { const e=ge(id); return e?e.value.trim():""; }
function sv(id,v)  { const e=ge(id); if(e) e.value=v||""; }
function esc(s)    { return String(s||"").replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;"); }
function flash(id) { const e=ge(id); if(!e) return; e.textContent="Saved ✓"; e.style.color="#22c55e"; setTimeout(()=>e.textContent="",2500); }
