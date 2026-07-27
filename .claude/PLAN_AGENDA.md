# Plan — Rediseño de Agenda / Citas

> Complementa [PLAN_EXPEDIENTE.md](PLAN_EXPEDIENTE.md). Fecha: 2026-07-26
> Estado: **propuesta**

---

## 1. Diagnóstico

Percepción del usuario: *"muy tieso, difícil de manejar"*. Verificado en código — **el weekstepper es el síntoma, no la causa**.

### 1.1 El calendario es de solo lectura

**Esta es la causa raíz.** Hay dos artefactos desconectados:

| | Qué hace |
|---|---|
| `appointment-list-container.tsx` | **Muestra** las citas |
| `add-appointment/` | **Crea** las citas, en un formulario aparte |

El formulario pide fecha y hora como campos de texto:

```ts
formData = { patientUuid: '', typeId: '', date: '', startTime: '' }
```

> Lo natural es al revés: **clic en el hueco del calendario → ahí se crea la cita**.
> Arreglar solo la navegación dejaría la sensación igual.

### 1.2 Navegación de una sola dimensión

```ts
const moveWeek = (direction: 'next' | 'prev') => { ... }
```

Es lo único que hay. Para una fecha lejana → N clics. **Falta:** salto a fecha, botón "hoy", mini-calendario, vista mes.

### 1.3 El calendario no representa el tiempo

Las citas son **tarjetas apiladas** en columnas por día. No hay eje horario.

Consecuencias:
- **No se ve el hueco libre** — que es justo lo que se mira al agendar
- **La duración no se ve**: una cita de 30 min y una de 2h se ven igual

### 1.4 🔴 La duración está hardcodeada — y el campo ya existe

```ts
// add-appointment + patient-detail-container
const endDateTime = new Date(startDateTime.getTime() + 30 * 60000);  // 30 min fijos
```

> **`AppointmentType.duration` ya existe en el schema Prisma** y **no se usa**.
> Confirmado con el usuario: *la duración depende del tipo de cita*.

### 1.5 Bug activo

`GET /appointments` construye `URLSearchParams` con `page`, `limit`, `date` y **no los envía**:

```ts
return await ApiServiceClient(APPOINTMENTS_URL).get<any>(`/appointments`);
// falta: `/appointments?${params}`
```

→ Trae **todas** las citas del tenant, sin filtrar. Empeora con el volumen.

### 1.6 Lo que SÍ funciona — conservar

- Color por tipo de cita + barra de especialidad
- Panel de detalle lateral
- Cambio de estado en lote
- Búsqueda y filtro por estado

---

## 2. Decisiones del usuario

| Pregunta | Respuesta | Implicación |
|---|---|---|
| ¿Cómo se agenda? | **Ambos casos** | Necesita las dos vías: clic en hueco **y** formulario rápido |
| ¿Duración? | **Depende del tipo** | Usar `AppointmentType.duration`. Quitar los 30 min fijos |
| ¿Qué vista? | **Todas** (día, semana, mes) | Las tres, con navegación fluida entre ellas |

---

## 3. Propuesta

### 3.1 Vistas

| Vista | Para qué | Notas |
|---|---|---|
| **Día** | "Qué tengo hoy" — clínico en sede | Eje horario vertical. Default en móvil |
| **Semana** | Planificar, ver carga | Eje horario. Default en escritorio |
| **Mes** | Ubicarse, saltar a fecha | Densidad, no detalle |
| **Lista** | Buscar, acciones en lote | ✅ Ya existe |

### 3.2 Navegación

- **← Hoy →** — el botón "hoy" es imprescindible
- **Mini-calendario** para salto directo
- Rango clicable → abre selector de fecha
- La vista elegida **persiste** entre sesiones

### 3.3 Calendario interactivo — el cambio de fondo

**Vía A — clic en hueco** (cuando se busca disponibilidad):
```
Clic en un espacio libre → modal con fecha y hora prellenadas
→ solo falta paciente + tipo
```

**Vía B — formulario** (cuando ya viene la fecha):
```
Botón "Nueva cita" → formulario actual, mejorado
```

> Ambas vías al mismo modal, con distinto punto de entrada.

### 3.4 Duración real

1. Al elegir tipo → `endTime = startTime + type.duration`
2. Ajustable en el modal antes de guardar
3. La **altura del bloque** en el calendario refleja la duración
4. Fallback a 30 min solo si el tipo no la define

### 3.5 Eje horario

Rejilla vertical con horas. Beneficios:
- El hueco libre **se ve**
- El solape **se ve**
- La duración **se ve**

> Requiere definir horario de atención por clínica (ej. 8:00–18:00) — hoy no existe. Sin eso, la rejilla no sabe dónde empezar.

---

## 3.6 Agenda como board — columna por profesional

**Decidido.** La agenda es **una sola**, con **columna por profesional** (modelo tipo board: tarjetas + columnas).

