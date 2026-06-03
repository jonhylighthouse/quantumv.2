// ============================================================
//  QUANTUM — app.js
//  Lógica principal de la aplicación
//  Versión 1.0.0 | 2026-05-31
// ============================================================

// ┌─────────────────────────────────────────────────────────┐
// │  CONFIGURACIÓN GLOBAL                                   │
// └─────────────────────────────────────────────────────────┘

/**
 * URL del Web App de Google Apps Script.
 * Reemplazar con la URL obtenida tras publicar el script.
 */
const DEFAULT_GAS_URL = "https://script.googleusercontent.com/macros/echo?user_content_key=AUkAhnSnJNQgZGX8JBlsBC0kDMLau_ehq21iDmOVWjwHyWr8KT4OeNE2cfe6e6EB9bHqumM7YC34wfd8b5qGY62cLJC4uPd0Q0aGmpo9AAlTRRbD3xhC07_lJh4wLBQTK8Cl1JDCPuMNRSySiMQI9nGfuwX1S0TQNJHAmEIyRvVTlFhc75S03jDDYAm4l8LrM7fD5jdJgIt0A-PtC-YzY6yiuq6QIkrMskECgfswLPEqGMkh-CA6_8oKjLfmOkyI6XN4tZk67L2gckR4IbcAf-LLdv-WxWRA_g&lib=MMjKMn1ABID9XRRSLzCggjMzJonRLtP1P";

let GAS_URL = localStorage.getItem("quantum_gas_url") || DEFAULT_GAS_URL;
/** Niveles de calificación Quantum */
const LEVELS = [
  { label: "3%",  points: 300   },
  { label: "6%",  points: 600   },
  { label: "9%",  points: 1200  },
  { label: "12%", points: 2400  },
  { label: "15%", points: 4000  },
  { label: "18%", points: 7000  },
  { label: "21%", points: 10000 },
];

/** Estado global de la aplicación */
const State = {
  team:          [],
  history:       [],
  syncStatus:    "idle",   // idle | syncing | ok | error
  lastSync:      null,
  activeSection: "home",
  networkView:   "tree",   // tree | constellation
  simulatorData: {},       // { id: puntos_extra }
  goalMode:      "3%",
  goalConfig: {
    ganaMas: { puntosRequeridos: 150 },
    miniBronce: {
      liderPuntos:    300,
      frontalesCant:  3,
      frontalesPuntos: 150,
    },
    personalizado: { puntos: 500 },
  },
  // ── Usuario activo ──────────────────────────────────────────
  currentUserId:   null,  // uuid guardado en localStorage
  currentUserName: "",
  userProfile: {
    nombre:  "",
    sponsor: "Joy",
    objetivo: "",  // Paso 1
    perfil:   "",  // Paso 2 (Autoridad / Desarrollo)
    enfoque:  "",  // Paso 3 (Belleza / Nutrición / Hogar / Cuidado Personal)
  },
  contacts: [], // { id, userId, nombre, instagram, whatsapp, observaciones, tipo, estado }
  // ── Progreso 11 pasos ────────────────────────────────────────
  // estado: "pending" | "in_progress" | "completed"
  duplicationProgress: {
    paso1:  "pending",
    paso2:  "pending",
    paso3:  "pending",
    paso4:  "pending",
    paso5:  "pending",
    paso6:  "pending",
    paso7:  "pending",
    paso8:  "pending",
    paso9:  "pending",
    paso10: "pending",
    paso11: "pending",
  },
  checklists: {
    paso4: {
      tema1: false,
      tema2: false,
      tema3: false,
      tema4: false,
      tema5: false,
    },
    paso5: {
      foto:      false,
      bio:       false,
      link:      false,
      historia:  false,
      posts:     false,
      optimizado: false,
    },
    paso8: {
      queExplicar:   false,
      queEvitar:     false,
      comoAbrir:     false,
      comoInteresar: false,
      practicaste:   false,
    },
  },
};

// ┌─────────────────────────────────────────────────────────┐
// │  DATOS FALLBACK (LocalStorage / seed)                   │
// └─────────────────────────────────────────────────────────┘

const SEED_TEAM = [
  { 
    id: "1", 
    nombre: "Joy",  
    sponsorId: "",  
    puntos: 201, 
    metaPersonal: 300, 
    activo: true, 
    fechaActualizacion: "2026-05-31",
    tiempoDisponible: "Tiempo completo",
    intereses: "Estrategia, mentoría de líderes, crecimiento sustentable",
    fortalezas: "Constructor",
    objetivosPersonales: "Empoderar a su red y consolidar el nivel 21%",
    observaciones: "Gran visión estratégica y líder natural del equipo.",
    proximosPasos: "Reunión de alineación mensual con Jon y Wall"
  },
  { 
    id: "2", 
    nombre: "Jon",  
    sponsorId: "1", 
    puntos:  85, 
    metaPersonal: 150, 
    activo: true, 
    fechaActualizacion: "2026-05-31",
    tiempoDisponible: "12 horas/semana",
    intereses: "Formación de equipos, desarrollo humano",
    fortalezas: "Educador",
    objetivosPersonales: "Ayudar a Mamá a lograr su meta y alcanzar el 9%",
    observaciones: "Muy comprometido con el aprendizaje y la enseñanza de su red.",
    proximosPasos: "Repasar academia y flujo de puntos con Mamá"
  },
  { 
    id: "3", 
    nombre: "Wall", 
    sponsorId: "1", 
    puntos:  25, 
    metaPersonal: 150, 
    activo: true, 
    fechaActualizacion: "2026-05-31",
    tiempoDisponible: "8 horas/semana",
    intereses: "Venta directa, negociación comercial, contacto social",
    fortalezas: "Comercial",
    objetivosPersonales: "Expandir su cartera de clientes y llegar al 6%",
    observaciones: "Excelente facilidad de palabra y carisma innato.",
    proximosPasos: "Talleres de recomendación de productos"
  },
  { 
    id: "4", 
    nombre: "Mamá", 
    sponsorId: "2", 
    puntos:  25, 
    metaPersonal: 150, 
    activo: true, 
    fechaActualizacion: "2026-05-31",
    tiempoDisponible: "6 horas/semana",
    intereses: "Consumo inteligente, bienestar familiar",
    fortalezas: "Técnico",
    objetivosPersonales: "Llegar a sus primeros 150 puntos de consumo personal",
    observaciones: "Avanza paso a paso, prefiere aprender a su propio ritmo sin presión.",
    proximosPasos: "Prueba de catálogo y selección de productos favoritos"
  },
];

// ┌─────────────────────────────────────────────────────────┐
// │  UTILIDADES GENERALES                                   │
// └─────────────────────────────────────────────────────────┘

/** Formatea número con separador de miles */
const fmt = n => Number(n).toLocaleString("es-AR");

/** Calcula el nivel Quantum dado un total de puntos */
function calcLevel(totalPts) {
  let current = null;
  let next    = LEVELS[0];
  for (let i = 0; i < LEVELS.length; i++) {
    if (totalPts >= LEVELS[i].points) {
      current = LEVELS[i];
      next    = LEVELS[i + 1] || null;
    }
  }
  return { current, next };
}

/** Total grupal de puntos reales */
function groupTotal(team) {
  return team.filter(m => m.activo).reduce((s, m) => s + Number(m.puntos), 0);
}

/** Total grupal con datos de simulador */
function simGroupTotal(team, simData) {
  return team.filter(m => m.activo).reduce((s, m) => {
    return s + Number(m.puntos) + (Number(simData[m.id]) || 0);
  }, 0);
}

/** Porcentaje de avance de un miembro */
function progress(member) {
  if (!member.metaPersonal) return 0;
  return Math.min(100, Math.round((member.puntos / member.metaPersonal) * 100));
}

/** Color de estado de un miembro según su avance */
function statusColor(member) {
  const pct = progress(member);
  if (pct >= 100) return "var(--green)";
  if (pct >= 70)  return "var(--blue)";
  if (pct >= 40)  return "var(--yellow)";
  return "var(--violet)";
}

/** Clase CSS de estado */
function statusClass(member) {
  const pct = progress(member);
  if (pct >= 100) return "status-complete";
  if (pct >= 70)  return "status-near";
  if (pct >= 40)  return "status-mid";
  return "status-far";
}

/** Iniciales de un nombre */
function initials(name) {
  return name.split(" ").map(w => w[0]).join("").toUpperCase().slice(0, 2);
}

/** Guarda equipo en LocalStorage como respaldo */
function saveToLocal(team) {
  try { localStorage.setItem("quantum_team", JSON.stringify(team)); } catch (_) {}
}

/** Lee equipo desde LocalStorage */
function loadFromLocal() {
  try {
    const raw = localStorage.getItem("quantum_team");
    return raw ? JSON.parse(raw) : null;
  } catch (_) { return null; }
}

/** Guarda historial en LocalStorage */
function saveHistoryToLocal(history) {
  try { localStorage.setItem("quantum_history", JSON.stringify(history)); } catch (_) {}
}

/** Lee historial desde LocalStorage */
function loadHistoryFromLocal() {
  try {
    const raw = localStorage.getItem("quantum_history");
    return raw ? JSON.parse(raw) : [];
  } catch (_) { return []; }
}

// ─── PERSISTENCIA: USUARIO ACTIVO ────────────────────────────

function generateUserId() {
  return "user_" + Date.now() + "_" + Math.random().toString(36).slice(2, 8);
}

function saveCurrentUser() {
  try {
    localStorage.setItem("quantum_user_id",   State.currentUserId || "");
    localStorage.setItem("quantum_user_name", State.currentUserName || "");
  } catch (_) {}
}

function loadCurrentUser() {
  try {
    State.currentUserId   = localStorage.getItem("quantum_user_id")   || null;
    State.currentUserName = localStorage.getItem("quantum_user_name")  || "";
    if (State.currentUserName) State.userProfile.nombre = State.currentUserName;
  } catch (_) {}
}

// ─── PERSISTENCIA DEL MENTOR DIGITAL ──────────────────────────

function saveUserProfile() {
  try { localStorage.setItem("quantum_user_profile", JSON.stringify(State.userProfile)); } catch (_) {}
}
function loadUserProfile() {
  try {
    const raw = localStorage.getItem("quantum_user_profile");
    if (raw) State.userProfile = { ...State.userProfile, ...JSON.parse(raw) };
  } catch (_) {}
}

function saveContacts() {
  try { localStorage.setItem("quantum_contacts", JSON.stringify(State.contacts)); } catch (_) {}
}
function loadContacts() {
  try {
    const raw = localStorage.getItem("quantum_contacts");
    State.contacts = raw ? JSON.parse(raw) : getSeedContacts();
  } catch (_) {
    State.contacts = getSeedContacts();
  }
}

function saveDuplicationProgress() {
  try { localStorage.setItem("quantum_duplication_progress", JSON.stringify(State.duplicationProgress)); } catch (_) {}
}
function loadDuplicationProgress() {
  try {
    const raw = localStorage.getItem("quantum_duplication_progress");
    if (raw) {
      const parsed = JSON.parse(raw);
      // Migration: convert old "Pendiente/En progreso/Completado" values to new schema
      const migrated = {};
      const keys = ["paso1","paso2","paso3","paso4","paso5","paso6","paso7","paso8","paso9","paso10","paso11"];
      keys.forEach(k => {
        const v = parsed[k];
        if (v === "Completado" || v === "completed") migrated[k] = "completed";
        else if (v === "En progreso" || v === "in_progress") migrated[k] = "in_progress";
        else migrated[k] = "pending";
      });
      State.duplicationProgress = migrated;
    }
  } catch (_) {}
}

function saveChecklists() {
  try { localStorage.setItem("quantum_checklists", JSON.stringify(State.checklists)); } catch (_) {}
}
function loadChecklists() {
  try {
    const raw = localStorage.getItem("quantum_checklists");
    if (raw) {
      const parsed = JSON.parse(raw);
      // Deep merge to preserve new keys
      State.checklists = {
        paso4: { ...State.checklists.paso4, ...(parsed.paso4 || {}) },
        paso5: { ...State.checklists.paso5, ...(parsed.paso5 || {}) },
        paso8: { ...State.checklists.paso8, ...(parsed.paso8 || {}) },
      };
    }
  } catch (_) {}
}

function getSeedContacts() {
  return [
    { id: "c1", nombre: "Lucía Fernández", instagram: "lucia.fer", whatsapp: "+541155554321", observaciones: "Compañera de gimnasio. Interesada en mejorar hábitos de nutrición.", tipo: "🔥 Caliente", estado: "Interesado" },
    { id: "c2", nombre: "Marcos Gómez", instagram: "marcosg", whatsapp: "+541155559876", observaciones: "Ex-compañero de trabajo. Le gusta el emprendimiento y el tiempo libre.", tipo: "🌤️ Tibio", estado: "Contactado" },
    { id: "c3", nombre: "Dra. Sofía Rivas", instagram: "dra.sofiarivas", whatsapp: "+541155551212", observaciones: "Esteticista y cosmetóloga. Perfil con autoridad. Ideal para línea de Belleza.", tipo: "❄️ Frío", estado: "Nuevo" },
    { id: "c4", nombre: "Patricia Sosa", instagram: "patricia_sosa_bienestar", whatsapp: "+541155553434", observaciones: "Amiga de la infancia. Consume productos de cuidado personal habitualmente.", tipo: "🔥 Caliente", estado: "Cliente" }
  ];
}

// ─── SINCRONIZACIÓN GAS — MULTIUSUARIO ──────────────────────────

async function gasPost(action, data) {
  if (!GAS_URL) return null;
  try {
    const res = await fetch(GAS_URL, {
      method: "POST",
      body: JSON.stringify({ action, ...data }),
    });
    return await res.json();
  } catch (err) {
    console.warn("gasPost error:", action, err.message);
    return null;
  }
}

async function gasGet(action, params = {}) {
  if (!GAS_URL) return null;
  try {
    const qs = new URLSearchParams({ action, ...params }).toString();
    const res = await fetch(`${GAS_URL}?${qs}`, { cache: "no-store" });
    return await res.json();
  } catch (err) {
    console.warn("gasGet error:", action, err.message);
    return null;
  }
}

/** Guarda usuario nuevo en Google Sheets */
async function saveUserToSheets(userId, nombre) {
  return gasPost("saveUser", {
    data: {
      id:        userId,
      nombre:    nombre,
      perfil:    State.userProfile.perfil   || "",
      enfoque:   State.userProfile.enfoque  || "",
      objetivo:  State.userProfile.objetivo || "",
      fechaAlta: new Date().toISOString().split("T")[0],
      activo:    true,
    }
  });
}

/** Carga progreso del usuario desde Google Sheets */
async function loadProgressFromSheets(userId) {
  const res = await gasGet("getProgress", { userId });
  if (res && res.progress) {
    res.progress.forEach(row => {
      const key = row.pasoId;
      if (State.duplicationProgress.hasOwnProperty(key)) {
        State.duplicationProgress[key] = row.estado || "pending";
      }
    });
    saveDuplicationProgress();
  }
}

/** Guarda el progreso actual en Google Sheets */
async function saveProgressToSheets() {
  const userId = State.currentUserId;
  if (!userId) return;
  const rows = Object.entries(State.duplicationProgress).map(([pasoId, estado]) => ({
    userId, pasoId, estado, fecha: new Date().toISOString().split("T")[0]
  }));
  return gasPost("saveProgress", { userId, rows });
}

/** Carga contactos del usuario desde Google Sheets */
async function loadContactsFromSheets(userId) {
  const res = await gasGet("getContacts", { userId });
  if (res && res.contacts && res.contacts.length > 0) {
    State.contacts = res.contacts;
    saveContacts();
  }
}

/** Guarda un contacto en Google Sheets */
async function saveContactToSheets(contact) {
  const userId = State.currentUserId;
  if (!userId) return;
  return gasPost("saveContact", { data: { ...contact, userId } });
}

// ┌─────────────────────────────────────────────────────────┐
// │  HELPERS: PUNTOS GRUPALES                               │
// └─────────────────────────────────────────────────────────┘

/** Devuelve todos los descendientes (hijos, nietos…) de un miembro */
function getAllDescendants(memberId, team) {
  const direct = team.filter(m => m.sponsorId === String(memberId));
  let all = [...direct];
  direct.forEach(c => { all = all.concat(getAllDescendants(c.id, team)); });
  return all;
}

/** Calcula los Puntos Grupales (PG) de un miembro: PP propio + PP de toda su red */
function computeGroupPoints(memberId, team) {
  const self = team.find(m => m.id === String(memberId));
  if (!self || !self.activo) return 0;
  const desc = getAllDescendants(memberId, team);
  return Number(self.puntos)
       + desc.filter(m => m.activo).reduce((s, m) => s + Number(m.puntos), 0);
}

