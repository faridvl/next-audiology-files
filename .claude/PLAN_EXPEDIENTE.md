# Plan — Reestructuración del Expediente del Paciente

> Plan de trabajo. Basado en [DOMAIN_ANALYSIS.md](DOMAIN_ANALYSIS.md).
> Fecha: 2026-07-26 · Estado: **propuesta, pendiente de aprobación**
> Esfuerzo: XS (<1h) · S (1-4h) · M (1-2d) · L (3-5d)

---

## 0. La pregunta que ordena todo

> **Un paciente llega a la clínica. ¿Qué hace el sistema?**

Hoy **no hay respuesta**: la visita no existe como entidad. Hay fragmentos sueltos (`MedicalControl`, `Maintenance`, un audiograma disfrazado de control) que un `sessionStorage` intenta pegar — y que se pierde al cerrar la pestaña.

### El flujo correcto

```
Paciente llega
   ↓
¿Tenía cita? ──sí──> se toma la cita agendada
   └──no──────────> walk-in (caso de Matthew en sedes)
   ↓
Se ABRE UN ENCUENTRO          ← la pieza que hoy NO existe
   ↓
Dentro del encuentro, según especialidad:
   ├── Nota          (1)      ← formato según especialidad (SOAP/DAP/…)
   ├── Estudio       (0..N)   ← audiometría / test psicométrico
   ├── Documento     (0..N)   ← factura, garantía, resultado del equipo
   └── Procedimiento (0..N)   ← mantenimiento, entrega de audífono
   ↓
Se CIERRA → firmado, con fecha, hora y autor (NOM-004 5.10)
   ↓
Aparece como UNA entrada en el expediente
```

**La diferencia con hoy:** un audiograma y su consulta del mismo día son **una** entrada, no dos filas sin relación.

### Cita ≠ Encuentro

| | Qué es | Cuándo existe |
|---|---|---|
| **Cita** | Una **intención** de atender | Antes. Puede cancelarse / no presentarse |
| **Encuentro** | La atención que **ocurrió** | Solo si el paciente llegó |

Hay citas sin encuentro (no asistió) y encuentros sin cita (walk-in). Entidades distintas; la cita es **referencia opcional** del encuentro.

### Vocabulario (hoy hay tres nombres para lo mismo)

| Término | Qué es | Reemplaza a |
|---|---|---|
| **Expediente** | Todo lo del paciente. Es `/patients/[uuid]` | "ficha", "detalle" |
| **Encuentro** | Lo que pasó un día | — (no existía) |
| **Nota** | Registro clínico dentro del encuentro | "control", "consulta", "medical control" |
| **Estudio** | Una medición: audiometría, test | `findings.audiogram` |

> "Control" desaparece — o queda solo como **tipo** de encuentro en audiología (*control de seguimiento*), nunca como sinónimo de consulta.

---

## 1. Decisiones ya tomadas

| # | Decisión | Fuente |
|---|---|---|
| 1 | **Sin producción** — no hay migración de datos que resolver | Verificado: sin seeds en medical-records |
| 2 | **Opción B** — generalizar el motor, no parchear audiología | §4 análisis |
| 3 | **El expediente es del paciente, no del médico** — un solo expediente con todo | NOM-004 5.14 |
| 4 | **Especialidad ≠ rol** — la especialidad define qué **escribes**, no qué **ves** | §4.5 |
| 5 | **Módulos por especialidad del tenant** — psicología no ve audífonos/inventario/mantenimiento | §4.7 |
| 6 | **Audiograma = adjunto + pocos valores clave** — Matthew ya tiene equipo | §4.7 |
| 7 | **Documento sin encuentro es el caso normal** — vínculo opcional | §4.9 |
| 8 | **Notas de proceso = tabla separada**, no `isPrivate` | §4.10 |
| 9 | **Formato de nota configurable** — SOAP no es universal | §4.10 |

---

## 2. Decisiones PENDIENTES — bloquean el inicio

