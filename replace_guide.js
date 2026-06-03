const fs = require('fs');

const appCode = fs.readFileSync('app.js', 'utf8');
const start = appCode.indexOf('function renderGuide()');
const end = appCode.indexOf('// ── RENDER DE PASOS INDIVIDUALES ─────────────────────────────');

if (start === -1 || end === -1) {
  console.error('Could not find renderGuide or step rendering start in app.js');
  process.exit(1);
}

const replacement = `function getStepPercentage(stepNum, status) {
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

  el.innerHTML = \`
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
      \\\${steps.map((st, i) => {
        const stepNum = i + 1;

        // Si el usuario completó todo el recorrido, y estamos en el paso 11, lo reemplazamos por la tarjeta de celebración
        if (isFinished && stepNum === 11) {
          return \\\`
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
          \\\`;
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

        return \\\`
          <div class="guide-step-card" style="\\\${statusStyle}; border-width:1px; border-style:solid; border-radius:var(--radius); padding:1.25rem; transition:all 0.3s ease">
            <div style="display:flex; justify-content:space-between; align-items:center; cursor:pointer" onclick="toggleGuideStep(\\\${stepNum})">
              <div style="display:flex; align-items:center; gap:1rem">
                <div style="background:\\\${bubbleBg}; color:\\\${bubbleColor}; font-weight:700; width:36px; height:36px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:0.95rem; flex-shrink:0">
                  \\\${isCompleted ? "✓" : stepNum}
                </div>
                <div>
                  <h4 style="font-size:1rem; font-weight:700; color:\\\${isLocked ? "var(--grey)" : "var(--white)"}">
                    \\\${st.icon} Paso \\\${stepNum}: \\\${st.title}
                  </h4>
                  <p style="font-size:0.78rem; color:var(--grey2); margin-top:0.1rem">\\\${st.desc}</p>
                </div>
              </div>
              <div style="display:flex; align-items:center; gap:0.5rem; flex-shrink:0">
                \\\${!isLocked ? '<span id="arrow-' + stepNum + '" style="font-size:0.8rem; color:var(--grey2); transform:rotate(' + (isActive ? "180deg" : "0deg") + '); transition:transform 0.2s; display:inline-block">▼</span>' : ""}
              </div>
            </div>
            
            <div style="display:flex; justify-content:space-between; align-items:center; margin-top:0.75rem; padding-top:0.75rem; border-top:1px dashed rgba(255,255,255,0.06); opacity:\\\${isLocked ? 0.5 : 1}">
              <div style="display:flex; align-items:center; gap:0.5rem">
                <span style="font-size:0.72rem; font-weight:600; padding:0.15rem 0.5rem; border-radius:4px; color:\\\${isCompleted ? "var(--green)" : isActive ? "var(--blue)" : "var(--grey)"}; background:\\\${isCompleted ? "rgba(46,204,113,0.1)" : isActive ? "rgba(77,163,255,0.1)" : "rgba(255,255,255,0.03)"}">\\\${statusText}</span>
                <span style="font-size:0.72rem; color:var(--grey2); font-weight:600">\\\${percent}% completado</span>
              </div>
              \\\${isActive ? \\\`<button onclick="toggleGuideStep(\\\${stepNum}); event.stopPropagation();" style="background:var(--blue); border:none; color:#000; font-size:0.75rem; font-weight:700; padding:0.3rem 0.65rem; border-radius:4px; cursor:pointer">Continuar →</button>\\\` : ""}
            </div>
            
            \\\${!isLocked ? \\\`
              <div id="body-\\\${stepNum}" style="display:\\\${isActive ? "block" : "none"}; border-top:1px solid var(--border); margin-top:1rem; padding-top:1.25rem">
                \\\${st.renderFn()}
              </div>
            \\\` : ""}
          </div>
        \\\`;
      }).join("")}
    </div>
  \`;
}

function toggleGuideStep(stepNum) {
  const body  = document.getElementById("body-" + stepNum);
  const arrow = document.getElementById("arrow-" + stepNum);
  if (!body) return;
  const isOpen = body.style.display !== "none";
  body.style.display = isOpen ? "none" : "block";
  if (arrow) arrow.style.transform = isOpen ? "rotate(0deg)" : "rotate(180deg)";
}
`;

const newCode = appCode.substring(0, start) + replacement + '\n\n' + appCode.substring(end);
fs.writeFileSync('app.js', newCode, 'utf8');
console.log('Successfully updated renderGuide!');