/** Obtiene la cadena de upline: [self, padre, abuelo, …] */
function getUplineChain(memberId, team) {
  const chain = [];
  let cur = team.find(m => m.id === String(memberId));
  while (cur) {
    chain.push(cur);
    cur = cur.sponsorId ? team.find(m => m.id === cur.sponsorId) : null;
  }
  return chain;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SINCRONIZACIÓN CON GOOGLE SHEETS                       │
// └─────────────────────────────────────────────────────────┘

/** Actualiza el indicador de estado de sincronización */
function setSyncStatus(status, msg) {
  State.syncStatus = status;
  const badge = document.getElementById("sync-badge");
  const dot   = document.getElementById("sync-dot");
  const text  = document.getElementById("sync-text");
  if (!badge) return;

  badge.className = "sync-badge sync-" + status;
  if (dot)  dot.className  = "sync-dot sync-dot-" + status;
  if (text) text.textContent = msg || { idle: "Sin sincronizar", syncing: "Sincronizando…", ok: "Sincronizado", error: "Error de conexión" }[status];
}

/** Carga el equipo desde Google Sheets (o LocalStorage si falla) */
async function fetchTeam() {
  if (!GAS_URL) {
    console.warn("URL de Apps Script no configurada. Usando datos locales.");
    const local = loadFromLocal();
    State.team = local || SEED_TEAM;
    saveToLocal(State.team);
    setSyncStatus("idle", "Sin URL configurada");
    return;
  }

  setSyncStatus("syncing");
  try {
    const res  = await fetch(`${GAS_URL}?action=getTeam`, { cache: "no-store" });
    const json = await res.json();
    if (json.team) {
      State.team = json.team;
      saveToLocal(State.team);
      State.lastSync = new Date().toLocaleTimeString("es-AR");
      setSyncStatus("ok");
    } else {
      throw new Error(json.error || "Respuesta inválida");
    }
  } catch (err) {
    console.error("fetchTeam:", err);
    const local = loadFromLocal();
    State.team = local || SEED_TEAM;
    setSyncStatus("error", "Error — datos locales");
  }
}

/** Carga el historial desde Google Sheets */
async function fetchHistory() {
  if (!GAS_URL) {
    State.history = loadHistoryFromLocal();
    return;
  }
  try {
    const res  = await fetch(`${GAS_URL}?action=getHistory`, { cache: "no-store" });
    const json = await res.json();
    if (json.history) {
      State.history = json.history;
      saveHistoryToLocal(State.history);
    }
  } catch (err) {
    console.error("fetchHistory:", err);
    State.history = loadHistoryFromLocal();
  }
}

/** Guarda o actualiza un miembro en Google Sheets */
async function saveMember(member) {
  setSyncStatus("syncing");
  // Actualizar localmente primero
  const idx = State.team.findIndex(m => m.id === member.id);
  if (idx >= 0) State.team[idx] = member; else State.team.push(member);
  saveToLocal(State.team);

  if (!GAS_URL) { setSyncStatus("idle", "Sin URL — guardado local"); return; }

  try {
    await fetch(GAS_URL, {
  method: "POST",
  body: JSON.stringify({ action: "saveMember", data: member }),
});
    State.lastSync = new Date().toLocaleTimeString("es-AR");
    setSyncStatus("ok");
  } catch (err) {
    console.error("saveMember:", err);
    setSyncStatus("error", "Guardado local — sin conexión");
  }
}

/** Elimina un miembro de Google Sheets */
async function deleteMember(id) {
  State.team = State.team.filter(m => m.id !== id);
  saveToLocal(State.team);

  if (!GAS_URL) return;
  try {
    await fetch(GAS_URL, {
  method: "POST",
  body: JSON.stringify({ action: "deleteMember", id }),
});
    setSyncStatus("ok");
  } catch (err) {
    console.error("deleteMember:", err);
    setSyncStatus("error");
  }
}

/** Guarda un snapshot del historial */
async function saveSnapshot(data) {
  if (!GAS_URL) return;
  try {
      await fetch(GAS_URL, {
  method: "POST",
  body: JSON.stringify({ action: "saveSnapshot", data }),
});
  } catch (err) { console.error("saveSnapshot:", err); }
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: DASHBOARD                                     │
// └─────────────────────────────────────────────────────────┘

function renderDashboard() {
  const team   = State.team;
  const total  = groupTotal(team);
  const { current, next } = calcLevel(total);
  const activos = team.filter(m => m.activo).length;
  const faltanNivel = next ? next.points - total : 0;

  const el = document.getElementById("section-dashboard");
  if (!el) return;

  // Calcular tendencia dinámica positiva
  let trendHtml = "🌱 Primer período de crecimiento en marcha.";
  if (State.history && State.history.length > 0) {
    const lastSnap = State.history[State.history.length - 1];
    const diff = total - lastSnap.totalGrupal;
    if (diff > 0) {
      trendHtml = `📈 ¡Excelente ritmo! Crecimiento de <strong>+${fmt(diff)} pts</strong> desde el último registro.`;
    } else if (diff === 0) {
      trendHtml = "➖ Crecimiento consolidado. Manteniendo bases sólidas.";
    } else {
      trendHtml = `🌱 Tu red se encuentra consolidando sus cimientos. ¡Buen momento para acompañar!`;
    }
  }

  // Lista de frases institucionales para rotar de forma aleatoria
  const frases = [
    "Crecer a tu ritmo. Construir con propósito.",
    "Más claridad. Menos presión.",
    "Transformando el esfuerzo de hoy en la visión de mañana.",
    "La arquitectura de tu crecimiento es única y sostenible.",
    "Construir una comunidad donde el éxito de cada persona impulsa al resto."
  ];
  const fraseSeleccionada = frases[Math.floor(Date.now() / 86400000) % frases.length]; // Cambia cada día

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Dashboard de Red</h2>
      <span class="section-sub">Acompañamiento en tiempo real de tu crecimiento grupal</span>
    </div>

    <div class="cards-grid animate-fade-in">
      ${card("Puntos Grupales", fmt(total), "💎", "card-blue",
        `<div class="card-sub">recorridos hacia el siguiente hito</div>
         <div class="progress-bar"><div class="progress-fill" style="width:${next ? Math.min(100,(total/next.points)*100) : 100}%;background:var(--blue)"></div></div>`)}

      ${card("Nivel Logrado", current ? current.label : "Estableciendo nivel", "📊", "card-violet",
        `<div class="card-sub">${current ? `Calificación mínima de ${fmt(current.points)} pts alcanzada` : "Camino a calificar tus primeros 300 pts"}</div>`)}

      ${card("Próximo Hito", next ? next.label : "🏆 Máximo", "🎯", "card-green",
        `<div class="card-sub">${next ? `Requiere ${fmt(next.points)} puntos grupales` : "¡Máximo nivel alcanzado!"}</div>`)}

      ${card("Próxima Celebración", next ? `A solo ${fmt(faltanNivel)} pts` : "¡Todo logrado!", "⚡", "card-green-dim",
        `<div class="card-sub">${next ? `para celebrar tu calificación al ${next.label} 🎉` : "¡Metas de la red cumplidas!"}</div>`)}

      ${card("Integrantes Activos", activos, "👥", "card-blue",
        `<div class="card-sub">de ${team.length} personas en el equipo</div>`)}

      ${card("Tendencia Actual", "Activa", "📈", "card-default",
        `<div class="card-sub" style="font-size:.75rem;color:var(--grey2);line-height:1.4">${trendHtml}</div>`)}
    </div>

    <!-- Frase Institucional Bánner -->
    <div class="dashboard-motivational-banner">
      <div class="banner-glow"></div>
      <span class="m-icon">✨</span>
      <p class="m-text">"${fraseSeleccionada}"</p>
    </div>

    <div class="section-header" style="margin-top:2rem">
      <h3 class="section-title" style="font-size:1.1rem">Camino de Progreso Individual</h3>
      <span class="section-sub" style="margin-top:.2rem">Haz clic en cualquier miembro para ver su Ficha de Acompañamiento</span>
    </div>
    <div class="members-list">
      ${team.map(m => memberCard(m)).join("")}
    </div>
  `;
}

/** Genera HTML de una tarjeta de dashboard */
function card(title, value, icon, cls, extra = "") {
  return `
    <div class="dash-card ${cls}">
      <div class="dash-card-icon">${icon}</div>
      <div class="dash-card-title">${title}</div>
      <div class="dash-card-value">${value}</div>
      ${extra}
    </div>`;
}

/** Genera HTML de tarjeta de miembro con Enfoque de Progreso Positivo */
function memberCard(m) {
  const pct  = progress(m);
  const col  = statusColor(m);
  const cls  = statusClass(m);
  
  let progressText = `Iniciando camino · ${pct}%`;
  if (pct >= 100) {
    progressText = `¡Meta personal celebrada! 🎉`;
  } else if (pct >= 70) {
    progressText = `¡A un paso del objetivo! · ${pct}%`;
  } else if (pct >= 40) {
    progressText = `¡Buen avance acumulado! · ${pct}%`;
  }

  return `
    <div class="member-card ${cls}" data-id="${m.id}" onclick="navigate('team'); setTimeout(() => toggleMemberDetail('${m.id}'), 150)" style="cursor:pointer">
      <div class="member-avatar" style="background:${col}20;border-color:${col}">
        <span style="color:${col}">${initials(m.nombre)}</span>
      </div>
      <div class="member-info">
        <div class="member-name" style="display:flex;align-items:center;justify-content:space-between">
          <span>${m.nombre}</span>
          ${m.fortalezas 
            ? `<span class="pill pill-${m.fortalezas.toLowerCase()}" style="font-size:.65rem;padding:.1rem .35rem;border-radius:4px">${m.fortalezas}</span>` 
            : ""}
        </div>
        <div class="member-meta">Acumulado: <strong>${fmt(m.puntos)} PP</strong> de su meta de ${fmt(m.metaPersonal)} PP</div>
        <div class="progress-bar">
          <div class="progress-fill" style="width:${pct}%;background:${col}"></div>
        </div>
        <div style="font-size:.75rem;color:${col};margin-top:.35rem;font-weight:500">${progressText}</div>
      </div>
      <div class="member-badge" style="color:${col}">${pct >= 100 ? "✓" : pct + "%"}</div>
    </div>`;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: MAPA DE RED — Canvas oval nodes               │
// └─────────────────────────────────────────────────────────┘

/** Construye el árbol recursivo a partir de SponsorID */
function buildTree(team) {
  const map   = {};
  const roots = [];
  team.forEach(m => { map[m.id] = { ...m, children: [] }; });
  team.forEach(m => {
    if (m.sponsorId && map[m.sponsorId]) {
      map[m.sponsorId].children.push(map[m.id]);
    } else {
      roots.push(map[m.id]);
    }
  });
  return roots;
}

function renderNetwork() {
  const el = document.getElementById("section-network");
  if (!el) return;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Arquitectura de tu Red</h2>
      <span class="section-sub">Visualización de la estructura de equipo</span>
    </div>
    <div class="view-toggle">
      <button class="view-btn ${State.networkView === "tree" ? "active" : ""}" onclick="setNetworkView('tree')">
        🌳 Vista Árbol
      </button>
      <button class="view-btn ${State.networkView === "constellation" ? "active" : ""}" onclick="setNetworkView('constellation')">
        ✨ Constelación
      </button>
    </div>
    <div id="network-container" class="network-container">
      <canvas id="network-canvas" class="network-canvas"></canvas>
      <div id="network-tooltip" class="network-tooltip" style="display:none"></div>
    </div>
  `;

  // Esperar un frame para que el DOM esté pintado
  requestAnimationFrame(() => {
    if (State.networkView === "tree") {
      initNetworkCanvas("tree");
    } else {
      initNetworkCanvas("constellation");
    }
  });
}

function setNetworkView(view) {
  State.networkView = view;
  renderNetwork();
  attachSectionListeners();
}

// ─── MOTOR DE CANVAS COMPARTIDO ──────────────────────────────

/**
 * Tamaño del nodo oval:
 * rx = semi-eje horizontal, ry = semi-eje vertical
 */
const NODE_RX = 68;
const NODE_RY = 36;

/** Devuelve el color hex puro según progreso */
function nodeColor(member) {
  const pct = progress(member);
  if (pct >= 100) return "#00A3A3"; // Teal
  if (pct >= 70)  return "#C5A880"; // Gold
  if (pct >= 40)  return "#D9B382"; // Soft Gold
  return "#789292"; // Grey-Teal
}

/** Dibuja un nodo oval sobre el canvas */
function drawOvalNode(ctx, x, y, node, scale = 1) {
  const col  = nodeColor(node);
  const pct  = progress(node);
  const rx   = NODE_RX * scale;
  const ry   = NODE_RY * scale;

  // ── Glow exterior ──
  const grd = ctx.createRadialGradient(x, y, 0, x, y, rx * 1.6);
  grd.addColorStop(0, col + "28");
  grd.addColorStop(1, "transparent");
  ctx.beginPath();
  ctx.ellipse(x, y, rx * 1.55, ry * 1.55, 0, 0, Math.PI * 2);
  ctx.fillStyle = grd;
  ctx.fill();

  // ── Fondo oval ──
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fillStyle = "#1A1A1A";
  ctx.fill();

  // ── Borde coloreado ──
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.strokeStyle = col;
  ctx.lineWidth   = 2.5 * scale;
  ctx.stroke();

  // ── Barra de progreso interna (arco inferior del oval) ──
  if (pct > 0 && pct < 100) {
    ctx.save();
    ctx.beginPath();
    ctx.ellipse(x, y, rx - 3, ry - 3, 0, 0, Math.PI * 2);
    ctx.clip();
    ctx.fillStyle = col + "18";
    ctx.fillRect(x - rx, y + ry * 0.45, rx * 2 * (pct / 100), ry * 0.55);
    ctx.restore();
  }

  // ── Nombre ──
  ctx.textAlign    = "center";
  ctx.textBaseline = "middle";
  ctx.fillStyle    = "#FFFFFF";
  ctx.font         = `bold ${Math.round(14 * scale)}px Inter, system-ui, sans-serif`;
  ctx.fillText(node.nombre, x, y - 6 * scale);

  // ── Puntos ──
  ctx.fillStyle = col;
  ctx.font      = `${Math.round(11 * scale)}px Inter, system-ui, sans-serif`;
  ctx.fillText(fmt(node.puntos) + " pts", x, y + 10 * scale);
}

/**
 * Dibuja una línea curva entre dos nodos ovales.
 * Usa una curva de Bezier cúbica para suavidad.
 */
function drawEdge(ctx, x1, y1, x2, y2, col) {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  // Control points: desplazados perpendicular levemente
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy) || 1;
  // Curvatura proporcional a la distancia
  const curve = len * 0.18;
  const cx1 = mx - dy / len * curve;
  const cy1 = my + dx / len * curve;

  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.quadraticCurveTo(cx1, cy1, x2, y2);
  ctx.strokeStyle = col || "rgba(77,163,255,0.25)";
  ctx.lineWidth   = 2;
  ctx.setLineDash([]);
  ctx.stroke();
}

// ─── LAYOUT: ÁRBOL JERÁRQUICO ────────────────────────────────

/**
 * Asigna posiciones X,Y en layout jerárquico top-down.
 * Calcula el ancho de subárbol de cada nodo para distribuir correctamente.
 */
function computeTreeLayout(roots, canvasW, canvasH) {
  const positions = {};
  const levelH    = Math.min(canvasH * 0.28, 160); // separación vertical entre niveles
  const marginX   = NODE_RX + 20;

  // Paso 1: calcular el "peso" (número de hojas) de cada subárbol
  function subtreeWidth(node) {
    if (!node.children || node.children.length === 0) return 1;
    return node.children.reduce((s, c) => s + subtreeWidth(c), 0);
  }

  // Paso 2: asignar posiciones recursivamente
  function assign(nodeList, startX, y, totalWidth) {
    let cursor = startX;
    nodeList.forEach(node => {
      const w     = subtreeWidth(node);
      const share = (totalWidth * w) / nodeList.reduce((s, n) => s + subtreeWidth(n), 0);
      const nx    = cursor + share / 2;
      positions[node.id] = { ...node, x: nx, y };
      if (node.children && node.children.length) {
        assign(node.children, cursor, y + levelH, share);
      }
      cursor += share;
    });
  }

  assign(roots, marginX, 70, canvasW - marginX * 2);
  return positions;
}

// ─── LAYOUT: CONSTELACIÓN RADIAL ────────────────────────────

function computeConstellationLayout(roots, canvasW, canvasH) {
  const positions = {};
  const cx = canvasW / 2;
  const cy = canvasH / 2;

  function assignRadial(nodeList, parentX, parentY, angleStart, angleEnd, radius) {
    const count = nodeList.length;
    nodeList.forEach((n, i) => {
      const angle = count === 1
        ? (angleStart + angleEnd) / 2
        : angleStart + (i / (count - 1)) * (angleEnd - angleStart);
      const x = parentX + Math.cos(angle) * radius;
      const y = parentY + Math.sin(angle) * radius;
      positions[n.id] = { ...n, x, y };
      if (n.children && n.children.length) {
        const spread = Math.max(0.7, Math.PI / (n.children.length + 1));
        assignRadial(n.children, x, y, angle - spread, angle + spread, radius * 0.72);
      }
    });
  }

  const baseR = Math.min(canvasW, canvasH) * 0.32;

  if (roots.length === 1) {
    const r = roots[0];
    positions[r.id] = { ...r, x: cx, y: cy };
    if (r.children && r.children.length) {
      const angleStep = (Math.PI * 2) / r.children.length;
      r.children.forEach((c, i) => {
        const a = -Math.PI / 2 + angleStep * i;
        const x = cx + Math.cos(a) * baseR;
        const y = cy + Math.sin(a) * baseR;
        positions[c.id] = { ...c, x, y };
        if (c.children && c.children.length) {
          const spread = Math.max(0.5, Math.PI / (c.children.length + 1));
          assignRadial(c.children, x, y, a - spread, a + spread, baseR * 0.6);
        }
      });
    }
  } else {
    assignRadial(roots, cx, cy, 0, Math.PI * 2, baseR);
  }

  return positions;
}

// ─── INICIALIZACIÓN DEL CANVAS ───────────────────────────────

function initNetworkCanvas(mode) {
  const canvas = document.getElementById("network-canvas");
  if (!canvas) return;

  const container = document.getElementById("network-container");
  const dpr       = window.devicePixelRatio || 1;
  const W         = container.clientWidth  || 800;
  const H         = container.clientHeight || 560;

  // HiDPI
  canvas.width  = W * dpr;
  canvas.height = H * dpr;
  canvas.style.width  = W + "px";
  canvas.style.height = H + "px";

  const ctx = canvas.getContext("2d");
  ctx.scale(dpr, dpr);

  const team  = State.team;
  const roots = buildTree(team);

  // Calcular posiciones según modo
  const positions = mode === "tree"
    ? computeTreeLayout(roots, W, H)
    : computeConstellationLayout(roots, W, H);

  // Guardar para tooltips/hover
  canvas._positions = positions;
  canvas._mode      = mode;

  drawNetwork(ctx, W, H, positions, team);

  // ── Tooltip en hover ──
  canvas.onmousemove = e => {
    const rect  = canvas.getBoundingClientRect();
    const mx    = e.clientX - rect.left;
    const my    = e.clientY - rect.top;
    const tooltip = document.getElementById("network-tooltip");
    let hit = null;

    Object.values(positions).forEach(n => {
      const dx = mx - n.x;
      const dy = my - n.y;
      // Test punto dentro del oval
      if ((dx * dx) / (NODE_RX * NODE_RX) + (dy * dy) / (NODE_RY * NODE_RY) <= 1) {
        hit = n;
      }
    });

    if (hit && tooltip) {
      const pct = progress(hit);
      const col = nodeColor(hit);
      tooltip.style.display = "block";
      tooltip.style.left    = (n => n.x + NODE_RX + 8)(hit) + "px";
      tooltip.style.top     = (n => n.y - NODE_RY)(hit) + "px";
      tooltip.innerHTML = `
        <div class="tt-name" style="color:${col}">${hit.nombre}</div>
        <div class="tt-row">Puntos: <strong>${fmt(hit.puntos)}</strong></div>
        <div class="tt-row">Meta: <strong>${fmt(hit.metaPersonal)}</strong></div>
        <div class="tt-row">Avance: <strong style="color:${col}">${pct}%</strong></div>
        <div class="tt-bar"><div style="width:${pct}%;background:${col};height:100%;border-radius:4px"></div></div>
      `;
      canvas.style.cursor = "pointer";
    } else {
      if (tooltip) tooltip.style.display = "none";
      canvas.style.cursor = "default";
    }
  };

  canvas.onmouseleave = () => {
    const tooltip = document.getElementById("network-tooltip");
    if (tooltip) tooltip.style.display = "none";
  };
}

function drawNetwork(ctx, W, H, positions, team) {
  ctx.clearRect(0, 0, W, H);

  // ── 1. Dibujar bordes (líneas) PRIMERO ──
  team.forEach(m => {
    if (m.sponsorId && positions[m.id] && positions[m.sponsorId]) {
      const from = positions[m.sponsorId];
      const to   = positions[m.id];
      const col  = nodeColor(from) + "50";
      drawEdge(ctx, from.x, from.y, to.x, to.y, col);
    }
  });

  // ── 2. Dibujar nodos encima ──
  Object.values(positions).forEach(n => {
    drawOvalNode(ctx, n.x, n.y, n);
  });
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: OBJETIVOS                                     │
// └─────────────────────────────────────────────────────────┘

function renderGoals() {
  const el = document.getElementById("section-goals");
  if (!el) return;

  const goalOptions = [
    ...LEVELS.map(l => l.label),
    "Gana Más", "Mini Bronce", "Personalizado"
  ];

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Objetivos</h2>
      <span class="section-sub">Analiza el estado de cada meta</span>
    </div>
    <div class="goal-selector">
      ${goalOptions.map(g => `
        <button class="goal-btn ${State.goalMode === g ? "active" : ""}"
                onclick="setGoalMode('${g}')">${g}</button>
      `).join("")}
    </div>
    <div id="goal-result" class="goal-result">
      ${renderGoalResult()}
    </div>
  `;
}

function setGoalMode(mode) {
  State.goalMode = mode;
  const resultEl = document.getElementById("goal-result");
  if (resultEl) resultEl.innerHTML = renderGoalResult();

  document.querySelectorAll(".goal-btn").forEach(b => {
    b.classList.toggle("active", b.textContent.trim() === mode);
  });
}

function renderGoalResult() {
  const mode = State.goalMode;
  const team = State.team.filter(m => m.activo);
  const total = groupTotal(State.team);

  // ── Niveles porcentuales ──
  const levelObj = LEVELS.find(l => l.label === mode);
  if (levelObj) {
    const diff = levelObj.points - total;
    const done = diff <= 0;
    return `
      <div class="goal-card ${done ? "goal-done" : "goal-pending"}">
        <div class="goal-icon">${done ? "🏆" : "🎯"}</div>
        <div class="goal-main">
          <div class="goal-label">Nivel ${mode} — ${fmt(levelObj.points)} puntos grupales</div>
          <div class="goal-value">${done
            ? `✅ <strong>¡Objetivo cumplido!</strong> Tienes ${fmt(total)} puntos`
            : `Faltan <strong>${fmt(diff)}</strong> puntos (actual: ${fmt(total)})`}</div>
          <div class="progress-bar" style="margin-top:.75rem">
            <div class="progress-fill" style="width:${Math.min(100,(total/levelObj.points)*100)}%;
              background:${done?"var(--green)":"var(--blue)"}"></div>
          </div>
        </div>
      </div>`;
  }

  // ── Gana Más ──
  if (mode === "Gana Más") {
    const req = State.goalConfig.ganaMas.puntosRequeridos;
    return `
      <div class="goal-header-info">
        Cada miembro debe alcanzar <strong>${req} puntos</strong>.
        <button class="btn-config" onclick="configGanaMas()">⚙ Configurar</button>
      </div>
      <div class="members-list">
        ${team.map(m => {
          const done = m.puntos >= req;
          const diff = req - m.puntos;
          const col  = done ? "var(--green)" : "var(--violet)";
          return `
            <div class="member-card" style="border-color:${col}30">
              <div class="member-avatar" style="background:${col}20;border-color:${col}">
                <span style="color:${col}">${initials(m.nombre)}</span>
              </div>
              <div class="member-info">
                <div class="member-name">${m.nombre}</div>
                <div class="member-meta">${fmt(m.puntos)} / ${fmt(req)} pts</div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${Math.min(100,(m.puntos/req)*100)}%;background:${col}"></div>
                </div>
              </div>
              <div class="member-badge" style="color:${col}">
                ${done ? "✓" : "−" + fmt(diff)}
              </div>
            </div>`;
        }).join("")}
      </div>`;
  }

  // ── Mini Bronce ──
  if (mode === "Mini Bronce") {
    const cfg = State.goalConfig.miniBronce;
    const roots = buildTree(State.team);
    const lider = roots[0]; // primer nodo raíz = líder
    const frontales = lider ? lider.children : [];

    const liderOk = lider && lider.puntos >= cfg.liderPuntos;
    const frontalesOk = frontales.filter(f => f.puntos >= cfg.frontalesPuntos);
    const metCant = frontalesOk.length >= cfg.frontalesCant;
    const allDone = liderOk && metCant;

    return `
      <div class="goal-header-info">
        Líder ≥ <strong>${cfg.liderPuntos} pts</strong> · 
        ${cfg.frontalesCant} frontales ≥ <strong>${cfg.frontalesPuntos} pts</strong> c/u.
        <button class="btn-config" onclick="configMiniBronce()">⚙ Configurar</button>
      </div>
      <div class="goal-card ${allDone ? "goal-done" : "goal-pending"}" style="margin-bottom:1rem">
        <div class="goal-icon">${allDone ? "🥉" : "🎯"}</div>
        <div class="goal-main">
          <div class="goal-label">${allDone ? "¡Mini Bronce cumplido!" : "Mini Bronce en progreso"}</div>
          <div class="goal-value">
            ${lider ? `Líder (${lider.nombre}): ${fmt(lider.puntos)} pts ${liderOk ? "✅" : "❌"}` : "Sin líder definido"}<br>
            Frontales calificados: ${frontalesOk.length} / ${cfg.frontalesCant} ${metCant ? "✅" : "❌"}
          </div>
        </div>
      </div>
      <div class="members-list">
        ${frontales.map(f => {
          const done = f.puntos >= cfg.frontalesPuntos;
          const col  = done ? "var(--green)" : "var(--violet)";
          return `
            <div class="member-card" style="border-color:${col}30">
              <div class="member-avatar" style="background:${col}20;border-color:${col}">
                <span style="color:${col}">${initials(f.nombre)}</span>
              </div>
              <div class="member-info">
                <div class="member-name">${f.nombre}</div>
                <div class="member-meta">${fmt(f.puntos)} / ${fmt(cfg.frontalesPuntos)} pts</div>
                <div class="progress-bar">
                  <div class="progress-fill" style="width:${Math.min(100,(f.puntos/cfg.frontalesPuntos)*100)}%;background:${col}"></div>
                </div>
              </div>
              <div class="member-badge" style="color:${col}">${done ? "✓" : "−" + fmt(cfg.frontalesPuntos - f.puntos)}</div>
            </div>`;
        }).join("")}
      </div>`;
  }

  // ── Personalizado ──
  if (mode === "Personalizado") {
    const req = State.goalConfig.personalizado.puntos;
    const diff = req - groupTotal(State.team);
    const done = diff <= 0;
    return `
      <div class="goal-card ${done ? "goal-done" : "goal-pending"}">
        <div class="goal-icon">${done ? "🏆" : "🎯"}</div>
        <div class="goal-main">
          <div class="goal-label">Meta personalizada: ${fmt(req)} puntos grupales</div>
          <div class="goal-value">${done ? "✅ ¡Meta cumplida!" : `Faltan <strong>${fmt(diff)}</strong> puntos`}</div>
          <div class="progress-bar" style="margin-top:.75rem">
            <div class="progress-fill" style="width:${Math.min(100,(groupTotal(State.team)/req)*100)}%;
              background:${done?"var(--green)":"var(--blue)"}"></div>
          </div>
          <div style="margin-top:1rem;display:flex;gap:.5rem;align-items:center">
            <label style="color:#888;font-size:.85rem">Meta:</label>
            <input type="number" id="custom-goal-input" value="${req}" min="1"
              style="background:#1C1C1C;border:1px solid #333;color:#fff;padding:.4rem .75rem;
                     border-radius:8px;width:120px;font-size:.9rem"
              oninput="setCustomGoal(this.value)">
            <span style="color:#888;font-size:.85rem">puntos</span>
          </div>
        </div>
      </div>`;
  }

  return "";
}

/** Configuraciones rápidas de objetivos */
function configGanaMas() {
  const val = prompt("Puntos requeridos por persona (Gana Más):", State.goalConfig.ganaMas.puntosRequeridos);
  if (val && !isNaN(val)) {
    State.goalConfig.ganaMas.puntosRequeridos = Number(val);
    renderGoals();
    attachSectionListeners();
  }
}

function configMiniBronce() {
  const lPts  = prompt("Puntos del líder:", State.goalConfig.miniBronce.liderPuntos);
  if (!lPts || isNaN(lPts)) return;
  const fCant = prompt("Número de frontales requeridos:", State.goalConfig.miniBronce.frontalesCant);
  if (!fCant || isNaN(fCant)) return;
  const fPts  = prompt("Puntos por frontal:", State.goalConfig.miniBronce.frontalesPuntos);
  if (!fPts || isNaN(fPts)) return;

  State.goalConfig.miniBronce = {
    liderPuntos:    Number(lPts),
    frontalesCant:  Number(fCant),
    frontalesPuntos:Number(fPts),
  };
  renderGoals();
  attachSectionListeners();
}

function setCustomGoal(val) {
  if (!isNaN(val) && Number(val) > 0) {
    State.goalConfig.personalizado.puntos = Number(val);
    const resultEl = document.getElementById("goal-result");
    if (resultEl) resultEl.innerHTML = renderGoalResult();
  }
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: SIMULADOR                                     │
// └─────────────────────────────────────────────────────────┘

function renderSimulator() {
  const el = document.getElementById("section-simulator");
  if (!el) return;

  const team = State.team;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Simulador Quantum</h2>
      <span class="section-sub">Carga puntos hipotéticos sin guardar y visualiza el impacto</span>
    </div>
    <div class="sim-grid">
      <div class="sim-inputs">
        <h3 class="sim-subtitle">Puntos adicionales hipotéticos</h3>
        ${team.filter(m => m.activo).map(m => `
          <div class="sim-row">
            <div class="sim-member">
              <div class="sim-avatar">${initials(m.nombre)}</div>
              <span>${m.nombre}</span>
              <span class="sim-current">(${fmt(m.puntos)} pts)</span>
            </div>
            <input type="number" class="sim-input" min="0"
              id="sim-${m.id}"
              value="${State.simulatorData[m.id] || 0}"
              placeholder="+ puntos"
              oninput="updateSimulator()">
          </div>
        `).join("")}
        <div class="sim-actions">
          <button class="btn-primary" onclick="updateSimulator()">🔄 Recalcular</button>
          <button class="btn-secondary" onclick="resetSimulator()">✕ Resetear</button>
        </div>
      </div>
      <div class="sim-result" id="sim-result">
        ${renderSimResult()}
      </div>
    </div>
  `;
}

function updateSimulator() {
  State.team.forEach(m => {
    const inp = document.getElementById("sim-" + m.id);
    if (inp) State.simulatorData[m.id] = Number(inp.value) || 0;
  });
  const el = document.getElementById("sim-result");
  if (el) el.innerHTML = renderSimResult();
}

function resetSimulator() {
  State.simulatorData = {};
  renderSimulator();
  attachSectionListeners();
}

function renderSimResult() {
  const team     = State.team;
  const simData  = State.simulatorData;
  const realTotal = groupTotal(team);
  const simTotal  = simGroupTotal(team, simData);
  const diff      = simTotal - realTotal;
  const { current: rCur, next: rNext } = calcLevel(realTotal);
  const { current: sCur, next: sNext } = calcLevel(simTotal);
  const levelUp   = (!rCur && sCur) || (rCur && sCur && rCur.label !== sCur.label);
  const faltaSim  = sNext ? sNext.points - simTotal : 0;

  return `
    <div class="sim-result-card">
      <div class="sim-res-row">
        <span>Total actual</span>
        <strong>${fmt(realTotal)} pts</strong>
      </div>
      <div class="sim-res-row sim-res-highlight">
        <span>Total simulado</span>
        <strong style="color:var(--blue)">${fmt(simTotal)} pts</strong>
      </div>
      <div class="sim-res-row">
        <span>Diferencia</span>
        <strong style="color:var(--green)">+${fmt(diff)} pts</strong>
      </div>
      <hr style="border-color:#333;margin:.75rem 0">
      <div class="sim-res-row">
        <span>Nivel actual</span>
        <strong>${rCur ? rCur.label : "Sin nivel"}</strong>
      </div>
      <div class="sim-res-row">
        <span>Nivel simulado</span>
        <strong style="color:${levelUp ? "var(--green)" : "var(--blue)"}">
          ${sCur ? sCur.label : "Sin nivel"} ${levelUp ? "⬆ SUBE" : ""}
        </strong>
      </div>
      <div class="sim-res-row">
        <span>Falta para siguiente</span>
        <strong style="color:${faltaSim === 0 ? "var(--green)" : "var(--yellow)"}">
          ${faltaSim > 0 ? fmt(faltaSim) + " pts" : "¡Siguiente nivel alcanzado!"}
        </strong>
      </div>
      ${levelUp ? `
        <div class="sim-celebrate">
          🎉 ¡Con estos puntos subes a <strong>${sCur.label}</strong>!
        </div>` : ""}
      <div class="progress-bar" style="margin-top:1rem;height:8px">
        <div class="progress-fill"
          style="width:${sNext ? Math.min(100,(simTotal/sNext.points)*100) : 100}%;background:var(--blue);transition:width .5s ease"></div>
      </div>
    </div>`;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: CAMINO SUGERIDO                               │
// └─────────────────────────────────────────────────────────┘

function renderPath() {
  const el = document.getElementById("section-path");
  if (!el) return;

  const active = State.team.filter(m => m.activo);
  // Ordenar por puntos faltantes ascendente (más cerca primero)
  const sorted = [...active].sort((a, b) => {
    const diffA = Math.max(0, a.metaPersonal - a.puntos);
    const diffB = Math.max(0, b.metaPersonal - b.puntos);
    return diffA - diffB;
  });

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Camino Sugerido</h2>
      <span class="section-sub">Prioridad de atención para alcanzar objetivos más rápido</span>
    </div>
    <div class="path-list">
      ${sorted.map((m, idx) => {
        const diff = Math.max(0, m.metaPersonal - m.puntos);
        const pct  = progress(m);
        const col  = statusColor(m);
        const done = diff === 0;
        return `
          <div class="path-card">
            <div class="path-rank ${done ? "rank-done" : idx === 0 ? "rank-1" : idx === 1 ? "rank-2" : "rank-n"}">
              ${done ? "✓" : "#" + (idx + 1)}
            </div>
            <div class="path-avatar" style="background:${col}20;border-color:${col}">
              <span style="color:${col}">${initials(m.nombre)}</span>
            </div>
            <div class="path-info">
              <div class="path-name">${m.nombre}</div>
              <div class="path-detail">
                ${done
                  ? `<span style="color:var(--green)">✅ Meta cumplida (${fmt(m.puntos)} pts)</span>`
                  : `Faltan <strong style="color:${col}">${fmt(diff)} puntos</strong> para su meta de ${fmt(m.metaPersonal)}`}
              </div>
              <div class="progress-bar" style="margin-top:6px">
                <div class="progress-fill" style="width:${pct}%;background:${col}"></div>
              </div>
            </div>
            <div class="path-priority">
              ${done
                ? `<span class="pill pill-green">Completo</span>`
                : idx === 0
                  ? `<span class="pill pill-blue">🔥 Prioritario</span>`
                  : idx === 1
                    ? `<span class="pill pill-yellow">⚡ Alto</span>`
                    : `<span class="pill pill-grey">Normal</span>`}
            </div>
          </div>`;
      }).join("")}
    </div>
    <div class="path-insight">
      <div class="insight-icon">💡</div>
      <div class="insight-text">
        Enfocarte en <strong>${sorted[0]?.nombre || "el equipo"}</strong> primero puede desencadenar 
        el avance grupal más eficiente. Ayuda a los que están más cerca de su meta.
      </div>
    </div>
  `;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: EQUIPO (gestión)                              │
// └─────────────────────────────────────────────────────────┘

function renderTeam() {
  const el = document.getElementById("section-team");
  if (!el) return;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Acompañamiento y Gestión de Equipo</h2>
      <span class="section-sub">Registra y acompaña el crecimiento humano y profesional de tu red</span>
    </div>
    
    <div class="alert-info" style="margin-bottom:1.5rem;background:rgba(77,163,255,.05);border:1px solid rgba(77,163,255,.15);padding:1rem;border-radius:12px;font-size:.85rem;line-height:1.6">
      <strong>💡 Acompañamiento Quantum:</strong> Creemos que cada persona tiene tiempos, objetivos y formas de aprender diferentes. Haz clic en la fila de cualquier miembro para desplegar su <strong>Ficha de Crecimiento Humano</strong>, ver sus fortalezas, necesidades de tiempo y acordar próximos pasos sin presiones.
    </div>

    <button class="btn-primary" style="margin-bottom:1.5rem" onclick="openMemberModal()">
      + Agregar Miembro
    </button>
    
    <div class="team-table-wrap">
      <table class="team-table">
        <thead>
          <tr>
            <th>Miembro</th><th>Sponsor</th><th>Puntos</th>
            <th>Meta</th><th>Avance</th><th>Activo</th><th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${State.team.map(m => {
            const sponsor = State.team.find(t => t.id === m.sponsorId);
            const pct = progress(m);
            const col = statusColor(m);
            return `
              <tr onclick="toggleMemberDetail('${m.id}', event)" style="cursor:pointer" class="member-main-row">
                <td>
                  <div style="display:flex;align-items:center;gap:.4rem">
                    <span id="exp-${m.id}" style="color:var(--grey);font-size:.7rem;width:12px;text-align:center;user-select:none">▶</span>
                    <div class="table-avatar" style="background:${col}20;border-color:${col}">
                      <span style="color:${col}">${initials(m.nombre)}</span>
                    </div>
                    <strong>${m.nombre}</strong>
                  </div>
                </td>
                <td>${sponsor ? sponsor.nombre : "—"}</td>
                <td>${fmt(m.puntos)} PP</td>
                <td>${fmt(m.metaPersonal)} PP</td>
                <td>
                  <div style="display:flex;align-items:center;gap:.5rem;min-width:100px">
                    <div class="progress-bar" style="flex:1;height:6px">
                      <div class="progress-fill" style="width:${pct}%;background:${col}"></div>
                    </div>
                    <span style="color:${col};font-size:.8rem;font-weight:600">${pct}%</span>
                  </div>
                </td>
                <td><span class="pill ${m.activo ? "pill-green" : "pill-grey"}">${m.activo ? "Sí" : "No"}</span></td>
                <td>
                  <div style="display:flex;gap:.4rem" onclick="event.stopPropagation()">
                    <button class="btn-icon" onclick="openMemberModal('${m.id}')" title="Editar">✏️</button>
                    <button class="btn-icon btn-icon-danger" onclick="confirmDelete('${m.id}')" title="Eliminar">🗑</button>
                  </div>
                </td>
              </tr>
              
              <!-- Ficha de Crecimiento Humano (Accordion) -->
              <tr id="detail-${m.id}" class="member-detail-row" style="display:none;background:#0d0d0d">
                <td colspan="7" style="padding:0">
                  <div class="member-detail-container" style="padding:1.5rem;border-left:3px solid ${col};display:grid;grid-template-columns:repeat(auto-fit, minmax(220px, 1fr));gap:1.5rem">
                    
                    <div class="detail-col">
                      <h4 style="color:${col};margin-bottom:.5rem;font-size:.9rem;display:flex;align-items:center;gap:.3rem">
                        <span>👤</span> Ficha de Crecimiento
                      </h4>
                      <div style="font-size:.85rem;line-height:1.7;color:#eee">
                        <div style="margin-bottom:.3rem">
                          <strong style="color:var(--grey2)">Fortaleza:</strong> 
                          ${m.fortalezas 
                            ? `<span class="pill pill-${m.fortalezas.toLowerCase()}" style="font-size:.7rem;padding:.1rem .35rem;border-radius:4px">${m.fortalezas}</span>` 
                            : '<span style="color:var(--grey)">Por definir</span>'}
                        </div>
                        <div style="margin-bottom:.3rem">
                          <strong style="color:var(--grey2)">Tiempo Disp.:</strong> 
                          <span>${m.tiempoDisponible || '<span style="color:var(--grey)">No especificado</span>'}</span>
                        </div>
                        <div>
                          <strong style="color:var(--grey2)">Objetivo Clave:</strong> 
                          <span>${m.objetivosPersonales || '<span style="color:var(--grey)">Sin definir</span>'}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div class="detail-col">
                      <h4 style="color:${col};margin-bottom:.5rem;font-size:.9rem;display:flex;align-items:center;gap:.3rem">
                        <span>💡</span> Intereses y Motivaciones
                      </h4>
                      <p style="font-size:.85rem;line-height:1.6;color:#ccc;white-space:pre-line">${m.intereses || 'No se han registrado intereses específicos. Escucha qué le apasiona a esta persona en la próxima charla.'}</p>
                    </div>
                    
                    <div class="detail-col">
                      <h4 style="color:${col};margin-bottom:.5rem;font-size:.9rem;display:flex;align-items:center;gap:.3rem">
                        <span>📝</span> Observaciones
                      </h4>
                      <p style="font-size:.85rem;line-height:1.6;color:#ccc;white-space:pre-line">${m.observaciones || 'Sin anotaciones de acompañamiento. Registra detalles para personalizar su crecimiento.'}</p>
                    </div>
                    
                    <div class="detail-col" style="border-left:1px solid #222;padding-left:1.5rem">
                      <h4 style="color:var(--green);margin-bottom:.5rem;font-size:.9rem;display:flex;align-items:center;gap:.3rem">
                        <span>🎯</span> Próximos Pasos (Sin Presión)
                      </h4>
                      <div class="next-steps-badge" style="background:rgba(46,204,113,.03);border:1px solid rgba(46,204,113,.15);padding:.75rem;border-radius:8px;font-size:.85rem;line-height:1.6;color:#e6fffa">
                        👉 ${m.proximosPasos || 'Construir un acuerdo mutuo en la próxima charla.'}
                      </div>
                      <div style="margin-top:.75rem;font-size:.75rem;color:var(--grey)">
                        Última actualización: ${m.fechaActualizacion || '—'}
                      </div>
                    </div>
                    
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

/** Toggle de acordeón de miembros en Equipo */
function toggleMemberDetail(memberId, event) {
  // Evitar disparar si se hace click en las acciones (botones de editar/eliminar)
  if (event && (event.target.closest('.btn-icon') || event.target.tagName === 'BUTTON' || event.target.tagName === 'INPUT')) {
    return;
  }
  
  const row = document.getElementById("detail-" + memberId);
  const exp = document.getElementById("exp-" + memberId);
  if (!row) return;

  if (row.style.display === "none") {
    row.style.display = "table-row";
    if (exp) {
      exp.textContent = "▼";
      exp.style.color = "var(--blue)";
    }
  } else {
    row.style.display = "none";
    if (exp) {
      exp.textContent = "▶";
      exp.style.color = "var(--grey)";
    }
  }
}

// ──────────────────────────────────────────────
//  MODAL: Agregar / Editar miembro
// ──────────────────────────────────────────────

function openMemberModal(editId) {
  const member = editId ? State.team.find(m => m.id === editId) : null;
  const isEdit = !!member;

  // Opciones de sponsor (excluir al propio miembro si editando)
  const sponsors = State.team.filter(m => !editId || m.id !== editId);

  const modal = document.getElementById("modal-overlay");
  modal.innerHTML = `
    <div class="modal" role="dialog" aria-modal="true">
      <div class="modal-header">
        <h3>${isEdit ? "Editar Miembro" : "Agregar Miembro"}</h3>
        <button class="modal-close" onclick="closeModal()">✕</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label>Nombre *</label>
          <input id="f-nombre" type="text" class="form-input" value="${member ? member.nombre : ""}" placeholder="Nombre completo">
        </div>
        <div class="form-group">
          <label>Sponsor (upline)</label>
          <select id="f-sponsor" class="form-input">
            <option value="">— Sin sponsor (raíz) —</option>
            ${sponsors.map(s => `
              <option value="${s.id}" ${member && member.sponsorId === s.id ? "selected" : ""}>${s.nombre}</option>
            `).join("")}
          </select>
        </div>
        <div class="form-group">
          <label>Puntos actuales</label>
          <input id="f-puntos" type="number" class="form-input" min="0" value="${member ? member.puntos : 0}">
        </div>
        <div class="form-group">
          <label>Meta personal</label>
          <input id="f-meta" type="number" class="form-input" min="0" value="${member ? member.metaPersonal : 150}">
        </div>
        <div class="form-group">
          <label>Tiempo disponible (ej: 8h/semana, tiempo completo)</label>
          <input id="f-tiempo" type="text" class="form-input" value="${member?.tiempoDisponible || ""}" placeholder="Ej: 10 horas semanales">
        </div>
        <div class="form-group">
          <label>Intereses personales y del negocio</label>
          <input id="f-intereses" type="text" class="form-input" value="${member?.intereses || ""}" placeholder="Ej: Ventas, liderazgo, desarrollo personal">
        </div>
        <div class="form-group">
          <label>Fortaleza / Perfil Quantum sugerido</label>
          <select id="f-fortaleza" class="form-input">
            <option value="" ${!member?.fortalezas ? "selected" : ""}>— Por descubrir —</option>
            <option value="Constructor" ${member?.fortalezas === "Constructor" ? "selected" : ""}>🌐 Constructor (Crear red)</option>
            <option value="Educador" ${member?.fortalezas === "Educador" ? "selected" : ""}>📚 Educador (Enseñar y guiar)</option>
            <option value="Técnico" ${member?.fortalezas === "Técnico" ? "selected" : ""}>⚙️ Técnico (Sistemas e investigación)</option>
            <option value="Comercial" ${member?.fortalezas === "Comercial" ? "selected" : ""}>🛍️ Comercial (Venta y contacto)</option>
          </select>
        </div>
        <div class="form-group">
          <label>Objetivos específicos de crecimiento</label>
          <input id="f-objetivos" type="text" class="form-input" value="${member?.objetivosPersonales || ""}" placeholder="Ej: Llegar al 6% este mes">
        </div>
        <div class="form-group">
          <label>Observaciones de acompañamiento</label>
          <textarea id="f-observaciones" class="form-input" style="height:60px;resize:vertical" placeholder="Notas de empatía, escucha activa o situación actual">${member?.observaciones || ""}</textarea>
        </div>
        <div class="form-group">
          <label>Próximos pasos a seguir</label>
          <input id="f-proximos" type="text" class="form-input" value="${member?.proximosPasos || ""}" placeholder="Ej: Agendar taller de inicio de red">
        </div>
        <div class="form-group">
          <label>
            <input type="checkbox" id="f-activo" ${!member || member.activo ? "checked" : ""}
              style="accent-color:var(--blue);margin-right:.4rem">
            Miembro activo
          </label>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-secondary" onclick="closeModal()">Cancelar</button>
        <button class="btn-primary" onclick="submitMember('${editId || ""}')">
          ${isEdit ? "Guardar cambios" : "Agregar"}
        </button>
      </div>
    </div>`;
  modal.style.display = "flex";
  document.getElementById("f-nombre").focus();
}

function closeModal() {
  const modal = document.getElementById("modal-overlay");
  if (modal) modal.style.display = "none";
}

async function submitMember(editId) {
  const nombre = document.getElementById("f-nombre").value.trim();
  if (!nombre) { alert("El nombre es requerido."); return; }

  const id = editId || String(Date.now());
  const member = {
    id,
    nombre,
    sponsorId:   document.getElementById("f-sponsor").value || "",
    puntos:      Number(document.getElementById("f-puntos").value) || 0,
    metaPersonal:Number(document.getElementById("f-meta").value) || 150,
    activo:      document.getElementById("f-activo").checked,
    fechaActualizacion: new Date().toISOString().split("T")[0],
    tiempoDisponible: document.getElementById("f-tiempo").value.trim(),
    intereses:        document.getElementById("f-intereses").value.trim(),
    fortalezas:       document.getElementById("f-fortaleza").value,
    objetivosPersonales: document.getElementById("f-objetivos").value.trim(),
    observaciones:    document.getElementById("f-observaciones").value.trim(),
    proximosPasos:    document.getElementById("f-proximos").value.trim(),
  };

  closeModal();
  await saveMember(member);
  renderAll();
  attachSectionListeners();
}

function confirmDelete(id) {
  const m = State.team.find(t => t.id === id);
  if (!m) return;
  if (!confirm(`¿Eliminar a ${m.nombre} de la red? Esta acción no se puede deshacer.`)) return;
  deleteMember(id).then(() => { renderAll(); attachSectionListeners(); });
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: HISTORIAL                                     │
// └─────────────────────────────────────────────────────────┘

function renderHistory() {
  const el = document.getElementById("section-history");
  if (!el) return;

  const hist = [...State.history].reverse();

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Historial</h2>
      <span class="section-sub">Registro de snapshots del grupo</span>
    </div>
    <button class="btn-primary" style="margin-bottom:1.5rem" onclick="takeSnapshot()">
      📸 Guardar Snapshot Ahora
    </button>
    ${hist.length === 0
      ? `<div class="empty-state">Sin historial guardado aún. ¡Guarda tu primer snapshot!</div>`
      : `<div class="history-list">
          ${hist.map(h => `
            <div class="history-card">
              <div class="history-date">${h.fecha}</div>
              <div class="history-body">
                <div class="history-stat">
                  <span class="history-label">Total grupal</span>
                  <span class="history-value">${fmt(h.totalGrupal)} pts</span>
                </div>
                <div class="history-stat">
                  <span class="history-label">Nivel</span>
                  <span class="history-value">${h.nivel || "—"}</span>
                </div>
                <div class="history-stat">
                  <span class="history-label">Objetivo</span>
                  <span class="history-value">${h.objetivo || "—"}</span>
                </div>
                ${h.observacion ? `<div class="history-obs">${h.observacion}</div>` : ""}
              </div>
            </div>`).join("")}
        </div>`}
  `;
}

async function takeSnapshot() {
  const total = groupTotal(State.team);
  const { current } = calcLevel(total);
  const { next } = calcLevel(total);

  const obs = prompt("Observación (opcional):", "");
  const snap = {
    fecha:       new Date().toISOString().split("T")[0],
    totalGrupal: total,
    nivel:       current ? current.label : "Sin nivel",
    objetivo:    next ? next.label : "Máximo",
    observacion: obs || "",
  };

  // Guardar localmente en historial
  State.history.push(snap);
  saveHistoryToLocal(State.history);
  await saveSnapshot(snap);
  renderHistory();
  attachSectionListeners();
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: CONFIGURACIÓN                                 │
// └─────────────────────────────────────────────────────────┘

function renderSettings() {
  const el = document.getElementById("section-settings");
  if (!el) return;

  const user = State.userProfile;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Configuración</h2>
      <span class="section-sub">Ajustá la conexión con Google Sheets y perfil de duplicación</span>
    </div>
    
    <!-- Perfil del usuario -->
    <div class="settings-card" style="background:var(--bg2); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius); margin-bottom:1.5rem">
      <h3 class="settings-title" style="font-size:1.05rem; font-weight:700; color:var(--white); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem">👤 Perfil Mentor Digital</h3>
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1rem">
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">Tu nombre</label>
          <input id="set-user-name" type="text" class="form-input" style="padding:0.5rem; font-size:0.85rem" value="${user.nombre || ''}" placeholder="Ej: Jon">
        </div>
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">Nombre de tu Sponsor</label>
          <input id="set-user-sponsor" type="text" class="form-input" style="padding:0.5rem; font-size:0.85rem" value="${user.sponsor || ''}" placeholder="Ej: Joy">
        </div>
      </div>
      <button class="btn-primary" style="width:100%" onclick="saveUserProfileSettings()">💾 Guardar perfil</button>
    </div>

    <div class="settings-card" style="background:var(--bg2); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius); margin-bottom:1.5rem">
      <h3 class="settings-title" style="font-size:1.05rem; font-weight:700; color:var(--white); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem">🔗 Conexión Google Sheets</h3>
      <div class="form-group">
        <label style="font-size:0.75rem">URL del Web App (Apps Script)</label>
        <input id="gas-url-input" type="url" class="form-input" style="padding:0.5rem"
          value="${GAS_URL}" placeholder="https://script.google.com/macros/s/...">
        <div class="form-hint" style="font-size:0.75rem; color:var(--grey); margin-top:0.25rem">
          Obtené esta URL en Apps Script → Implementar → Aplicación web. Debe terminar en /exec
        </div>
      </div>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap; margin-top:1rem">
        <button class="btn-primary" onclick="saveGasUrl()">💾 Guardar URL</button>
        <button class="btn-secondary" onclick="testConnection()">🔌 Probar Conexión</button>
        <button class="btn-secondary" onclick="forceSyncAll()">🔄 Sincronizar Todo</button>
      </div>
      <div id="connection-test-result" style="margin-top:1rem"></div>
    </div>
    
    <div class="settings-card" style="background:var(--bg2); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius); margin-bottom:1.5rem">
      <h3 class="settings-title" style="font-size:1.05rem; font-weight:700; color:var(--white); margin-bottom:1rem; display:flex; align-items:center; gap:0.5rem">💾 Datos Locales</h3>
      <p style="color:#888;font-size:.85rem;margin-bottom:1rem">
        Quantum guarda los datos en tu dispositivo como respaldo cuando no hay conexión.
      </p>
      <div style="display:flex;gap:.75rem;flex-wrap:wrap">
        <button class="btn-secondary" onclick="exportData()">📥 Exportar JSON</button>
        <button class="btn-secondary" onclick="importData()">📤 Importar JSON</button>
        <button class="btn-danger" onclick="clearLocalData()">🗑 Limpiar datos locales</button>
      </div>
    </div>

    <div class="settings-card" style="background:var(--bg2); border:1px solid rgba(77,163,255,0.2); padding:1.5rem; border-radius:var(--radius); margin-bottom:1.5rem">
      <h3 class="settings-title" style="font-size:1.05rem; font-weight:700; color:var(--white); margin-bottom:0.5rem; display:flex; align-items:center; gap:0.5rem">🔄 Comenzar desde cero</h3>
      <p style="color:#888;font-size:0.82rem;line-height:1.5;margin-bottom:1rem">
        Reinicia únicamente el recorrido del manual para comenzar de nuevo. Tus contactos del CRM, perfil de usuario y configuración se mantendrán intactos.
      </p>
      <button class="btn-secondary" style="width:100%; border-color:var(--blue); color:var(--blue)" onclick="resetProgress()">🔄 Comenzar desde cero</button>
    </div>

    <div class="settings-card" style="background:var(--bg2); border:1px solid rgba(231,76,60,0.2); padding:1.5rem; border-radius:var(--radius); margin-bottom:1.5rem">
      <h3 class="settings-title" style="font-size:1.05rem; font-weight:700; color:var(--white); margin-bottom:0.5rem">🔐 Sesión</h3>
      <p style="color:#888;font-size:0.82rem;line-height:1.5;margin-bottom:1rem">
        Usuario activo: <strong style="color:var(--white)">${State.currentUserName || State.userProfile.nombre || "Sin nombre"}</strong>
        ${State.currentUserId ? `<br><span style="font-size:0.7rem;color:var(--grey)">ID: ${State.currentUserId}</span>` : ""}
      </p>
      <div style="display:flex;gap:0.75rem;flex-wrap:wrap">
        <button class="btn-secondary" style="flex:1" onclick="changeSessionName()">✏️ Cambiar nombre</button>
        <button class="btn-danger" style="flex:1" onclick="logoutSession()">🚪 Cerrar sesión</button>
      </div>
    </div>

    <div class="settings-card" style="background:var(--bg2); border:1px solid var(--border); padding:1.5rem; border-radius:var(--radius)">
      <h3 class="settings-title" style="font-size:1.05rem; font-weight:700; color:var(--white); margin-bottom:0.5rem">ℹ️ Sobre Quantum</h3>
      <p style="color:#888;font-size:0.8rem;line-height:1.6">
        Quantum v2.0.0 · Manual de Duplicación Digital — 11 Pasos<br>
        Tecnología: HTML · CSS · JavaScript · Google Sheets · Apps Script<br>
        Diseñado para acompañar, enseñar y duplicar equipos digitales.
      </p>
    </div>
  `;
}

function saveUserProfileSettings() {
  const name    = document.getElementById("set-user-name") ? document.getElementById("set-user-name").value.trim() : "";
  const sponsor = document.getElementById("set-user-sponsor") ? document.getElementById("set-user-sponsor").value.trim() : "";
  if (!name) { alert("El nombre es requerido."); return; }
  State.userProfile.nombre  = name;
  State.userProfile.sponsor = sponsor;
  State.currentUserName     = name;
  saveUserProfile();
  saveCurrentUser();
  // Sincronizar en GAS si hay sesión activa
  if (State.currentUserId) {
    saveUserToSheets(State.currentUserId, name).catch(() => {});
  }
  alert("¡Perfil guardado correctamente!");
  renderAll();
}

function changeSessionName() {
  const newName = prompt("Nuevo nombre:", State.currentUserName || State.userProfile.nombre || "");
  if (!newName || !newName.trim()) return;
  State.currentUserName    = newName.trim();
  State.userProfile.nombre = newName.trim();
  saveCurrentUser();
  saveUserProfile();
  if (State.currentUserId) {
    saveUserToSheets(State.currentUserId, newName.trim()).catch(() => {});
  }
  renderAll();
}

window.saveUserProfileSettings = saveUserProfileSettings;
window.changeSessionName       = changeSessionName;
window.logoutSession           = logoutSession;


async function saveGasUrl() {
  const val = document.getElementById("gas-url-input").value.trim();
  // Escribir la URL en memoria (no podemos modificar la constante, usamos localStorage)
  localStorage.setItem("quantum_gas_url", val);
GAS_URL = val;
alert("URL guardada correctamente. Ya podés probar la conexión.");
}

async function testConnection() {
  const url = document.getElementById("gas-url-input").value.trim() || GAS_URL;
  const res  = document.getElementById("connection-test-result");
  if (!url) { res.innerHTML = `<div class="alert-error">⚠ Ingresa una URL primero.</div>`; return; }
  res.innerHTML = `<div class="alert-info">🔄 Probando conexión…</div>`;
  try {
    const r = await fetch(`${url}?action=ping`, { cache: "no-store" });
    const j = await r.json();
    res.innerHTML = j.ok
      ? `<div class="alert-success">✅ Conexión exitosa — ${j.timestamp}</div>`
      : `<div class="alert-error">❌ Error: ${j.error}</div>`;
  } catch (e) {
    res.innerHTML = `<div class="alert-error">❌ Sin conexión: ${e.message}</div>`;
  }
}

async function forceSyncAll() {
  setSyncStatus("syncing");
  await fetchTeam();
  await fetchHistory();
  renderAll();
  attachSectionListeners();
}

function exportData() {
  const data = {
    team:    State.team,
    history: State.history,
    exported:new Date().toISOString(),
  };
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement("a");
  a.href     = url;
  a.download = `quantum-backup-${new Date().toISOString().split("T")[0]}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

function importData() {
  const input = document.createElement("input");
  input.type  = "file";
  input.accept= ".json";
  input.onchange = e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      try {
        const data = JSON.parse(ev.target.result);
        if (data.team) { State.team = data.team; saveToLocal(State.team); }
        if (data.history) { State.history = data.history; saveHistoryToLocal(State.history); }
        alert("✅ Datos importados correctamente.");
        renderAll();
        attachSectionListeners();
      } catch (err) {
        alert("❌ Error al importar: " + err.message);
      }
    };
    reader.readAsText(file);
  };
  input.click();
}

function clearLocalData() {
  if (!confirm("¿Eliminar todos los datos locales? Esta acción no se puede deshacer.")) return;
  localStorage.removeItem("quantum_team");
  localStorage.removeItem("quantum_history");
  localStorage.removeItem("quantum_gas_url");
  State.team    = SEED_TEAM;
  State.history = [];
  alert("Datos locales eliminados. Se cargaron los datos de ejemplo.");
  renderAll();
  attachSectionListeners();
}

// ┌─────────────────────────────────────────────────────────┐
// │  NAVEGACIÓN                                             │
// └─────────────────────────────────────────────────────────┘

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: ACERCA DEL NEGOCIO                            │
// └─────────────────────────────────────────────────────────┘

function renderAbout() {
  const el = document.getElementById("section-about");
  if (!el) return;

  const total  = groupTotal(State.team);
  const { current } = calcLevel(total);

  el.innerHTML = `
    <!-- Hero con logo -->
    <div class="about-hero">
      <div class="about-hero-glow"></div>
      <img src="logo.png" alt="Quantum" class="about-logo" onerror="this.style.display='none'">
      <h1 class="about-tagline">Construye tu red.<br>Escala tu libertad.</h1>
      <p class="about-tagline-sub">
        Quantum es un modelo de negocio basado en distribução por redes donde cada persona
        puede generar ingresos crecientes ayudando a otros a crecer.
      </p>
      <div class="about-cta-row">
        <button class="btn-primary" onclick="navigate('dashboard')">Ver mi Dashboard →</button>
        <button class="btn-secondary" onclick="navigate('network')">Ver mi Red →</button>
      </div>
    </div>

    <!-- Stats en vivo -->
    <div class="about-live-stats">
      <div class="about-stat">
        <div class="about-stat-val">${fmt(total)}</div>
        <div class="about-stat-label">Puntos grupales</div>
      </div>
      <div class="about-stat">
        <div class="about-stat-val" style="color:var(--blue)">${current ? current.label : 'Sin nivel'}</div>
        <div class="about-stat-label">Nivel actual</div>
      </div>
      <div class="about-stat">
        <div class="about-stat-val">${State.team.filter(m => m.activo).length}</div>
        <div class="about-stat-label">Integrantes</div>
      </div>
      <div class="about-stat">
        <div class="about-stat-val" style="color:var(--green)">Activo</div>
        <div class="about-stat-label">Estado de la red</div>
      </div>
    </div>

    <!-- Cómo funciona -->
    <div class="about-section">
      <h2 class="about-section-title">¿Cómo funciona Quantum?</h2>
      <div class="about-cards">

        <div class="about-card">
          <div class="about-card-icon" style="background:rgba(77,163,255,.1);color:var(--blue)">1</div>
          <div class="about-card-body">
            <h3>Te uniós y compartis</h3>
            <p>Cada integrante tiene un Sponsor (upline) que lo invitó. Vos también podés invitar personas y construir tu propia red frontal.</p>
          </div>
        </div>

        <div class="about-card">
          <div class="about-card-icon" style="background:rgba(46,204,113,.1);color:var(--green)">2</div>
          <div class="about-card-body">
            <h3>Acuémulás puntos</h3>
            <p>Cada compra o acción genera <strong>puntos personales</strong>. Los puntos de toda tu red se suman para calcular el <strong>puntaje grupal</strong> y tu nivel de calificación.</p>
          </div>
        </div>

        <div class="about-card">
          <div class="about-card-icon" style="background:rgba(241,196,15,.1);color:var(--yellow)">3</div>
          <div class="about-card-body">
            <h3>Subís de nivel</h3>
            <p>A mayor puntaje grupal, mayor es tu porcentaje de ganancia. Desde <strong>3%</strong> hasta <strong>21%</strong>, cada nivel desbloquea más beneficios y comisiones.</p>
          </div>
        </div>

        <div class="about-card">
          <div class="about-card-icon" style="background:rgba(155,92,255,.1);color:var(--violet)">4</div>
          <div class="about-card-body">
            <h3>Tu equipo crece contigo</h3>
            <p>Cuando ayudás a tus frontales a alcanzar sus metas, <strong>todos ganan más</strong>. El éxito de tu red es tu éxito.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Niveles -->
    <div class="about-section">
      <h2 class="about-section-title">Escala de niveles</h2>
      <p class="about-section-sub">El puntaje grupal de tu red determina en qué nivel estás y cuánto ganás.</p>
      <div class="about-levels">
        ${LEVELS.map(l => {
          const reached = total >= l.points;
          const pct = Math.min(100, Math.round((total / l.points) * 100));
          return `
            <div class="about-level ${reached ? 'level-reached' : ''} ${current && current.label === l.label ? 'level-current' : ''}">
              <div class="about-level-label">${l.label}</div>
              <div class="about-level-pts">${fmt(l.points)} pts</div>
              <div class="progress-bar" style="margin-top:.4rem;height:4px">
                <div class="progress-fill" style="width:${pct}%;background:${reached ? 'var(--green)' : current && current.label === l.label ? 'var(--blue)' : 'var(--grey)'}"></div>
              </div>
              ${current && current.label === l.label ? '<div class="level-badge">Tu nivel actual</div>' : ''}
              ${reached && !(current && current.label === l.label) ? '<div class="level-badge level-badge-done">✓ Superado</div>' : ''}
            </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Objetivos clave -->
    <div class="about-section">
      <h2 class="about-section-title">Objetivos clave del equipo</h2>
      <div class="about-goals-grid">

        <div class="about-goal-card">
          <div class="about-goal-icon">🏆</div>
          <h3>Gana Más</h3>
          <p>Cada integrante activo llega a <strong>150 puntos</strong> propios. Cuando todos califican, el ingreso grupal se multiplica.</p>
          <button class="btn-secondary" style="margin-top:1rem;font-size:.8rem" onclick="navigate('goals');setTimeout(()=>setGoalMode('Gana Más'),100)">Ver estado →</button>
        </div>

        <div class="about-goal-card">
          <div class="about-goal-icon">🥉</div>
          <h3>Mini Bronce</h3>
          <p>Líder con <strong>300 pts</strong> + 3 frontales con <strong>150 pts</strong> cada uno. El primer gran logro del equipo.</p>
          <button class="btn-secondary" style="margin-top:1rem;font-size:.8rem" onclick="navigate('goals');setTimeout(()=>setGoalMode('Mini Bronce'),100)">Ver estado →</button>
        </div>

        <div class="about-goal-card">
          <div class="about-goal-icon">⚡</div>
          <h3>Simulador</h3>
          <p>Proyectá cuántos puntos necesita cada persona para que el equipo suba de nivel. Planificación inteligente.</p>
          <button class="btn-secondary" style="margin-top:1rem;font-size:.8rem" onclick="navigate('simulator')">Abrir simulador →</button>
        </div>

      </div>
    </div>

    <!-- Por qué Quantum -->
    <div class="about-why">
      <div class="about-why-inner">
        <div class="about-why-logo">
          <img src="logo.png" alt="Q" style="width:48px;opacity:.8" onerror="this.style.display='none'">
        </div>
        <h2>¿Por qué Quantum?</h2>
        <p>
          Quantum es un sistema de crecimiento colaborativo. No se trata solo de acumular puntos,
          sino de construir una comunidad donde el éxito de cada persona impulsa al resto.
          Con herramientas de visualización, simulación y seguimiento en tiempo real,
          cada decisión está respaldada por datos.
        </p>
        <div class="about-values">
          <div class="about-value"><span>🤝</span> Colaboración</div>
          <div class="about-value"><span>📈</span> Crecimiento</div>
          <div class="about-value"><span>🔍</span> Transparencia</div>
          <div class="about-value"><span>🚀</span> Escalabilidad</div>
        </div>
      </div>
    </div>
  `;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: FLUJO DE PUNTOS                               │
// └─────────────────────────────────────────────────────────┘

/** Estado del visualizador de flujo */
let _selectedFlowId = null;

function renderFlow() {
  const el = document.getElementById('section-flow');
  if (!el) return;
  const team = State.team;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Cómo viajan los puntos en la red</h2>
      <span class="section-sub">Entendé cómo la actividad de cada persona impacta en toda la estructura</span>
    </div>

    <!-- Conceptos PP / PG -->
    <div class="flow-concepts">
      <div class="flow-concept-card">
        <div class="concept-num" style="background:rgba(77,163,255,.12);color:var(--blue)">PP</div>
        <div>
          <strong>Puntos Personales</strong>
          <p>Los puntos que genera cada persona con su propia actividad o consumo de productos.</p>
        </div>
      </div>
      <div class="flow-concept-card">
        <div class="concept-num" style="background:rgba(155,92,255,.12);color:var(--violet)">PG</div>
        <div>
          <strong>Puntos Grupales</strong>
          <p>PP propios + los PP de <em>toda</em> la red que está por debajo dentro de la estructura.</p>
        </div>
      </div>
    </div>

    <!-- Estado actual: PP y PG -->
    <div class="about-section">
      <h3 class="about-section-title">Estado actual — PP y PG de cada persona</h3>
      <div class="pg-overview-grid">
        ${team.filter(m => m.activo).map(m => {
          const pg  = computeGroupPoints(m.id, team);
          const desc = getAllDescendants(m.id, team).filter(d => d.activo);
          const netPts = desc.reduce((s, d) => s + Number(d.puntos), 0);
          const col  = nodeColor(m);
          return `
            <div class="pg-card" style="border-color:${col}30">
              <div class="pg-card-name" style="color:${col}">${m.nombre}</div>
              <div class="pg-formula">
                <div class="pg-formula-part">
                  <span class="pg-formula-val">${fmt(m.puntos)}</span>
                  <span class="pg-formula-label">PP propio</span>
                </div>
                <div class="pg-formula-op">+</div>
                <div class="pg-formula-part">
                  <span class="pg-formula-val">${fmt(netPts)}</span>
                  <span class="pg-formula-label">de red (${desc.length} pers.)</span>
                </div>
                <div class="pg-formula-op">=</div>
                <div class="pg-formula-part pg-formula-total" style="color:${col}">
                  <span class="pg-formula-val">${fmt(pg)}</span>
                  <span class="pg-formula-label">PG total</span>
                </div>
              </div>
            </div>`;
        }).join('')}
      </div>
    </div>

    <!-- Visualizador interactivo -->
    <div class="about-section">
      <h3 class="about-section-title">Visualizador de flujo</h3>
      <p class="about-section-sub">Seleccioná una persona para ver cómo sus puntos personales viajan hacia arriba en la estructura.</p>
      <div class="flow-person-buttons" id="flow-person-btns">
        ${team.filter(m => m.activo).map(m => `
          <button class="flow-person-btn" data-id="${m.id}"
                  onclick="showFlowFor('${m.id}')"
                  style="--btn-col:${nodeColor(m)}">
            <span class="flow-btn-avatar" style="background:${nodeColor(m)}20;color:${nodeColor(m)}">${initials(m.nombre)}</span>
            ${m.nombre}
          </button>
        `).join('')}
      </div>
      <div id="flow-viz" class="flow-viz-container"></div>
      <div id="flow-expl" class="flow-expl-wrap"></div>
    </div>

    <!-- Simulador de impacto -->
    <div class="about-section">
      <h3 class="about-section-title">Simulador de impacto</h3>
      <p class="about-section-sub">¿Qué pasa si alguien sube sus puntos? Calculá el efecto en cascada sobre toda la cadena upline.</p>
      <div class="impact-sim-layout">
        <div class="impact-sim-inputs">
          <div class="form-group">
            <label>Persona</label>
            <select id="impact-member-sel" class="form-input" onchange="updateImpactSim()">
              ${team.filter(m => m.activo).map(m =>
                `<option value="${m.id}">${m.nombre} — ${fmt(m.puntos)} PP actuales</option>`
              ).join('')}
            </select>
          </div>
          <div class="form-group">
            <label>Nuevos puntos personales</label>
            <input type="number" id="impact-new-pts" class="form-input"
                   min="0" placeholder="Ej: 100" oninput="updateImpactSim()">
          </div>
          <button class="btn-primary" onclick="updateImpactSim()">⚡ Calcular impacto</button>
        </div>
        <div id="impact-sim-result" class="impact-sim-result">
          <div class="empty-state">Seleccioná una persona e ingresá sus nuevos puntos</div>
        </div>
      </div>
    </div>
  `;

  // Auto-seleccionar el primer miembro
  if (team.length > 0) {
    const firstActive = team.find(m => m.activo);
    if (firstActive) showFlowFor(firstActive.id);
  }
}

/** Muestra el flujo animado desde un miembro hacia sus líderes */
function showFlowFor(memberId) {
  _selectedFlowId = memberId;
  const team  = State.team;
  const chain = getUplineChain(memberId, team); // [self, padre, abuelo…]
  const self  = chain[0];

  // Actualizar botones
  document.querySelectorAll('.flow-person-btn').forEach(btn => {
    btn.classList.toggle('active', btn.dataset.id === memberId);
  });

  const viz = document.getElementById('flow-viz');
  if (!viz) return;

  // Mostrar top-down: raíz arriba, seleccionado abajo
  const display = [...chain].reverse();

  viz.innerHTML = display.map((m, i) => {
    const isSelected  = m.id === memberId;
    const isLast      = i === display.length - 1;
    const pg          = computeGroupPoints(m.id, team);
    const contribution = Number(self.puntos);
    const col         = nodeColor(m);

    return `
      <div class="flow-chain-item">
        <div class="flow-node-card ${isSelected ? 'flow-selected' : 'flow-impacted'}"
             style="--nc:${col};border-color:${col}40">
          <div class="flow-node-header">
            <div class="flow-node-av" style="background:${col}20;border-color:${col}">
              <span style="color:${col}">${initials(m.nombre)}</span>
            </div>
            <div class="flow-node-meta">
              <div class="flow-node-name">${m.nombre}</div>
              ${isSelected
                ? `<div class="flow-badge flow-badge-origin">✦ Origen de los puntos</div>`
                : `<div class="flow-badge flow-badge-impact">+${fmt(contribution)} PG recibidos</div>`
              }
            </div>
          </div>
          <div class="flow-node-stats">
            <div class="flow-stat">
              <span class="flow-stat-lbl">PP propio</span>
              <span class="flow-stat-val">${fmt(m.puntos)}</span>
            </div>
            <div class="flow-stat flow-stat-pg">
              <span class="flow-stat-lbl">PG total</span>
              <span class="flow-stat-val" style="color:${col}">${fmt(pg)}</span>
            </div>
          </div>
        </div>
        ${!isLast ? `
          <div class="flow-connector">
            <div class="flow-conn-line">
              <div class="flow-dot-up" style="--d:0s"></div>
              <div class="flow-dot-up" style="--d:0.4s"></div>
              <div class="flow-dot-up" style="--d:0.8s"></div>
            </div>
            <div class="flow-conn-label">↑ ${fmt(contribution)} PP suben hacia ${display[i-1]?.nombre || 'arriba'}</div>
          </div>
        ` : ''}
      </div>`;
  }).join('');

  // Explicación
  const expl = document.getElementById('flow-expl');
  if (!expl) return;
  const impacted = chain.slice(1); // upline sin el self

  expl.innerHTML = `
    <div class="flow-expl-card">
      <div class="flow-expl-icon">💡</div>
      <div class="flow-expl-body">
        <p>Los <strong>${fmt(self.puntos)} puntos personales</strong> de <strong>${self.nombre}</strong>
           impactan directamente en:</p>
        <ul class="flow-expl-list">
          <li><span style="color:${nodeColor(self)}">✦</span> <strong>${self.nombre}</strong> — propio</li>
          ${impacted.map(m =>
            `<li><span style="color:${nodeColor(m)}">↑</span> <strong>${m.nombre}</strong> — upline</li>`
          ).join('')}
        </ul>
        ${impacted.length === 0
          ? `<p class="flow-expl-note">Este integrante es la raíz de la red. Sus PP solo impactan en su propio PG.</p>`
          : `<p class="flow-expl-note">Regla: cada punto generado por una persona sube por toda la cadena hacia sus líderes.</p>`
        }
      </div>
    </div>`;
}

/** Actualiza el resultado del simulador de impacto */
function updateImpactSim() {
  const sel    = document.getElementById('impact-member-sel');
  const input  = document.getElementById('impact-new-pts');
  const result = document.getElementById('impact-sim-result');
  if (!sel || !input || !result) return;

  const memberId = sel.value;
  const newPts   = input.value === '' ? null : Number(input.value);
  result.innerHTML = _renderImpactResult(memberId, newPts);
}

function _renderImpactResult(memberId, newPts) {
  const team = State.team;
  const member = team.find(m => m.id === memberId);
  if (!member) return '<div class="empty-state">Seleccioná una persona</div>';

  const currentPts = Number(member.puntos);
  if (newPts === null) return '<div class="empty-state">Ingresá los nuevos puntos</div>';

  const diff  = newPts - currentPts;
  const chain = getUplineChain(memberId, team);

  const rows = chain.map(m => {
    const pgBefore = computeGroupPoints(m.id, team);
    const pgAfter  = pgBefore + diff;
    const col      = nodeColor(m);
    return { m, pgBefore, pgAfter, diff, col };
  });

  const diffColor = diff > 0 ? 'var(--green)' : diff < 0 ? 'var(--red)' : 'var(--grey)';
  const sign      = diff > 0 ? '+' : '';

  return `
    <div class="impact-result">
      <div class="impact-result-header">
        <span>${member.nombre}:</span>
        <strong>${fmt(currentPts)} PP
          ${diff !== 0 ? `→ <span style="color:${diffColor}">${fmt(newPts)} PP (${sign}${fmt(diff)})</span>` : '(sin cambio)'}
        </strong>
      </div>
      <div class="impact-chain">
        ${rows.map((r, i) => `
          <div class="impact-row">
            <div class="impact-row-member">
              <div class="impact-av" style="background:${r.col}20;border-color:${r.col}">
                <span style="color:${r.col}">${initials(r.m.nombre)}</span>
              </div>
              <div>
                <div class="impact-row-name">${r.m.nombre}</div>
                <div class="impact-row-type">${i === 0 ? 'Persona seleccionada' : 'Upline'}</div>
              </div>
            </div>
            <div class="impact-row-values">
              <span class="impact-pg-before">PG: ${fmt(r.pgBefore)}</span>
              <span class="impact-arrow">→</span>
              <span class="impact-pg-after" style="color:${r.diff !== 0 ? diffColor : 'var(--grey2)'}">
                ${fmt(r.pgAfter)}
                ${r.diff !== 0 ? `<small>(${sign}${fmt(r.diff)})</small>` : ''}
              </span>
            </div>
          </div>`
        ).join('')}
      </div>
      ${diff !== 0 ? `
        <div class="impact-total">
          <span>Impacto total en la red:</span>
          <strong style="color:${diffColor}">${sign}${fmt(diff)} puntos grupales</strong>
        </div>` : ''}
    </div>`;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: ENTENDIENDO EL MODELO                         │
// └─────────────────────────────────────────────────────────┘

function renderModel() {
  const el = document.getElementById('section-model');
  if (!el) return;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Entendiendo el modelo</h2>
      <span class="section-sub">Información clara y objetiva sobre redes de comercialización</span>
    </div>

    <!-- ¿Qué es una red? -->
    <div class="model-block">
      <div class="model-block-icon">🌐</div>
      <div class="model-block-body">
        <h3>¿Qué es una red de comercialización?</h3>
        <p>Una red de comercialización es un sistema donde las personas pueden participar en
           múltiples formas según su nivel de compromiso:</p>
        <div class="model-features">
          <div class="model-feature"><span class="mf-icon">🛍</span><span>Consumir productos</span></div>
          <div class="model-feature"><span class="mf-icon">💬</span><span>Recomendar productos</span></div>
          <div class="model-feature"><span class="mf-icon">💼</span><span>Vender productos</span></div>
          <div class="model-feature"><span class="mf-icon">🤝</span><span>Enseñar a otros a hacer lo mismo</span></div>
        </div>
        <div class="model-key-rule">
          <span>📌</span>
          <span>La actividad se mide mediante <strong>puntos generados por el movimiento de productos</strong>.
          Sin productos, sin actividad, sin puntos.</span>
        </div>
      </div>
    </div>

    <!-- ¿Qué es una estafa piramidal? -->
    <div class="model-block model-block-danger">
      <div class="model-block-icon">⚠️</div>
      <div class="model-block-body">
        <h3>¿Qué es una estafa piramidal?</h3>
        <p>Una estafa piramidal es un sistema donde el dinero proviene
           principalmente del <strong>ingreso de nuevas personas</strong>, no del movimiento de productos.</p>
        <div class="model-features">
          <div class="model-feature model-feature-no"><span class="mf-icon">❌</span><span>No existen productos reales o tienen poco valor</span></div>
          <div class="model-feature model-feature-no"><span class="mf-icon">❌</span><span>El reclutamiento es la principal fuente de ingresos</span></div>
          <div class="model-feature model-feature-no"><span class="mf-icon">❌</span><span>El sistema depende constantemente de incorporar nuevas personas</span></div>
          <div class="model-feature model-feature-no"><span class="mf-icon">❌</span><span>Cuando deja de entrar gente, el sistema colapsa</span></div>
        </div>
      </div>
    </div>

    <!-- Tabla comparativa -->
    <div class="about-section">
      <h3 class="about-section-title">Diferencias principales</h3>
      <div class="model-comparison">
        <div class="model-col model-col-bad">
          <div class="model-col-header">⚠️ Estafa piramidal</div>
          <div class="model-col-body">
            <div class="model-row-bad"><span>❌</span> El dinero viene del ingreso de personas</div>
            <div class="model-row-bad"><span>❌</span> No existe una actividad comercial real</div>
            <div class="model-row-bad"><span>❌</span> Reclutar es la principal fuente de ingresos</div>
            <div class="model-row-bad"><span>❌</span> Sin nuevos integrantes, no hay ingresos</div>
          </div>
        </div>
        <div class="model-col model-col-good">
          <div class="model-col-header">✅ Red de comercialización</div>
          <div class="model-col-body">
            <div class="model-row-good"><span>✅</span> Existen productos reales y consumibles</div>
            <div class="model-row-good"><span>✅</span> Los productos pueden consumirse sin participar del negocio</div>
            <div class="model-row-good"><span>✅</span> Los puntos se generan por movimiento de productos</div>
            <div class="model-row-good"><span>✅</span> Incorporar personas NO genera puntos por sí solo</div>
            <div class="model-row-good"><span>✅</span> Sin actividad y sin productos no existe crecimiento</div>
          </div>
        </div>
      </div>
    </div>

    <!-- Mitos frecuentes -->
    <div class="about-section">
      <h3 class="about-section-title">Mitos frecuentes</h3>
      <div class="model-myths">

        <div class="myth-card">
          <div class="myth-claim">💬 &ldquo;Si entra gente, gano dinero&rdquo;</div>
          <div class="myth-answer">
            <div class="myth-answer-header">Realidad:</div>
            <p>No necesariamente. Una persona sin actividad genera <strong>0 puntos</strong>.
               El crecimiento depende de la actividad y del movimiento de productos, no de cuántas personas se unen.</p>
          </div>
        </div>

        <div class="myth-card">
          <div class="myth-claim">💬 &ldquo;Solo importa reclutar&rdquo;</div>
          <div class="myth-answer">
            <div class="myth-answer-header">Realidad:</div>
            <p>Sin puntos, sin productos y sin actividad <strong>no existe crecimiento de la red</strong>.
               El reclutamiento es una herramienta, no el motor del sistema.</p>
          </div>
        </div>

        <div class="myth-card">
          <div class="myth-claim">💬 &ldquo;Los puntos aparecen por agregar personas&rdquo;</div>
          <div class="myth-answer">
            <div class="myth-answer-header">Realidad:</div>
            <p>Los puntos aparecen cuando existe <strong>movimiento de productos</strong> dentro de la red.
               Agregar personas sin actividad no genera puntos.</p>
          </div>
        </div>

      </div>
    </div>

    <!-- Disclaimer -->
    <div class="model-disclaimer">
      <div class="model-disclaimer-icon">📋</div>
      <div>
        <strong>Aclaración importante</strong>
        <p>
          Quantum es una <strong>herramienta educativa y de visualización</strong>.
          No garantiza resultados ni ingresos. Su objetivo es ayudar a comprender
          la estructura, los puntos, los objetivos y el crecimiento de una red
          de forma clara, visual y basada en datos reales.
        </p>
        <p style="margin-top:.5rem;color:var(--grey)">
          Los resultados dependen exclusivamente de la actividad, el esfuerzo y
          el movimiento de productos de cada integrante de la red.
        </p>
      </div>
    </div>
  `;
}

// ┌─────────────────────────────────────────────────────────┐
// │  NAVEGACIÓN                                             │
// └─────────────────────────────────────────────────────────┘

const SECTIONS = ["welcome", "home", "guide", "contacts", "growth", "settings"];


let _activeGrowthTab = "dashboard";

function navigate(section) {
  const growthSubTabs = ["dashboard", "network", "team", "goals", "simulator", "flow", "history", "academy", "profiles"];
  
  if (growthSubTabs.includes(section)) {
    _activeGrowthTab = section;
    section = "growth";
  }
  
  if (!SECTIONS.includes(section)) return;
  State.activeSection = section;

  // Mostrar/ocultar secciones
  SECTIONS.forEach(s => {
    const el = document.getElementById("section-" + s);
    if (el) el.style.display = s === section ? "block" : "none";
  });

  // En la pantalla de bienvenida, ocultar sidebar y nav
  const sidebar = document.getElementById("sidebar");
  const mobileNav = document.querySelector(".mobile-nav");
  const topbar = document.querySelector(".topbar");
  const isWelcome = section === "welcome";
  if (sidebar)   sidebar.style.display    = isWelcome ? "none" : "";
  if (mobileNav) mobileNav.style.display  = isWelcome ? "none" : "";
  if (topbar)    topbar.style.display     = isWelcome ? "none" : "";

  if (!isWelcome) {
    // Actualizar nav links
    document.querySelectorAll(".nav-link").forEach(a => {
      a.classList.toggle("active", a.dataset.section === section);
    });
    
    // Mobile bottom nav
    document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
      btn.classList.toggle("active", btn.dataset.section === section);
    });

    // Cerrar sidebar en mobile
    closeSidebar();
  }

  // Renderizar sección activa
  renderSection(section);
}

function renderSection(section) {
  switch (section) {
    case "welcome":    renderWelcome();       break;
    case "home":       renderHome();          break;
    case "guide":      renderGuide();         break;
    case "contacts":   renderContactsCRM();   break;

    case "growth":     renderCrecimiento();   break;
    case "settings":   renderSettings();      break;
  }
  attachSectionListeners();
}

function renderAll() {
  renderSection(State.activeSection);
}

// ┌─────────────────────────────────────────────────────────┐
// │  SIDEBAR / MOBILE MENU                                  │
// └─────────────────────────────────────────────────────────┘

function toggleSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.toggle("open");
  document.getElementById("sidebar-overlay").classList.toggle("visible");
}

function closeSidebar() {
  const sidebar = document.getElementById("sidebar");
  sidebar.classList.remove("open");
  document.getElementById("sidebar-overlay").classList.remove("visible");
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: SEGUIMIENTO (KANBAN)                          │
// └─────────────────────────────────────────────────────────┘

const KANBAN_COLUMNS = [
  { id: "Nuevo",      label: "Nuevo",      emoji: "🆕", color: "rgba(255,255,255,0.06)" },
  { id: "Contactado", label: "Contactado", emoji: "📩", color: "rgba(77,163,255,0.06)"  },
  { id: "Interesado", label: "Interesado", emoji: "⭐", color: "rgba(255,200,50,0.06)"  },
  { id: "Reunión",    label: "Reunión",    emoji: "🤝", color: "rgba(155,92,255,0.06)"  },
  { id: "Cliente",    label: "Cliente",    emoji: "🛍️", color: "rgba(46,204,113,0.06)"  },
  { id: "Socio",      label: "Socio",      emoji: "🚀", color: "rgba(0,220,180,0.06)"   },
];

let _kanbanView = 0; // índice de la columna visible en mobile

function renderKanbanBoard() {
  const el = document.getElementById("section-kanban");
  if (!el) return;

  const contacts = State.contacts;

  // Agrupar contactos por estado
  const byCol = {};
  KANBAN_COLUMNS.forEach(c => { byCol[c.id] = []; });
  contacts.forEach(c => {
    const col = c.estado || "Nuevo";
    if (byCol[col]) byCol[col].push(c);
    else byCol["Nuevo"].push(c);
  });

  const colsHtml = KANBAN_COLUMNS.map((col, idx) => `
    <div class="kanban-col" id="kanban-col-${idx}"
         style="flex:0 0 240px; min-width:240px; background:${col.color}; border:1px solid var(--border); border-radius:var(--radius); padding:1rem; display:flex; flex-direction:column; gap:0.5rem"
         ondragover="event.preventDefault()"
         ondrop="handleKanbanDrop(event, '${col.id}')">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.5rem">
        <span style="font-size:0.8rem; font-weight:700; color:var(--grey2); text-transform:uppercase; letter-spacing:0.05em">
          ${col.emoji} ${col.label}
        </span>
        <span style="background:var(--bg3); color:var(--grey2); font-size:0.72rem; font-weight:700; padding:0.1rem 0.45rem; border-radius:10px">
          ${byCol[col.id].length}
        </span>
      </div>
      ${byCol[col.id].length === 0
        ? `<div style="text-align:center; padding:1rem 0; color:var(--grey); font-size:0.78rem; border:1px dashed var(--border); border-radius:8px">Sin contactos</div>`
        : byCol[col.id].map(c => `
          <div class="kanban-card" draggable="true"
               ondragstart="handleKanbanDragStart(event, '${c.id}')"
               style="background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:0.85rem; cursor:grab; transition:box-shadow 0.15s"
               onmouseover="this.style.boxShadow='0 2px 12px rgba(0,0,0,0.3)'"
               onmouseout="this.style.boxShadow='none'">
            <div style="font-size:0.88rem; font-weight:700; color:var(--white); margin-bottom:0.25rem">${c.nombre}</div>
            ${c.tipo ? `<div style="font-size:0.7rem; color:var(--grey2); margin-bottom:0.35rem">${c.tipo}</div>` : ""}
            ${c.observaciones ? `<div style="font-size:0.72rem; color:var(--grey); line-height:1.4; overflow:hidden; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical">${c.observaciones}</div>` : ""}
            <div style="display:flex; gap:0.4rem; margin-top:0.6rem; flex-wrap:wrap">
              ${KANBAN_COLUMNS.filter(k => k.id !== col.id).map(k => `
                <button onclick="moveKanbanContact('${c.id}', '${k.id}')" title="Mover a ${k.label}"
                        style="background:var(--bg3); border:none; color:var(--grey2); font-size:0.65rem; padding:0.15rem 0.4rem; border-radius:3px; cursor:pointer; transition:background 0.15s"
                        onmouseover="this.style.background='var(--border)'"
                        onmouseout="this.style.background='var(--bg3)'">${k.emoji}</button>
              `).join("")}
            </div>
          </div>
        `).join("")}
    </div>
  `).join("");

  // Mobile: mostrar una columna a la vez con flechas
  const mobileCol = KANBAN_COLUMNS[_kanbanView];
  const mobileContacts = byCol[mobileCol.id] || [];
  const mobileColHtml = `
    <div style="background:${mobileCol.color}; border:1px solid var(--border); border-radius:var(--radius); padding:1rem">
      <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.75rem">
        <button onclick="shiftKanbanView(-1)" style="background:var(--bg3); border:none; color:var(--white); padding:0.4rem 0.75rem; border-radius:6px; cursor:pointer; font-size:1rem">‹</button>
        <span style="font-size:0.9rem; font-weight:700; color:var(--white)">
          ${mobileCol.emoji} ${mobileCol.label}
          <span style="font-size:0.72rem; background:var(--bg3); color:var(--grey2); padding:0.1rem 0.4rem; border-radius:8px; margin-left:0.4rem">${mobileContacts.length}</span>
        </span>
        <button onclick="shiftKanbanView(1)" style="background:var(--bg3); border:none; color:var(--white); padding:0.4rem 0.75rem; border-radius:6px; cursor:pointer; font-size:1rem">›</button>
      </div>
      <div style="display:flex; gap:0.4rem; justify-content:center; margin-bottom:0.75rem">
        ${KANBAN_COLUMNS.map((c, i) => `<div style="width:8px; height:8px; border-radius:50%; background:${i === _kanbanView ? "var(--blue)" : "var(--bg3)"}"></div>`).join("")}
      </div>
      ${mobileContacts.length === 0
        ? `<div style="text-align:center; padding:1rem; color:var(--grey); font-size:0.8rem; border:1px dashed var(--border); border-radius:8px">Sin contactos en esta etapa</div>`
        : mobileContacts.map(c => `
          <div style="background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:0.85rem; margin-bottom:0.5rem">
            <div style="font-size:0.9rem; font-weight:700; color:var(--white); margin-bottom:0.2rem">${c.nombre}</div>
            ${c.tipo ? `<div style="font-size:0.72rem; color:var(--grey2); margin-bottom:0.35rem">${c.tipo}</div>` : ""}
            ${c.observaciones ? `<div style="font-size:0.74rem; color:var(--grey); line-height:1.4">${c.observaciones}</div>` : ""}
            <div style="margin-top:0.6rem">
              <select onchange="moveKanbanContact('${c.id}', this.value); this.value='${mobileCol.id}'"
                      style="width:100%; background:var(--bg3); border:1px solid var(--border); color:var(--white); padding:0.35rem; border-radius:6px; font-size:0.78rem">
                ${KANBAN_COLUMNS.map(k => `<option value="${k.id}" ${k.id === mobileCol.id ? "selected" : ""}>${k.emoji} ${k.label}</option>`).join("")}
              </select>
            </div>
          </div>
        `).join("")}
    </div>
  `;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Seguimiento</h2>
      <span class="section-sub">Tablero Kanban — avanzá cada contacto en su etapa</span>
    </div>

    <div style="display:flex; gap:0.75rem; margin-bottom:1.25rem; flex-wrap:wrap">
      ${KANBAN_COLUMNS.map(c => `
        <div style="background:var(--bg2); border:1px solid var(--border); border-radius:8px; padding:0.5rem 0.9rem; text-align:center; flex:1; min-width:80px">
          <div style="font-size:1.1rem; font-weight:800; color:var(--white)">${byCol[c.id].length}</div>
          <div style="font-size:0.65rem; color:var(--grey2)">${c.emoji} ${c.label}</div>
        </div>
      `).join("")}
    </div>

    <!-- Desktop: todas las columnas en horizontal -->
    <div class="kanban-desktop" style="overflow-x:auto; display:flex; gap:0.75rem; padding-bottom:0.75rem">
      ${colsHtml}
    </div>

    <!-- Mobile: una columna a la vez -->
    <div class="kanban-mobile">
      ${mobileColHtml}
    </div>

    <div style="margin-top:1.25rem; display:flex; gap:0.75rem">
      <button class="btn-secondary" style="flex:1" onclick="navigate('contacts')">👥 Ir al CRM</button>
      <button class="btn-secondary" style="flex:1" onclick="navigate('guide')">📖 Guía de duplicación</button>
    </div>
  `;

  // Inject responsive CSS for kanban
  if (!document.getElementById("kanban-css")) {
    const style = document.createElement("style");
    style.id = "kanban-css";
    style.textContent = `
      .kanban-desktop { display:flex !important; }
      .kanban-mobile  { display:none !important; }
      @media (max-width: 768px) {
        .kanban-desktop { display:none !important; }
        .kanban-mobile  { display:block !important; }
      }
    `;
    document.head.appendChild(style);
  }
}

let _kanbanDragId = null;

function handleKanbanDragStart(event, contactId) {
  _kanbanDragId = contactId;
  event.dataTransfer.effectAllowed = "move";
}

function handleKanbanDrop(event, newStatus) {
  event.preventDefault();
  if (!_kanbanDragId) return;
  moveKanbanContact(_kanbanDragId, newStatus);
  _kanbanDragId = null;
}

function moveKanbanContact(contactId, newStatus) {
  const idx = State.contacts.findIndex(c => c.id === contactId);
  if (idx < 0) return;
  State.contacts[idx].estado = newStatus;
  saveContacts();
  saveContactToSheets(State.contacts[idx]).catch(() => {});
  renderKanbanBoard();
}

function shiftKanbanView(dir) {
  _kanbanView = (_kanbanView + dir + KANBAN_COLUMNS.length) % KANBAN_COLUMNS.length;
  renderKanbanBoard();
}

// ┌─────────────────────────────────────────────────────────┐
// │  EVENT LISTENERS DINÁMICOS                              │
// └─────────────────────────────────────────────────────────┘

function attachSectionListeners() {
  // Los listeners dinámicos se manejan con onclick inline
  // Aquí se pueden agregar listeners adicionales si es necesario
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: NUESTRA VISIÓN                                │
// └─────────────────────────────────────────────────────────┘

function renderVision() {
  const el = document.getElementById("section-vision");
  if (!el) return;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Nuestra Visión</h2>
      <span class="section-sub">La filosofía y el propósito de acompañamiento detrás de Quantum</span>
    </div>

    <!-- Frase Institucional Destacada -->
    <div class="vision-hero-banner animate-fade-in">
      <div class="vision-hero-glow"></div>
      <div class="vision-hero-content">
        <span class="vision-pre-title">PROPÓSITO CENTRAL</span>
        <h1 class="vision-hero-title">"Crecer a tu ritmo.<br>Construir con propósito."</h1>
        <p class="vision-hero-desc">
          Quantum nace para digitalizar y centralizar el acompañamiento, la formación, la organización 
          y el crecimiento sustentable de una red de personas. Transformamos lo que solía estar disperso 
          en PDFs, planillas, audios y chats de WhatsApp en una plataforma simple, visual y cercana.
        </p>
      </div>
    </div>

    <!-- Las Diferentes Formas de Avanzar (Filosofía) -->
    <div class="about-section">
      <h3 class="about-section-title" style="text-align:center;margin-bottom:2rem">
        "Cada persona tiene tiempos, objetivos, fortalezas y formas de aprender diferentes"
      </h3>
      
      <div class="vision-cards-grid">
        
        <div class="vision-card">
          <div class="vision-card-icon">⏳</div>
          <h4>El Factor Tiempo</h4>
          <p>Algunas personas tienen más tiempo disponible. Otras tienen menos. En Quantum creemos en la gestión sustentable de tus horas para construir sin descuidar tu vida personal.</p>
        </div>

        <div class="vision-card">
          <div class="vision-card-icon">💬</div>
          <h4>Estilo de Conexión</h4>
          <p>Algunas disfrutan conversar y conectar directamente con las personas. Otras prefieren estudiar en silencio y dominar los sistemas. Todas las personalidades enriquecen la red.</p>
        </div>

        <div class="vision-card">
          <div class="vision-card-icon">🚶</div>
          <h4>Ritmo de Crecimiento</h4>
          <p>Algunas avanzan sumamente rápido, buscando resultados inmediatos. Otras avanzan paso a paso, consolidando sus bases. Ningún proceso es igual a otro y ambos son válidos.</p>
        </div>

      </div>
    </div>

    <!-- Carta Compromiso -->
    <div class="vision-statement-card">
      <h3>El Compromiso Quantum</h3>
      <p>
        No somos una simple calculadora fría de puntos o una herramienta de presión por resultados numéricos a corto plazo. 
        Nuestra meta es <strong>digitalizar la sabiduría de nuestros líderes</strong> para brindarte claridad, cercanía y herramientas personalizadas. 
        Queremos que encuentres tu propia estrategia y que disfrutes el camino de aprendizaje y crecimiento colaborativo.
      </p>
      <div class="vision-values-row">
        <span>🤝 Empatía</span>
        <span>🎧 Escucha</span>
        <span>💡 Claridad</span>
        <span>🚀 Crecimiento Sostenible</span>
      </div>
    </div>

    <!-- ROADMAP FUTURO (Escalabilidad) -->
    <div class="about-section" style="margin-top:3rem">
      <h3 class="about-section-title">La Arquitectura de tu Crecimiento</h3>
      <p class="about-section-sub" style="margin-bottom:2rem">Módulos planificados en el roadmap tecnológico para expandir e integrar tu ecosistema de red.</p>
      
      <div class="roadmap-grid">
        
        <div class="roadmap-item">
          <div class="roadmap-status">FASE 1 — Actual</div>
          <h4>Visualización de Red y Metas</h4>
          <p>Cálculo de PP/PG en tiempo real, árbol y constelación de red, y fichas de progreso positivo de acompañamiento.</p>
        </div>

        <div class="roadmap-item">
          <div class="roadmap-status status-next">FASE 2 — Planificado</div>
          <h4>Catálogo e Integración de Ventas</h4>
          <p>Módulo de productos interactivos, catálogo digital de recomendación y registro de ventas directas de la red.</p>
        </div>

        <div class="roadmap-item style-glow">
          <div class="roadmap-status status-next">FASE 3 — En Desarrollo</div>
          <h4>CRM y Acompañamiento Humano</h4>
          <p>Seguimiento detallado de contactos, biblioteca de recursos compartidos de líderes y alertas de coaching empático.</p>
        </div>

        <div class="roadmap-item">
          <div class="roadmap-status status-future">FASE 4 — Futuro</div>
          <h4>Automatización con n8n & WhatsApp</h4>
          <p>Mensajes automatizados sobre hitos de red, felicitaciones por metas personales cumplidas y sincronización en la nube.</p>
        </div>

        <div class="roadmap-item">
          <div class="roadmap-status status-future">FASE 5 — Futuro</div>
          <h4>App Móvil y Reportes Avanzados</h4>
          <p>Aplicación nativa para smartphones con notificaciones push y analíticas avanzadas de tendencias e histórico del equipo.</p>
        </div>

      </div>
    </div>
  `;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: ACADEMIA QUANTUM                              │
// └─────────────────────────────────────────────────────────┘

function renderAcademy() {
  const el = document.getElementById("section-academy");
  if (!el) return;

  const team = State.team;
  const activeMembers = team.filter(m => m.activo);

  // Calcular métricas del equipo real para ejemplos en vivo
  const totalGrupalJoy = computeGroupPoints("1", team); // Joy PG
  
  // Gana Más calificados (>= 150 PP)
  const ganaMasQualifiers = activeMembers.filter(m => m.puntos >= 150);
  const ganaMasListStr = ganaMasQualifiers.map(m => m.nombre).join(", ") || "Ninguno";

  // Análisis de Mini Bronce para el líder (Joy - id 1)
  const joy = team.find(m => m.id === "1");
  const joyFrontales = team.filter(m => m.sponsorId === "1" && m.activo);
  const joyPG = computeGroupPoints("1", team);
  
  // Condición 1: Líder con 300 pts o más
  const condLider = joyPG >= 300;
  // Condición 2: Al menos 3 frontales
  const condFrontalesCant = joyFrontales.length >= 3;
  // Condición 3: Frontales con 150 pts o más
  const frontalesSuficientes = joyFrontales.filter(f => f.puntos >= 150);
  const condFrontalesPts = frontalesSuficientes.length >= 3;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Academia Quantum</h2>
      <span class="section-sub">Aprende el sistema de forma visual, amigable y basada en tu equipo real</span>
    </div>

    <!-- Introducción -->
    <div class="academy-welcome-card">
      <div class="academy-welcome-content">
        <h3>📚 Entendiendo el Sistema</h3>
        <p>
          En Quantum, los números no son para presionar, sino para planificar con claridad. 
          Aquí te explicamos de forma simple y en vivo cómo funciona la arquitectura de puntos de tu red.
        </p>
      </div>
    </div>

    <!-- Navegación interna de la Academia -->
    <div class="academy-grid">
      
      <!-- Bloque 1: Conceptos Básicos -->
      <div class="academy-card">
        <h4 style="color:var(--blue);margin-bottom:.75rem">💎 1. Puntos Personales vs Grupales</h4>
        <p style="font-size:.85rem;line-height:1.6;color:#ccc;margin-bottom:1rem">
          La actividad de tu red se mide en <strong>Puntos (PP / PG)</strong>. Cada producto que se mueve en tu red equivale a un puntaje específico.
        </p>
        <div style="background:rgba(255,255,255,.02);border:1px solid var(--border);padding:.75rem;border-radius:8px;font-size:.8rem;line-height:1.5">
          <div style="margin-bottom:.5rem"><strong style="color:var(--blue)">PP (Puntos Personales):</strong> Es tu consumo propio o tus ventas directas a clientes. Ej: <strong>Joy tiene ${joy ? fmt(joy.puntos) : 201} PP</strong>.</div>
          <div><strong style="color:var(--violet)">PG (Puntos Grupales):</strong> Es la suma de tu PP + el PP de toda tu red. Ej: <strong>Joy tiene ${fmt(joyPG)} PG</strong> en total.</div>
        </div>
      </div>

      <!-- Bloque 2: Flujo de Puntos -->
      <div class="academy-card">
        <h4 style="color:var(--violet);margin-bottom:.75rem">🔄 2. ¿Cómo viajan los puntos?</h4>
        <p style="font-size:.85rem;line-height:1.6;color:#ccc;margin-bottom:1rem">
          Cada punto que genera un integrante de la red sube en cascada hacia sus líderes directos e indirectos.
        </p>
        
        <div style="background:rgba(155,92,255,.05);border:1px solid rgba(155,92,255,.15);padding:.75rem;border-radius:8px;font-size:.8rem;line-height:1.6">
          <strong style="color:var(--white)">Ejemplo en vivo con tu red:</strong><br>
          • <strong>Mamá</strong> genera <strong>25 PP</strong>.<br>
          • Esos 25 PP suman al PG de <strong>Mamá</strong> (25 pts).<br>
          • Suben a <strong>Jon</strong> sumando a su PG (actualmente ${computeGroupPoints("2", team)} pts).<br>
          • Suben a <strong>Joy</strong> sumando a su PG (actualmente ${fmt(joyPG)} pts).<br>
          <span style="color:var(--grey2);font-size:.75rem">* Wall está en otra rama, por lo que sus puntos no impactan a Jon, pero sí a Joy.</span>
        </div>
        <button class="btn-secondary" style="margin-top:.75rem;font-size:.75rem;width:100%" onclick="navigate('flow')">
          Ver Diagrama de Flujo Animado →
        </button>
      </div>

      <!-- Bloque 3: Impacto de un Frontal -->
      <div class="academy-card">
        <h4 style="color:var(--green);margin-bottom:.75rem">🌐 3. El Impacto de un Frontal</h4>
        <p style="font-size:.85rem;line-height:1.6;color:#ccc;margin-bottom:1rem">
          Un <strong>frontal</strong> es una persona patrocinada directamente por ti. Ellos inician tu red hacia abajo.
        </p>
        <div style="background:rgba(46,204,113,.05);border:1px solid rgba(46,204,113,.15);padding:.75rem;border-radius:8px;font-size:.8rem;line-height:1.6">
          <strong>Análisis de tu estructura:</strong><br>
          • <strong>Joy</strong> tiene <strong>${joyFrontales.length} frontales directos</strong> (${joyFrontales.map(m => m.nombre).join(" y ")}).<br>
          • El PG de <strong>Jon</strong> (${computeGroupPoints("2", team)} pts) representa el <strong>${Math.round((computeGroupPoints("2", team)/joyPG)*100) || 0}%</strong> del negocio de Joy.<br>
          • El PG de <strong>Wall</strong> (${computeGroupPoints("3", team)} pts) representa el <strong>${Math.round((computeGroupPoints("3", team)/joyPG)*100) || 0}%</strong>.<br>
          <span style="color:var(--green)">💡 Diversificar tus frontales le da solidez y estabilidad sustentable a tu estructura.</span>
        </div>
      </div>

      <!-- Bloque 4: Niveles y Comisiones -->
      <div class="academy-card">
        <h4 style="color:var(--yellow);margin-bottom:.75rem">📊 4. Cómo alcanzar los niveles</h4>
        <p style="font-size:.85rem;line-height:1.6;color:#ccc;margin-bottom:.75rem">
          A medida que tu PG grupal crece, asciendes en la escala de beneficios (3% al 21%).
        </p>
        <div style="font-size:.8rem;line-height:1.5;color:#eee">
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #222;padding:.2rem 0"><span>Nivel 3%</span> <span>300 PG</span></div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #222;padding:.2rem 0"><span>Nivel 6%</span> <span>600 PG</span></div>
          <div style="display:flex;justify-content:space-between;border-bottom:1px solid #222;padding:.2rem 0"><span>Nivel 9%</span> <span>1.200 PG</span></div>
          <div style="display:flex;justify-content:space-between;padding:.2rem 0"><span style="color:var(--yellow)">Tu red actual:</span> <strong style="color:var(--yellow)">${fmt(joyPG)} PG (${calcLevel(joyPG).current ? calcLevel(joyPG).current.label : "Sin nivel"})</strong></div>
        </div>
        <button class="btn-secondary" style="margin-top:.75rem;font-size:.75rem;width:100%" onclick="navigate('about')">
          Ver Escala de Niveles Completa →
        </button>
      </div>

    </div>

    <!-- EJEMPLOS REALES DE OBJETIVOS CLAVE -->
    <div class="about-section" style="margin-top:2rem">
      <h3 class="about-section-title">Análisis de Metas en Vivo</h3>
      <p class="about-section-sub">Basado en el estado actual de los integrantes de tu red</p>

      <div class="academy-goals-container">
        
        <!-- Tarjeta Gana Más -->
        <div class="academy-goal-row">
          <div class="academy-goal-header-part">
            <span class="goal-badge" style="background:rgba(77,163,255,.1);color:var(--blue)">🏆 Gana Más</span>
            <p style="font-size:.85rem;color:#aaa;margin-top:.3rem">
              Cada integrante activo debe alcanzar al menos <strong>150 PP personales</strong>.
            </p>
          </div>
          <div class="academy-goal-status-part" style="background:rgba(255,255,255,.02);padding:1rem;border-radius:8px">
            <h5 style="margin-bottom:.4rem;font-size:.85rem">Estado de Calificación del Equipo:</h5>
            <div style="font-size:.8rem;line-height:1.6">
              ✔ <strong>Calificados actuales:</strong> ${ganaMasListStr}<br>
              💡 <strong>Acciones de acompañamiento sugeridas:</strong>
              <ul style="margin-left:1.2rem;margin-top:.3rem;color:#bbb">
                ${activeMembers.filter(m => m.puntos < 150).map(m => 
                  `<li><strong>${m.nombre}</strong> está a <strong>${150 - m.puntos} PP</strong> de calificar. Ayúdale a encontrar clientes o repasar catálogo de forma amigable.</li>`
                ).join("")}
              </ul>
            </div>
          </div>
        </div>

        <!-- Tarjeta Mini Bronce -->
        <div class="academy-goal-row" style="margin-top:1.5rem">
          <div class="academy-goal-header-part">
            <span class="goal-badge" style="background:rgba(46,204,113,.1);color:var(--green)">🥉 Mini Bronce</span>
            <p style="font-size:.85rem;color:#aaa;margin-top:.3rem">
              Líder calificado (300 PG o más) con <strong>3 frontales activos con 150 PP o más</strong> cada uno.
            </p>
          </div>
          <div class="academy-goal-status-part" style="background:rgba(255,255,255,.02);padding:1rem;border-radius:8px">
            <h5 style="margin-bottom:.4rem;font-size:.85rem">Análisis para Joy (Líder de Red):</h5>
            <div style="font-size:.8rem;line-height:1.6">
              • <strong>Condición PG Líder:</strong> ${condLider ? '<span style="color:var(--green)">✔ Cumplido</span>' : '<span style="color:var(--yellow)">⚡ Faltan puntos</span>'} (Joy tiene ${fmt(joyPG)} PG de 300 requeridos)<br>
              • <strong>Cantidad de Frontales:</strong> ${condFrontalesCant ? '<span style="color:var(--green)">✔ Cumplido</span>' : '<span style="color:var(--yellow)">⚡ Faltan frontales</span>'} (Joy tiene ${joyFrontales.length} frontales de 3 requeridos)<br>
              • <strong>Frontales con 150 PP:</strong> ${condFrontalesPts ? '<span style="color:var(--green)">✔ Cumplido</span>' : `<span style="color:var(--yellow)">⚡ Falta acompañamiento</span> (${frontalesSuficientes.length} de 3 con 150 PP)`}<br>
              
              <div style="margin-top:.75rem;padding:.75rem;background:rgba(241,196,15,.05);border:1px solid rgba(241,196,15,.15);border-radius:6px;color:#ffe89c;line-height:1.6">
                <strong>📌 Plan de Acompañamiento Mutuo sugerido:</strong><br>
                1. Apoya a <strong>Jon</strong> (actual: ${team.find(m => m.id === "2")?.puntos || 0} PP) para sumar <strong>${150 - (team.find(m => m.id === "2")?.puntos || 0)} PP</strong>.<br>
                2. Acompaña a <strong>Wall</strong> (actual: ${team.find(m => m.id === "3")?.puntos || 0} PP) para sumar <strong>${150 - (team.find(m => m.id === "3")?.puntos || 0)} PP</strong>.<br>
                3. Invita y ayuda a un <strong>tercer frontal</strong> para contar con los 3 activos requeridos en primera línea.
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  `;
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: PERFILES DE CRECIMIENTO                       │
// └─────────────────────────────────────────────────────────┘

// Variable global para rastrear las respuestas del test de fortalezas
let _quizAnswers = [null, null, null];

function renderProfiles() {
  const el = document.getElementById("section-profiles");
  if (!el) return;

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Perfiles de Crecimiento</h2>
      <span class="section-sub">Identifica tus fortalezas y encuentra la estrategia adecuada para tu estilo</span>
    </div>

    <!-- Frase Institucional -->
    <div class="profile-intro-banner">
      <p>"Cada persona tiene fortalezas, tiempos y formas de aprender diferentes. Encontrar tu perfil te permite crecer de forma orgánica y sin presiones."</p>
    </div>

    <!-- Los 4 Perfiles -->
    <div class="profile-cards">
      
      <div class="p-card constructor">
        <div class="p-card-header">
          <span class="p-icon">🌐</span>
          <h3>Constructor</h3>
        </div>
        <p class="p-desc">Le apasiona conectar personas, organizar eventos y liderar comunidades. Disfruta ver el mapa de la red expandirse.</p>
        <div class="p-strategy">
          <strong>Estrategia sugerida:</strong> Enfocarse en prospección activa, técnicas de duplicación rápida y mentoría en liderazgo de frontales.
        </div>
      </div>

      <div class="p-card educador">
        <div class="p-card-header">
          <span class="p-icon">📚</span>
          <h3>Educador</h3>
        </div>
        <p class="p-desc">Ama enseñar, explicar conceptos y acompañar con paciencia. Disfruta ver a otros comprender el sistema y celebrar sus logros.</p>
        <div class="p-strategy">
          <strong>Estrategia sugerida:</strong> Crear talleres de capacitación, guiar a frontales en sus primeros pasos y liderar la Academia Quantum.
        </div>
      </div>

      <div class="p-card tecnico">
        <div class="p-card-header">
          <span class="p-icon">⚙️</span>
          <h3>Técnico</h3>
        </div>
        <p class="p-desc">Disfruta crear sistemas estructurados, automatizar tareas y analizar datos. Prefiere el orden lógico y la eficiencia técnica.</p>
        <div class="p-strategy">
          <strong>Estrategia sugerida:</strong> Diseñar planillas de seguimiento, automatizar flujos con n8n, y estructurar el CRM del equipo.
        </div>
      </div>

      <div class="p-card comercial">
        <div class="p-card-header">
          <span class="p-icon">🛍️</span>
          <h3>Comercial</h3>
        </div>
        <p class="p-desc">Le gusta vender, negociar, hacer demostraciones de productos y establecer conversaciones de alto valor comercial.</p>
        <div class="p-strategy">
          <strong>Estrategia sugerida:</strong> Expandir cartera de clientes directos, organizar demostraciones de productos y dictar clínicas de ventas.
        </div>
      </div>

    </div>

    <!-- TEST DE FORTALEZAS INTERACTIVO -->
    <div class="about-section" style="margin-top:3rem">
      <h3 class="about-section-title" style="text-align:center">🔍 Cuestionario de Fortalezas Quantum</h3>
      <p class="about-section-sub" style="text-align:center;margin-bottom:2rem">Responde estas 3 preguntas sencillas para identificar tu perfil y recibir tu recomendación estratégica en vivo</p>

      <div class="quiz-container" id="quiz-container">
        <!-- Pregunta 1 -->
        <div class="quiz-q-block" id="quiz-q0">
          <h4 class="quiz-q-title">1. ¿Qué actividad disfrutas más en tu día a día en el equipo?</h4>
          <div class="quiz-options">
            <button class="quiz-opt-btn" onclick="selectQuizOption(0, 'Constructor')">🌐 Conectar personas y planificar reuniones grupales</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(0, 'Educador')">📚 Acompañar a un miembro nuevo, responder dudas y enseñar</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(0, 'Técnico')">⚙️ Analizar métricas, estructurar planillas y crear sistemas</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(0, 'Comercial')">🛍️ Ofrecer productos directos y cerrar ventas con clientes</button>
          </div>
        </div>

        <!-- Pregunta 2 (Oculta inicialmente) -->
        <div class="quiz-q-block" id="quiz-q1" style="display:none">
          <h4 class="quiz-q-title">2. ¿Cuál consideras que es tu mayor superpoder o talento natural?</h4>
          <div class="quiz-options">
            <button class="quiz-opt-btn" onclick="selectQuizOption(1, 'Constructor')">🤝 Mi facilidad para unir personas y armar grupos comprometidos</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(1, 'Educador')">❤️ Mi empatía y paciencia para explicar con claridad paso a paso</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(1, 'Técnico')">🧠 Mi pensamiento lógico y mi gusto por herramientas tecnológicas</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(1, 'Comercial')">🗣️ Mi carisma y seguridad para hablar sobre productos y convencer</button>
          </div>
        </div>

        <!-- Pregunta 3 (Oculta inicialmente) -->
        <div class="quiz-q-block" id="quiz-q2" style="display:none">
          <h4 class="quiz-q-title">3. ¿Cuál sería tu logro ideal a mediano plazo dentro de tu red?</h4>
          <div class="quiz-options">
            <button class="quiz-opt-btn" onclick="selectQuizOption(2, 'Constructor')">🏆 Contar con una red en constante expansión de docenas de personas</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(2, 'Educador')">🎓 Ser el mentor de referencia y ver a mis frontales subir de nivel</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(2, 'Técnico')">🚀 Diseñar sistemas y automatizaciones que simplifiquen el trabajo de todos</button>
            <button class="quiz-opt-btn" onclick="selectQuizOption(2, 'Comercial')">📈 Desarrollar un volumen altísimo de facturación personal y de ventas</button>
          </div>
        </div>

        <!-- Resultado (Oculto inicialmente) -->
        <div class="quiz-result-block" id="quiz-result" style="display:none">
          <!-- Renderizado por showQuizResult() -->
        </div>

      </div>
    </div>
  `;
  
  // Reiniciar estado del quiz
  _quizAnswers = [null, null, null];
}

function selectQuizOption(qIndex, profileType) {
  _quizAnswers[qIndex] = profileType;
  
  // Transición visual amigable a la siguiente pregunta
  const currentBlock = document.getElementById("quiz-q" + qIndex);
  if (currentBlock) currentBlock.style.display = "none";
  
  if (qIndex < 2) {
    const nextBlock = document.getElementById("quiz-q" + (qIndex + 1));
    if (nextBlock) {
      nextBlock.style.display = "block";
      nextBlock.classList.add("fade-in");
    }
  } else {
    showQuizResult();
  }
}

function showQuizResult() {
  const resultBlock = document.getElementById("quiz-result");
  if (!resultBlock) return;

  // Calcular perfil predominante
  const counts = {};
  let maxType = _quizAnswers[0];
  let maxCount = 0;
  
  _quizAnswers.forEach(type => {
    counts[type] = (counts[type] || 0) + 1;
    if (counts[type] > maxCount) {
      maxCount = counts[type];
      maxType = type;
    }
  });

  // Datos específicos del resultado
  const profileDetails = {
    Constructor: {
      title: "🌐 Perfil Constructor",
      color: "var(--violet)",
      badge: "Líder de Red & Conector",
      desc: "Tienes un talento natural para tejer relaciones, conectar personas y armar equipos sólidos. Tu energía inspira al grupo a unirse.",
      tips: [
        "Enfócate en la prospección activa y en enseñar a tus frontales técnicas de duplicación.",
        "Organiza reuniones periódicas del equipo para mantener encendido el espíritu colaborativo.",
        "Utiliza la simulación en Quantum para trazar caminos viables de ascenso grupal."
      ]
    },
    Educador: {
      title: "📚 Perfil Educador",
      color: "var(--blue)",
      badge: "Guía de Progreso & Mentor",
      desc: "Tu mayor superpoder es la empatía, la paciencia y el amor por la enseñanza. Tienes la habilidad única de acompañar sin presionar, comprendiendo los tiempos ajenos.",
      tips: [
        "Conviértete en el referente de formación de la red, guiando la Academia Quantum.",
        "Fomenta charlas de escucha activa uno a uno para ayudar a tus frontales a delinear sus propios pasos.",
        "Diseña materiales visuales y sencillos para simplificar el modelo de negocio."
      ]
    },
    Técnico: {
      title: "⚙️ Perfil Técnico",
      color: "var(--green)",
      badge: "Arquitecto de Sistemas & Analista",
      desc: "Eres un estratega mental, amante de la lógica, los números claros y las herramientas que automatizan procesos. Tu red confía en tu precisión.",
      tips: [
        "Aprovecha para estructurar el backend técnico del equipo, como plantillas de CRM o Web Apps.",
        "Planifica integraciones tecnológicas (WhatsApp/n8n) para simplificar el flujo administrativo.",
        "Ayuda al equipo a interpretar la data del Dashboard objetivamente y sin alarmismos."
      ]
    },
    Comercial: {
      title: "🛍️ Perfil Comercial",
      color: "var(--yellow)",
      badge: "Generador de Relaciones & Vendedor",
      desc: "Posees un magnetismo comercial innato y una habilidad inmensa para recomendar productos. Disfrutas el intercambio cara a cara y el cierre de ventas.",
      tips: [
        "Focalízate en consolidar una cartera robusta de clientes recurrentes de alto volumen.",
        "Lidera talleres prácticos de venta directa y demostración de productos para tu equipo.",
        "Asegura siempre tu calificación de 'Gana Más' (150 PP) y sé el ejemplo de facturación inicial."
      ]
    }
  };

  const p = profileDetails[maxType];

  resultBlock.innerHTML = `
    <div class="result-glow" style="background:${p.color}15"></div>
    <div style="text-align:center;margin-bottom:1rem">
      <span class="pill" style="background:${p.color}20;color:${p.color};font-weight:600;padding:.25rem .75rem;font-size:.8rem">${p.badge}</span>
      <h3 style="font-size:1.5rem;color:#fff;margin-top:.5rem">${p.title}</h3>
    </div>
    
    <p style="font-size:.9rem;line-height:1.7;color:#ddd;text-align:center;margin-bottom:1.5rem">${p.desc}</p>
    
    <div style="background:rgba(255,255,255,.02);border:1px solid var(--border);padding:1rem;border-radius:10px;margin-bottom:1.5rem">
      <h4 style="color:${p.color};font-size:.95rem;margin-bottom:.5rem">🚀 Estrategias Clave recomendadas:</h4>
      <ul style="margin-left:1.2rem;font-size:.85rem;line-height:1.6;color:#ccc">
        ${p.tips.map(tip => `<li>${tip}</li>`).join("")}
      </ul>
    </div>
    
    <div style="display:flex;justify-content:center;gap:1rem">
      <button class="btn-primary" onclick="renderProfiles()" style="font-size:.85rem">🔄 Hacer de nuevo</button>
      <button class="btn-secondary" onclick="navigate('team')" style="font-size:.85rem">👥 Aplicar en mi equipo</button>
    </div>
  `;
  
  resultBlock.style.display = "block";
  resultBlock.classList.add("fade-in");
}

// Inyectar en el objeto window para que los onclicks inline funcionen
window.selectQuizOption = selectQuizOption;
window.renderProfiles = renderProfiles;


// ─── PANTALLA DE BIENVENIDA ────────────────────────────────────

function renderWelcome() {
  const el = document.getElementById("section-welcome");
  if (!el) return;

  el.innerHTML = `
    <div style="min-height:100vh; display:flex; align-items:center; justify-content:center; padding:2rem; background:var(--bg-black)">
      <div class="animate-fade-in" style="width:100%; max-width:420px; text-align:center">

        <div style="margin-bottom:2rem">
          <img src="logo.png" alt="Quantum" style="height:72px; object-fit:contain; filter:drop-shadow(0 0 24px rgba(0,163,163,0.35))">
        </div>

        <h1 style="font-family:var(--font-brand); font-size:2.2rem; font-weight:800; color:var(--white); margin-bottom:0.5rem; letter-spacing:0.03em">
          Bienvenido a Quantum
        </h1>
        <p style="color:var(--grey2); font-size:1rem; margin-bottom:2.5rem; line-height:1.5">
          Tu sistema de despegue digital.
        </p>

        <div style="background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:2rem">
          <div class="form-group" style="margin-bottom:1.25rem; text-align:left">
            <label style="font-size:0.8rem; color:var(--grey2); font-weight:600; letter-spacing:0.04em; text-transform:uppercase; margin-bottom:0.5rem; display:block">Tu nombre</label>
            <input id="welcome-name-input" type="text" class="form-input"
              placeholder="Ingresá tu nombre"
              style="font-size:1rem; padding:0.9rem 1rem"
              onkeydown="if(event.key==='Enter') startSession()">
          </div>
          <button class="btn-primary" style="width:100%; font-size:1rem; padding:0.9rem; font-weight:700; letter-spacing:0.03em" onclick="startSession()">
            Comenzar →
          </button>
          <p id="welcome-error" style="color:var(--red, #e74c3c); font-size:0.8rem; margin-top:0.75rem; display:none">
            Por favor, ingresá tu nombre para continuar.
          </p>
        </div>

        <p style="font-size:0.72rem; color:var(--grey); margin-top:1.5rem; line-height:1.5">
          Quantum guarda tu progreso localmente y en la nube<br>para que puedas retomar desde cualquier dispositivo.
        </p>
      </div>
    </div>
  `;

  setTimeout(() => {
    const inp = document.getElementById("welcome-name-input");
    if (inp) inp.focus();
  }, 100);
}

async function startSession() {
  const nameEl = document.getElementById("welcome-name-input");
  const errEl  = document.getElementById("welcome-error");
  const nombre = nameEl ? nameEl.value.trim() : "";

  if (!nombre) {
    if (errEl) errEl.style.display = "block";
    return;
  }
  if (errEl) errEl.style.display = "none";

  const userId = generateUserId();
  State.currentUserId   = userId;
  State.currentUserName = nombre;
  State.userProfile.nombre = nombre;

  saveCurrentUser();
  saveUserProfile();
  saveDuplicationProgress();

  // Sincronizar con Google Sheets en background (no bloquea la UI)
  saveUserToSheets(userId, nombre).catch(() => {});

  navigate("home");
}

function logoutSession() {
  if (!confirm("¿Cerrar sesión? Tu progreso está guardado.")) return;
  localStorage.removeItem("quantum_user_id");
  localStorage.removeItem("quantum_user_name");
  State.currentUserId   = null;
  State.currentUserName = "";
  State.userProfile = { nombre: "", sponsor: "Joy", objetivo: "", perfil: "", enfoque: "" };
  State.duplicationProgress = { paso1:"pending",paso2:"pending",paso3:"pending",paso4:"pending",paso5:"pending",paso6:"pending",paso7:"pending",paso8:"pending",paso9:"pending",paso10:"pending",paso11:"pending" };
  State.checklists = { paso4:{tema1:false,tema2:false,tema3:false,tema4:false,tema5:false}, paso5:{foto:false,bio:false,link:false,historia:false,posts:false,optimizado:false}, paso8:{queExplicar:false,queEvitar:false,comoAbrir:false,comoInteresar:false,practicaste:false} };
  navigate("welcome");
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: MENTOR DIGITAL - HOME                         │
// └─────────────────────────────────────────────────────────┘

const GUIDE_STEPS_META = [
  { id: "paso1",  label: "Definir Objetivo",       icon: "🎯" },
  { id: "paso2",  label: "¿Quién Sos?",             icon: "👤" },
  { id: "paso3",  label: "Línea de Enfoque",        icon: "🌱" },
  { id: "paso4",  label: "Aprender",                icon: "📚" },
  { id: "paso5",  label: "Ecosistema Digital",       icon: "📱" },
  { id: "paso6",  label: "Lista de Contactos",      icon: "👥" },
  { id: "paso7",  label: "Contactar",               icon: "💬" },
  { id: "paso8",  label: "Dar el Plan",             icon: "🤝" },
  { id: "paso9",  label: "Seguimiento",             icon: "📋" },
  { id: "paso10", label: "Cliente o Socio",         icon: "🏆" },
  { id: "paso11", label: "Duplicar",                icon: "🚀" },
];

function getActiveStep() {
  for (let i = 0; i < GUIDE_STEPS_META.length; i++) {
    const st = GUIDE_STEPS_META[i];
    if (State.duplicationProgress[st.id] !== "completed") {
      return { index: i + 1, ...st };
    }
  }
  return null;
}

function getDailyTasks(activeStep) {
  // Genera tareas concretas según el paso activo
  const taskMap = {
    1:  ["✍️ Escribí tu por qué en una hoja", "🎯 Elegí 2 motivaciones de la lista", "💭 Pensá en tu objetivo a 6 meses"],
    2:  ["👤 Identificá tu tipo de perfil", "📝 Anotá 3 fortalezas tuyas", "🤔 Pensá cómo te presentarías a alguien nuevo"],
    3:  ["🌱 Elegí tu línea de enfoque", "📸 Buscá 3 referentes de esa línea en Instagram", "💡 Anotá qué te diferencia en esa línea"],
    4:  ["📚 Leé el primer micro-contenido (2 min)", "✅ Marcá los temas que ya conocés", "🔁 Repasá el tema de duplicación"],
    5:  ["📸 Actualizá tu foto de perfil", "✍️ Reescribí tu bio", "🔗 Verificá que tu link en bio esté activo"],
    6:  ["👥 Cargá 5 contactos nuevos en el CRM", "🏷️ Clasificá tus contactos existentes", "📋 Identificá tus 3 mejores prospectos"],
    7:  ["💬 Enviá 2 mensajes de primer contacto", "📋 Copiá el mensaje generado y adaptalo", "📩 Revisá respuestas pendientes"],
    8:  ["📝 Repasá los puntos clave del plan", "🎭 Practicá la apertura con alguien", "📞 Coordiná co-cierre con tu sponsor"],
    9:  ["📋 Actualizá el estado de 3 contactos", "📱 Enviá un seguimiento a un prospecto tibio", "📅 Agendá recordatorio para la semana"],
    10: ["🛍️ Identifica 1 posible cliente", "🚀 Identifica 1 posible socio", "💬 Enviá propuesta a tu mejor prospecto"],
    11: ["🚀 Compartí el sistema con tu nuevo socio", "📖 Mostrá cómo usar Quantum", "🎯 Acompañá el Paso 1 de tu equipo"],
  };
  const idx = activeStep ? activeStep.index : 11;
  return taskMap[idx] || taskMap[11];
}

function renderHome() {
  const el = document.getElementById("section-home");
  if (!el) return;

  const nombre = State.userProfile.nombre || State.currentUserName || "Emprendedor";
  let completedCount = 0;
  GUIDE_STEPS_META.forEach(st => {
    if (State.duplicationProgress[st.id] === "completed") completedCount++;
  });
  const total = GUIDE_STEPS_META.length;
  const pct   = Math.round((completedCount / total) * 100);
  const activeStep = getActiveStep();
  const isFinished = !activeStep;

  // ── Tareas del día ───────────────────────────────────────
  const tasks = getDailyTasks(activeStep);
  const savedTasks = JSON.parse(localStorage.getItem("quantum_daily_tasks") || "{}");
  const todayKey   = new Date().toISOString().split("T")[0];
  const doneTasks  = savedTasks[todayKey] || [];
  const tasksDoneCount = tasks.filter((_, i) => doneTasks.includes(i)).length;

  const tasksHtml = tasks.map((t, i) => `
    <label style="display:flex; align-items:center; gap:0.85rem; padding:0.7rem 0; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer">
      <input type="checkbox" id="dt-${i}" ${doneTasks.includes(i) ? "checked" : ""}
             onchange="toggleDailyTask(${i})"
             style="width:18px; height:18px; flex-shrink:0; accent-color:var(--blue); cursor:pointer">
      <span style="font-size:0.88rem; color:${doneTasks.includes(i) ? "var(--grey)" : "var(--white)"}; ${doneTasks.includes(i) ? "text-decoration:line-through" : ""}; transition:color 0.2s">${t}</span>
    </label>
  `).join("");

  // ── Tarjeta próximo paso ─────────────────────────────────
  const stepCardHtml = isFinished ? `
    <div style="background:linear-gradient(135deg, rgba(46,204,113,0.08) 0%, rgba(0,220,180,0.05) 100%); border:1px solid rgba(46,204,113,0.3); border-left:4px solid var(--green); border-radius:var(--radius); padding:1.5rem; text-align:center">
      <div style="font-size:3rem; margin-bottom:0.5rem">🎉</div>
      <h3 style="color:var(--green); font-size:1.1rem; font-weight:800; margin-bottom:0.4rem">¡Recorrido completado!</h3>
      <p style="font-size:0.82rem; color:var(--grey2); line-height:1.5; margin-bottom:1rem">
        Ya conocés el sistema Quantum.<br>Ahora ayudá a otra persona a recorrerlo.
      </p>
      <button class="btn-primary" style="width:100%; margin-bottom:0.5rem; background:var(--green); color:#000" onclick="navigate('guide')">🚀 Comenzar Duplicación</button>
      <button class="btn-secondary" style="width:100%; font-size:0.82rem" onclick="resetProgress()">🔄 Reiniciar recorrido</button>
    </div>
  ` : `
    <div style="background:var(--bg2); border:1px solid var(--blue); border-left:4px solid var(--blue); border-radius:var(--radius); overflow:hidden">
      <div style="padding:1.25rem 1.25rem 1rem; position:relative">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(77,163,255,0.04) 0%,transparent 100%);pointer-events:none"></div>
        <div style="background:var(--blue); color:#000; font-size:0.62rem; font-weight:800; padding:0.18rem 0.5rem; border-radius:3px; display:inline-block; margin-bottom:0.65rem; letter-spacing:0.07em">PRÓXIMO PASO</div>
        <div style="display:flex; gap:1rem; align-items:center">
          <span style="font-size:2.4rem; flex-shrink:0">${activeStep.icon}</span>
          <div style="flex:1; min-width:0">
            <h3 style="font-size:1rem; font-weight:700; color:var(--white); margin-bottom:0.15rem">Paso ${activeStep.index}: ${activeStep.label}</h3>
            <p style="font-size:0.78rem; color:var(--grey2)">Completá este paso para desbloquear el siguiente.</p>
          </div>
        </div>
      </div>
      <div style="display:flex; border-top:1px solid var(--border)">
        <button onclick="navigate('guide')" style="flex:2; background:var(--blue); border:none; color:#000; font-size:0.85rem; font-weight:800; padding:0.8rem; cursor:pointer; transition:opacity 0.15s" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">Continuar →</button>
        <button onclick="navigate('guide')" style="flex:1; background:transparent; border:none; border-left:1px solid var(--border); color:var(--grey2); font-size:0.78rem; padding:0.8rem; cursor:pointer; transition:color 0.15s" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--grey2)'">📖 Ver guía completa</button>
      </div>
    </div>
  `;

  el.innerHTML = `
    <div style="padding-bottom:1.5rem">

      <!-- Saludo -->
      <div class="animate-fade-in" style="padding:1.5rem 0 0.75rem; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem">
        <div>
          <h1 style="font-size:1.65rem; font-weight:800; color:var(--white); margin-bottom:0.2rem">Hola, ${nombre} 👋</h1>
          <p style="color:var(--grey2); font-size:0.85rem">¿Qué vas a hacer hoy para avanzar?</p>
        </div>
        <button class="btn-secondary" style="font-size:0.8rem; padding:0.45rem 0.9rem; border-color:var(--border)" onclick="resetProgress()">🔄 Empezar de nuevo</button>
      </div>

      <!-- 🎯 QUÉ HACER AHORA — TARJETA HÉROE -->
      <div class="animate-fade-in" style="background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:1.25rem; overflow:hidden">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border-bottom:1px solid var(--border); background:linear-gradient(90deg, rgba(77,163,255,0.04) 0%, transparent 100%)">
          <div>
            <div style="font-size:0.7rem; font-weight:800; color:var(--blue); letter-spacing:0.07em; text-transform:uppercase; margin-bottom:0.15rem">🎯 Qué hacer ahora</div>
            <div style="font-size:0.78rem; color:var(--grey2)">${tasksDoneCount} de ${tasks.length} tareas completadas</div>
          </div>
          <div style="position:relative; width:44px; height:44px">
            <svg viewBox="0 0 44 44" style="width:44px;height:44px;transform:rotate(-90deg)">
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--bg3)" stroke-width="4"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--blue)" stroke-width="4"
                stroke-dasharray="${Math.round(2*Math.PI*18)}"
                stroke-dashoffset="${Math.round(2*Math.PI*18*(1 - (tasks.length ? tasksDoneCount/tasks.length : 0)))}"
                stroke-linecap="round"/>
            </svg>
            <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;color:var(--white)">${Math.round((tasks.length ? tasksDoneCount/tasks.length : 0)*100)}%</span>
          </div>
        </div>
        <div style="padding:0.25rem 1.25rem 0.75rem">
          ${tasksHtml}
        </div>
      </div>

      <!-- PRÓXIMO PASO -->
      <div class="animate-fade-in" style="margin-bottom:1.25rem">
        ${stepCardHtml}
      </div>

      <!-- Progreso general (secundario) -->
      <div style="background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:0.9rem 1.1rem; margin-bottom:1.25rem">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.45rem">
          <span style="font-size:0.75rem; color:var(--grey2)">Progreso del Manual</span>
          <span style="font-size:0.78rem; font-weight:700; color:${pct===100 ? 'var(--green)' : 'var(--grey2)'};">${completedCount}/${total} pasos</span>
        </div>
        <div style="height:6px; background:var(--bg3); border-radius:99px; overflow:hidden">
          <div style="width:${pct}%; height:100%; background:linear-gradient(90deg, var(--violet) 0%, var(--blue) 100%); border-radius:99px; transition:width 0.6s ease"></div>
        </div>
      </div>

      <!-- Accesos rápidos -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.6rem">
        <button class="btn-secondary" onclick="navigate('guide')" style="font-size:0.8rem; padding:0.7rem">📖 Guía completa</button>
        <button class="btn-secondary" onclick="navigate('contacts')" style="font-size:0.8rem; padding:0.7rem">👥 CRM</button>
        <button class="btn-secondary" onclick="navigate('growth')" style="font-size:0.8rem; padding:0.7rem">📈 Crecimiento</button>
        <button class="btn-secondary" onclick="navigate('settings')" style="font-size:0.8rem; padding:0.7rem">⚙️ Configuración</button>
      </div>
    </div>
  `;
}

function toggleDailyTask(idx) {
  const todayKey = new Date().toISOString().split("T")[0];
  const saved    = JSON.parse(localStorage.getItem("quantum_daily_tasks") || "{}");
  const done     = saved[todayKey] || [];
  const pos      = done.indexOf(idx);
  if (pos > -1) done.splice(pos, 1);
  else done.push(idx);
  saved[todayKey] = done;
  localStorage.setItem("quantum_daily_tasks", JSON.stringify(saved));
  renderHome();
}

function resetProgress() {
  if (!confirm("¿Reiniciar el recorrido del Manual?\n\nEsto resetea únicamente los 11 pasos del manual.\nTus contactos del CRM, configuración y perfil se mantienen intactos.")) return;

  const nuevoNombre = prompt("Ingresá el nombre de la persona que va a iniciar el recorrido:", State.currentUserName || State.userProfile.nombre || "");
  if (nuevoNombre === null) return; // Cancelado
  const nombreLimpio = nuevoNombre.trim();
  if (!nombreLimpio) {
    alert("El nombre no puede estar vacío.");
    return;
  }

  // Actualizar nombre
  State.currentUserName = nombreLimpio;
  State.userProfile.nombre = nombreLimpio;
  saveUserProfile();
  localStorage.setItem("quantum_user_name", nombreLimpio);

  // Reiniciar manual
  GUIDE_STEPS_META.forEach(st => {
    State.duplicationProgress[st.id] = "pending";
  });
  State.checklists = {
    paso4: { tema1:false, tema2:false, tema3:false, tema4:false, tema5:false },
    paso5: { foto:false, bio:false, link:false, historia:false, posts:false, optimizado:false },
    paso8: { queExplicar:false, queEvitar:false, comoAbrir:false, comoInteresar:false, practicaste:false },
  };
  saveDuplicationProgress();
  saveChecklists();
  saveProgressToSheets().catch(() => {});
  
  // Guardar en Sheets si está la función de guardado
  if (typeof saveUserToSheets === "function") {
    saveUserToSheets().catch(() => {});
  }

  renderAll();
}

// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: MENTOR DIGITAL - GUÍA DE DUPLICACIÓN          │
// └─────────────────────────────────────────────────────────┘

function getStepPercentage(stepNum, status) {
  if (status === "completed") return 100;
  if (status === "pending") return 0;
  if (stepNum === 4) {
    const pk = State.checklists.paso4 || {};
    const total = 5;
    const done = Object.values(pk).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }
  if (stepNum === 5) {
    const pk = State.checklists.paso5 || {};
    const total = 6;
    const done = Object.values(pk).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }
  if (stepNum === 8) {
    const pk = State.checklists.paso8 || {};
    const total = 5;
    const done = Object.values(pk).filter(Boolean).length;
    return Math.round((done / total) * 100);
  }
  return 50; // Default for in-progress steps without sub-tasks
}

function renderGuide() {
  const el = document.getElementById("section-guide");
  if (!el) return;

  const activeStep = getActiveStep();
  const isFinished = !activeStep;

  const steps = [
    { id: "paso1",  title: "Definir Objetivo",       icon: "🎯", desc: "¿Por qué querés hacer esto?",                      renderFn: renderGuideStep1 },
    { id: "paso2",  title: "¿Quién Sos?",             icon: "👤", desc: "Definí tu perfil de comunicación",                 renderFn: renderGuideStep2 },
    { id: "paso3",  title: "Línea de Enfoque",        icon: "🌱", desc: "Elegí el área desde donde vas a comunicar",        renderFn: renderGuideStep3 },
    { id: "paso4",  title: "Aprender",                icon: "📚", desc: "Micro-contenidos esenciales (máx. 2 min c/u)",     renderFn: renderGuideStep4 },
    { id: "paso5",  title: "Ecosistema Digital",       icon: "📱", desc: "Optimizá tu presencia en redes sociales",          renderFn: renderGuideStep5 },
    { id: "paso6",  title: "Lista de Contactos",      icon: "👥", desc: "Cargá tu lista clasificada en el CRM",             renderFn: renderGuideStep6 },
    { id: "paso7",  title: "Contactar",               icon: "💬", desc: "Generá mensajes personalizados e impactantes",     renderFn: renderGuideStep7 },
    { id: "paso8",  title: "Dar el Plan",             icon: "🤝", desc: "Preparate para mostrar la propuesta",              renderFn: renderGuideStep8 },
    { id: "paso9",  title: "Seguimiento",             icon: "📋", desc: "Gestioná el avance de cada contacto",              renderFn: renderGuideStep9 },
    { id: "paso10", title: "Cliente o Socio",         icon: "🏆", desc: "Identifica las dos salidas posibles",              renderFn: renderGuideStep10 },
    { id: "paso11", title: "Duplicar",                icon: "🚀", desc: "Enseñá el sistema a tu nuevo socio",               renderFn: renderGuideStep11 },
  ];

  el.innerHTML = `
    <div class="section-header" style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:1rem; margin-bottom:1.5rem">
      <div>
        <h2 class="section-title">📖 Guía de Duplicación</h2>
        <span class="section-sub">Recorré paso a paso el sistema Quantum.</span>
      </div>
      <div>
        <button class="btn-secondary" style="font-size:0.8rem; padding:0.4rem 0.8rem; border-color:var(--border)" onclick="resetProgress()">🔄 Comenzar desde cero</button>
      </div>
    </div>
    
    <div class="guide-steps-list animate-fade-in" style="display:flex; flex-direction:column; gap:1.25rem">
      ${steps.map((st, i) => {
        const stepNum = i + 1;

        // Si el usuario completó todo el recorrido, y estamos en el paso 11, lo reemplazamos por la tarjeta de celebración
        if (isFinished && stepNum === 11) {
          return `
            <div class="guide-step-card" style="background:linear-gradient(135deg, rgba(46,204,113,0.08) 0%, rgba(0,220,180,0.05) 100%); border:1px solid rgba(46,204,113,0.3); border-left:4px solid var(--green); border-radius:var(--radius); padding:1.5rem; text-align:center">
              <div style="font-size:3rem; margin-bottom:0.5rem">🎉</div>
              <h3 style="color:var(--green); font-size:1.1rem; font-weight:800; margin-bottom:0.4rem">Recorrido principal completado</h3>
              <p style="font-size:0.85rem; color:var(--grey2); line-height:1.5; margin-bottom:1rem">
                Ya conocés el sistema Quantum.<br>Ahora el próximo paso es ayudar a otra persona a recorrerlo.
              </p>
              <div style="display:flex; gap:0.5rem; justify-content:center; flex-wrap:wrap">
                <button class="btn-primary" style="min-width:150px; background:var(--green); color:#000" onclick="navigate('contacts')">🚀 Comenzar Duplicación</button>
                <button class="btn-secondary" style="min-width:150px; font-size:0.82rem" onclick="resetProgress()">🔄 Reiniciar Recorrido</button>
              </div>
            </div>
          `;
        }

        const status = State.duplicationProgress[st.id] || "pending";
        const isCompleted = status === "completed";
        const isActive    = activeStep && stepNum === activeStep.index;
        const isLocked    = activeStep && stepNum > activeStep.index;

        let statusText  = "Pendiente";
        let statusStyle = "background:rgba(255,255,255,0.02); border-color:var(--border)";
        let bubbleBg    = "var(--bg3)";
        let bubbleColor = "var(--grey2)";

        if (isCompleted) {
          statusText  = "✅ Completado";
          statusStyle = "background:rgba(46,204,113,0.02); border-color:rgba(46,204,113,0.15)";
          bubbleBg    = "var(--green)";
          bubbleColor = "#000";
        } else if (isActive) {
          statusText  = "⏳ En progreso";
          statusStyle = "background:rgba(77,163,255,0.03); border-color:var(--blue); box-shadow:0 4px 16px rgba(77,163,255,0.06)";
          bubbleBg    = "var(--blue)";
          bubbleColor = "#000";
        } else if (isLocked) {
          statusText  = "🔒 Bloqueado";
          statusStyle = "background:rgba(255,255,255,0.01); border-color:var(--border); opacity:0.45";
        }

        const percent = getStepPercentage(stepNum, status);

        return `
          <div class="guide-step-card" style="${statusStyle}; border-width:1px; border-style:solid; border-radius:var(--radius); padding:1.25rem; transition:all 0.3s ease">
            <div style="display:flex; justify-content:space-between; align-items:center; cursor:pointer" onclick="toggleGuideStep(${stepNum})">
              <div style="display:flex; align-items:center; gap:1rem">
                <div style="background:${bubbleBg}; color:${bubbleColor}; font-weight:700; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.95rem; flex-shrink:0">
                  ${isCompleted ? "✓" : stepNum}
                </div>
                <div>
                  <h4 style="font-size:1rem; font-weight:700; color:${isLocked ? "var(--grey)" : "var(--white)"}">
                    ${st.icon} Paso ${stepNum}: ${st.title}
                  </h4>
                  <p style="font-size:0.78rem; color:var(--grey2); margin-top:0.1rem">${st.desc}</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0">
                ${!isLocked ? '<span id="arrow-' + stepNum + '" style="font-size:0.8rem; color:var(--grey2); transform:rotate(' + (isActive ? "180deg" : "0deg") + '); transition:transform 0.2s; display:inline-block">▼</span>' : ""}
              </div>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed rgba(255,255,255,0.06); opacity:${isLocked ? 0.5 : 1}">
              <div style="display:flex; align-items:center; gap:0.5rem">
                <span style="font-size:0.72rem; font-weight:600; padding:0.15rem 0.5rem; border-radius:4px; color:${isCompleted ? "var(--green)" : isActive ? "var(--blue)" : "var(--grey)"}; background:${isCompleted ? "rgba(46,204,113,0.1)" : isActive ? "rgba(77,163,255,0.1)" : "rgba(255,255,255,0.03)"}">${statusText}</span>
                <span style="font-size:0.72rem; color:var(--grey2); font-weight:600">${percent}% completado</span>
              </div>
              ${isActive ? `<button onclick="toggleGuideStep(${stepNum}); event.stopPropagation();" style="background:var(--blue); border:none; color:#000; font-size:0.75rem; font-weight:700; padding:0.3rem 0.65rem; border-radius:4px; cursor:pointer">Continuar →</button>` : ""}
            </div>
            
            ${!isLocked ? `
              <div id="body-${stepNum}" style="display:${isActive ? "block" : "none"}; border-top:1px solid var(--border); margin-top:1rem; padding-top:1.25rem">
                ${st.renderFn()}
              </div>
            ` : ""}
          </div>
        `;
      }).join("")}
    </div>
  `;
}

function toggleGuideStep(stepNum) {
  const body  = document.getElementById("body-" + stepNum);
  const arrow = document.getElementById("arrow-" + stepNum);
  if (!body) return;
  const isOpen = body.style.display !== "none";
  body.style.display = isOpen ? "none" : "block";
  if (arrow) arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
}


// ── RENDER DE PASOS INDIVIDUALES ─────────────────────────────

function renderGuideStep1() {
  const user = State.userProfile;
  const currentObj = user.objetivo || "";
  const options = ["Ingreso extra 💰", "Ahorrar 🏦", "Viajar ✈️", "Desarrollo personal 🌱", "Tiempo libre ⏰", "Emprender 🚀"];
  const isSelected = opt => currentObj.includes(opt.replace(/ [^\s]+$/, ""));

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1rem">
      El primer paso es entender <strong style="color:var(--white)">para qué</strong> vas a construir tu red. Elegí las motivaciones que resuenen con vos:
    </p>
    <div style="display:flex; flex-wrap:wrap; gap:0.5rem; margin-bottom:1.25rem">
      ${options.map(opt => `
        <button class="obj-pill ${isSelected(opt) ? "active" : ""}" 
                data-value="${opt}" 
                onclick="toggleObjectivePill(this)"
                style="background:${isSelected(opt) ? "var(--blue)" : "var(--bg3)"}; color:${isSelected(opt) ? "#000" : "var(--white)"}; border:1px solid ${isSelected(opt) ? "var(--blue)" : "var(--border)"}; padding:0.5rem 1rem; border-radius:20px; font-size:0.85rem; font-weight:500; transition:all 0.15s">
          ${opt}
        </button>
      `).join("")}
    </div>
    
    <div class="form-group">
      <label>Tu por qué en tus palabras (opcional):</label>
      <textarea id="obj-detail" class="form-input" style="height:64px; resize:vertical" placeholder="Ej: Quiero generar un ingreso extra para pagar mis estudios y tener más libertad horaria.">${currentObj ? (currentObj.split(" — ")[1] || "") : ""}</textarea>
    </div>

    <button class="btn-primary" style="width:100%; margin-top:0.75rem" onclick="submitStep1()">Guardar objetivo y avanzar →</button>
  `;
}

function toggleObjectivePill(btn) {
  btn.classList.toggle("active");
  if (btn.classList.contains("active")) {
    btn.style.background = "var(--blue)";
    btn.style.color = "#000";
    btn.style.borderColor = "var(--blue)";
  } else {
    btn.style.background = "var(--bg3)";
    btn.style.color = "var(--white)";
    btn.style.borderColor = "var(--border)";
  }
}

function submitStep1() {
  const pills = Array.from(document.querySelectorAll(".obj-pill.active")).map(btn => btn.dataset.value);
  const detail = document.getElementById("obj-detail") ? document.getElementById("obj-detail").value.trim() : "";
  if (pills.length === 0 && !detail) { alert("Por favor, elegí al menos una opción."); return; }
  State.userProfile.objetivo = pills.join(", ") + (detail ? " — " + detail : "");
  saveUserProfile();
  State.duplicationProgress.paso1 = "completed";
  State.duplicationProgress.paso2 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep2() {
  const user = State.userProfile;
  const current = user.perfil || "";

  const profiles = [
    { id: "autoridad", icon: "🎓", title: "Perfil con Autoridad", desc: "Médico, nutricionista, esteticista, entrenador, farmacéutico, chef, influencer de bienestar. Tu presentación parte de tu credencial profesional." },
    { id: "desarrollo", icon: "🌱", title: "Perfil en Desarrollo", desc: "No tenés título ni audiencia aún. Construís tu marca desde cero compartiendo tu transformación personal y tu proceso de aprendizaje." }
  ];

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      Tu perfil define <strong style="color:var(--white)">cómo vas a comunicarte</strong> con tu audiencia. No hay uno mejor que el otro — son caminos distintos:
    </p>
    <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.25rem">
      ${profiles.map(p => `
        <div class="profile-card" data-profile="${p.id}" onclick="selectProfileType('${p.id}')"
             style="cursor:pointer; border:2px solid ${current === p.id ? "var(--blue)" : "var(--border)"}; background:${current === p.id ? "rgba(77,163,255,0.06)" : "var(--bg3)"}; border-radius:var(--radius); padding:1.25rem; transition:all 0.2s">
          <div style="display:flex; gap:1rem; align-items:flex-start">
            <span style="font-size:2rem; flex-shrink:0">${p.icon}</span>
            <div>
              <h5 style="font-size:0.95rem; font-weight:700; color:${current === p.id ? "var(--blue)" : "var(--white)"}; margin-bottom:0.25rem">${p.title}</h5>
              <p style="font-size:0.8rem; color:var(--grey2); line-height:1.5">${p.desc}</p>
            </div>
          </div>
          ${current === p.id ? '<div style="text-align:right; margin-top:0.5rem"><span style="font-size:0.72rem; background:var(--blue); color:#000; padding:0.15rem 0.5rem; border-radius:4px; font-weight:700">SELECCIONADO</span></div>' : ""}
        </div>
      `).join("")}
    </div>
    <button class="btn-primary" style="width:100%" onclick="submitStep2()">Confirmar perfil y avanzar →</button>
  `;
}

function selectProfileType(profileId) {
  State.userProfile.perfil = profileId;
  saveUserProfile();
  renderGuide();
}

function submitStep2() {
  if (!State.userProfile.perfil) { alert("Por favor, seleccioná tu tipo de perfil."); return; }
  State.duplicationProgress.paso2 = "completed";
  State.duplicationProgress.paso3 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep3() {
  const user = State.userProfile;
  const current = user.enfoque || "";

  const lines = [
    { id: "belleza",         emoji: "💄", label: "Belleza",         desc: "Cuidado de la piel, maquillaje, tratamientos estéticos, anti-aging." },
    { id: "nutricion",       emoji: "🍏", label: "Nutrición",       desc: "Suplementos, hábitos saludables, alimentación consciente, pérdida de peso." },
    { id: "hogar",           emoji: "🏠", label: "Hogar",           desc: "Limpieza, aromas, cuidado del ambiente y bienestar doméstico." },
    { id: "cuidado-personal", emoji: "🧘", label: "Cuidado Personal", desc: "Cabello, cuerpo, bienestar integral y rutinas de autocuidado." },
  ];

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      Elegí <strong style="color:var(--white)">una línea</strong> desde donde vas a comenzar a comunicar. Esto no te limita, te da foco.
    </p>
    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem">
      ${lines.map(l => `
        <div onclick="selectEnfoqueType('${l.id}')"
             style="cursor:pointer; border:2px solid ${current === l.id ? "var(--blue)" : "var(--border)"}; background:${current === l.id ? "rgba(77,163,255,0.06)" : "var(--bg3)"}; border-radius:var(--radius); padding:1rem; text-align:center; transition:all 0.2s">
          <div style="font-size:2rem; margin-bottom:0.4rem">${l.emoji}</div>
          <div style="font-weight:700; font-size:0.9rem; color:${current === l.id ? "var(--blue)" : "var(--white)"}; margin-bottom:0.3rem">${l.label}</div>
          <div style="font-size:0.72rem; color:var(--grey2); line-height:1.4">${l.desc}</div>
          ${current === l.id ? '<div style="margin-top:0.5rem"><span style="font-size:0.65rem; background:var(--blue); color:#000; padding:0.1rem 0.4rem; border-radius:3px; font-weight:700">✓ ELEGIDA</span></div>' : ""}
        </div>
      `).join("")}
    </div>
    <button class="btn-primary" style="width:100%" onclick="submitStep3()">Confirmar línea y avanzar →</button>
  `;
}

function selectEnfoqueType(enfoqueId) {
  State.userProfile.enfoque = enfoqueId;
  saveUserProfile();
  renderGuide();
}

function submitStep3() {
  if (!State.userProfile.enfoque) { alert("Por favor, elegí tu línea de enfoque."); return; }
  State.duplicationProgress.paso3 = "completed";
  State.duplicationProgress.paso4 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep4() {
  const ck = State.checklists.paso4;
  const topics = [
    { key: "tema1", icon: "🔗", title: "¿Qué es una red de mercadeo?", desc: "Entendé la diferencia entre MLM y trabajo tradicional. Aprende cómo funciona el modelo de duplicación.", min: "2 min" },
    { key: "tema2", icon: "🎯", title: "El poder de los contactos clave", desc: "Cómo clasificar contactos: calientes, tibios y fríos. Por qué no todos son para ahora.", min: "2 min" },
    { key: "tema3", icon: "💄", title: "Tu línea de enfoque: productos y diferencial", desc: "Qué hace única tu línea. Cómo hablar de ella sin sonar a vendedor.", min: "2 min" },
    { key: "tema4", icon: "💬", title: "El primer mensaje: cómo romper el hielo", desc: "La estructura de un primer contacto efectivo. Qué decir, qué no decir, cómo generar curiosidad.", min: "2 min" },
    { key: "tema5", icon: "🚀", title: "La duplicación: el secreto del crecimiento", desc: "Por qué enseñar el sistema vale más que vender. Cómo construir un equipo que se replica.", min: "2 min" },
  ];
  const done = topics.filter(t => ck[t.key]).length;

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:0.75rem">
      Leé o escuchá cada micro-contenido (máx. 2 min) y marcalo como leído antes de avanzar:
    </p>
    <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
      <span style="font-size:0.8rem; color:var(--grey2)">${done} de ${topics.length} temas</span>
      <span style="font-size:0.8rem; font-weight:700; color:var(--blue)">${Math.round(done/topics.length*100)}%</span>
    </div>
    <div style="height:6px; background:var(--bg3); border-radius:99px; overflow:hidden; margin-bottom:1.25rem">
      <div style="width:${Math.round(done/topics.length*100)}%; height:100%; background:var(--blue); border-radius:99px; transition:width 0.4s"></div>
    </div>
    
    <div style="display:flex; flex-direction:column; gap:0.75rem; margin-bottom:1.25rem">
      ${topics.map(t => `
        <div style="background:var(--bg3); border:1px solid ${ck[t.key] ? "rgba(46,204,113,0.3)" : "var(--border)"}; border-radius:var(--radius); padding:1rem; display:flex; gap:0.75rem; align-items:flex-start">
          <input type="checkbox" id="cl4-${t.key}" ${ck[t.key] ? "checked" : ""} 
                 onchange="toggleAcademyCheckbox('${t.key}')"
                 style="margin-top:0.2rem; width:18px; height:18px; cursor:pointer; flex-shrink:0; accent-color:var(--blue)">
          <label for="cl4-${t.key}" style="cursor:pointer; flex:1">
            <div style="font-size:0.9rem; font-weight:700; color:${ck[t.key] ? "var(--green)" : "var(--white)"}; display:flex; gap:0.5rem; align-items:center">
              <span>${t.icon}</span> ${t.title}
              <span style="font-size:0.65rem; color:var(--grey); background:var(--bg2); padding:0.1rem 0.4rem; border-radius:3px">${t.min}</span>
            </div>
            <p style="font-size:0.78rem; color:var(--grey2); margin-top:0.25rem; line-height:1.4">${t.desc}</p>
          </label>
        </div>
      `).join("")}
    </div>
    <button class="btn-primary" style="width:100%" onclick="submitStep4()">Temas leídos — avanzar →</button>
  `;
}

function toggleAcademyCheckbox(key) {
  const el = document.getElementById("cl4-" + key);
  if (!el) return;
  State.checklists.paso4[key] = el.checked;
  saveChecklists();
}

function submitStep4() {
  const done = Object.values(State.checklists.paso4).filter(Boolean).length;
  if (done < 3) { alert("Por favor, leé al menos 3 de los 5 temas antes de avanzar."); return; }
  State.duplicationProgress.paso4 = "completed";
  State.duplicationProgress.paso5 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep5() {
  const ck = State.checklists.paso5;
  const items = [
    { key: "foto",       icon: "📸", label: "Foto de perfil profesional",    desc: "Clara, bien iluminada, sonriendo. Sin filtros exagerados." },
    { key: "bio",        icon: "✍️", label: "Bio optimizada",                desc: "Incluí lo que hacés y a quién ayudás. Sin palabras de MLM." },
    { key: "link",       icon: "🔗", label: "Link en bio activo",            desc: "WhatsApp Business, Linktree o página de contacto." },
    { key: "historia",   icon: "📖", label: "Historia personal publicada",   desc: "Un post o historia contando tu transformación o por qué empezaste." },
    { key: "posts",      icon: "🎨", label: "3+ posts de contenido de valor", desc: "Tips de tu línea de enfoque, testimonios, educación." },
    { key: "optimizado", icon: "✅", label: "Perfil en modo público",        desc: "Asegurate de que cualquier persona pueda ver tu contenido." },
  ];
  const done = items.filter(it => ck[it.key]).length;

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:0.75rem">
      Tu perfil digital es tu primera impresión. Completá esta checklist antes de contactar:
    </p>
    <div style="height:6px; background:var(--bg3); border-radius:99px; overflow:hidden; margin-bottom:1.25rem">
      <div style="width:${Math.round(done/items.length*100)}%; height:100%; background:var(--blue); border-radius:99px; transition:width 0.4s"></div>
    </div>
    <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.25rem">
      ${items.map(it => `
        <label style="display:flex; gap:0.75rem; align-items:flex-start; background:var(--bg3); border:1px solid ${ck[it.key] ? "rgba(46,204,113,0.3)" : "var(--border)"}; border-radius:var(--radius); padding:0.85rem; cursor:pointer">
          <input type="checkbox" id="cl5-${it.key}" ${ck[it.key] ? "checked" : ""} 
                 onchange="toggleEcosystemCheckbox('${it.key}')"
                 style="margin-top:0.2rem; width:18px; height:18px; flex-shrink:0; accent-color:var(--blue)">
          <div>
            <div style="font-size:0.88rem; font-weight:700; color:${ck[it.key] ? "var(--green)" : "var(--white)"}">
              ${it.icon} ${it.label}
            </div>
            <div style="font-size:0.75rem; color:var(--grey2); margin-top:0.2rem">${it.desc}</div>
          </div>
        </label>
      `).join("")}
    </div>
    <button class="btn-primary" style="width:100%" onclick="submitStep5()">Ecosistema listo — avanzar →</button>
  `;
}

function toggleEcosystemCheckbox(key) {
  const el = document.getElementById("cl5-" + key);
  if (!el) return;
  State.checklists.paso5[key] = el.checked;
  saveChecklists();
}

function submitStep5() {
  const done = Object.values(State.checklists.paso5).filter(Boolean).length;
  if (done < 4) { alert("Por favor, completá al menos 4 de los 6 ítems del ecosistema."); return; }
  State.duplicationProgress.paso5 = "completed";
  State.duplicationProgress.paso6 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep6() {
  const count = State.contacts.length;
  const hot   = State.contacts.filter(c => c.tipo && c.tipo.includes("Caliente")).length;
  const warm  = State.contacts.filter(c => c.tipo && c.tipo.includes("Tibio")).length;
  const cold  = State.contacts.filter(c => c.tipo && c.tipo.includes("Frío")).length;

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      Tu lista de contactos es el motor de tu negocio. Cargá al menos <strong style="color:var(--white)">20 personas</strong> clasificadas como 🔥 Caliente, 🌤️ Tibio o ❄️ Frío.
    </p>
    
    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem; margin-bottom:1.25rem">
      <div style="font-weight:700; font-size:0.95rem; color:var(--white); margin-bottom:0.75rem">Tu CRM actual:</div>
      <div style="display:grid; grid-template-columns:repeat(3, 1fr); gap:0.5rem; text-align:center">
        <div style="background:rgba(255,100,100,0.08); border:1px solid rgba(255,100,100,0.2); border-radius:8px; padding:0.75rem">
          <div style="font-size:1.4rem; font-weight:800; color:var(--white)">${hot}</div>
          <div style="font-size:0.7rem; color:var(--grey2)">🔥 Calientes</div>
        </div>
        <div style="background:rgba(255,200,50,0.08); border:1px solid rgba(255,200,50,0.2); border-radius:8px; padding:0.75rem">
          <div style="font-size:1.4rem; font-weight:800; color:var(--white)">${warm}</div>
          <div style="font-size:0.7rem; color:var(--grey2)">🌤️ Tibios</div>
        </div>
        <div style="background:rgba(77,163,255,0.08); border:1px solid rgba(77,163,255,0.2); border-radius:8px; padding:0.75rem">
          <div style="font-size:1.4rem; font-weight:800; color:var(--white)">${cold}</div>
          <div style="font-size:0.7rem; color:var(--grey2)">❄️ Fríos</div>
        </div>
      </div>
      <div style="text-align:center; margin-top:0.75rem; font-size:0.8rem; color:var(--grey2)">Total: <strong style="color:var(--white)">${count} contactos</strong></div>
    </div>

    <div style="display:flex; gap:0.75rem; flex-direction:column">
      <button class="btn-secondary" onclick="navigate('contacts')">👥 Abrir CRM y cargar contactos</button>
      <button class="btn-primary" onclick="submitStep6()">Lista lista — avanzar →</button>
    </div>
  `;
}

function submitQuickContact() {
  submitStep6();
}

function submitStep6() {
  if (State.contacts.length < 3) { alert("Cargá al menos 3 contactos en el CRM antes de avanzar."); return; }
  State.duplicationProgress.paso6 = "completed";
  State.duplicationProgress.paso7 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep7() {
  const contacts = State.contacts.slice(0, 8);
  const user     = State.userProfile;
  const firstContact = contacts[0] || { nombre: "Contacto", tipo: "🔥 Caliente" };

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1rem">
      Generá un mensaje personalizado según tu línea de enfoque y el perfil de tu contacto. Copialo y envialo por Instagram/WhatsApp.
    </p>

    <div class="form-group">
      <label>Seleccioná un contacto:</label>
      <select id="msg-contact-select" class="form-input" onchange="changeMsgContact()" style="padding:0.6rem">
        ${contacts.map(c => `<option value="${c.id}">${c.nombre} (${c.tipo || "Sin tipo"})</option>`).join("")}
      </select>
    </div>

    <div id="msg-preview-box" style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem; margin:1rem 0; position:relative">
      <div style="font-size:0.72rem; color:var(--grey); margin-bottom:0.5rem; text-transform:uppercase; letter-spacing:0.04em">MENSAJE GENERADO</div>
      <p id="msg-preview-text" style="font-size:0.88rem; line-height:1.65; color:var(--white); white-space:pre-wrap">${generateSmartMessage(user.perfil, user.enfoque, firstContact.tipo, firstContact.nombre)}</p>
    </div>

    <div style="display:flex; gap:0.75rem; flex-wrap:wrap">
      <button class="btn-secondary" style="flex:1" onclick="copySmartMessage()">📋 Copiar mensaje</button>
      <button class="btn-secondary" style="flex:1" onclick="openWhatsAppChat()">💬 Abrir WhatsApp</button>
    </div>
    <button class="btn-primary" style="width:100%; margin-top:0.75rem" onclick="submitStep7()">Contactos enviados — avanzar →</button>
  `;
}

function changeMsgContact() {
  const sel = document.getElementById("msg-contact-select");
  if (!sel) return;
  const contact = State.contacts.find(c => c.id === sel.value) || State.contacts[0];
  const msg = generateSmartMessage(State.userProfile.perfil, State.userProfile.enfoque, contact.tipo, contact.nombre);
  const preview = document.getElementById("msg-preview-text");
  if (preview) preview.textContent = msg;
}

function copySmartMessage() {
  const text = document.getElementById("msg-preview-text");
  if (!text) return;
  navigator.clipboard.writeText(text.textContent).then(() => {
    const btn = event.target;
    const orig = btn.textContent;
    btn.textContent = "✅ ¡Copiado!";
    setTimeout(() => { btn.textContent = orig; }, 1500);
  });
}

function openWhatsAppChat() {
  const sel = document.getElementById("msg-contact-select");
  const contact = sel ? (State.contacts.find(c => c.id === sel.value) || State.contacts[0]) : State.contacts[0];
  if (!contact) return;
  const text = document.getElementById("msg-preview-text");
  const msg  = encodeURIComponent(text ? text.textContent : "");
  const phone = (contact.whatsapp || "").replace(/\D/g, "");
  if (phone) {
    window.open(`https://api.whatsapp.com/send?phone=${phone}&text=${msg}`);
  } else {
    window.open(`https://api.whatsapp.com/send?text=${msg}`);
  }
}

function saveMsgAsFav() {}

function submitStep7() {
  State.duplicationProgress.paso7 = "completed";
  State.duplicationProgress.paso8 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep8() {
  const ck = State.checklists.paso8;
  const items = [
    { key: "queExplicar",   icon: "📝", label: "Sé qué explicar en la reunión",       desc: "Beneficios del negocio, plan de ingresos, libertad de tiempo, calidad de los productos." },
    { key: "queEvitar",     icon: "🚫", label: "Sé qué evitar",                       desc: "No presionar, no usar vocabulario de MLM, no prometer resultados mágicos." },
    { key: "comoAbrir",     icon: "👋", label: "Sé cómo abrir la reunión",            desc: "Agradecer su tiempo, establecer la duración (15-20 min), crear un ambiente de conversación." },
    { key: "comoInteresar", icon: "💡", label: "Sé cómo generar interés genuino",    desc: "Preguntar sobre su situación actual antes de hablar de la propuesta." },
    { key: "practicaste",   icon: "🎭", label: "Practiqué con mi sponsor o espejo",   desc: "Al menos una vez antes de ir a una reunión real. Tu sponsor puede hacer el co-cierre." },
  ];
  const done = items.filter(it => ck[it.key]).length;
  const sponsor = State.userProfile.sponsor || "upline";

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:0.75rem">
      Antes de mostrar la propuesta a un prospecto, preparate con esta checklist. <strong style="color:var(--white)">No necesitás saberlo todo</strong> — solo tener los puntos clave claros.
    </p>
    
    <div style="background:rgba(77,163,255,0.06); border:1px solid rgba(77,163,255,0.2); border-radius:var(--radius); padding:1rem; margin-bottom:1rem">
      <div style="font-size:0.8rem; font-weight:700; color:var(--blue); margin-bottom:0.35rem">💡 REGLA DE ORO DE LA REUNIÓN</div>
      <p style="font-size:0.82rem; color:var(--grey2); line-height:1.5; font-style:italic">
        "Primero preguntá, después presentá. Escuchá qué necesita la persona antes de hablar de la propuesta."
      </p>
    </div>

    <div style="height:6px; background:var(--bg3); border-radius:99px; overflow:hidden; margin-bottom:1rem">
      <div style="width:${Math.round(done/items.length*100)}%; height:100%; background:var(--blue); border-radius:99px; transition:width 0.4s"></div>
    </div>
    <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.25rem">
      ${items.map(it => `
        <label style="display:flex; gap:0.75rem; align-items:flex-start; background:var(--bg3); border:1px solid ${ck[it.key] ? "rgba(46,204,113,0.3)" : "var(--border)"}; border-radius:var(--radius); padding:0.85rem; cursor:pointer">
          <input type="checkbox" id="cl8-${it.key}" ${ck[it.key] ? "checked" : ""} 
                 onchange="togglePlanCheckbox('${it.key}')"
                 style="margin-top:0.2rem; width:18px; height:18px; flex-shrink:0; accent-color:var(--blue)">
          <div>
            <div style="font-size:0.88rem; font-weight:700; color:${ck[it.key] ? "var(--green)" : "var(--white)"}">
              ${it.icon} ${it.label}
            </div>
            <div style="font-size:0.75rem; color:var(--grey2); margin-top:0.2rem">${it.desc}</div>
          </div>
        </label>
      `).join("")}
    </div>

    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); padding:1rem; margin-bottom:1rem">
      <div style="font-size:0.82rem; font-weight:700; color:var(--white); margin-bottom:0.5rem">🤝 Pedí ayuda a tu Sponsor</div>
      <p style="font-size:0.78rem; color:var(--grey2); margin-bottom:0.75rem">Tu sponsor (${sponsor}) puede ir con vos a las primeras reuniones. No tenés que hacerlo solo.</p>
      <button class="btn-secondary" style="width:100%; font-size:0.82rem" onclick="sendSponsorHelpMsg('${sponsor}')">💬 Pedirle ayuda a ${sponsor} por WhatsApp</button>
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep8()">Plan preparado — avanzar →</button>
  `;
}

function togglePlanCheckbox(key) {
  const el = document.getElementById("cl8-" + key);
  if (!el) return;
  State.checklists.paso8[key] = el.checked;
  saveChecklists();
}

function submitStep8() {
  State.duplicationProgress.paso8 = "completed";
  State.duplicationProgress.paso9 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep9() {
  const contactsInProgress = State.contacts.filter(c =>
    ["Contactado", "Interesado", "Reunión"].includes(c.estado)
  );

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      El seguimiento es donde se convierten los prospectos. La mayoría dice que no a la primera — el negocio está en el seguimiento inteligente.
    </p>

    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); padding:1.25rem; margin-bottom:1rem; text-align:center">
      <div style="font-size:2.5rem; margin-bottom:0.5rem">👥</div>
      <h5 style="color:var(--white); font-weight:700; margin-bottom:0.25rem">Tu CRM de Contactos</h5>
      <p style="font-size:0.8rem; color:var(--grey2); margin-bottom:0.75rem">
        Gestioná el estado de cada contacto: Nuevo → Contactado → Interesado → Reunión → Cliente / Socio
      </p>
      <div style="font-size:1.1rem; font-weight:800; color:var(--blue); margin-bottom:0.5rem">${contactsInProgress.length} contactos activos en proceso</div>
      <button class="btn-secondary" style="width:100%" onclick="navigate('contacts')">👥 Abrir CRM de contactos</button>
    </div>

    <div style="background:rgba(155,92,255,0.06); border:1px solid rgba(155,92,255,0.2); border-radius:var(--radius); padding:1rem; margin-bottom:1.25rem">
      <div style="font-size:0.8rem; font-weight:700; color:var(--violet); margin-bottom:0.35rem">⚡ REGLA DEL SEGUIMIENTO</div>
      <p style="font-size:0.82rem; color:var(--grey2); line-height:1.5">
        Tocá cada contacto <strong style="color:var(--white)">una vez por semana</strong>. No vendas — acompañá. Compartí un tip, preguntá cómo le fue, recordale que seguís disponible.
      </p>
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep9()">Seguimiento iniciado — avanzar →</button>
  `;
}

function sendSponsorHelpMsg(sponsor) {
  const text = encodeURIComponent("Hola " + sponsor + ", ¡ya preparé todo! Estoy listo para dar el plan a mis primeros contactos. ¿Me acompañás a la primera reunión?");
  window.open("https://api.whatsapp.com/send?text=" + text);
}

function submitStep9() {
  State.duplicationProgress.paso9 = "completed";
  State.duplicationProgress.paso10 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep10() {
  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      Después de una reunión, tu prospecto puede tomar dos caminos. Ambos son valiosos — aprendé a identificar cuál es cuál y cómo acompañar en cada caso:
    </p>

    <div style="display:grid; grid-template-columns:1fr 1fr; gap:0.75rem; margin-bottom:1.25rem">
      <div style="background:rgba(46,204,113,0.05); border:1px solid rgba(46,204,113,0.25); border-radius:var(--radius); padding:1.25rem; text-align:center">
        <div style="font-size:2rem; margin-bottom:0.5rem">🛍️</div>
        <h5 style="color:var(--green); font-weight:800; margin-bottom:0.5rem">CLIENTE</h5>
        <p style="font-size:0.75rem; color:var(--grey2); line-height:1.5">
          Le interesan los productos, no el negocio. Ayudalo a elegir su pack ideal. Hacé seguimiento mensual.
        </p>
        <div style="margin-top:0.75rem; font-size:0.7rem; color:var(--green); font-weight:700">✓ Genera ingreso directo</div>
      </div>
      <div style="background:rgba(155,92,255,0.05); border:1px solid rgba(155,92,255,0.25); border-radius:var(--radius); padding:1.25rem; text-align:center">
        <div style="font-size:2rem; margin-bottom:0.5rem">🚀</div>
        <h5 style="color:var(--violet); font-weight:800; margin-bottom:0.5rem">SOCIO</h5>
        <p style="font-size:0.75rem; color:var(--grey2); line-height:1.5">
          Le interesa el negocio. Empezá su proceso de duplicación — dales acceso a Quantum.
        </p>
        <div style="margin-top:0.75rem; font-size:0.7rem; color:var(--violet); font-weight:700">✓ Multiplica tu red</div>
      </div>
    </div>

    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); padding:1rem; margin-bottom:1.25rem">
      <div style="font-size:0.8rem; font-weight:700; color:var(--white); margin-bottom:0.35rem">💡 Clave del cierre</div>
      <p style="font-size:0.8rem; color:var(--grey2); line-height:1.5">
        Al final de la reunión siempre preguntá: <em style="color:var(--white)">"¿Qué te resonó más de lo que te mostré?"</em> — La respuesta te indica si es cliente o socio.
      </p>
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep10()">Entendí los dos caminos — avanzar →</button>
  `;
}

function submitStep10() {
  State.duplicationProgress.paso10 = "completed";
  State.duplicationProgress.paso11 = "in_progress";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  renderAll();
}

function renderGuideStep11() {
  const nombre = State.userProfile.nombre || State.currentUserName || "Vos";

  return `
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      La magia de este sistema no está en vender — está en <strong style="color:var(--white)">enseñar</strong>. Cuando tu nuevo socio hace lo mismo que hiciste vos, el negocio se duplica sin que trabajes el doble.
    </p>

    <div style="background:var(--bg3); border:1px solid var(--border); border-radius:var(--radius); padding:1.5rem; margin-bottom:1.25rem">
      <div style="display:flex; justify-content:center; align-items:center; gap:0.5rem; flex-wrap:wrap; font-size:0.85rem">
        <div style="background:rgba(155,92,255,0.15); color:var(--violet); padding:0.5rem 0.9rem; border-radius:8px; border:1px solid rgba(155,92,255,0.3); font-weight:700; text-align:center">
          <div style="font-size:1.1rem">👤</div>
          <div>${nombre}</div>
          <div style="font-size:0.65rem; opacity:0.7">Paso 1-11</div>
        </div>
        <span style="color:var(--grey2); font-size:1.2rem">→</span>
        <div style="background:rgba(77,163,255,0.15); color:var(--blue); padding:0.5rem 0.9rem; border-radius:8px; border:1px solid rgba(77,163,255,0.3); font-weight:700; text-align:center">
          <div style="font-size:1.1rem">👤</div>
          <div>Socio 1</div>
          <div style="font-size:0.65rem; opacity:0.7">Paso 1-11</div>
        </div>
        <span style="color:var(--grey2); font-size:1.2rem">→</span>
        <div style="background:rgba(46,204,113,0.15); color:var(--green); padding:0.5rem 0.9rem; border-radius:8px; border:1px solid rgba(46,204,113,0.3); font-weight:700; text-align:center">
          <div style="font-size:1.1rem">👥</div>
          <div>Red</div>
          <div style="font-size:0.65rem; opacity:0.7">Crecimiento</div>
        </div>
      </div>
      <p style="font-size:0.8rem; color:var(--grey2); line-height:1.5; margin-top:1rem; text-align:center">
        Cada socio repite los mismos 11 pasos con Quantum. Vos solo acompañás y guiás.
      </p>
    </div>

    <div style="background:rgba(155,92,255,0.06); border:1px solid rgba(155,92,255,0.2); border-radius:var(--radius); padding:1rem; margin-bottom:1.25rem">
      <div style="font-size:0.8rem; font-weight:700; color:var(--violet); margin-bottom:0.35rem">🎯 TU SIGUIENTE ACCIÓN</div>
      <p style="font-size:0.82rem; color:var(--grey2); line-height:1.5">
        Compartile a tu nuevo socio el enlace de Quantum. Pedile que complete el Paso 1 antes de la próxima llamada.
      </p>
    </div>

    <button class="btn-primary" style="width:100%; font-weight:800; font-size:1rem" onclick="submitStep11()">
      🏆 Finalizar el Manual y celebrar
    </button>
  `;
}

function submitStep11() {
  State.duplicationProgress.paso11 = "completed";
  saveDuplicationProgress();
  saveProgressToSheets().catch(() => {});
  alert("🎉 ¡FELICITACIONES " + (State.currentUserName || State.userProfile.nombre || "").toUpperCase() + "! Completaste los 11 pasos del Manual de Duplicación Digital. Ahora es tu turno de duplicar el sistema con tu equipo.");
  renderAll();
}


// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: PLANIFICACIÓN - CONTACTOS (CRM)                │
// └─────────────────────────────────────────────────────────┘

let _crmSearchText = "";
let _crmTypeFilter = "";
let _crmStatusFilter = "";

function renderContactsCRM() {
  const el = document.getElementById("section-contacts");
  if (!el) return;

  const contacts = State.contacts;

  const filtered = contacts.filter(c => {
    const matchName = c.nombre.toLowerCase().includes(_crmSearchText.toLowerCase()) || 
                      (c.observaciones || "").toLowerCase().includes(_crmSearchText.toLowerCase());
    const matchType = !_crmTypeFilter || c.tipo === _crmTypeFilter;
    const matchStatus = !_crmStatusFilter || c.estado === _crmStatusFilter;
    return matchName && matchType && matchStatus;
  });

  const statuses = ["Nuevo", "Contactado", "Interesado", "Reunión", "Cliente", "Socio"];
  const temps = ["🔥 Caliente", "🌤️ Tibio", "❄️ Frío"];

  el.innerHTML = `
    <div class="section-header">
      <h2 class="section-title">Lista de Contactos (CRM)</h2>
      <span class="section-sub">Administrá las relaciones, notas y estados de tus contactos</span>
    </div>

    <div style="background:var(--bg2); border:1px solid var(--border); padding:1.25rem; border-radius:var(--radius); margin-bottom:1.5rem">
      <h3 style="font-size:1rem; font-weight:700; color:var(--white); margin-bottom:1rem">+ Cargar Nuevo Contacto</h3>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:0.75rem">
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">Nombre completo *</label>
          <input id="crm-nombre" type="text" class="form-input" style="padding:0.4rem; font-size:0.85rem" placeholder="Ej: Sofía Martínez">
        </div>
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">Instagram (usuario sin @)</label>
          <input id="crm-insta" type="text" class="form-input" style="padding:0.4rem; font-size:0.85rem" placeholder="Ej: sofimart">
        </div>
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">WhatsApp (con código de país)</label>
          <input id="crm-whats" type="text" class="form-input" style="padding:0.4rem; font-size:0.85rem" placeholder="Ej: +541155556666">
        </div>
      </div>
      
      <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(200px, 1fr)); gap:0.75rem; margin-bottom:1rem">
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">Temperatura de contacto</label>
          <select id="crm-tipo" class="form-input" style="padding:0.4rem; font-size:0.85rem">
            <option value="🔥 Caliente">🔥 Caliente (Amigo/Cercano)</option>
            <option value="🌤️ Tibio">🌤️ Tibio (Conocido)</option>
            <option value="❄️ Frío">❄️ Frío (Desconocido)</option>
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">Estado inicial</label>
          <select id="crm-estado" class="form-input" style="padding:0.4rem; font-size:0.85rem">
            ${statuses.map(st => `<option value="${st}">${st}</option>`).join("")}
          </select>
        </div>
        <div class="form-group" style="margin:0">
          <label style="font-size:0.75rem">Observaciones / notas</label>
          <input id="crm-obs" type="text" class="form-input" style="padding:0.4rem; font-size:0.85rem" placeholder="Ej: Amiga de la infancia, le gusta la estética">
        </div>
      </div>

      <button class="btn-primary" style="width:100%" onclick="submitCrmContact()">💾 Guardar en CRM</button>
    </div>

    <div style="display:grid; grid-template-columns:repeat(auto-fit, minmax(180px, 1fr)); gap:0.75rem; margin-bottom:1.25rem">
      <input type="text" class="form-input" style="padding:0.5rem; font-size:0.85rem" 
             value="${_crmSearchText}" placeholder="🔎 Buscar por nombre..." 
             oninput="updateCrmSearch(this.value)">
             
      <select class="form-input" style="padding:0.5rem; font-size:0.85rem" onchange="updateCrmTypeFilter(this.value)">
        <option value="">— Filtrar Temperatura —</option>
        ${temps.map(t => `<option value="${t}" ${_crmTypeFilter === t ? 'selected' : ''}>${t}</option>`).join("")}
      </select>

      <select class="form-input" style="padding:0.5rem; font-size:0.85rem" onchange="updateCrmStatusFilter(this.value)">
        <option value="">— Filtrar Estado —</option>
        ${statuses.map(st => `<option value="${st}" ${_crmStatusFilter === st ? 'selected' : ''}>${st}</option>`).join("")}
      </select>
    </div>

    <div class="team-table-wrap" style="background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); overflow:hidden">
      <table class="team-table" style="width:100%; border-collapse:collapse">
        <thead>
          <tr style="text-align:left; background:var(--bg3); border-bottom:1px solid var(--border)">
            <th style="padding:0.75rem 1rem; font-size:0.8rem; color:var(--grey2); text-transform:uppercase">Contacto</th>
            <th style="padding:0.75rem 1rem; font-size:0.8rem; color:var(--grey2); text-transform:uppercase">Redes / Tel</th>
            <th style="padding:0.75rem 1rem; font-size:0.8rem; color:var(--grey2); text-transform:uppercase">Temperatura</th>
            <th style="padding:0.75rem 1rem; font-size:0.8rem; color:var(--grey2); text-transform:uppercase">Estado</th>
            <th style="padding:0.75rem 1rem; font-size:0.8rem; color:var(--grey2); text-transform:uppercase">Notas</th>
            <th style="padding:0.75rem 1rem; font-size:0.8rem; color:var(--grey2); text-transform:uppercase">Acciones</th>
          </tr>
        </thead>
        <tbody>
          ${filtered.length === 0 ? `
            <tr>
              <td colspan="6" style="padding:2rem; text-align:center; color:var(--grey)">No se encontraron contactos con los filtros actuales.</td>
            </tr>
          ` : filtered.map(c => {
            const col = c.tipo.includes("Caliente") ? "var(--green)" : c.tipo.includes("Tibio") ? "var(--blue)" : "var(--violet)";
            return `
              <tr style="border-bottom:1px solid var(--border)">
                <td style="padding:0.75rem 1rem">
                  <div style="display:flex; align-items:center; gap:0.5rem">
                    <div style="background:${col}15; border:1px solid ${col}40; color:${col}; width:32px; height:32px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-weight:700; font-size:0.8rem">
                      ${initials(c.nombre)}
                    </div>
                    <strong>${c.nombre}</strong>
                  </div>
                </td>
                <td style="padding:0.75rem 1rem; font-size:0.85rem">
                  ${c.instagram ? `<div>📸 @${c.instagram}</div>` : ""}
                  ${c.whatsapp ? `<div style="color:var(--grey2); margin-top:0.15rem">📞 ${c.whatsapp}</div>` : ""}
                </td>
                <td style="padding:0.75rem 1rem; font-size:0.85rem">
                  <span style="background:${col}10; border:1px solid ${col}30; color:${col}; padding:0.15rem 0.4rem; border-radius:4px; font-weight:600; font-size:0.75rem">
                    ${c.tipo}
                  </span>
                </td>
                <td style="padding:0.75rem 1rem">
                  <select class="form-input" style="padding:0.25rem 0.5rem; font-size:0.8rem; background:var(--bg3); border-color:var(--border); width:130px" 
                          onchange="changeContactStatusInline('${c.id}', this.value)">
                    ${statuses.map(st => `
                      <option value="${st}" ${c.estado === st ? 'selected' : ''}>${st}</option>
                    `).join("")}
                  </select>
                </td>
                <td style="padding:0.75rem 1rem; font-size:0.85rem; color:#ccc; max-width:200px; white-space:nowrap; overflow:hidden; text-overflow:ellipsis" title="${c.observaciones || ''}">
                  ${c.observaciones || '—'}
                </td>
                <td style="padding:0.75rem 1rem">
                  <div style="display:flex; gap:0.4rem">
                    ${c.whatsapp ? `
                      <button class="btn-icon" onclick="window.open('https://api.whatsapp.com/send?phone=' + String('${c.whatsapp}').replace(/[^0-9+]/g, ''))" title="Chat de WhatsApp">💬</button>
                    ` : ""}
                    <button class="btn-icon btn-icon-danger" onclick="deleteContact('${c.id}')" title="Eliminar contacto">🗑</button>
                  </div>
                </td>
              </tr>
            `;
          }).join("")}
        </tbody>
      </table>
    </div>
  `;
}

function submitCrmContact() {
  const nombre = document.getElementById("crm-nombre").value.trim();
  const insta = document.getElementById("crm-insta").value.trim();
  const whats = document.getElementById("crm-whats").value.trim();
  const tipo = document.getElementById("crm-tipo").value;
  const estado = document.getElementById("crm-estado").value;
  const obs = document.getElementById("crm-obs").value.trim();

  if (!nombre) {
    alert("El nombre es requerido.");
    return;
  }

  const c = {
    id: "c_" + Date.now(),
    nombre,
    instagram: insta,
    whatsapp: whats,
    tipo,
    estado,
    observaciones: obs
  };

  State.contacts.push(c);
  saveContacts();

  document.getElementById("crm-nombre").value = "";
  document.getElementById("crm-insta").value = "";
  document.getElementById("crm-whats").value = "";
  document.getElementById("crm-obs").value = "";

  renderContactsCRM();
}

function updateCrmSearch(val) {
  _crmSearchText = val;
  renderContactsCRM();
}

function updateCrmTypeFilter(val) {
  _crmTypeFilter = val;
  renderContactsCRM();
}

function updateCrmStatusFilter(val) {
  _crmStatusFilter = val;
  renderContactsCRM();
}

function changeContactStatusInline(contactId, newStatus) {
  const contact = State.contacts.find(c => c.id === contactId);
  if (contact) {
    contact.estado = newStatus;
    saveContacts();
  }
}

function deleteContact(id) {
  if (!confirm("¿Seguro que querés eliminar este contacto?")) return;
  State.contacts = State.contacts.filter(c => c.id !== id);
  saveContacts();
  renderContactsCRM();
}


// ┌─────────────────────────────────────────────────────────┐
// │  SECCIÓN: RESULTADOS - CRECIMIENTO (SUB-TABS)            │
// └─────────────────────────────────────────────────────────┘

function renderCrecimiento() {
  const el = document.getElementById("section-growth");
  if (!el) return;

  const tabs = [
    { id: "dashboard", label: "📈 Puntos", fn: renderDashboard },
    { id: "network", label: "🌳 Red", fn: renderNetwork },
    { id: "team", label: "👥 Equipo", fn: renderTeam },
    { id: "goals", label: "🎯 Objetivos", fn: renderGoals },
    { id: "simulator", label: "⚡ Simulador", fn: renderSimulator },
    { id: "flow", label: "🔄 Flujo", fn: renderFlow },
    { id: "history", label: "📸 Historial", fn: renderHistory },
    { id: "academy", label: "📚 Academia", fn: renderAcademy },
    { id: "profiles", label: "🔍 Perfiles", fn: renderProfiles }
  ];

  el.innerHTML = `
    <div class="growth-container animate-fade-in" style="display:flex; flex-direction:column; width:100%">
      <div class="growth-tabs-scroll" style="width:100%; overflow-x:auto; border-bottom:1px solid var(--border); margin-bottom:1.5rem">
        <div class="growth-tabs" style="display:flex; gap:0.5rem; padding:0.5rem 0.25rem; min-width:max-content">
          ${tabs.map(t => `
            <button class="growth-tab-btn ${t.id === _activeGrowthTab ? 'active' : ''}"
                    onclick="switchGrowthTab('${t.id}')"
                    style="background:${t.id === _activeGrowthTab ? 'var(--blue)' : 'var(--bg3)'}; color:${t.id === _activeGrowthTab ? 'var(--bg-black)' : 'var(--grey2)'}; border:1px solid ${t.id === _activeGrowthTab ? 'var(--blue)' : 'var(--border)'}; padding:0.5rem 1rem; border-radius:20px; font-size:0.8rem; font-weight:600; cursor:pointer; transition:all 0.2s">
              ${t.label}
            </button>
          `).join("")}
        </div>
      </div>
      
      <div id="growth-tab-content" class="growth-tab-content">
        <div id="section-${_activeGrowthTab}"></div>
      </div>
    </div>
  `;

  const targetTab = tabs.find(t => t.id === _activeGrowthTab);
  if (targetTab && typeof targetTab.fn === "function") {
    setTimeout(() => {
      targetTab.fn();
    }, 10);
  }
}

function switchGrowthTab(tabId) {
  _activeGrowthTab = tabId;
  renderCrecimiento();
}

window.switchGrowthTab = switchGrowthTab;

function generateSmartMessage(perfil, enfoque, tipo, contactName) {
  contactName = contactName || "amigo";
  tipo = tipo || "🔥 Caliente";
  enfoque = enfoque || "";
  const tempClean = tipo.includes("Caliente") ? "caliente" : tipo.includes("Tibio") ? "tibio" : "frio";
  const enfClean = enfoque.toLowerCase();
  
  // SPECIFIC SPEECHES DESIGNED BY JOY FOR BEGINNERS
  if (enfClean.includes("belleza")) {
    return "Hola Eli ¿cómo estás? Qué lindo y prolijo tu feed, me encanta tu trabajo con el rubro de cosmiatría. Te escribo porque estoy liderando un proyecto de digitalización de negocios estéticos acá en Argentina. Sé que el contexto actual nos exige a todas diversificar ingresos, y estamos ayudando a profesionales de la belleza a implementar un sistema de Social Selling (venta en redes). La idea es que puedas monetizar la recomendación de rutinas de cuidado/skincare que seguro ya les hacés a tus clientas en el gabinete, pero de forma 100% digital, con y sin stock. Si te interesa sumar una línea premium a tu espacio y generar un ingreso extra que no dependa de tus horas de servicio, dejanos tu contacto y te comparto un audio breve sobre cómo lo estructuramos. ¡Un beso!";
  }
  
  if (enfClean.includes("nutricion") || enfClean.includes("nutri")) {
    return "Hola Dr Mariano, ¿cómo está? Lo sigo hace un tiempo y el contenido que comparte me resulta de mucho valor para el cuidado y bienestar de la salud. Lo contacto por éste motivo ya que formo parte de una línea de nutrición que aporta a profesionales de la salud y el fitness una unidad de negocio digital basada en suplementación orgánica certificada. Hoy en día, la demanda de bienestar creció muchísimo y la gente busca soluciones integrales. Nosotros nos encargamos de la estrategia de marketing para que pueda recomendar soluciones de hábitos saludables y generar ingresos extras potenciando su marca personal. La propuesta está disponible para que podamos realizar una reunión virtual en el horario de 10 a 18hs. La duración de la misma puede variar entre 15 a 20 minutos. Sin más, muchas gracias por su atención y buenos consejos a la comunidad.";
  }

  // FALLBACK ELEGANT SPANISH
  return "¡Hola " + contactName + "! ¿Cómo estás? Te escribo porque estoy armando una propuesta de negocio digital sustentable orientada a nuestra línea de enfoque en Argentina. Pensé en vos porque sé que valorás la calidad de vida y el tiempo libre. Si te copa charlar unos minutos virtualmente o por WhatsApp de forma simple y sin presiones, avisame y coordinamos un ratito. ¡Un abrazo grande!";
}


// ┌─────────────────────────────────────────────────────────┐
// │  INICIALIZACIÓN                                         │
// └─────────────────────────────────────────────────────────┘

async function init() {
  // ── Cargar URL de GAS ──────────────────────────────────────
  const savedUrl = localStorage.getItem("quantum_gas_url");
  if (savedUrl) GAS_URL = savedUrl;

  // ── Cargar datos locales ───────────────────────────────────
  loadCurrentUser();
  loadUserProfile();
  loadContacts();
  loadDuplicationProgress();
  loadChecklists();

  // ── Configurar navegación ──────────────────────────────────
  document.querySelectorAll(".nav-link").forEach(link => {
    link.addEventListener("click", e => {
      e.preventDefault();
      navigate(link.dataset.section);
    });
  });

  document.querySelectorAll(".mobile-nav-btn").forEach(btn => {
    btn.addEventListener("click", () => navigate(btn.dataset.section));
  });

  const hamburger = document.getElementById("hamburger");
  if (hamburger) hamburger.addEventListener("click", toggleSidebar);

  const overlay = document.getElementById("sidebar-overlay");
  if (overlay) overlay.addEventListener("click", closeSidebar);

  document.addEventListener("keydown", e => {
    if (e.key === "Escape") closeModal();
  });

  const modalOverlay = document.getElementById("modal-overlay");
  if (modalOverlay) modalOverlay.addEventListener("click", e => {
    if (e.target === e.currentTarget) closeModal();
  });

  // ── Registrar globals para onclick inline ─────────────────
  window.startSession              = startSession;
  window.logoutSession             = logoutSession;
  window.changeSessionName         = changeSessionName;
  window.toggleGuideStep           = toggleGuideStep;
  window.toggleObjectivePill       = toggleObjectivePill;
  window.submitStep1               = submitStep1;
  window.selectProfileType         = selectProfileType;
  window.submitStep2               = submitStep2;
  window.selectEnfoqueType         = selectEnfoqueType;
  window.submitStep3               = submitStep3;
  window.toggleAcademyCheckbox     = toggleAcademyCheckbox;
  window.submitStep4               = submitStep4;
  window.toggleEcosystemCheckbox   = toggleEcosystemCheckbox;
  window.submitStep5               = submitStep5;
  window.submitQuickContact        = submitQuickContact;
  window.submitStep6               = submitStep6;
  window.changeMsgContact          = changeMsgContact;
  window.copySmartMessage          = copySmartMessage;
  window.openWhatsAppChat          = openWhatsAppChat;
  window.saveMsgAsFav              = saveMsgAsFav;
  window.submitStep7               = submitStep7;
  window.togglePlanCheckbox        = togglePlanCheckbox;
  window.submitStep8               = submitStep8;
  window.sendSponsorHelpMsg        = sendSponsorHelpMsg;
  window.submitStep9               = submitStep9;
  window.submitStep10              = submitStep10;
  window.submitStep11              = submitStep11;
  window.submitCrmContact          = submitCrmContact;
  window.updateCrmSearch           = updateCrmSearch;
  window.updateCrmTypeFilter       = updateCrmTypeFilter;
  window.updateCrmStatusFilter     = updateCrmStatusFilter;
  window.changeContactStatusInline = changeContactStatusInline;
  window.deleteContact             = deleteContact;
  window.moveKanbanContact         = moveKanbanContact;
  window.handleKanbanDragStart     = handleKanbanDragStart;
  window.handleKanbanDrop          = handleKanbanDrop;
  window.shiftKanbanView           = shiftKanbanView;
  window.navigate                  = navigate;

  // ── Decidir pantalla inicial ───────────────────────────────
  if (!State.currentUserId) {
    // Sin sesión → mostrar pantalla de bienvenida
    navigate("welcome");
  } else {
    // Con sesión → cargar equipo y navegar al home
    await fetchTeam();
    await fetchHistory();
    // Cargar progreso desde Sheets en background (no bloquea la UI)
    loadProgressFromSheets(State.currentUserId).catch(() => {});
    loadContactsFromSheets(State.currentUserId).catch(() => {});
    navigate("home");
  }
}

// Arrancar cuando el DOM esté listo
document.addEventListener("DOMContentLoaded", init);
