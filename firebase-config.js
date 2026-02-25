// ================================================
// CONFIGURACIÓN DE FIREBASE
// ================================================

const firebaseConfig = {
  apiKey:            "AIzaSyDuzLFqmodbrWJfgjB6z2M5dTX547VjONE",
  authDomain:        "prueba-1d434.firebaseapp.com",
  databaseURL:       "https://prueba-1d434-default-rtdb.firebaseio.com",
  projectId:         "prueba-1d434",
  storageBucket:     "prueba-1d434.firebasestorage.app",
  messagingSenderId: "796937090721",
  appId:             "1:796937090721:web:220da647c75cae3a7e62e0"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.database();

// ===== HELPERS DE BASE DE DATOS =====
const dbGet    = (path)      => db.ref(path).get().then(s => s.val());
const dbSet    = (path, val) => db.ref(path).set(val);
const dbUpdate = (path, val) => db.ref(path).update(val);
const dbRemove = (path)      => db.ref(path).remove();
const dbOn     = (path, cb)  => db.ref(path).on('value', s => cb(s.val()));
const dbOff    = (path)      => db.ref(path).off();
const dbPush   = (path, val) => db.ref(path).push(val);

// ===== CONFIGURACIÓN DE TURNOS =====
const TURNOS = {
  mañana: { label: "Mañana (7am–7pm)",  colorClass: "turno-manana", comidas: ["desayuno","almuerzo","merienda"] },
  diurno: { label: "Diurno (7am–4pm)",  colorClass: "turno-diurno", comidas: ["desayuno","almuerzo"] },
  tarde:  { label: "Tarde (11am–11pm)", colorClass: "turno-tarde",  comidas: ["almuerzo","merienda","cena"] },
  noche:  { label: "Noche (2pm–11pm)",  colorClass: "turno-noche",  comidas: ["merienda","cena"] }
};

const COMIDA_LABEL = { desayuno:"DESAYUNO", almuerzo:"ALMUERZO", merienda:"MERIENDA", cena:"CENA" };
const COMIDA_ICON  = { desayuno:"🍞", almuerzo:"🍛", merienda:"🥐", cena:"🍲" };
const COMIDAS_ALL  = ["desayuno","almuerzo","merienda","cena"];
const DIA_NOMBRE   = ["Domingo","Lunes","Martes","Miércoles","Jueves","Viernes","Sábado"];
const DIA_LUN_DOM  = ["Lunes","Martes","Miércoles","Jueves","Viernes","Sábado","Domingo"];
const DIA_CORTO    = ["Lun","Mar","Mié","Jue","Vie","Sáb","Dom"];

// ===== SECTORES =====
const SECTORES = ["bisutería","librería","cosméticos","lili","otros"];

// ===== DÍAS DE LA SEMANA (para día libre) =====
const DIAS_SEMANA = ["lunes","martes","miércoles","jueves","viernes","sábado","domingo"];

// Mapa de nombre de día libre → índice en semana Lun-Dom (0=Lun, 6=Dom)
const DIA_A_IDX = {
  "lunes": 0, "martes": 1, "miércoles": 2,
  "jueves": 3, "viernes": 4, "sábado": 5, "domingo": 6
};

// ===== HELPERS DE FECHA =====
function pad(n)      { return String(n).padStart(2, "0"); }
function iso(d)      { return `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`; }
function formatDM(s) { const [,m,d] = s.split("-"); return `${d}/${m}`; }
function formatDMY(s){ const [y,m,d] = s.split("-"); return `${d}/${m}/${y}`; }
function addDays(date, n){ const d = new Date(date); d.setDate(d.getDate()+n); return d; }
function startOfWeekMonday(date){
  const d = new Date(date);
  const day = d.getDay();
  d.setDate(d.getDate() + (day === 0 ? -6 : 1) - day);
  d.setHours(0,0,0,0);
  return d;
}

// ===== HELPERS DE PERSONAL =====

// Solo primer nombre (para tablas)
function primerNombre(nombre) {
  return (nombre || "").split(" ")[0];
}

// Comidas según turno (si turno es "otro" o desconocido, muestra todas)
function comidasDeTurno(turno) {
  return TURNOS[turno]?.comidas || COMIDAS_ALL;
}

// Label de sector para mostrar
function labelSector(p) {
  if (!p || !p.sector) return "—";
  if (p.sector === "otros" && p.sectorTexto) return p.sectorTexto;
  return p.sector.charAt(0).toUpperCase() + p.sector.slice(1);
}

// Label de día libre para mostrar
function labelDiaLibre(p) {
  if (!p || !p.diaLibre) return "—";
  if (p.diaLibre === "otro" && p.diaLibreTexto) return p.diaLibreTexto;
  return p.diaLibre.charAt(0).toUpperCase() + p.diaLibre.slice(1);
}

// Label de turno para mostrar
function labelTurno(p) {
  if (!p || !p.turno) return "—";
  if (p.turno === "otro" && p.turnoTexto) return p.turnoTexto;
  return TURNOS[p.turno]?.label || p.turno;
}

// Índice de día libre (0=Lun, 6=Dom), -1 si no aplica
// Si diaLibre="otro" intenta leer diaLibreTexto (ej: "Lunes")
function idxDiaLibre(p) {
  if (!p || !p.diaLibre) return -1;
  const mapa = { lunes:0, martes:1, miercoles:2, jueves:3, viernes:4, sabado:5, domingo:6 };
  const normalizar = s => (s || "").toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").trim();
  if (p.diaLibre !== "otro") {
    return mapa[normalizar(p.diaLibre)] ?? -1;
  }
  // diaLibre="otro": intentar parsear el texto personalizado
  return mapa[normalizar(p.diaLibreTexto)] ?? -1;
}

// ¿Es este índice de semana el día libre de la persona?
function esDiaLibre(p, weekIdx) {
  return idxDiaLibre(p) === weekIdx;
}