```
        MATTHEW                  MARÍA
      (itinerante)             (central)
  ┌──────────────────┐    ┌──────────────────┐
  │ 09:00 Juan P.    │    │ 09:00 Ana R.     │
  │ [Control] 30m    │    │ [1ra vez] 60m    │
  │ 📍 Sede Centro   │    │ 📍 Central       │
  ├──────────────────┤    ├──────────────────┤
  │      (libre)     │    │ 10:00 Luis M.    │
  │                  │    │ [Audiometría]    │
  ├──────────────────┤    └──────────────────┘
  │ 14:00 Rosa T.    │
  │ 📍 Sede Norte ⚠️ │  ← traslado
  └──────────────────┘
```

Resuelve el pendiente que estaba sin decidir: hoy la agenda es **indistinta** y Matthew y María pueden chocar.

✅ **Base ya existe:** `Appointment.userUUID` está en el tipo — la cita ya sabe de qué profesional es. Falta **usarlo** para agrupar.

### Reglas de interacción

| Acción | Comportamiento |
|---|---|
| Arrastrar **vertical** (dentro de la columna) | ✅ Cambia hora/día |
| Arrastrar **entre columnas** | ❌ **NO reasigna profesional** — decisión del usuario |
| Cambiar de profesional | Abrir la cita y editar. Más seguro que el drag |

> Decisión explícita: el drag **solo mueve en el tiempo**. Evita reasignar por error de arrastre.

### 🔴 Sedes — Matthew ve varias sedes en un mismo día

**Confirmado con el usuario.** La sede **no** es un dato secundario: hay **traslados entre citas**.

Implicaciones:
- La sede debe verse **en la tarjeta**, no solo en el detalle
- Al agendar hay que considerar el **tiempo de traslado** — si no, se agenda algo físicamente imposible
- Conviene una **señal visual** cuando dos citas consecutivas son en sedes distintas

**Estado actual del modelo:**

| | Estado |
|---|---|
| `Patient.sede` | ⚠️ Existe en DB, **string libre** |
| Uso en el site | 🔴 **Ninguno** — solo aparece como palabra en el landing |
| `Appointment.sede` | 🔴 **No existe** — la cita no sabe dónde es |

> **La sede es del encuentro, no del paciente.** Un paciente puede ser atendido en sedes distintas.
> Hoy `sede` cuelga de `Patient`, que es el lugar equivocado.

**Prerequisito:** añadir sede a `Appointment`. Relacionado con P3-6 (*sedes como modelo real*), hoy postergado — pero **Matthew lo necesita ya**.

> ⚠️ Sin esto, la agenda multi-sede no es representable. Sube de prioridad.

| # | Fase | Esfuerzo | Repo | Entregable |
|---|---|---|---|---|
| ~~A0~~ | ~~Fix params~~ | — | — | ✅ **Ya resuelto** (`appointments-query.ts:13` sí los envía) |
| **A1** | Duración real por tipo | S | Site | `AppointmentType.duration` ya existe, no se usa |
| **A2** | Navegación: hoy + salto a fecha + persistencia | S | Site | Se acaba el "tieso" |
| **A3** | **Sede en `Appointment`** | M | API + Site | 🔴 Prerequisito del board multi-sede |
| **A4** | **Board: columna por profesional** | M | Site | Matthew y María dejan de chocar |
| **A5** | Eje horario (día/semana) | M | Site | Se ven huecos, solapes y duración |
| **A6** | Clic en hueco → crear | M | Site | Calendario interactivo |
| **A7** | Drag vertical = reagendar | S | Site | Requiere A5 |
| **A8** | Alerta de traslado entre sedes | S | Site | Requiere A3 + A4 |
| **A9** | Vista mes | S | Site | Visión amplia |

> **A1 + A2 (esfuerzo S) resuelven buena parte de la queja** sin tocar el modelo.
> **A3 es el prerequisito bloqueante** del board multi-sede.

---

## 5. Pendientes

| # | Tema | Estado |
|---|---|---|
| 1 | ¿Una agenda o varias? | ✅ **Resuelto:** una, con **columna por profesional** |
| 2 | ¿El drag reasigna profesional? | ✅ **Resuelto:** no — solo mueve en el tiempo |
| 3 | ¿Sedes en un mismo día? | ✅ **Resuelto:** sí, Matthew ve varias → requiere A3 |
| 4 | **Horario de atención por clínica** | ⬜ No existe. Necesario para el eje horario (A5) |
| 5 | **¿Detectar solapes?** | ⬜ Hoy nada impide dos citas a la misma hora |
| 6 | **¿Tiempo de traslado entre sedes?** | ⬜ ¿Se modela una duración estimada, o solo se avisa visualmente? |
| 7 | Nombre del container | ⬜ `AppointmentsView` viola PATTERNS #10 → `AppointmentsContainer` |

---

## 6. Relación con el plan del expediente

Independientes salvo un punto: **Cita ≠ Encuentro** ([PLAN_EXPEDIENTE §0](PLAN_EXPEDIENTE.md)).

- La **cita** es una intención (puede no cumplirse)
- El **encuentro** es la atención que ocurrió

Al implementar `Encuentro` (Fase 1), la cita será su **referencia opcional**. La agenda no cambia por eso.
