# Estructura Técnica — Sistema de Comidas 2026

## 1. Stack Tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | HTML5 + CSS3 + Vanilla JavaScript (sin frameworks) |
| Base de datos | Firebase Realtime Database (SDK 10.7.1 compat via CDN) |
| Hosting | Cloudflare Pages |
| PWA | Service Worker + manifest.json |
| Control de versiones | Git + GitHub |

- **URL pública:** https://lista-2026.meryanez975.workers.dev
- **Proyecto Firebase:** `prueba-1d434`
- **Repositorio:** https://github.com/meryanez975-jpg/lista-2026

---

## 2. Estructura de Archivos

```
lista 2026/
├── index.html              ← Pantalla pública (entrada principal)
├── firebase-config.js      ← Config Firebase + helpers globales + constantes
├── sw.js                   ← Service Worker v6 (caché PWA)
├── manifest.json           ← Config PWA (íconos, tema morado)
├── estilo.css              ← Estilos compartidos entre páginas
├── PAGES/
│   ├── panel_admin.html       ← Panel principal del administrador (drawer)
│   ├── panel_supervisor.html  ← Panel principal del supervisor (drawer)
│   ├── admin.html             ← Login antiguo (celular + contraseña)
│   ├── registro.html          ← Personal marca sus comidas SI/NO
│   ├── servicio.html          ← Reparto: estados de entrega por persona
│   ├── conteo.html            ← Conteo semanal por sector + exportar Word
│   ├── personal.html          ← Formulario agregar/editar empleado
│   ├── lista_personal.html    ← Lista completa del personal
│   ├── menu_admin.html        ← Cargar menú del día por comida
│   ├── extras.html            ← Registrar personal extra ocasional
│   └── otros.html             ← Admins, gráficos, limpiar datos
└── icons/
    ├── icon-192.svg
    ├── icon-512.svg
    └── generar-iconos.html
```

---

## 3. Firebase — Estructura de la Base de Datos

```
/personal/{pushKey}/
    nombre          → string
    sector          → "bisutería" | "librería" | "cosméticos" | "lili" | "otros"
    sectorTexto     → string (si sector = "otros")
    diaLibre        → "lunes" | "martes" | ... | "otro"
    diaLibreTexto   → string (si diaLibre = "otro")
    turno           → "mañana" | "diurno" | "tarde" | "noche" | "otro"
    turnoTexto      → string (si turno = "otro")
    activo          → boolean

/menu/{YYYY-MM-DD}/{comida}/
    plato           → string
    frio            → string
    caliente        → string
    (comida = "desayuno" | "almuerzo" | "merienda" | "cena")

/registros/{pushKey}/{fecha}/{comida}/
    valor           → "SI" | "NO"

/servicio/{fecha}/{comida}/{pushKey}/
    estado          → "pendiente" | "servido" | "falta_plato" | "falta_sopa"

/extras/{pushKey}/
    nombre          → string
    comidas         → array (ej: ["almuerzo", "cena"])
    fechaRef        → string (YYYY-MM-DD)
    duracion        → "dia" | "semana" | "permanente"
    activo          → boolean

/config/admins/{celular}/
    nombre          → string
    password        → string (PIN de 4 dígitos)
    rol             → "admin" | "supervisor"

/config/admin_pass/  ← contraseña heredada (sistema viejo)
```

---

## 4. Constantes y Configuración Global (`firebase-config.js`)

### Turnos y comidas por turno
```javascript
TURNOS = {
  mañana: ["desayuno","almuerzo","merienda"],   // 7am–7pm
  diurno: ["desayuno","almuerzo"],              // 7am–4pm
  tarde:  ["almuerzo","merienda","cena"],       // 11am–11pm
  noche:  ["merienda","cena"]                  // 2pm–11pm
}
```

### Sectores
```
"bisutería" | "librería" | "cosméticos" | "lili" | "otros"
```

### Helpers de base de datos
```javascript
dbGet(path)         → lee valor una vez
dbSet(path, val)    → escribe/sobreescribe
dbUpdate(path, val) → actualiza campos
dbRemove(path)      → elimina nodo
dbOn(path, cb)      → escucha en tiempo real
dbOff(path)         → desuscribe listener
dbPush(path, val)   → agrega con clave auto
```

### Helpers de fecha
```javascript
iso(d)              → "YYYY-MM-DD"
formatDM(s)         → "DD/MM"
formatDMY(s)        → "DD/MM/YYYY"
addDays(date, n)    → nueva fecha +n días
startOfWeekMonday() → lunes de la semana actual
```

---

## 5. Sistema de Autenticación / Sesiones

### Sistema nuevo (PIN) — principal
| Variable sessionStorage | Valores |
|------------------------|---------|
| `rol_activo` | `"admin"` \| `"supervisor"` |
| `rol_nombre` | nombre del usuario |

- Entrada: `index.html` → zona invisible → modal PIN → Firebase verifica → panel

