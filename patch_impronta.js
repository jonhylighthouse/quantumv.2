const fs = require('fs');
const path = require('path');

// 1. PATH STYLE.CSS
const styleCssPath = path.join(__dirname, 'style.css');
let styleCss = fs.readFileSync(styleCssPath, 'utf8');

// Replace Google Fonts import
styleCss = styleCss.replace(
  "@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@700;900&display=swap');",
  "@import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;0,700;1,400&family=Inter:wght@300;400;500;600;700;800&family=Orbitron:wght@700;900&display=swap');"
);

// Modify CSS variables in :root
styleCss = styleCss.replace(
  `:root {
  --bg:       #050505;
  --bg2:      #111111;
  --bg3:      #1C1C1C;
  --bg4:      #252525;
  --border:   #2A2A2A;
  --white:    #FFFFFF;
  --grey:     #666666;
  --grey2:    #999999;
  --blue:     #4DA3FF;
  --blue-dim: #1a3a5c;
  --green:    #2ECC71;
  --green-dim:#0d3d22;
  --yellow:   #F1C40F;
  --yellow-dim:#3d3000;
  --violet:   #9B5CFF;
  --violet-dim:#2a1554;
  --red:      #E74C3C;`,
  `:root {
  --bg:       #030909;
  --bg2:      #081515;
  --bg3:      #0F2525;
  --bg4:      #183535;
  --border:   #1C3D3D;
  --white:    #FFFFFF;
  --grey:     #789292;
  --grey2:    #A3BEBE;
  --blue:     #C5A880; /* Gold */
  --blue-dim: #3a3023;
  --green:    #00A3A3; /* Teal */
  --green-dim:#003333;
  --yellow:   #D9B382;
  --yellow-dim:#4a3924;
  --violet:   #C5A880; /* Gold */
  --violet-dim:#3d3023;
  --red:      #C0392B;
  --gold:     #C5A880;
  --teal:     #00A3A3;
  --font-serif: 'Cormorant Garamond', serif;`
);

// Apply serif font to all section titles and big headers
styleCss = styleCss.replace(
  ".section-title {\n  font-size:    1.5rem;\n  font-weight:  800;",
  ".section-title {\n  font-family:  var(--font-serif);\n  font-size:    2.2rem;\n  font-weight:  700;\n  color: var(--gold);"
);

styleCss = styleCss.replace(
  ".welcome-title {\n  font-size: 1.8rem;\n  font-weight: 800;",
  ".welcome-title {\n  font-family: var(--font-serif);\n  font-size: 2.5rem;\n  font-weight: 600;\n  color: var(--gold);"
);

styleCss = styleCss.replace(
  "h3 {\n  font-size: 1.15rem;\n  font-weight: 700;",
  "h3 {\n  font-family: var(--font-serif);\n  font-size: 1.35rem;\n  font-weight: 600;"
);

// Save updated style.css
fs.writeFileSync(styleCssPath, styleCss, 'utf8');
console.log("style.css successfully patched with Joy's brand colors & elegant typography.");

// 2. PATH APP.JS
const appJsPath = path.join(__dirname, 'app.js');
let appJs = fs.readFileSync(appJsPath, 'utf8');

// Replace renderGuideStep2 (Perfil con Autoridad / Desarrollo) content to match Imagen 1
const oldStep2 = `function renderGuideStep2() {
  const currentPerfil = State.userProfile.perfil || "";

  return \`
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      Cada persona tiene una situación diferente. Al definir quién sos, Quantum adapta tu estrategia para que sea amigable y efectiva:
    </p>
    
    <div style="display:grid; grid-template-columns:1fr; gap:1rem; margin-bottom:1.5rem">
      <div class="profile-select-card \\\${currentPerfil === 'Autoridad' ? 'active' : ''}" 
           onclick="selectProfileType('Autoridad')"
           style="border:1px solid \\\${currentPerfil === 'Autoridad' ? 'var(--blue)' : 'var(--border)'}; background:\\\${currentPerfil === 'Autoridad' ? 'rgba(77,163,255,0.02)' : 'var(--bg3)'}; padding:1.25rem; border-radius:var(--radius); cursor:pointer">
        <h4 style="color:var(--blue); font-size:1rem; font-weight:700; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem">
          <span>👑</span> Perfil con Autoridad
        </h4>
        <p style="font-size:0.85rem; line-height:1.5; color:#ccc">
          Si tenés una profesión establecida, un negocio local, comunidad o marca personal. 
          <em>Ej: Nutricionistas, esteticistas, peluqueras, influencers, odontólogos, etc.</em>
        </p>
      </div>
      
      <div class="profile-select-card \\\${currentPerfil === 'Desarrollo' ? 'active' : ''}" 
           onclick="selectProfileType('Desarrollo')"
           style="border:1px solid \\\${currentPerfil === 'Desarrollo' ? 'var(--blue)' : 'var(--border)'}; background:\\\${currentPerfil === 'Desarrollo' ? 'rgba(77,163,255,0.02)' : 'var(--bg3)'}; padding:1.25rem; border-radius:var(--radius); cursor:pointer">
        <h4 style="color:var(--violet); font-size:1rem; font-weight:700; margin-bottom:0.5rem; display:flex; align-items:center; gap:0.4rem">
          <span>🚀</span> Perfil en Desarrollo
        </h4>
        <p style="font-size:0.85rem; line-height:1.5; color:#ccc">
          Si recién comenzás en esto y no tenés experiencia comercial o comunidad armada. Tu principal estrategia inicial será **documentar tu proceso** de aprendizaje.
        </p>
      </div>
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep2()">Guardar y avanzar →</button>
  \`;
}`;

