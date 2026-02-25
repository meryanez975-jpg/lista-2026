# 📖 Guía del Sistema de Comidas

**URL:** https://steady-crisp-27d6d6.netlify.app
**Última actualización:** Febrero 2026

---

## 🏠 Pantalla de inicio

Muestra los botones principales. Algunos son visibles para todos, otros solo para administradores.

| Botón | Quién lo ve | Para qué sirve |
|---|---|---|
| ✏️ REGISTRO | Todos | El personal marca sus comidas |
| 🍽️ SERVICIO | Todos | Para marcar si ya se sirvió la comida |
| 🧮 CONTEO | Solo admins | Ver resumen semanal de comidas |
| 🔐 ADMINISTRACIÓN | Solo admins | Gestionar personal, menú y configuración |

Para entrar como admin: tocar el 🔒 de la esquina inferior derecha e ingresar celular y contraseña.

---

## ✏️ REGISTRO — Para el personal

**Archivo:** `PAGES/registro.html`

### ¿Qué hace?
El personal busca su propio nombre y marca si quiere comer o no para cada día de la semana.

### Flujo paso a paso

1. El personal escribe su **primer nombre** en el buscador.
2. Selecciona su nombre de la lista y toca **Entrar**.
3. Ve las comidas que le corresponden según su **turno**.
4. Selecciona una comida y ve la semana con 7 filas.
5. En cada día toca **SI** (va a comer) o **NO** (no va a comer).
6. El día libre aparece bloqueado automáticamente como 🏖️ DÍA LIBRE.
7. Cuando todos los días están marcados, toca **💾 Confirmar** para guardar.

### Reglas que aplica el sistema
- Solo muestra las comidas del turno de la persona (ej: turno noche no ve desayuno).
- El día libre se bloquea automáticamente, no se puede marcar.
- Se puede volver a entrar para cambiar una respuesta en cualquier momento.
- Las flechas ◀ ▶ permiten navegar entre semanas.

### Datos que guarda en Firebase
```
/registros/{personKey}/{fecha}/{comida} = "SI" o "NO"
```

---

## 🍽️ SERVICIO — Para quien reparte la comida

**Archivo:** `PAGES/servicio.html`

### ¿Qué hace?
Muestra en tiempo real quién dijo SI para una comida y permite marcar si ya fue servido.

### Flujo paso a paso

1. Elegir la comida que se está sirviendo (Desayuno, Almuerzo, Merienda, Cena).
2. Aparece la lista de personas que registraron **SI** para ese día.
3. Usar el buscador para encontrar un nombre rápido.
4. Tocar el estado de cada persona para cambiarlo:

| Estado | Significado |
|---|---|
| ⏳ Pendiente | Todavía no recibió nada |
| ✅ Servido | Ya recibió todo |
| 🍽️ Falta plato | Recibió bebida pero falta la comida |
| 🥤 Falta bebida | Recibió plato pero falta la bebida |

5. El resumen arriba (4 contadores) se actualiza en tiempo real.
6. Las flechas ◀ ▶ permiten ver días anteriores o siguientes.

### Reglas que aplica
- Solo muestra personas que registraron SI.
- Filtra por turno (no muestra a quien no le corresponde esa comida).
- El personal cargado se guarda en memoria al abrir la página (más rápido al navegar fechas).

### Datos que guarda en Firebase
```
/servicio/{fecha}/{comida}/{personKey} = "pendiente" | "servido" | "falta_plato" | "falta_beb"
```

---

## 🔐 ADMINISTRACIÓN

**Archivo:** `PAGES/admin.html`
Requiere login (celular + contraseña). Desde aquí se accede a todas las funciones de gestión.

---

## 👥 Personal

### Agregar persona — `PAGES/personal.html`

Campos del formulario:

| Campo | Opciones | Efecto en el sistema |
|---|---|---|
| Nombre completo | Texto libre | Se usa para identificar a la persona |
| Sector | Bisutería / Librería / Cosméticos / Lili / Otros | Agrupa a la persona en conteo y lista |
| Turno | Mañana / Diurno / Tarde / Noche / Otro | Define qué comidas le corresponden |
| Día libre | Lunes a Domingo / Otro | Se bloquea automáticamente en registro |

**Turnos y comidas:**