| # | Pregunta | Estado |
|---|---|---|
| **D1** | ¿Append-only desde ya? | ✅ **SÍ — decidido.** Ver §2.1 |
| **D2** | ¿STAFF lee notas clínicas? | ⬜ Pendiente. Ley 8968: datos sensibles. Recomendación: **no**, solo administrativo |
| **D3** | ¿Psicología en el MVP? | ✅ **SÍ — decidido.** Fase 5 confirmada; `clinical-templates` sube a P1 |

> Nada bloquea el inicio. D2 se puede decidir durante la Fase 1.

### 2.1 Append-only — qué significa en la práctica

**Regla:** los registros clínicos no se editan ni se borran. Solo se agregan.

| | Escenario: el médico escribió "otitis media" y se equivocó |
|---|---|
| **Mutable (hoy)** | `UPDATE` → dice "otitis externa". **"Otitis media" desapareció.** Nadie sabe que existió |
| **Append-only** | Se agrega corrección. Se ve: "otitis media" *(corregido 26/07 por Dr. X → otitis externa)* |

**Fundamento:** NOM-004 5.11 exige el expediente *"sin enmendaduras ni tachaduras"*. Es la versión digital de la regla de papel: no se usa corrector — se tacha con una línea y se firma al lado. Un expediente reescribible sin rastro **no sirve como prueba legal**, que es para lo que existe.

Reforzado por CPPCR art. 22: retención **10 años** en psicología.

**Qué NO implica:**
- ❌ Que no se pueda corregir → sí, **por adición**
- ❌ Que no se pueda eliminar un paciente → **soft delete**, ya implementado

**Implicaciones concretas:**

| Entidad | Regla |
|---|---|
| `Nota` firmada | Sin `UPDATE`. Corrección por adición (patrón `correctionNotes`, ya existe) |
| `Encuentro` cerrado | Sin `UPDATE`. Reabrir = nuevo encuentro vinculado |
| `Estudio` | Inmutable. Repetir medición = estudio nuevo |
| Datos demográficos | ✅ **Sí** editables — no son registro clínico |
| Borrado | Solo soft delete. Bloquear `DELETE` duro |

> ✅ Ya existe el precedente: `PATCH /medical-controls/:uuid/correction-note`. La Fase 1 lo generaliza y **quita los `UPDATE` destructivos**.

---

## 3. Plan por fases

Orden deliberado: **cada fase deja algo demostrable** y las de mayor riesgo de abstracción van al final.

### FASE 0 — Correcciones P0 · Esfuerzo S · Site + API

Independientes del rediseño. Se pueden hacer ya.