const newStep2 = `function renderGuideStep2() {
  const currentPerfil = State.userProfile.perfil || "";

  return \`
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem; font-style:italic">
      "Identificación de Nicho: Definición del Perfil de Partida" - Módulo diseñado por Joy para personas que se inician.
    </p>
    
    <div style="display:grid; grid-template-columns:1fr; gap:1.25rem; margin-bottom:1.5rem">
      <!-- Perfil con Autoridad -->
      <div class="profile-select-card \\\${currentPerfil === 'Autoridad' ? 'active' : ''}" 
           onclick="selectProfileType('Autoridad')"
           style="border:1px solid \\\${currentPerfil === 'Autoridad' ? 'var(--gold)' : 'var(--border)'}; background:\\\${currentPerfil === 'Autoridad' ? 'rgba(0,163,163,0.05)' : 'var(--bg3)'}; padding:1.5rem; border-radius:var(--radius); cursor:pointer; position:relative; overflow:hidden">
        <div style="display:flex; align-items:flex-start; gap:1rem">
          <div style="font-size:2.2rem; line-height:1; flex-shrink:0">👩‍⚕️</div>
          <div>
            <h4 style="font-family:var(--font-serif); color:var(--gold); font-size:1.3rem; font-weight:600; margin-bottom:0.5rem">Perfil con Autoridad:</h4>
            <p style="font-size:0.85rem; line-height:1.6; color:#ccc">
              Personas que ya cuentan con una **profesión, oficio, local comercial o una comunidad activa** (ej. esteticistas, nutricionistas, peluqueras, influencers, médicos, odontólogos, cosmiatras).
            </p>
          </div>
        </div>
      </div>
      
      <!-- Perfil en Desarrollo -->
      <div class="profile-select-card \\\${currentPerfil === 'Desarrollo' ? 'active' : ''}" 
           onclick="selectProfileType('Desarrollo')"
           style="border:1px solid \\\${currentPerfil === 'Desarrollo' ? 'var(--gold)' : 'var(--border)'}; background:\\\${currentPerfil === 'Desarrollo' ? 'rgba(0,163,163,0.05)' : 'var(--bg3)'}; padding:1.5rem; border-radius:var(--radius); cursor:pointer; position:relative; overflow:hidden">
        <div style="display:flex; align-items:flex-start; gap:1rem">
          <div style="font-size:2.2rem; line-height:1; flex-shrink:0">🌱</div>
          <div>
            <h4 style="font-family:var(--font-serif); color:var(--gold); font-size:1.3rem; font-weight:600; margin-bottom:0.5rem">Perfil en Desarrollo:</h4>
            <p style="font-size:0.85rem; line-height:1.6; color:#ccc">
              Personas **sin profesión previa o sin experiencia en redes sociales**. Su estrategia no será dar cátedra, sino **documentar con autenticidad su propio cambio de hábitos**.
            </p>
          </div>
        </div>
      </div>
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep2()">Guardar y avanzar →</button>
  \`;
}`;