| Turno | Horario | Comidas que tiene |
|---|---|---|
| Mañana | 7am – 7pm | Desayuno · Almuerzo · Merienda |
| Diurno | 7am – 4pm | Desayuno · Almuerzo |
| Tarde | 11am – 11pm | Almuerzo · Merienda · Cena |
| Noche | 2pm – 11pm | Merienda · Cena |

> Si sector u otro campo dice "Otros/Otro", se puede escribir un texto personalizado. Si el texto del día libre coincide con un nombre de día (ej: "Lunes"), el sistema lo reconoce y lo respeta.

### Lista del personal — `PAGES/lista_personal.html`

Tres vistas disponibles:

| Vista | Muestra |
|---|---|
| 🏢 Sector | Grupos colapsables por área. Botón ✏️ editar y 🗑️ eliminar por persona |
| 🕐 Horario | Agrupado por turno. Muestra badge con el día libre de cada uno |
| 📅 Días Libres | Separado en Turno Mañana y Turno Tarde/Noche. Tabla con los 7 días marcando el día libre de cada persona |

Desde el modal de edición se puede modificar cualquier dato o eliminar a la persona (también borra sus registros).

### Datos en Firebase
```
/personal/{pushKey}/
  nombre, sector, sectorTexto, turno, turnoTexto,
  diaLibre, diaLibreTexto, activo
```

---

## 📋 Menú por fecha — `PAGES/menu_admin.html`

### ¿Qué hace?
Permite cargar el menú de cada comida para cada día de la semana.

### Flujo
1. Elegir la comida (Desayuno, Almuerzo, Merienda, Cena).
2. Ver la semana: cada día muestra si ya tiene datos (✅) o está vacío (⬜).
3. Tocar un día para editarlo.
4. Completar los campos (plato, sopa, bebida fría, bebida caliente según la comida).
5. Tocar **💾 Guardar**: guarda los datos, muestra la hora de la última modificación y limpia los campos.

### Funciones adicionales
- **📖 Historial**: muestra las comidas del último mes con fecha y hora de guardado.
- Las flechas ◀ ▶ navegan entre semanas.
- El menú cargado aparece automáticamente en la pantalla de Registro del personal.

### Datos en Firebase
```
/menu/{YYYY-MM-DD}/{comida}/
  plato, sopa, frio, caliente, _guardado, _guardadoFecha
```

---

## 🧮 Conteo semanal — `PAGES/conteo.html`

### ¿Qué hace?
Muestra una tabla con todas las personas que dijeron SI para una comida, agrupadas por sector.

### Flujo
1. Elegir la comida.
2. Navegar con ◀ ▶ para ver otras semanas.
3. Tocar **📄 Descargar Word** para guardar el reporte.

### Reglas que aplica
- Solo muestra personas cuyo turno incluye la comida seleccionada.
- Los días libres aparecen como **LIBRE** (no cuentan en el total).
- Al final hay un **Total general** por día.
- El archivo Word incluye la tabla completa con estilos.

---

## ⚙️ Otros — `PAGES/otros.html`

- Gestión de administradores (agregar/editar/eliminar)
- Gráficos de registros
- Limpiar datos

---

## 🗄️ Estructura completa de Firebase

```
/personal/{key}
  nombre, sector, sectorTexto, turno, turnoTexto,
  diaLibre, diaLibreTexto, activo

/menu/{YYYY-MM-DD}/{comida}
  plato, sopa, frio, caliente, _guardado, _guardadoFecha

/registros/{personKey}/{YYYY-MM-DD}/{comida}
  "SI" o "NO"

/servicio/{YYYY-MM-DD}/{comida}/{personKey}
  "pendiente" | "servido" | "falta_plato" | "falta_beb"

/config/admins/{celular}
  nombre, password
```

---

## 🔧 Datos técnicos

| Tecnología | Uso |
|---|---|
| HTML + CSS + JavaScript | Sin frameworks |
| Firebase Realtime Database | Proyecto: prueba-1d434 |
| Netlify | Publicación automática desde GitHub |
| PWA | Instalable como app en celular |

**Repositorio:** https://github.com/meryanez975-jpg/lista-2026
**Base de datos:** https://prueba-1d434-default-rtdb.firebaseio.com
