# Estructura Lógica del Usuario — Sistema de Comidas 2026

## 1. Tipos de Usuario

| Tipo | Acceso | Descripción |
|------|--------|-------------|
| **Personal** | Sin contraseña | Empleado que registra sus propias comidas |
| **Servicio** | Sin contraseña | Quien reparte los platos |
| **Supervisor** | PIN de 4 dígitos | Gestiona personal, menú y extras |
| **Admin** | PIN de 4 dígitos | Acceso total + ajustes del sistema |

---

## 2. Pantalla de Inicio (`index.html`)

La pantalla pública muestra **2 botones grandes**:

```
┌─────────────────────────┐
│   📝 Registrar comidas  │  ← va a registro.html
│  (fondo verde)          │
├─────────────────────────┤
│   🍽️ Ir a Servicio      │  ← va a servicio.html
│  (fondo naranja)        │
└─────────────────────────┘
```

Para acceder al panel de admin/supervisor: tocar 3 veces la esquina inferior izquierda **o** deslizar desde el borde derecho → aparece el modal PIN.

---

## 3. Flujo del Personal (empleado normal)

```
index.html
    └─→ registro.html
            │
            ├─ Paso 1: Elige su nombre de la lista
            │
            ├─ Paso 2: Ve los días de la semana
            │          (su día libre aparece bloqueado)
            │
            └─ Paso 3: Para cada día → marca SI o NO
                       en cada comida según su turno:
                       Mañana:  Desayuno, Almuerzo, Merienda
                       Diurno:  Desayuno, Almuerzo
                       Tarde:   Almuerzo, Merienda, Cena
                       Noche:   Merienda, Cena
```

---

## 4. Flujo del Servicio (quien reparte)

```
index.html
    └─→ servicio.html
            │
            ├─ Selecciona la comida (Desayuno/Almuerzo/Merienda/Cena)
            │
            └─ Ve la lista de personas que marcaron SI
                       Para cada persona puede marcar:
                       ✅ Ya se sirvió
                       🍽️ Falta 2do plato  (solo almuerzo)
                       🍵 Falta la sopa    (solo almuerzo)
```

---

## 5. Flujo del Supervisor

```
index.html → PIN → panel_supervisor.html
                        │
                        ├─ 👤 Agregar personal → personal.html
                        │       Registra: nombre, sector, turno, día libre
                        │
                        ├─ 📋 Ver registrados → conteo.html
                        │       Muestra por semana y sector quién marcó
                        │       + sección personal extra (morado)
                        │       + botón exportar a Word
                        │
                        ├─ 🍲 Editar comidas → menu_admin.html
                        │       Carga el menú de cada día:
                        │       plato, opción fría, opción caliente
                        │
                        ├─ ⭐ Personal extra → extras.html
                        │       Registra personas ocasionales:
                        │       nombre + comidas + duración (día/semana/permanente)
                        │       Acciones sobre cada extra: Editar ✏️ / Eliminar 🗑️ / Habilitar 🔓
                        │
                        ├─ 📝 Registrar comidas → registro.html (igual que personal)
                        │
                        └─ 🍽️ Ir a Servicio → servicio.html (igual que servicio)
```

---

## 6. Flujo del Administrador

```
index.html → PIN → panel_admin.html
                        │
                        ├─ Todo lo que puede hacer el Supervisor (ver arriba)
                        │
                        └─ ⚙️ Otros (ajustes) → otros.html
                                ├─ Ver y editar admins del sistema
                                ├─ Ver gráficos de uso
                                └─ Limpiar datos

    (El Admin también accede a extras.html con las mismas acciones
     que el supervisor: Agregar, Editar, Eliminar, Habilitar)
```

---

## 7. Páginas y su Función

### Públicas (sin login)
| Página | Quién la usa | Qué hace |
|--------|-------------|----------|
| `index.html` | Todos | Pantalla de inicio, 2 opciones |
| `registro.html` | Personal | Marcar comidas de la semana (SI/NO) |
| `servicio.html` | Servicio | Marcar platos entregados |