// Replace renderGuideStep3 (Línea de enfoque) to match Imagen 2
const oldStep3 = `function renderGuideStep3() {
  const currentEnfoque = State.userProfile.enfoque || "";

  const lines = [
    { id: "Belleza", label: "Belleza 💄", desc: "Orientado a maquillaje, cosmetología, manicuría y estética. Objetivo: ayudar a verse y sentirse mejor." },
    { id: "Nutricion", label: "Nutrición 🍏", desc: "Orientado a alimentación saludable, fitness y bienestar. Objetivo: mejorar hábitos de energía y nutrición." },
    { id: "Hogar", label: "Hogar 🏠", desc: "Orientado a organización, limpieza ecológica y optimización del hogar. Objetivo: optimizar y cuidar el hogar de forma inteligente." },
    { id: "CuidadoPersonal", label: "Cuidado Personal 🧘", desc: "Orientado a bienestar integral, hábitos diarios y cuidado del cuerpo. Objetivo: mejorar la calidad de vida diaria." }
  ];

  return \`
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem">
      Intentar comunicar todo junto genera confusión. Elegí una línea de enfoque inicial para hablar con propiedad y conectar de forma coherente:
    </p>
    
    <div style="display:grid; grid-template-columns:1fr; gap:0.75rem; margin-bottom:1.5rem">
      \\\${lines.map(l => \\\`
        <div class="enfoque-select-card \\\${currentEnfoque === l.id ? 'active' : ''}" 
             onclick="selectEnfoqueType('\\\\text: \\\${l.id}')"
             style="border:1px solid \\\${currentEnfoque === l.id ? 'var(--blue)' : 'var(--border)'}; background:\\\${currentEnfoque === l.id ? 'rgba(77,163,255,0.02)' : 'var(--bg3)'}; padding:1rem; border-radius:var(--radius); cursor:pointer; display:flex; align-items:center; justify-content:space-between">
          <div style="padding-right:1rem">
            <h5 style="color:var(--white); font-size:0.95rem; font-weight:700">\\\\text: \\\${l.label}</h5>
            <p style="font-size:0.8rem; color:var(--grey2); margin-top:0.25rem">\\\\text: \\\${l.desc}</p>
          </div>
          <div style="width:20px; height:20px; border-radius:50%; border:2px solid \\\${currentEnfoque === l.id ? 'var(--blue)' : 'var(--border)'}; display:flex; align-items:center; justify-content:center; flex-shrink:0">
            \\\\text: \\\${currentEnfoque === l.id ? '<div style=\"width:10px; height:10px; border-radius:50%; background:var(--blue)\"></div>' : ''}
          </div>
        </div>
      \\\`).join(\"\")}
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep3()">Guardar y avanzar →</button>
  \`;
}`;

const newStep3 = `function renderGuideStep3() {
  const currentEnfoque = State.userProfile.enfoque || "";

  const lines = [
    { 
      id: "Belleza", 
      label: "BELLEZA Y CUIDADO", 
      brand: "ARTISTRY Y SATINIQUE", 
      desc: "Maquilladoras, Cosmetólogas, Manicuras, Lashistas, Peluqueras. Creadoras de contenido beauty, interesadas en skincare. Personas que documenten el recupero de la salud de su cabello.", 
      emoji: "💄" 
    },
    { 
      id: "Nutricion", 
      label: "NUTRICIÓN", 
      brand: "NUTRILITE", 
      desc: "Nutricionistas, Personal Trainers, Instructores de Yoga/Pilates, Deportistas. Personas en proceso de descenso de peso o mejora de energía diaria y vitalidad.", 
      emoji: "🍏" 
    },
    { 
      id: "Hogar", 
      label: "HOGAR", 
      brand: "AMWAY HOME", 
      desc: "Organizadoras de hogar, Emprendedoras Deco, Mamás y Amas de casa. Personas que documentan su día a día. Creadoras de contenido. Influencer.", 
      emoji: "🏠" 
    }
  ];

  return \`
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1.25rem; font-style:italic">
      "Línea de Enfoque" - Elegí tu área comercial inicial según tu perfil y gustos para potenciar tu recomendación con autenticidad:
    </p>
    
    <div style="display:grid; grid-template-columns:1fr; gap:1rem; margin-bottom:1.5rem">
      \\\${lines.map(l => \\\`
        <div class="enfoque-select-card \\\${currentEnfoque === l.id ? 'active' : ''}" 
             onclick="selectEnfoqueType('\\\\\${l.id}')"
             style="border:1px solid \\\${currentEnfoque === l.id ? 'var(--gold)' : 'var(--border)'}; background:\\\${currentEnfoque === l.id ? 'rgba(0,163,163,0.05)' : 'var(--bg3)'}; padding:1.25rem; border-radius:var(--radius); cursor:pointer; display:flex; align-items:center; justify-content:space-between">
          <div style="padding-right:1rem">
            <h5 style="font-family:var(--font-serif); color:var(--gold); font-size:1.15rem; font-weight:600; display:flex; align-items:center; gap:0.4rem">
              <span>\\\${l.emoji}</span> \\\${l.label} <span style="font-size:0.75rem; color:var(--grey2); font-weight:400; font-family:var(--font-body)">(\\\${l.brand})</span>
            </h5>
            <p style="font-size:0.8rem; color:#ccc; margin-top:0.35rem; line-height:1.5">\\\${l.desc}</p>
          </div>
          <div style="width:20px; height:20px; border-radius:50%; border:2px solid \\\${currentEnfoque === l.id ? 'var(--gold)' : 'var(--border)'}; display:flex; align-items:center; justify-content:center; flex-shrink:0">
            \\\${currentEnfoque === l.id ? '<div style="width:10px; height:10px; border-radius:50%; background:var(--gold)"></div>' : ''}
          </div>
        </div>
      \\\`).join("")}
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep3()">Guardar y avanzar →</button>
  \`;
}`;

