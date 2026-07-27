# ROADMAP — Orden de ataque

> Índice maestro. Detalle en [PLAN_EXPEDIENTE.md](PLAN_EXPEDIENTE.md) y [PLAN_AGENDA.md](PLAN_AGENDA.md).
> Fecha: 2026-07-26
> Esfuerzo: XS (<1h) · S (1-4h) · M (1-2d) · L (3-5d)

---

## Contexto

Dos clínicas entrando: **AudioColors** (audiología — Matthew itinerante, María en central) y una de **psicología**. Ambas en el MVP.

**Decidido:** append-only sí · psicología en MVP · sin offline (Matthew siempre con conexión) · sin producción (no hay migración de datos).

---

## ⚠️ Expectativa realista

**El expediente NO se termina en un día.** Fases 1–3 = `Encuentro` (M) + `Estudio` (M) + UI (M), tocando API y site, con migraciones de Prisma. **Estimado: 1 semana o más.**

**Lo que sí cabe en una sesión:** el bloque P0 completo.

---

## ETAPA 1 — P0 · esfuerzo S · una sesión

Agujeros funcionales. No tocan el modelo de datos.

| # | Tarea | Esfuerzo | Repo | Entregable |
|---|---|---|---|---|
| 1 | **Filtro de especialidad al leer** | S | Site + API | El expediente muestra **todo** lo del paciente. Riesgo clínico resuelto (NOM-004 5.14) |
| 2 | **Forma del audiograma → PDF** | S | Site | El PDF deja de salir con guiones |
| 3 | **Permisos STAFF** (D2) | S | Site + API | Recepción deja de leer notas clínicas |
| 4 | **Upload documentos 500 + `GET`** | S | API | Se pueden adjuntar y listar documentos |

> ✅ **Ya resuelto:** el bug de `GET /appointments` — la query **sí** envía los params (`appointments-query.ts:13`). `API_CONTRACT.md` está desactualizado; corregirlo.
> ⚠️ **Movido a Etapa 4:** recuperar contraseña. La mutation está **comentada entera** y llama a `/auth/forgot-password`, que **no existe en la API**. Es M (endpoint + correo + token + página), no S.

---

## ETAPA 2 — Agenda rápida · esfuerzo S · media sesión

Ataca directo la queja de *"tieso"* sin rediseño de fondo.

| # | Tarea | Esfuerzo | Detalle |
|---|---|---|---|
| 5 | **Duración real por tipo** | S | `AppointmentType.duration` **ya existe y no se usa**. Quitar los 30 min fijos |
| 6 | **Botón "hoy" + salto a fecha** | S | Hoy solo hay `moveWeek('next'\|'prev')` |
| 7 | **Persistir vista elegida** | XS | |

> A3–A5 (eje horario, clic en hueco, vista mes) son M — van después del expediente.

---

## ETAPA 3 — Expediente · esfuerzo L · ~1 semana

**La prioridad declarada.** Detalle en [PLAN_EXPEDIENTE.md](PLAN_EXPEDIENTE.md).

| # | Fase | Esfuerzo | Entregable |
|---|---|---|---|
| 8 | **`Encuentro`** | M | "¿Qué se hizo el 3 de marzo?" tiene respuesta. Muere `sessionStorage` |
| 9 | **Append-only** | S | Sin `UPDATE` destructivo. Generaliza `correctionNotes` |
| 10 | **`Estudio`** | M | Audiograma bien modelado, fuera de `findings` |
| 11 | **Expediente en 3 niveles** | M | Identidad / Estado / Cronología |
| 12 | **`clinical-templates` a API** | M | 🔴 Hoy es `localStorage`. **Bloquea psicología** |

> 8 y 9 van juntos: append-only se define **al crear** `Encuentro`, no después.

---

## ETAPA 4 — Psicología · esfuerzo M

Requiere Etapa 3 (sobre todo #12).

| # | Tarea | Esfuerzo |
|---|---|---|
| 13 | `ProcessNote` **tabla separada** (no `isPrivate`) | M |
| 14 | Formatos de nota DAP/BIRP/GIRP | S |
| 15 | `ResultadoTest` con `baremoUsado` | S |
| 16 | Protocolos ocultos a administrativos (art. 20 CPPCR) | S |
| 17 | Retención 10 años + bloquear borrado duro | S |
| 18 | **Recuperar contraseña** (endpoint + correo + página) | M |

---

## ETAPA 5 — Multi-especialidad · esfuerzo L

| # | Tarea | Esfuerzo |
|---|---|---|
| 19 | Registro de pasos + ruta `/consulta/[step]` | L |
| 20 | Ocultar módulos por especialidad | S |
| 21 | Agenda: eje horario + clic en hueco + mes | M |

---

## ETAPA 6 — Limpieza · esfuerzo S · cabe en una sesión

Barata, y ataca la sensación de *"funcional pero no acabado"*.

| # | Tarea | Esfuerzo |
|---|---|---|
| 22 | Ocultar `report-template` del sidebar | XS |
| 23 | Borrar `new-control-v1` duplicado | XS |
| 24 | `maintenance` en sidebar según especialidad | XS |
| 25 | `AppointmentsView` → `AppointmentsContainer` (PATTERNS #10) | XS |
| 26 | Editar/eliminar tipos de cita (UI) | S |
| 27 | Campos sin DB en Perfil/Ajustes | M |
| 28 | i18n: texto quemado | L |
| 29 | Paginación consistente | M |

> Se puede adelantar completa en cualquier momento si se quiere una victoria visible.

---

## Pendientes sin decidir

| # | Tema | Bloquea | Nota |
|---|---|---|---|
| 1 | **¿Matthew y María comparten agenda?** | Etapa 5 (#21) | Mismo tenant, él itinerante, ella fija. Si es indistinta, **van a chocar** |
| 2 | Horario de atención por clínica | Etapa 5 (#21) | No existe. Necesario para el eje horario |
| 3 | ¿Detectar solapes de citas? | — | Hoy nada impide dos citas a la misma hora |
| 4 | Propiedad del expediente en CR | Términos de servicio | Requiere abogado local |

---

## Resumen

```
Etapa 1  P0                    S       ← una sesión
Etapa 2  Agenda rápida         S       ← media sesión
Etapa 3  EXPEDIENTE            L       ← ~1 semana · PRIORIDAD
Etapa 4  Psicología            M
Etapa 5  Multi-especialidad    L
Etapa 6  Limpieza              S       ← adelantable
```