### Sistema viejo (celular + contraseña) — heredado
| Variable sessionStorage | Valores |
|------------------------|---------|
| `admin_logged` | `"1"` |
| `admin_phone` | número de celular |
| `admin_rol` | rol del admin |

- Entrada: `PAGES/admin.html`

### Verificación de sesión en páginas protegidas
```javascript
if (sessionStorage.getItem("admin_logged") !== "1" &&
    !["admin","supervisor"].includes(sessionStorage.getItem("rol_activo")))
  window.location.href = "../index.html";
```

---

## 6. PWA — Service Worker (`sw.js`)

- **Versión caché actual:** `comidas-v6`
- **Estrategia:** Network First → si falla red, usa caché
- **Excluye de caché:** Firebase (`firebaseio.com`), librerías CDN (`gstatic.com`, `firebasejs`)
- **Al instalar:** precachea todos los HTML + assets
- **Al activar:** elimina cachés de versiones anteriores
- **Archivos precacheados:** index.html, estilo.css, firebase-config.js, manifest.json, iconos, todas las páginas PAGES/

> Al modificar archivos JS/HTML importantes → incrementar versión: `CACHE_NAME = "comidas-vX"`

---

## 7. Cómo Actualizar el Sitio

```bash
cd "C:\Users\Lizeth\OneDrive\lista 2026"
git add .
git commit -m "Descripción del cambio"
git push origin master
```
Cloudflare Pages detecta el push y publica automáticamente en 30-60 segundos.

---

## 8. Acceso al Modal PIN (triggers en index.html)

| Trigger | Acción |
|---------|--------|
| 3 toques en esquina inferior izquierda | Abre modal PIN |
| Deslizar desde borde derecho (>60px) | Abre modal PIN |

---

## 9. Personal Extra — Lógica de Duración

| Duración | Aparece en |
|----------|-----------|
| `"dia"` | Solo la fecha exacta de `fechaRef` |
| `"semana"` | Toda la semana de `fechaRef` |
| `"permanente"` | Siempre |

Aparece en `conteo.html` como sección morada "⭐ PERSONAL EXTRA" e incluida en el total general.

### Campos en Firebase (`/extras/{key}/`)
| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombre` | string | Nombre completo |
| `comidas` | array | Ej: `["almuerzo","cena"]` |
| `fechaRef` | string YYYY-MM-DD | Fecha desde la que aplica |
| `duracion` | string | `"dia"` \| `"semana"` \| `"permanente"` |
| `activo` | boolean | `true` mientras esté vigente |
| `habilitado` | boolean | `true` si se habilitó para elegir comidas (solo semana/permanente) |

### Acciones disponibles en `extras.html`

| Acción | Función JS | Firebase |
|--------|-----------|---------|
| Agregar | `dbPush("extras", {...})` | Crea nuevo nodo |
| **Editar** | `dbUpdate("extras/{key}", {...})` | Sobreescribe campos: nombre, comidas, fechaRef, duracion |
| Eliminar | `dbRemove("extras/{key}")` | Elimina nodo completo |
| Habilitar/Deshabilitar | `dbSet("extras/{key}/habilitado", bool)` | Actualiza solo el campo `habilitado` |

### Flujo de edición (nuevo)
1. Usuario toca **✏️ Editar** en la tarjeta del extra
2. El formulario se rellena con los datos actuales (nombre, comidas, duración, fecha)
3. El título cambia a "✏️ Editar persona extra" y el botón a "💾 Guardar cambios"
4. Aparece botón **✕ Cancelar edición** para volver sin guardar
5. Al guardar: `dbUpdate` actualiza solo los campos editables (no toca `activo` ni `habilitado`)
6. Tras guardar exitosamente: el formulario se limpia y la lista se recarga

### Detalle técnico de la edición
```javascript
// Variable que guarda la clave del extra que se está editando (null = modo agregar)
let editandoKey = null;

// Al editar: rellena form, cambia UI
function editarExtra(key, nombre, comidas, duracion, fechaRef) { ... }

// Al cancelar: limpia form, restaura UI
function cancelarEdicion() { ... }

// Al guardar: detecta modo por editandoKey
if (editandoKey) {
  await dbUpdate(`extras/${editandoKey}`, { nombre, comidas, fechaRef, duracion });
} else {
  await dbPush("extras", { nombre, comidas, fechaRef, duracion, activo: true });
}
```

### Acceso por rol
- Página `extras.html` acepta: `rol_activo === "supervisor"` o `rol_activo === "admin"`
- El botón "Volver al panel" se ajusta dinámicamente:
  - Admin → `panel_admin.html`
  - Supervisor → `panel_supervisor.html`

---

## 10. Estados de Servicio por Comida

| Comida | Estados posibles |
|--------|-----------------|
| Desayuno | pendiente, servido |
| Almuerzo | pendiente, servido, falta_plato, falta_sopa |
| Merienda | pendiente, servido |
| Cena | pendiente, servido |