// Replace renderGuideStep5 (Ecosistema Digital) to match Imagen 3 exactly
const oldStep5 = `function renderGuideStep5() {
  const ch = State.checklists.paso5;

  const items = [
    { key: "foto", label: "Foto de perfil clara (mostrando tu rostro con luz natural)" },
    { key: "bio", label: "Biografía estratégica (qué ofreces y a quién ayudas)" },
    { key: "link", label: "Link a WhatsApp directo (para facilitar el contacto)" },
    { key: "historia", label: "Historia destacada inicial (presentando tu enfoque)" },
    { key: "posts", label: "Publicaciones iniciales coherentes con tu enfoque" },
    { key: "optimizado", label: "Perfil general optimizado y prolijo" }
  ];

  const total = items.length;
  const completed = Object.values(ch).filter(Boolean).length;
  const pct = Math.round((completed / total) * 100);

  const allDone = completed === total;

  return \`
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1rem">
      Prepará tus redes sociales básicas (Instagram, WhatsApp) para reflejar tu enfoque de forma profesional e inspirar confianza:
    </p>

    <!-- Barra de progreso interna -->
    <div style="background:var(--bg3); padding:0.75rem 1rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center; margin-bottom:1rem">
      <span style="font-size:0.8rem; color:var(--grey2)">Ecosistema optimizado</span>
      <strong style="color:var(--blue); font-size:0.8rem">\\\${completed} de \\\${total} tareas (\\\${pct}%)</strong>
    </div>

    <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.5rem">
      \\\${items.map(it => \\\`
        <label style="background:var(--bg3); border:1px solid var(--border); padding:0.75rem 1rem; border-radius:8px; display:flex; align-items:center; gap:0.75rem; cursor:pointer">
          <input type="checkbox" \\\${ch[it.key] ? 'checked' : ''} 
                 onclick="toggleEcosystemCheckbox('\\\\\${it.key}', this.checked)"
                 style="accent-color:var(--blue); width:18px; height:18px; cursor:pointer">
          <span style="font-size:0.85rem; color:\\\${ch[it.key] ? 'var(--grey2)' : '#eee'}; text-decoration:\\\${ch[it.key] ? 'line-through' : 'none'}">\\\${it.label}</span>
        </label>
      \\\`).join(\"\")}
    </div>

    <button class="btn-primary" \\\text: \\\${!allDone ? 'disabled style=\"opacity:0.5; cursor:not-allowed\"' : ''} style=\"width:100%\" onclick=\"submitStep5()\">
      Ecosistema listo, avanzar →
    </button>
  \`;
}`;

const newStep5 = `function renderGuideStep5() {
  const ch = State.checklists.paso5;

  const items = [
    { key: "foto", label: "📸 Foto de Perfil: rostro despejado, sonriente, con buena luz natural." },
    { key: "bio", label: "📝 Biografía Línea 1 (Contexto): tu profesión o tu propósito actual." },
    { key: "promesa", label: "🤝 Biografía Línea 2 (Promesa): a quién ayudás y qué problema resolvés." },
    { key: "link", label: "🔗 Biografía Línea 3 (Llamado a la acción): un link que derive directo a WhatsApp." },
    { key: "historia", label: "⭐ Historias Destacadas: mostrando y contando tu mirada propia y enfoque." },
    { key: "optimizado", label: "🎨 Ecosistema Digital Completo: identidad de marca clara y prolija." }
  ];

  const total = items.length;
  const completed = Object.values(ch).filter(Boolean).length;
  const pct = Math.round((completed / total) * 100);
  const allDone = completed === total;

  return \`
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1rem">
      <strong>Configuración del Ecosistema Digital:</strong> Antes de iniciar cualquier acción de contacto, el perfil de Instagram o TikTok debe lucir impecable, tener una identidad mostrando una mirada propia, clara y coherente.
    </p>

    <div style="background:var(--bg3); border:1px solid var(--border); padding:0.75rem 1rem; border-radius:8px; display:flex; justify-content:space-between; align-items:center; margin-bottom:1.25rem">
      <span style="font-size:0.8rem; color:var(--grey2)">Ecosistema de marca optimizado</span>
      <strong style="color:var(--gold); font-size:0.8rem">\\\${completed} de \\\${total} logrados (\\\${pct}%)</strong>
    </div>

    <div style="display:flex; flex-direction:column; gap:0.6rem; margin-bottom:1.5rem">
      \\\${items.map(it => \\\`
        <label style="background:var(--bg3); border:1px solid var(--border); padding:0.75rem 1rem; border-radius:8px; display:flex; align-items:center; gap:0.75rem; cursor:pointer">
          <input type="checkbox" \\\${ch[it.key] ? 'checked' : ''} 
                 onclick="toggleEcosystemCheckbox('\\\\\${it.key}', this.checked)"
                 style="accent-color:var(--gold); width:18px; height:18px; cursor:pointer">
          <span style="font-size:0.85rem; color:\\\${ch[it.key] ? 'var(--grey2)' : '#eee'}; text-decoration:\\\${ch[it.key] ? 'line-through' : 'none'}">\\\${it.label}</span>
        </label>
      \\\`).join("")}
    </div>

    <!-- Regla de Ecosistema digital Joy -->
    <div style="background:rgba(197,168,128,0.06); border:1px dashed var(--gold); padding:1rem; border-radius:8px; margin-bottom:1.5rem; text-align:center">
      <p style="font-size:0.9rem; color:var(--white); font-weight:600; font-family:var(--font-serif)">
        "La gente necesita entender quién sos y por qué deberían seguirte."
      </p>
    </div>

    <button class="btn-primary" \\\${!allDone ? 'disabled style="opacity:0.5; cursor:not-allowed"' : ''} style="width:100%" onclick="submitStep5()">
      Ecosistema configurado, avanzar →
    </button>
  \`;
}`;

