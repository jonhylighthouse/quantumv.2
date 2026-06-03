// ============================================================
//  QUANTUM — Google Apps Script API  v2.0
//  Pegar este código en: Extensions > Apps Script
//  Publicar como: Aplicación Web (Acceso: Cualquiera / Anyone)
//  Método: GET y POST
// ============================================================

// ─── HOJAS ───────────────────────────────────────────────────
const SHEET_NAME_TEAM       = "Equipo";
const SHEET_NAME_HISTORY    = "Historial";
const SHEET_NAME_USUARIOS   = "Usuarios";
const SHEET_NAME_PROGRESO   = "Progreso";
const SHEET_NAME_CONTACTOS  = "Contactos_V2";

// ─── PUNTO DE ENTRADA GET ────────────────────────────────────
function doGet(e) {
  const action = e.parameter.action || "";
  let result;
  try {
    switch (action) {
      case "getTeam":     result = getTeam();                             break;
      case "getHistory":  result = getHistory();                          break;
      case "getUser":     result = getUser(e.parameter.userId);           break;
      case "getProgress": result = getProgress(e.parameter.userId);       break;
      case "getContacts": result = getContacts(e.parameter.userId);       break;
      case "ping":        result = { ok: true, timestamp: new Date().toISOString() }; break;
      default:            result = { error: "Acción GET desconocida: " + action };
    }
  } catch (err) { result = { error: err.message }; }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ─── PUNTO DE ENTRADA POST ───────────────────────────────────
function doPost(e) {
  let body = {};
  try { body = JSON.parse(e.postData.contents); } catch (_) { body = {}; }

  const action = body.action || "";
  let result;
  try {
    switch (action) {
      case "saveMember":   result = saveMember(body.data);                   break;
      case "deleteMember": result = deleteMember(body.id);                   break;
      case "saveSnapshot": result = saveSnapshot(body.data);                 break;
      case "saveUser":     result = saveUser(body.data);                     break;
      case "saveProgress": result = saveProgress(body.userId, body.rows);    break;
      case "saveContact":  result = saveContact(body.data);                  break;
      default:             result = { error: "Acción POST desconocida: " + action };
    }
  } catch (err) { result = { error: err.message }; }

  return ContentService
    .createTextOutput(JSON.stringify(result))
    .setMimeType(ContentService.MimeType.JSON);
}

// ============================================================
//  GET: Equipo
// ============================================================
function getTeam() {
  const sheet = getOrCreateSheet(SHEET_NAME_TEAM, [
    "ID","Nombre","SponsorID","Puntos","MetaPersonal","Activo","FechaActualizacion",
    "TiempoDisponible","Intereses","Fortalezas","ObjetivosPersonales","Observaciones","ProximosPasos"
  ]);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { team: [] };
  const headers = rows[0].map(h => String(h).trim());
  const team = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return {
      id:                  String(obj["ID"]                  || ""),
      nombre:              String(obj["Nombre"]              || ""),
      sponsorId:           String(obj["SponsorID"]           || ""),
      puntos:              Number(obj["Puntos"]              || 0),
      metaPersonal:        Number(obj["MetaPersonal"]        || 0),
      activo:              obj["Activo"] === true || String(obj["Activo"]).toUpperCase() === "TRUE",
      fechaActualizacion:  String(obj["FechaActualizacion"]  || ""),
      tiempoDisponible:    String(obj["TiempoDisponible"]    || ""),
      intereses:           String(obj["Intereses"]           || ""),
      fortalezas:          String(obj["Fortalezas"]          || ""),
      objetivosPersonales: String(obj["ObjetivosPersonales"] || ""),
      observaciones:       String(obj["Observaciones"]       || ""),
      proximosPasos:       String(obj["ProximosPasos"]       || ""),
    };
  });
  return { team };
}