### Privadas (requieren sesión)
| Página | Rol mínimo | Qué hace |
|--------|-----------|----------|
| `panel_supervisor.html` | Supervisor | Menú del supervisor con drawer lateral |
| `panel_admin.html` | Admin | Menú del admin con drawer lateral |
| `personal.html` | Supervisor | Agregar o editar empleado |
| `lista_personal.html` | Supervisor | Ver toda la lista del personal |
| `menu_admin.html` | Supervisor | Cargar el menú diario |
| `conteo.html` | Supervisor | Ver quién registró + conteo por sector |
| `extras.html` | Supervisor | Registrar personal extra ocasional |
| `otros.html` | Admin | Ajustes: admins, gráficos, limpiar datos |

---

## 8. Datos del Personal (lo que se registra)

Cuando se agrega un empleado se guardan:

| Campo | Opciones |
|-------|----------|
| Nombre completo | texto libre |
| Sector | Bisutería / Librería / Cosméticos / Lili / Otros (texto libre) |
| Turno | Mañana (7am–7pm) / Diurno (7am–4pm) / Tarde (11am–11pm) / Noche (2pm–11pm) / Otro |
| Día libre | Lunes / Martes / Miércoles / Jueves / Viernes / Sábado / Domingo / Otro |
| Activo | Sí / No |

---

## 9. Personal Extra

Para registrar alguien que trabaja ocasionalmente (sin estar en la lista fija):

| Campo | Opciones |
|-------|----------|
| Nombre | texto libre |
| Comidas | Desayuno / Almuerzo / Merienda / Cena (múltiple) |
| Duración | Solo ese día / Toda esa semana / Permanente |
| Fecha de referencia | fecha desde la cual aplica |

Aparece en el conteo semanal con fondo morado, separado del personal fijo, pero se suma al total.

### Acciones disponibles sobre cada extra registrado

| Acción | Quién puede | Qué hace |
|--------|------------|---------|
| ✏️ **Editar** | Supervisor y Admin | Modifica nombre, comidas, duración y fecha |
| 🗑️ **Eliminar** | Supervisor y Admin | Borra definitivamente el registro |
| 🔓 **Habilitar / Deshabilitar** | Supervisor y Admin | Permite o quita que el extra elija sus propias comidas (solo para duración semana o permanente) |

### Cómo editar un extra (paso a paso)

```
1. Abrir extras.html (desde el panel supervisor o admin)
2. Tocar "👥 Ver extras activos" para desplegar la lista
3. Tocar el botón "✏️ Editar" en la tarjeta del extra a modificar
4. El formulario se completa automáticamente con los datos actuales
5. Modificar lo que necesite: nombre, comidas, duración, fecha
6. Tocar "💾 Guardar cambios"
   → Si hay error de WiFi, muestra mensaje y permite reintentar
7. Para cancelar sin guardar → tocar "✕ Cancelar edición"
```

> **Nota:** Editar un extra no cambia su estado de habilitación ni lo desactiva.

---

## 10. El Menú del Día

Para cada día y cada comida, el supervisor puede cargar:
- **Plato principal**
- **Opción fría** (ej: ensalada)
- **Opción caliente** (ej: sopa)

El personal ve el menú al momento de marcar SI o NO en `registro.html`.

---

## 11. Conteo Semanal (`conteo.html`)

Muestra una tabla semana por semana con:
- Quién del personal fijo marcó SI por día y comida
- Subtotales por sector
- Sección extra en morado con el personal ocasional
- Total general de comidas

Se puede exportar el resumen a un documento Word.

---

## 12. Reglas de Negocio Importantes

1. **El día libre no se puede marcar:** en `registro.html`, la fila del día libre aparece bloqueada para todos los sectores (incluyendo "otros").
2. **Cada turno solo ve sus comidas:** el personal no ve comidas que no le corresponden según su turno.
3. **El personal extra tiene duración limitada:** "día" (solo esa fecha), "semana" (esa semana entera), "permanente" (siempre activo).
4. **Dos sistemas de login coexisten:** el PIN nuevo y el login viejo por celular. Ambos dan acceso a las mismas páginas protegidas.
5. **El admin ve todo, el supervisor no ve "otros.html":** el acceso a ajustes del sistema es exclusivo del admin.