// Replace renderGuideStep7 (Mensajes/Speeches) to match Imagen 4 and 5
const oldStep7 = `function renderGuideStep7() {
  const contacts = State.contacts;
  if (contacts.length === 0) {
    return \`<p style="color:var(--yellow); font-size:0.9rem">⚠️ Primero tenés que cargar al menos un contacto en el paso anterior.</p>\`;
  }

  if (!_selectedContactIdMsg && contacts.length > 0) {
    _selectedContactIdMsg = contacts[0].id;
  }

  const selContact = contacts.find(c => c.id === _selectedContactIdMsg) || contacts[0];
  const user = State.userProfile;
  
  const perfil = user.perfil || "Desarrollo";
  const enfoque = user.enfoque || "CuidadoPersonal";
  const tipo = selContact.tipo || "🔥 Caliente";

  const message = generateSmartMessage(perfil, enfoque, tipo, selContact.nombre);

  return \`
    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1rem">
      El generador adapta el mensaje según **tu perfil** (\\\${perfil}), **tu enfoque** (\\\${enfoque}) y **la temperatura del contacto** (\\\${tipo}):
    </p>

    <div class="form-group" style="margin-bottom:1rem">
      <label>1. Seleccioná a quién querés contactar:</label>
      <select id="msg-contact-select" class="form-input" onchange="changeMsgContact(this.value)">
        \\\${contacts.map(c => \\\`
          <option value="\\\\text: \\\${c.id}" \\\\text: \\\${c.id === _selectedContactIdMsg ? 'selected' : ''}>\\\\text: \\\${c.nombre} (\\\\text: \\\${c.tipo})</option>
        \\\`).join(\"\")}
      </select>
    </div>

    <div class="form-group" style="margin-bottom:1rem">
      <label>2. Mensaje inteligente sugerido (español amigable):</label>
      <textarea id="smart-msg-box" class="form-input" style="height:150px; resize:vertical; font-size:0.9rem; line-height:1.5; color:#eee">\\\\text: \\\${message}</textarea>
    </div>

    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem">
      <button class="btn-primary" onclick="copySmartMessage()" style="padding:0.5rem 1rem; font-size:0.85rem">📋 Copiar mensaje</button>
      <button class="btn-secondary" onclick="openWhatsAppChat('\\\\text: \\\${selContact.whatsapp}', 'smart-msg-box')" style="padding:0.5rem 1rem; font-size:0.85rem">💬 Enviar WhatsApp</button>
      <button class="btn-secondary" onclick="saveMsgAsFav('\\\\text: \\\\text: \\\${selContact.id}')" style="padding:0.5rem 1rem; font-size:0.85rem">⭐ Guardar notas</button>
    </div>

    <p style="font-size:0.75rem; color:var(--grey2); font-style:italic; margin-bottom:1.25rem">
      * Podés editar el texto libremente antes de copiarlo o enviarlo. Al hacer clic en 'Guardar notas', se agregará a las observaciones de la ficha del contacto.
    </p>

    <button class="btn-primary" style="width:100%" onclick="submitStep7()">
      Ya envié mi primer mensaje, avanzar →
    </button>
  \`;
}`;