// ============================================================
//  GET: Historial
// ============================================================
function getHistory() {
  const sheet = getOrCreateSheet(SHEET_NAME_HISTORY, [
    "Fecha","TotalGrupal","Nivel","Objetivo","Observacion"
  ]);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { history: [] };
  const headers = rows[0].map(h => String(h).trim());
  const history = rows.slice(1).map(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    return {
      fecha:       String(obj["Fecha"]       || ""),
      totalGrupal: Number(obj["TotalGrupal"] || 0),
      nivel:       String(obj["Nivel"]       || ""),
      objetivo:    String(obj["Objetivo"]    || ""),
      observacion: String(obj["Observacion"] || ""),
    };
  });
  return { history };
}

// ============================================================
//  GET: Usuario
// ============================================================
function getUser(userId) {
  if (!userId) return { user: null };
  const sheet = getOrCreateSheet(SHEET_NAME_USUARIOS, [
    "ID","Nombre","Perfil","Enfoque","Objetivo","FechaAlta","Activo"
  ]);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { user: null };
  const headers = rows[0].map(h => String(h).trim());
  for (let i = 1; i < rows.length; i++) {
    const obj = {};
    headers.forEach((h, idx) => { obj[h] = rows[i][idx]; });
    if (String(obj["ID"]) === String(userId)) {
      return { user: {
        id:       String(obj["ID"]       || ""),
        nombre:   String(obj["Nombre"]   || ""),
        perfil:   String(obj["Perfil"]   || ""),
        enfoque:  String(obj["Enfoque"]  || ""),
        objetivo: String(obj["Objetivo"] || ""),
        fechaAlta:String(obj["FechaAlta"]|| ""),
        activo:   obj["Activo"] === true || String(obj["Activo"]).toUpperCase() === "TRUE",
      }};
    }
  }
  return { user: null };
}

// ============================================================
//  GET: Progreso de usuario (11 pasos)
// ============================================================
function getProgress(userId) {
  if (!userId) return { progress: [] };
  const sheet = getOrCreateSheet(SHEET_NAME_PROGRESO, [
    "UsuarioID","PasoID","Estado","FechaActualizacion"
  ]);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { progress: [] };
  const headers = rows[0].map(h => String(h).trim());
  const progress = [];
  rows.slice(1).forEach(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    if (String(obj["UsuarioID"]) === String(userId)) {
      progress.push({
        userId: String(obj["UsuarioID"] || ""),
        pasoId: String(obj["PasoID"]   || ""),
        estado: String(obj["Estado"]   || "pending"),
        fecha:  String(obj["FechaActualizacion"] || ""),
      });
    }
  });
  return { progress };
}

// ============================================================
//  GET: Contactos de un usuario
// ============================================================
function getContacts(userId) {
  if (!userId) return { contacts: [] };
  const sheet = getOrCreateSheet(SHEET_NAME_CONTACTOS, [
    "ID","UsuarioID","Nombre","Instagram","WhatsApp","Tipo","Estado","Observaciones","FechaActualizacion"
  ]);
  const rows = sheet.getDataRange().getValues();
  if (rows.length <= 1) return { contacts: [] };
  const headers = rows[0].map(h => String(h).trim());
  const contacts = [];
  rows.slice(1).forEach(row => {
    const obj = {};
    headers.forEach((h, i) => { obj[h] = row[i]; });
    if (String(obj["UsuarioID"]) === String(userId)) {
      contacts.push({
        id:           String(obj["ID"]            || ""),
        userId:       String(obj["UsuarioID"]     || ""),
        nombre:       String(obj["Nombre"]        || ""),
        instagram:    String(obj["Instagram"]     || ""),
        whatsapp:     String(obj["WhatsApp"]      || ""),
        tipo:         String(obj["Tipo"]          || ""),
        estado:       String(obj["Estado"]        || "Nuevo"),
        observaciones:String(obj["Observaciones"] || ""),
      });
    }
  });
  return { contacts };
}

