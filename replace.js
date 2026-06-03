const fs = require('fs');

const appCode = fs.readFileSync('app.js', 'utf8');
const start = appCode.indexOf('function getDailyTasks');
const end = appCode.indexOf('// ┌─────────────────────────────────────────────────────────┐\n// │  SECCIÓN: MENTOR DIGITAL - GUÍA DE DUPLICACIÓN          │');

if (start === -1 || end === -1) {
  console.error('Could not find start or end index in app.js');
  process.exit(1);
}

const replacement = `function getDailyTasks(activeStep) {
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

  const tasksHtml = tasks.map((t, i) => \`
    <label style="display:flex; align-items:center; gap:0.85rem; padding:0.7rem 0; border-bottom:1px solid rgba(255,255,255,0.04); cursor:pointer">
      <input type="checkbox" id="dt-\${i}" \${doneTasks.includes(i) ? "checked" : ""}
             onchange="toggleDailyTask(\${i})"
             style="width:18px; height:18px; flex-shrink:0; accent-color:var(--blue); cursor:pointer">
      <span style="font-size:0.88rem; color:\${doneTasks.includes(i) ? "var(--grey)" : "var(--white)"}; \${doneTasks.includes(i) ? "text-decoration:line-through" : ""}; transition:color 0.2s">\${t}</span>
    </label>
  \`).join("");

  // ── Tarjeta próximo paso ─────────────────────────────────
  const stepCardHtml = isFinished ? \`
    <div style="background:linear-gradient(135deg, rgba(46,204,113,0.08) 0%, rgba(0,220,180,0.05) 100%); border:1px solid rgba(46,204,113,0.3); border-left:4px solid var(--green); border-radius:var(--radius); padding:1.5rem; text-align:center">
      <div style="font-size:3rem; margin-bottom:0.5rem">🎉</div>
      <h3 style="color:var(--green); font-size:1.1rem; font-weight:800; margin-bottom:0.4rem">¡Recorrido completado!</h3>
      <p style="font-size:0.82rem; color:var(--grey2); line-height:1.5; margin-bottom:1rem">
        Ya conocés el sistema Quantum.<br>Ahora ayudá a otra persona a recorrerlo.
      </p>
      <button class="btn-primary" style="width:100%; margin-bottom:0.5rem; background:var(--green); color:#000" onclick="navigate('guide')">🚀 Comenzar Duplicación</button>
      <button class="btn-secondary" style="width:100%; font-size:0.82rem" onclick="resetProgress()">🔄 Reiniciar recorrido</button>
    </div>
  \` : \`
    <div style="background:var(--bg2); border:1px solid var(--blue); border-left:4px solid var(--blue); border-radius:var(--radius); overflow:hidden">
      <div style="padding:1.25rem 1.25rem 1rem; position:relative">
        <div style="position:absolute;inset:0;background:linear-gradient(135deg,rgba(77,163,255,0.04) 0%,transparent 100%);pointer-events:none"></div>
        <div style="background:var(--blue); color:#000; font-size:0.62rem; font-weight:800; padding:0.18rem 0.5rem; border-radius:3px; display:inline-block; margin-bottom:0.65rem; letter-spacing:0.07em">PRÓXIMO PASO</div>
        <div style="display:flex; gap:1rem; align-items:center">
          <span style="font-size:2.4rem; flex-shrink:0">\${activeStep.icon}</span>
          <div style="flex:1; min-width:0">
            <h3 style="font-size:1rem; font-weight:700; color:var(--white); margin-bottom:0.15rem">Paso \${activeStep.index}: \${activeStep.label}</h3>
            <p style="font-size:0.78rem; color:var(--grey2)">Completá este paso para desbloquear el siguiente.</p>
          </div>
        </div>
      </div>
      <div style="display:flex; border-top:1px solid var(--border)">
        <button onclick="navigate('guide')" style="flex:2; background:var(--blue); border:none; color:#000; font-size:0.85rem; font-weight:800; padding:0.8rem; cursor:pointer; transition:opacity 0.15s" onmouseover="this.style.opacity='0.85'" onmouseout="this.style.opacity='1'">Continuar →</button>
        <button onclick="navigate('guide')" style="flex:1; background:transparent; border:none; border-left:1px solid var(--border); color:var(--grey2); font-size:0.78rem; padding:0.8rem; cursor:pointer; transition:color 0.15s" onmouseover="this.style.color='var(--white)'" onmouseout="this.style.color='var(--grey2)'">📖 Ver guía completa</button>
      </div>
    </div>
  \`;

  el.innerHTML = \`
    <div style="padding-bottom:1.5rem">

      <!-- Saludo -->
      <div class="animate-fade-in" style="padding:1.5rem 0 0.75rem">
        <h1 style="font-size:1.65rem; font-weight:800; color:var(--white); margin-bottom:0.2rem">Hola, \${nombre} 👋</h1>
        <p style="color:var(--grey2); font-size:0.85rem">¿Qué vas a hacer hoy para avanzar?</p>
      </div>

      <!-- 🎯 QUÉ HACER AHORA — TARJETA HÉROE -->
      <div class="animate-fade-in" style="background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); margin-bottom:1.25rem; overflow:hidden">
        <div style="display:flex; justify-content:space-between; align-items:center; padding:1rem 1.25rem; border-bottom:1px solid var(--border); background:linear-gradient(90deg, rgba(77,163,255,0.04) 0%, transparent 100%)">
          <div>
            <div style="font-size:0.7rem; font-weight:800; color:var(--blue); letter-spacing:0.07em; text-transform:uppercase; margin-bottom:0.15rem">🎯 Qué hacer ahora</div>
            <div style="font-size:0.78rem; color:var(--grey2)">\${tasksDoneCount} de \${tasks.length} tareas completadas</div>
          </div>
          <div style="position:relative; width:44px; height:44px">
            <svg viewBox="0 0 44 44" style="width:44px;height:44px;transform:rotate(-90deg)">
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--bg3)" stroke-width="4"/>
              <circle cx="22" cy="22" r="18" fill="none" stroke="var(--blue)" stroke-width="4"
                stroke-dasharray="\${Math.round(2*Math.PI*18)}"
                stroke-dashoffset="\${Math.round(2*Math.PI*18*(1 - (tasks.length ? tasksDoneCount/tasks.length : 0)))}"
                stroke-linecap="round"/>
            </svg>
            <span style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:0.7rem;font-weight:800;color:var(--white)">\${Math.round((tasks.length ? tasksDoneCount/tasks.length : 0)*100)}%</span>
          </div>
        </div>
        <div style="padding:0.25rem 1.25rem 0.75rem">
          \${tasksHtml}
        </div>
      </div>

      <!-- PRÓXIMO PASO -->
      <div class="animate-fade-in" style="margin-bottom:1.25rem">
        \${stepCardHtml}
      </div>

      <!-- Progreso general (secundario) -->
      <div style="background:var(--bg2); border:1px solid var(--border); border-radius:var(--radius); padding:0.9rem 1.1rem; margin-bottom:1.25rem">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.45rem">
          <span style="font-size:0.75rem; color:var(--grey2)">Progreso del Manual</span>
          <span style="font-size:0.78rem; font-weight:700; color:\${pct===100 ? 'var(--green)' : 'var(--grey2)'};">\${completedCount}/\${total} pasos</span>
        </div>
        <div style="height:6px; background:var(--bg3); border-radius:99px; overflow:hidden">
          <div style="width:\${pct}%; height:100%; background:linear-gradient(90deg, var(--violet) 0%, var(--blue) 100%); border-radius:99px; transition:width 0.6s ease"></div>
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
  \`;
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
  if (!confirm("¿Reiniciar el recorrido del Manual?\\n\\nEsto resetea únicamente los 11 pasos.\\nTus contactos, configuración y perfil se mantienen intactos.")) return;
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
  renderAll();
}`;

const newCode = appCode.substring(0, start) + replacement + '\n\n' + appCode.substring(end);
fs.writeFileSync('app.js', newCode, 'utf8');
console.log('Done replacement!');