const newStep7 = `function renderGuideStep7() {
  const contacts = State.contacts;
  if (contacts.length === 0) {
    return \`<p style="color:var(--yellow); font-size:0.9rem">⚠️ Primero tenés que cargar al menos un contacto en el paso anterior.</p>\`;
  }

  if (!_selectedContactIdMsg && contacts.length > 0) {
    _selectedContactIdMsg = contacts[0].id;
  }

  const selContact = contacts.find(c => c.id === _selectedContactIdMsg) || contacts[0];
  const user = State.userProfile;
  
  const perfil = user.perfil || "Desarrollo";
  const enfoque = user.enfoque || "CuidadoPersonal";
  const tipo = selContact.tipo || "🔥 Caliente";

  const message = generateSmartMessage(perfil, enfoque, tipo, selContact.nombre);

  return \`
    <!-- Speeches de contacto golden rule Joy -->
    <div style="background:rgba(197,168,128,0.06); border:1px solid var(--gold); padding:1rem; border-radius:8px; margin-bottom:1.25rem; display:flex; align-items:flex-start; gap:0.75rem">
      <div style="font-size:1.5rem">💡</div>
      <div>
        <h5 style="color:var(--gold); font-weight:700; font-family:var(--font-serif); margin-bottom:0.25rem">REGLA DE ORO DE CONTACTO:</h5>
        <p style="font-size:0.8rem; line-height:1.5; color:#ccc">
          <strong>"Antes de copiar y pegar el texto, debemos darle like a 3 publicaciones del prospecto y comentar una historia de forma genuina."</strong>
        </p>
      </div>
    </div>

    <p style="font-size:0.9rem; line-height:1.6; color:var(--grey2); margin-bottom:1rem">
      Seleccioná tu contacto de la lista para obtener el **Speech de Contacto Oficial** recomendado para su perfil e iniciar la interacción:
    </p>

    <div class="form-group" style="margin-bottom:1rem">
      <label>1. Seleccioná a quién querés contactar:</label>
      <select id="msg-contact-select" class="form-input" onchange="changeMsgContact(this.value)">
        \\\${contacts.map(c => \\\`
          <option value="\\\${c.id}" \\\${c.id === _selectedContactIdMsg ? 'selected' : ''}>\\\${c.nombre} (\\\${c.tipo})</option>
        \\\`).join("")}
      </select>
    </div>

    <div class="form-group" style="margin-bottom:1rem">
      <label>2. Speech de Contacto recomendado (Listo para enviar):</label>
      <textarea id="smart-msg-box" class="form-input" style="height:170px; resize:vertical; font-size:0.85rem; line-height:1.5; color:#eee">\\\${message}</textarea>
    </div>

    <div style="display:flex; gap:0.5rem; flex-wrap:wrap; margin-bottom:1.5rem">
      <button class="btn-primary" onclick="copySmartMessage()" style="padding:0.5rem 1rem; font-size:0.85rem">📋 Copiar speech</button>
      <button class="btn-secondary" onclick="openWhatsAppChat('\\\${selContact.whatsapp}', 'smart-msg-box')" style="padding:0.5rem 1rem; font-size:0.85rem">💬 Enviar WhatsApp</button>
      <button class="btn-secondary" onclick="saveMsgAsFav('\\\${selContact.id}')" style="padding:0.5rem 1rem; font-size:0.85rem">⭐ Guardar notas</button>
    </div>

    <button class="btn-primary" style="width:100%" onclick="submitStep7()">
      Ya envié mi primer speech de contacto, avanzar →
    </button>
  \`;
}`;

// Normalize line endings and run replacements
const normAppJs = appJs.replace(/\r\n/g, '\n');

const step2OldNorm = oldStep2.replace(/\r\n/g, '\n');
const step2NewNorm = newStep2.replace(/\r\n/g, '\n');
const step3OldNorm = oldStep3.replace(/\r\n/g, '\n');
const step3NewNorm = newStep3.replace(/\r\n/g, '\n');
const step5OldNorm = oldStep5.replace(/\r\n/g, '\n');
const step5NewNorm = newStep5.replace(/\r\n/g, '\n');
const step7OldNorm = oldStep7.replace(/\r\n/g, '\n');
const step7NewNorm = newStep7.replace(/\r\n/g, '\n');

if (normAppJs.includes(step2OldNorm)) {
  appJs = normAppJs.replace(step2OldNorm, step2NewNorm);
  console.log("renderGuideStep2 matched and replaced successfully.");
} else {
  console.log("Warning: renderGuideStep2 could not be matched directly.");
}

if (appJs.includes(step3OldNorm)) {
  appJs = appJs.replace(step3OldNorm, step3NewNorm);
  console.log("renderGuideStep3 matched and replaced successfully.");
} else {
  console.log("Warning: renderGuideStep3 could not be matched directly.");
}

if (appJs.includes(step5OldNorm)) {
  appJs = appJs.replace(step5OldNorm, step5NewNorm);
  console.log("renderGuideStep5 matched and replaced successfully.");
} else {
  console.log("Warning: renderGuideStep5 could not be matched directly.");
}

if (appJs.includes(step7OldNorm)) {
  appJs = appJs.replace(step7OldNorm, step7NewNorm);
  console.log("renderGuideStep7 matched and replaced successfully.");
} else {
  console.log("Warning: renderGuideStep7 could not be matched directly.");
}