// ============================================================
//  POST: Guardar/actualizar miembro en Equipo
// ============================================================
function saveMember(data) {
  if (!data || !data.id) return { error: "Datos de miembro inválidos" };
  const sheet = getOrCreateSheet(SHEET_NAME_TEAM, [
    "ID","Nombre","SponsorID","Puntos","MetaPersonal","Activo","FechaActualizacion",
    "TiempoDisponible","Intereses","Fortalezas","ObjetivosPersonales","Observaciones","ProximosPasos"
  ]);
  const rows = sheet.getDataRange().getValues();
  let targetRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) { targetRow = i + 1; break; }
  }
  const now = new Date().toISOString().split("T")[0];
  const rowData = [
    String(data.id), String(data.nombre || ""), String(data.sponsorId || ""),
    Number(data.puntos || 0), Number(data.metaPersonal || 0), data.activo !== false, now,
    String(data.tiempoDisponible    || ""), String(data.intereses           || ""),
    String(data.fortalezas          || ""), String(data.objetivosPersonales || ""),
    String(data.observaciones       || ""), String(data.proximosPasos       || ""),
  ];
  if (targetRow > 0) sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  else sheet.appendRow(rowData);
  return { ok: true, id: data.id, timestamp: now };
}

// ============================================================
//  POST: Eliminar miembro
// ============================================================
function deleteMember(id) {
  if (!id) return { error: "ID requerido" };
  const sheet = getOrCreateSheet(SHEET_NAME_TEAM, [
    "ID","Nombre","SponsorID","Puntos","MetaPersonal","Activo","FechaActualizacion",
    "TiempoDisponible","Intereses","Fortalezas","ObjetivosPersonales","Observaciones","ProximosPasos"
  ]);
  const rows = sheet.getDataRange().getValues();
  for (let i = rows.length - 1; i >= 1; i--) {
    if (String(rows[i][0]) === String(id)) { sheet.deleteRow(i + 1); return { ok: true, deleted: id }; }
  }
  return { error: "Miembro no encontrado: " + id };
}

// ============================================================
//  POST: Guardar snapshot de historial
// ============================================================
function saveSnapshot(data) {
  if (!data) return { error: "Datos inválidos" };
  const sheet = getOrCreateSheet(SHEET_NAME_HISTORY, [
    "Fecha","TotalGrupal","Nivel","Objetivo","Observacion"
  ]);
  const now = new Date().toISOString().split("T")[0];
  sheet.appendRow([
    data.fecha || now, Number(data.totalGrupal || 0),
    String(data.nivel || ""), String(data.objetivo || ""), String(data.observacion || ""),
  ]);
  return { ok: true, timestamp: now };
}

// ============================================================
//  POST: Guardar usuario
// ============================================================
function saveUser(data) {
  if (!data || !data.id) return { error: "Datos de usuario inválidos" };
  const sheet = getOrCreateSheet(SHEET_NAME_USUARIOS, [
    "ID","Nombre","Perfil","Enfoque","Objetivo","FechaAlta","Activo"
  ]);
  const rows = sheet.getDataRange().getValues();
  let targetRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id)) { targetRow = i + 1; break; }
  }
  const now = new Date().toISOString().split("T")[0];
  const rowData = [
    String(data.id), String(data.nombre || ""), String(data.perfil || ""),
    String(data.enfoque || ""), String(data.objetivo || ""),
    String(data.fechaAlta || now), data.activo !== false,
  ];
  if (targetRow > 0) sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  else sheet.appendRow(rowData);
  return { ok: true, id: data.id };
}

// ============================================================
//  POST: Guardar progreso de 11 pasos (upsert por fila)
// ============================================================
function saveProgress(userId, rows) {
  if (!userId || !rows) return { error: "Datos inválidos" };
  const sheet = getOrCreateSheet(SHEET_NAME_PROGRESO, [
    "UsuarioID","PasoID","Estado","FechaActualizacion"
  ]);
  const existing = sheet.getDataRange().getValues();
  const headers  = existing[0] ? existing[0].map(h => String(h).trim()) : [];
  const now = new Date().toISOString().split("T")[0];

  rows.forEach(row => {
    let targetRow = -1;
    for (let i = 1; i < existing.length; i++) {
      if (String(existing[i][0]) === String(userId) && String(existing[i][1]) === String(row.pasoId)) {
        targetRow = i + 1; break;
      }
    }
    const rowData = [String(userId), String(row.pasoId), String(row.estado || "pending"), now];
    if (targetRow > 0) sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
    else sheet.appendRow(rowData);
  });
  return { ok: true, userId, timestamp: now };
}

