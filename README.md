# Sistema de Comidas

App web para gestionar las comidas del personal de trabajo.

**URL:** https://steady-crisp-27d6d6.netlify.app

---

## Para el personal (sin necesidad de login)

### Registro — Marcar si van a comer

1. Entran a la app y tocan **REGISTRO**
2. Escriben su **primer nombre** en el buscador
3. Seleccionan su nombre y tocan **Entrar**
4. El sistema muestra solo las comidas de su turno:
   - Turno mañana → Desayuno, Almuerzo, Merienda
   - Turno diurno → Desayuno, Almuerzo
   - Turno tarde → Almuerzo, Merienda, Cena
   - Turno noche → Merienda, Cena
5. Tocan una comida y ven los 7 días de la semana
6. En cada día eligen **SI** (va a comer) o **NO** (no va a comer)
7. Su día libre aparece bloqueado automáticamente
8. Tocan **Confirmar** para guardar — pueden volver a cambiar cuando quieran

### Servicio — Para quien reparte la comida

1. Tocan **SERVICIO** y eligen la comida que se está sirviendo
2. Ven la lista de personas que dijeron **SI** para ese día
3. Buscan un nombre con el buscador
4. Tocan el estado de cada persona para cambiarlo:
   - Pendiente
   - Servido
   - Falta plato
   - Falta bebida
5. Los 4 contadores arriba se actualizan en tiempo real

---

## Para el administrador (requiere login)

Para entrar: tocar el candado en la esquina inferior derecha e ingresar número de celular y contraseña.
Al iniciar sesión aparecen los botones **CONTEO** y **ADMINISTRACIÓN**.

### Conteo — Ver cuántos van a comer

- Elige una comida y navega por semanas
- Ve una tabla con todos los que dijeron SI, agrupados por sector
- Los días libres aparecen como LIBRE (no cuentan en el total)
- Al final hay un total por día
- Puede descargar la tabla como archivo Word

### Administración

**Personal**
- Agregar persona: nombre completo, sector, turno y día libre
- Ver lista en 3 vistas: por sector, por horario y por días libres
- Editar o eliminar cualquier persona

**Menú por fecha**
- Carga los platos de cada comida por día (plato, sopa, bebida fría, bebida caliente)
- Guarda con fecha y hora de última modificación
- Tiene historial del último mes
- El menú cargado aparece automáticamente en la pantalla de Registro

**Otros**
- Gestionar administradores (agregar, editar, eliminar)
- Ver gráficos de registros
- Limpiar datos

---

## Flujo típico de un día

1. El admin carga el menú de la semana
2. El personal marca SI o NO en Registro
3. Al momento de servir, Servicio muestra quiénes van a comer
4. Se va marcando a cada persona como Servido
5. Al final de la semana, el admin descarga el Conteo en Word

---

## Tecnologías

| Tecnología | Uso |
|---|---|
| HTML + CSS + JavaScript | Sin frameworks |
| Firebase Realtime Database | Base de datos en tiempo real |
| Netlify | Publicación automática desde GitHub |
| PWA | Instalable como app en celular |

**Repositorio:** https://github.com/meryanez975-jpg/lista-2026