// Write the modified speeches to generateSmartMessage function
appJs = appJs.replace(
  `function generateSmartMessage(perfil, enfoque, tipo, contactName) {
  contactName = contactName || "amigo";
  const tempClean = tipo.includes("Caliente") ? "caliente" : tipo.includes("Tibio") ? "tibio" : "frio";
  const enfClean = enfoque.toLowerCase();
  const perfClean = perfil.toLowerCase();

  const templates = {
    belleza: {
      autoridad: {
        caliente: \`¡Hola [Name]! ¿Cómo andás? Che, te escribo porque estoy sumando una línea de estética y cuidado de la piel súper premium en mi consultorio/estudio y me acordé de vos porque sé que te encanta cuidarte. ¿Cuándo tenés un ratito para que nos tomemos un café o nos hagamos una videollamada corta? Me re interesa contarte y que le pegues una ojeada. ¡Abrazo!\`,
        tibio: \`¡Hola [Name]! ¿Cómo va todo? Hace bastante no hablamos. Te cuento que estoy expandiendo mis servicios de belleza e incorporando una línea cosmética premium. Pensé en vos porque sé que valorás la calidad. Si te copa, te comparto un link corto o coordinamos para charlar dos minutos, sin compromiso. ¡Que andes lindo!\`,
        frio: \`¡Hola [Name]! ¿Cómo estás? Te escribo porque sigo tu perfil y me copa mucho tu contenido. Como profesional de la belleza, estoy lanzando un proyecto de asesoría estética digital y estoy seleccionando algunos perfiles clave en la zona. Vi tu buena onda y me pareció genial escribirte. Si te interesa chusmear de qué se trata de forma simple, decime y coordinamos. ¡Saludos!\`
      },
      desarrollo: {
        caliente: \`¡Hola [Name]! ¿Cómo andás? Che, te cuento que empecé un proyecto hermoso sobre asesoría de imagen y belleza integral, y estoy aprendiendo muchísimo sobre el cuidado de la piel. Coincidimos en que te encanta lucir divina. ¿Nos tomamos un café virtual o real y te cuento breve? Me re serviría para practicar y darte tips copados. ¡Un abrazo!\`,
        tibio: \`¡Hola [Name]! ¿Todo bien? Te escribo porque arranqué un camino nuevo compartiendo consejos de belleza y cuidado de la piel en mis redes. Pensé en escribirte porque me pareció que te podría interesar chusmear lo que estoy haciendo y darme tu feedback sincero. ¿Coordinamos y charlamos dos minutos? ¡Beso!\`,
        frio: \`¡Hola [Name]! ¿Cómo estás? Te cuento que estoy documentando en mis redes mi proceso de aprendizaje en el área del cuidado personal y cosmética saludable. Vi que te interesan estos temas y por eso me animé a escribirte. Si te copa mirar lo que hago o charlar un ratito, avisame. ¡Que tengas un lindo día!\`
      }
    },
    nutricion: {
      autoridad: {
        caliente: \`¡Hola [Name]! ¿Cómo estás? Te escribo porque estoy incorporando un programa de hábitos saludables y suplementación deportiva premium orientado al alto rendimiento. Pensé en presentártelo ya que sé que te apasiona entrenar y cuidarte a fondo. ¿Cuándo te viene bien que hagamos un zoom de 10 minutos y lo chusmeamos? ¡Abrazo grande!\`,
        tibio: \`¡Hola [Name]! ¿Cómo va? Espero que muy bien. Quería contarte que estoy sumando un área de nutrición celular y bienestar a mis consultas/clases. Sé que te interesa estar saludable y con buena energía. Si te copa, coordinamos un ratito esta semana para contarte en detalle, sin presiones. ¡Abrazo!\`,
        frio: \`¡Hola [Name]! ¿Qué tal? Sigo de cerca tus posts de entrenamiento y me parecen excelentes. Te escribo porque estoy armando una red de bienestar y nutrición activa en la zona y estoy contactando perfiles afines al fitness. Creo que te podría súper interesar. Si estás abierto a escuchar una propuesta corta, avisame y coordinamos. ¡Saludos!\`
      },
      desarrollo: {
        caliente: \`¡Hola [Name]! ¿Cómo va todo? Te cuento que empecé un cambio de hábitos de nutrición y bienestar que me está haciendo sentir de primera. Como recién arranco, lo estoy documentando todo. Me acordé de vos porque sé que te copa comer sano. ¿Te sumás a tomar unos mates virtuales y te muestro el sistema? ¡Abrazo!\`,
        tibio: \`¡Hola [Name]! ¿Cómo estás? Hace tiempo no charlamos. Te escribo porque estoy compartiendo mi camino de cambio físico y alimentación saludable. Me está rindiendo muchísimo la energía diaria. Pensé que te podría servir chusmearlo. Si querés te cuento breve la próxima vez que nos hablemos. ¡Beso!\`,
        frio: \`¡Hola [Name]! ¿Cómo estás? Te escribo porque vi que te gustan los hábitos saludables. Estoy empezando a documentar mi proceso de bienestar y alimentación consciente, y quería compartirlo con personas que tengan los mismos intereses. Si te copa pegarle una mirada a la info o charlar, avisame. ¡Saludos!\`
      }
    },
    hogar: {
      autoridad: {
        caliente: \`¡Hola [Name]! ¿Cómo estás? Te cuento que estoy incorporando una línea ecológica y sustentable para el cuidado y optimización del hogar que rinde muchísimo. Pensé en vos porque sé que sos súper organizada con las cosas de tu casa. ¿Cuándo te queda cómodo que charlemos un ratito y te muestro cómo funciona? ¡Abrazo!\`,
        tibio: \`¡Hola [Name]! ¿Cómo va todo? Te escribo para contarte que estoy expandiendo mis asesorías incorporando soluciones sustentables y de ahorro para el hogar. Creo que te vendría de diez chusmearlo. Si tenés 5 minutos esta semana coordinamos una charlita rápida. ¡Que andes muy bien!\`,
        frio: \`¡Hola [Name]! ¿Cómo estás? Sigo tus publicaciones y me encanta tu estilo de organización hogareña. Estoy liderando un proyecto digital enfocado en hogares ecológicos y sustentables, y estoy buscando perfiles afines para expandir la propuesta. Si te interesa escuchar los detalles de forma simple, avisame y charlamos. ¡Saludos!\`
      },
      desarrollo: {
        caliente: \`¡Hola [Name]! ¿Cómo va? Che, te cuento que empecé a usar productos ultra concentrados y ecológicos para mi casa que me están haciendo ahorrar una locura de tiempo y plata. Lo estoy documentando en mis redes para ayudar a otros. ¿Te copa si coordinamos y te muestro la prueba en vivo? Te va a encantar. ¡Beso!\`,
        tibio: \`¡Hola [Name]! ¿Cómo andás tanto tiempo? Quería contarte que arranqué un desafío para transformar mi casa en un hogar sustentable y libre de químicos. Es un cambio enorme y me re copa el proceso. Pensé que te interesaría conocerlo. Si querés te cuento breve la próxima vez que nos hablemos. ¡Un beso!\`,
        frio: \`¡Hola [Name]! ¿Cómo estás? Te escribo porque vi que compartís cosas hermosas sobre cuidado del hogar. Acabo de iniciar un proyecto sobre consumo inteligente ecológico para el hogar. Si te copa ver cómo funciona este sistema que estoy documentando, avisame y te comparto una guía corta. ¡Saludos!\`
      }
    },
    "cuidado personal": {
      autoridad: {
        caliente: \`¡Hola [Name]! ¿Cómo estás? Te escribo porque incorporé a mi rutina una línea premium de cuidado personal y desarrollo de hábitos saludables. Pensé en vos porque sé que le das mucha importancia a tu bienestar diario. ¿Te copa si nos juntamos un ratito y te muestro lo que estoy usando? Te va a encantar. ¡Abrazo!\`,
        tibio: \`¡Hola [Name]! ¿Cómo andás? Te quería contar que estoy expandiendo mis servicios de asesoría personal integrando productos orgánicos y rutinas de bienestar corporal. Me acordé de vos porque sé que te gusta cuidarte. Si te interesa chusmearlo, avisame y coordinamos una charla de dos minutos. ¡Beso!\`,
        frio: \`¡Hola [Name]! ¿Cómo estás? Te escribo porque me llamó la atención tu perfil y vi tu buena onda. Estoy lanzando un proyecto digital enfocado en el bienestar y cuidado personal saludable, y estoy seleccionando colaboradores clave. Si estás abierto a evaluar proyectos en paralelo, decime y coordinamos. ¡Saludos!\`
      },
      desarrollo: {
        caliente: \`¡Hola [Name]! ¿Todo bien? Te cuento algo relindo: empecé a enfocarme fuerte en mi cuidado diario y en armar una rutina de hábitos saludables que me cambió la energía por completo. Lo estoy documentando paso a paso. ¿Te copa si nos tomamos un café y te comparto lo que estoy haciendo? ¡Abrazo!\`,
        tibio: \`¡Hola [Name]! ¿Cómo estás? Tanto tiempo. Te escribo porque empecé a compartir mi proceso de desarrollo de hábitos y cuidado personal en mis redes. Pensé que te podría copa ver lo que estoy aprendiendo y las rutinas que uso. ¿Coordinamos y charlamos un ratito esta semana? ¡Beso!\`,
        frio: \`¡Hola [Name]! ¿Cómo estás? Te escribo porque vi tus publicaciones sobre crecimiento y hábitos. Acabo de arrancar un camino documentando mis rutinas de cuidado personal saludable y me gustaría conectar con personas afines. Si te copa que te cuente mi experiencia de forma simple, avisame. ¡Saludos!\`
      }
    }
  };

  const group = templates[enfClean] || templates["cuidado personal"];
  const subGroup = group[perfClean] || group["desarrollo"];
  const msgTemplate = subGroup[tempClean] || subGroup["caliente"];

  return msgTemplate.replace("[Name]", contactName);
}`,
  `function generateSmartMessage(perfil, enfoque, tipo, contactName) {
  contactName = contactName || "amigo";
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
}`
);

fs.writeFileSync(appJsPath, appJs, 'utf8');
console.log("app.js successfully patched with Joy's exact slides contents and specific speeches.");