// ============================================================
//  POST: Guardar/actualizar contacto de usuario
// ============================================================
function saveContact(data) {
  if (!data || !data.id) return { error: "Datos de contacto inválidos" };
  const sheet = getOrCreateSheet(SHEET_NAME_CONTACTOS, [
    "ID","UsuarioID","Nombre","Instagram","WhatsApp","Tipo","Estado","Observaciones","FechaActualizacion"
  ]);
  const rows = sheet.getDataRange().getValues();
  let targetRow = -1;
  for (let i = 1; i < rows.length; i++) {
    if (String(rows[i][0]) === String(data.id) && String(rows[i][1]) === String(data.userId || "")) {
      targetRow = i + 1; break;
    }
  }
  const now = new Date().toISOString().split("T")[0];
  const rowData = [
    String(data.id), String(data.userId || ""), String(data.nombre || ""),
    String(data.instagram || ""), String(data.whatsapp || ""),
    String(data.tipo || ""), String(data.estado || "Nuevo"),
    String(data.observaciones || ""), now,
  ];
  if (targetRow > 0) sheet.getRange(targetRow, 1, 1, rowData.length).setValues([rowData]);
  else sheet.appendRow(rowData);
  return { ok: true, id: data.id };
}

// ============================================================
//  UTILIDAD: Obtener o crear hoja con encabezados
// ============================================================
function getOrCreateSheet(name, headers) {
  const ss    = SpreadsheetApp.getActiveSpreadsheet();
  let   sheet = ss.getSheetByName(name);
  if (!sheet) {
    sheet = ss.insertSheet(name);
    sheet.appendRow(headers);
    sheet.getRange(1, 1, 1, headers.length).setFontWeight("bold");
  }
  return sheet;
}

// ============================================================
//  DATOS SEMILLA (ejecutar manualmente UNA SOLA VEZ)
//  Tools > Run > seedInitialData
// ============================================================
function seedInitialData() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  // ── Equipo ──
  let teamSheet = ss.getSheetByName(SHEET_NAME_TEAM);
  if (teamSheet) ss.deleteSheet(teamSheet);
  teamSheet = ss.insertSheet(SHEET_NAME_TEAM);
  const teamHeaders = ["ID","Nombre","SponsorID","Puntos","MetaPersonal","Activo","FechaActualizacion",
    "TiempoDisponible","Intereses","Fortalezas","ObjetivosPersonales","Observaciones","ProximosPasos"];
  teamSheet.appendRow(teamHeaders);
  teamSheet.getRange(1, 1, 1, teamHeaders.length).setFontWeight("bold");
  const today = new Date().toISOString().split("T")[0];
  const members = [
    ["1","Joy","",201,300,true,today,"Tiempo completo","Estrategia, mentoría","Constructor","Empoderar su red","Gran visión estratégica.","Reunión mensual"],
    ["2","Jon","1",85,150,true,today,"12 horas/semana","Formación de equipos","Educador","Alcanzar el 9%","Comprometido con el aprendizaje.","Repasar academia"],
    ["3","Wall","1",25,150,true,today,"8 horas/semana","Venta directa","Comercial","Expandir cartera","Excelente carisma.","Talleres de recomendación"],
    ["4","Mamá","2",25,150,true,today,"6 horas/semana","Bienestar familiar","Técnico","Primeros 150 puntos","Aprende a su ritmo.","Prueba de catálogo"],
  ];
  members.forEach(r => teamSheet.appendRow(r));

  // ── Historial ──
  let histSheet = ss.getSheetByName(SHEET_NAME_HISTORY);
  if (histSheet) ss.deleteSheet(histSheet);
  histSheet = ss.insertSheet(SHEET_NAME_HISTORY);
  const histHeaders = ["Fecha","TotalGrupal","Nivel","Objetivo","Observacion"];
  histSheet.appendRow(histHeaders);
  histSheet.getRange(1, 1, 1, histHeaders.length).setFontWeight("bold");
  histSheet.appendRow([today, 336, "3%", "300 puntos", "Datos iniciales Quantum V2"]);

  SpreadsheetApp.getUi().alert("✅ Datos semilla V2 cargados correctamente.");
}