| # | Tarea | Repo | Detalle |
|---|---|---|---|
| 0.1 | **Quitar el filtro por especialidad al leer** | Site | [use-patient-detail.ts:73](../src/components/containers/patients/patients-detail/use-patient-detail.ts#L73) — viola NOM-004 5.14 y tiene riesgo clínico (ototóxicos invisibles al audiólogo). `selectedSpec` queda como **preferencia de vista** |
| 0.2 | **Quitar filtro por `speciality` del JWT al leer** | API | `find-all-medical-controls.use-case.ts` — fragmenta el expediente |
| 0.3 | **Arreglar forma del audiograma** | Site | §2.1 — el PDF sale con guiones. Unificar en la forma que se persiste hoy |

> 0.1 y 0.2 son **el mismo bug** en dos capas. Hacerlos juntos.

**Entregable:** el expediente muestra todo. El PDF deja de salir vacío.

---

### FASE 1 — `Encuentro` · Esfuerzo M · API + Site

La pieza central. Todo lo demás depende de esto.

**API:**
- Modelo `Encounter`: `uuid`, `patientUuid`, `tenantUuid`, `autorUuid`, `especialidad`, `appointmentUuid?` (nullable — walk-in), `startedAt`, `closedAt?`, `status`
- `MedicalControl` pasa a colgar de `Encounter` (nullable en transición)
- `Maintenance` también puede colgar de `Encounter`
- Endpoints: `POST /encounters`, `GET /encounters/patient/:uuid`, `PATCH /encounters/:uuid/close`

**Site:**
- `ConsultaSessionStorage` **se elimina** — el encuentro vive en DB
- Timeline del expediente agrupa por encuentro

**Entregable:** "¿qué se hizo el 3 de marzo?" tiene respuesta. Se acaba la pérdida al cerrar pestaña y el bug de `savedControlUuid` sobrescrito (§2.3).

---

### FASE 2 — `Estudio` · Esfuerzo M · API + Site

Sacar las mediciones de `findings`.

**API:**
- Modelo `Study`: `uuid`, `encounterUuid`, `patientUuid`, `tipo` (enum), `payload` (Json), `documentUuid?` (el archivo del equipo), `createdAt`, `autorUuid`
- Tipos iniciales: `AUDIOMETRIA_TONAL`, `TEST_PSICOMETRICO`

**Site:**
- El audiograma deja de ser `MedicalControl` falso con `diagnosis: "Audiograma"`
- **Adjunto + pocos valores clave** (PTA / umbrales principales) — decisión 6
- El PDF lee de `Study`, no de `findings`

**Entregable:** el audiograma queda bien modelado. Habilita comparación longitudinal (aunque la UI de comparación sea post-MVP).

---

### FASE 3 — Expediente reestructurado · Esfuerzo M · Site

Solo UI. Los tres niveles de §4.8.

- **Identidad** (1, estable) — siempre visible
- **Estado clínico** (1, se actualiza) — antecedentes + dispositivos activos
- **Cronología** (N, crece) — encuentros, estudios, documentos

Cambios concretos:
- `BackgroundPanel` / `DevicesPanel` → bloque de contexto, no paneles sueltos
- Timeline agrupa por encuentro
- Mantenimientos entran al timeline
- Documentos suben de "apéndice final" a fuente principal
- `/ficha` deja de ser página paralela → **modo impresión** del mismo expediente
- Módulos ocultos según especialidad del tenant (decisión 5)

**Entregable:** el expediente deja de sentirse mezclado. Psicología deja de ver "Vincular audífono".

---

### FASE 4 — Motor multi-especialidad · Esfuerzo L · Site + API

⚠️ **La de mayor riesgo de abstracción prematura.** Va al final a propósito: para entonces hay evidencia real de qué varía.

- Registro `ConsultaStep` + `SPECIALTY_STEPS` + `STEP_REGISTRY` (§4.6)
- Ruta única `/patients/[uuid]/consulta/[step]` reemplaza las 3 páginas
- `ClinicalTemplate` extendido con `pasosConsulta` y `formatoNota`
- Inicialización de plantilla por tenant al crear la clínica (P3-5)

**Entregable:** añadir especialidad = configuración, no código.

---

### FASE 5 — Psicología · Esfuerzo M · API + Site

Solo si D3 = sí.

- `ProcessNote` **tabla separada** (decisión 8) — acceso restringido al autor
- Formatos de nota DAP/BIRP/GIRP además de SOAP
- `ResultadoTest` con `baremoUsado` (§4.10)
- Control de acceso por rol en documentos — protocolos ocultos a administrativos (art. 20 CPPCR)
- Retención 10 años + bloqueo de borrado duro (art. 22 CPPCR)

---

## 4. Fuera de alcance (explícito)

| Tema | Por qué | Cuándo |
|---|---|---|
| Comparación de audiogramas en el tiempo | El usuario lo puso post-MVP | Post-MVP |
| Vía ósea, enmascaramiento, logoaudiometría | El audiograma entra como adjunto (§4.7) | Solo si se pide captura completa |
| Período de prueba y ajustes de audífono | Extensión del módulo de dispositivos | Post-MVP |
| Offline / conectividad intermitente | **No confirmado** que Matthew lo necesite | ⚠️ **Preguntar a Matthew** |
| Propiedad del expediente en CR | Requiere abogado local (§3.1) | Antes de términos de servicio |

---

## 5. Riesgos

| Riesgo | Mitigación |
|---|---|
| **Fase 4 diseña para especialidades hipotéticas** | Va al final; para entonces hay 2 clínicas reales como evidencia |
| **Fases 1-2 tocan 14 archivos que leen `findings`** | Sin producción → sin migración. El costo es reescritura, y se paga una sola vez |
| **Fase 1 toca `routes.ts` / `use-navigation.ts`** (infraestructura) | Fase 4 los toca, no la 1. Separadas a propósito |
| **D1 no se decide y se construye mutable** | Bloquear inicio de Fase 1 hasta decidir |

---

## 6. Inventario de secciones del sitio

38 páginas en 12 módulos. Estado verificado en código, no supuesto.

| Módulo | Págs | Estado | Sirve a psicología | Notas |
|---|---|---|---|---|
| **Pacientes / Expediente** | 10 | ⚠️ Funcional, mal modelado | ✅ **Núcleo** | Objeto de este plan |
| **Citas** | 3 | ⚠️ Funcional con bug | ✅ **Núcleo** | `GET /appointments` **no envía params** — trae todas las citas del tenant sin filtrar |
| **Dashboard** | 1 | ⚠️ Parcial | ✅ Núcleo | 3 métricas + agenda |
| **Plantillas clínicas** | 2 | 🔴 **localStorage** | ✅ **Núcleo** | **No persiste.** Motor del que depende psicología |
| **Documentos** | — | 🔴 Upload 500 | ✅ **Núcleo** | Falta `GET /patients/:uuid/documents`. Vía principal del audiograma |
| **Usuarios** | 4 | ✅ Completo | ✅ Núcleo | CRUD conectado |
| **Perfil** | 1 | ⚠️ Campos sin DB | ✅ Núcleo | Firma sí sube |
| **Ajustes** | 1 | ⚠️ Campos sin DB | ✅ Núcleo | Solo `businessName`/`businessType` persisten |
| **Tipos de cita** | 2 | ✅ Completo | ✅ Núcleo | Falta UI de editar/eliminar |
| **Inventario** | 4 | ✅ Completo | ❌ **Audiología** | Recién rediseñado por serie |
| **Mantenimiento** | 1 | ⚠️ Sin entrada en menú | ❌ **Audiología** | Solo se llega desde el paciente |
| **Plantilla de reporte** | 1 | 🔴 Sin diseñar | — | Ocupa lugar en el sidebar sin funcionar |
| **Controles** | 2 | ⚠️ Duplicado | ✅ Núcleo | `new-control` y `new-control-v1` conviven |

### Módulos omitidos en la primera pasada

El listado anterior priorizaba por urgencia técnica y dejó fuera módulos funcionales que **sí tienen deuda**:

| Módulo | Estado | Deuda |
|---|---|---|
| **Login** | ✅ Funcional | Sesión de 1h **sin refresh** — expira trabajando |
| **Registro** | ✅ Funcional | Crea Tenant + User |
| **Recuperar contraseña** | 🔴 **No existe la página** | La mutation `use-forgot-password-mutation.ts` existe, **sin UI**. Usuario que olvida su clave queda **sin salida** |
| **Landing** | ⚠️ Existe | Marketing, fuera del producto |
| **Transversal — i18n** | ⚠️ Parcial | Texto quemado en varios módulos (P2-10) |
| **Transversal — paginación** | ⚠️ Inconsistente | Listas con criterios distintos (P2-11) |
| **Transversal — permisos STAFF** | 🔴 A medias | Ver §6.1 |

### 6.1 Roles — STAFF está incompleto

Roles: `OWNER`, `ADMIN`, `DOCTOR`, `STAFF`. **STAFF = recepción / asistente administrativo.**

En las clínicas reales: Matthew `OWNER`, María `DOCTOR`; la psicóloga `OWNER`/`DOCTOR`. Quien agende y cobre → `STAFF`.

🔴 **Hoy STAFF solo se usa en un lugar:**

```ts
// patient-detail-container.tsx:557
const canStartConsulta = user?.role && user.role !== UserRole.STAFF;
```

Se le oculta "Iniciar consulta", pero **puede entrar al expediente y leer todas las notas clínicas**.

> ⚠️ **Más grave en psicología:** STAFF leería motivo de consulta, examen del estado mental y **evaluación de riesgo suicida**.
> Ley 8968 clasifica salud como **dato sensible**.

**Recomendación (D2):** STAFF ve agenda, datos de contacto, facturas y garantías. **No** ve notas clínicas ni estudios.

### Hallazgos

1. 🔴 **`clinical-templates` no persiste** — usa `localStorage`. Es el motor que Fase 4 necesita y del que **depende psicología**. Sube de P3 a **P1**.
2. ⚠️ **`report-template` está en el sidebar pero no funciona** — ocupa espacio de menú sin entregar valor. Ocultarlo es XS.
3. ⚠️ **`maintenance` no está en el sidebar** — inconsistente: es audiología, y debería aparecer u ocultarse según especialidad, no quedar semi-oculto.
4. ⚠️ **Bug en `GET /appointments`** — construye `URLSearchParams` y no los envía. Citas es núcleo para ambas clínicas.
5. **Solo 2 de 12 módulos son exclusivos de audiología** (inventario, mantenimiento). Confirma que el núcleo genérico es grande y ya existe.

---

## 7. Orden de prioridad recomendado

Prioridad declarada: **pacientes y expediente**. Lo demás se ordena por (a) sirve a ambas clínicas, (b) está roto, (c) bloquea otra cosa.

### P0 — Roto, bloquea o es riesgo
| # | Tarea | Esfuerzo | Por qué |
|---|---|---|---|
| 1 | Filtro de especialidad (site + API) | S | Riesgo clínico + NOM-004 5.14 |
| 2 | Forma del audiograma / PDF | S | Todo PDF sale con guiones |
| 3 | `GET /appointments` no envía params | XS | Citas es núcleo |
| 4 | Upload de documentos 500 + `GET` documentos | S | Vía principal del audiograma |
| 5 | **Página de recuperar contraseña** | S | Usuario que olvida su clave queda **sin salida**. La mutation ya existe |
| 6 | **Permisos de STAFF** (§6.1) | S | Recepción lee notas clínicas. Crítico con psicología en el MVP |

### P1 — Expediente (el plan, Fases 1–3)
| # | Tarea | Esfuerzo |
|---|---|---|
| 5 | `Encuentro` (Fase 1) | M |
| 6 | `Estudio` (Fase 2) | M |
| 7 | Expediente en 3 niveles (Fase 3) | M |
| 8 | **`clinical-templates` a API** | M ← **bloquea psicología** |

### P2 — Multi-especialidad (Fases 4–5)
| # | Tarea | Esfuerzo |
|---|---|---|
| 9 | Motor de pasos + registro (Fase 4) | L |
| 10 | Psicología: `ProcessNote`, formatos, baremos (Fase 5) | M |
| 11 | Ocultar módulos por especialidad | S |

### P3 — Limpieza (barata, mejora percepción de "acabado")
| # | Tarea | Esfuerzo |
|---|---|---|
| 12 | Ocultar `report-template` del sidebar | XS |
| 13 | Borrar `new-control-v1` duplicado | XS |
| 14 | `maintenance` en sidebar según especialidad | XS |
| 15 | Editar/eliminar tipos de cita (UI) | S |
| 16 | Campos sin DB en Perfil/Ajustes | M |

> **P3 completo cabe en una sesión** y ataca directo la sensación de "funcional pero no acabado".

---

## 8. Estado

- [x] Análisis de dominio ([DOMAIN_ANALYSIS.md](DOMAIN_ANALYSIS.md))
- [x] Investigación audiología y psicología
- [x] Contexto de usuarios reales (§4.7)
- [x] Inventario de secciones (§6)
- [x] **D3 — psicología ENTRA al MVP** → Fase 5 confirmada; `clinical-templates` sube a P1
- [x] **Offline — NO necesario.** Matthew siempre trabaja con conexión
- [ ] **D1 — append-only** ← bloquea Fase 1
- [ ] D2 — permisos de STAFF
- [ ] Aprobación del plan
