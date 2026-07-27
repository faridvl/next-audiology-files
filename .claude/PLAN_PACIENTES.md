# Plan — Módulo Pacientes por sesiones

> Grupo completo: **crear → listar → expediente**. Es una unidad: no sirve rediseñar el expediente si los datos que lo alimentan entran mal.
> Detalle de dominio en [DOMAIN_ANALYSIS.md](DOMAIN_ANALYSIS.md) · Fecha: 2026-07-26

---

## 0. ⚠️ Corrección de supuesto

Se asumió que crear/editar paciente *"no tienen máscaras ni validaciones"*. **Verificado en código: sí las tienen, y son buenas.**

| | Estado real |
|---|---|
| **Crear** (`add-patient/`) | ✅ Yup completo · `DOCUMENT_MASKS` por tipo de documento · regex de nombres · teléfono `XXXX-XXXX` · `maxLength` por campo |
| **Editar** (`patient-edit/`) | ✅ Yup con nombre, apellido, teléfono, email |
| **Lista** (`patients-list/`) | ✅ Búsqueda con debounce 300ms · paginación · filtro de estado |

> El módulo está **mejor de lo que se creía**. El problema no es ausencia de validación — es **inconsistencia entre formularios**.

---

## 1. Diagnóstico real

### 1.1 🔴 Crear y Editar no validan lo mismo

| Campo | Crear | Editar |
|---|---|---|
| `firstName` / `lastName` | ✅ regex + required | ✅ required |
| `phone` | ✅ `XXXX-XXXX` | ✅ |
| `email` | ✅ formato + **required** | ⚠️ formato, **no required** |
| `documentId` | ✅ máscara por tipo + required | 🔴 **bloqueado, no editable** |
| `birthDate` | ✅ required + rango | 🔴 **ausente del formulario** |
| `gender` | ✅ | ✅ |
| `address` | ✅ `maxLength 240` | ⚠️ `maxLength 120` — **inconsistente** |

**Consecuencias:**
- Se crea un paciente **con** fecha de nacimiento, pero si se equivoca **no hay forma de corregirla en la UI**. Y la edad del expediente se calcula de ahí.
- `documentId` bloqueado: si se teclea mal la cédula, no se arregla.
- `address` acepta 240 al crear y 120 al editar → **truncamiento silencioso**.

### 1.2 Dos formularios paralelos para la misma entidad

```
src/components/containers/add-patient/          ← crear (fuera de patients/)
src/components/containers/patients/patient-edit/ ← editar
```

Mismo objeto `Patient`, dos esquemas Yup separados que **divergen**. Y `add-patient/` está fuera de la carpeta `patients/`.

### 1.3 Violaciones de convención (PATTERNS.md)

| Archivo | Violación |
|---|---|
| `pages/patients/create.tsx` | `router.push('/patients')` directo → **regla #1** (usar `useNavigation`) |
| `add-patient/add-patient.tsx` | Componente `PatientForm`, sin sufijo `Container` → **regla #10** |
| `create.tsx` | Strings quemados (`'Paciente registrado correctamente.'`) → **regla #11** |
| `add-patient/` | Carpeta fuera de `containers/patients/` |

### 1.4 Duplicación de expediente

`/patients/[uuid]` y `/patients/[uuid]/ficha` — dos vistas con queries duplicadas (§4.8 análisis).

---

## 2. Plan por sesiones

Cada sesión deja algo funcionando y verificable. Orden: **los datos primero, el expediente después**.

---

### SESIÓN 1 — Unificar formularios · esfuerzo S · solo Site

**Objetivo:** que crear y editar sean coherentes. Sin tocar API.

| # | Tarea | Detalle |
|---|---|---|
| 1.1 | **Esquema Yup compartido** | Un solo `patient-validation.ts`. Crear y editar lo consumen |
| 1.2 | **`birthDate` editable** | Hoy ausente en editar. Alimenta la edad del expediente |
| 1.3 | **`documentId` editable** | Con la misma máscara del crear. Hoy bloqueado sin salida |
| 1.4 | **Unificar `address`** | 240 en ambos (hoy 240 vs 120 → truncamiento) |
| 1.5 | **Unificar `email`** | Decidir: ¿required en ambos o en ninguno? |
| 1.6 | Mover `add-patient/` → `containers/patients/patient-create/` | Coherencia de estructura |
| 1.7 | `PatientForm` → `PatientCreateContainer` | PATTERNS #10 |
| 1.8 | `router.push` → `useNavigation` | PATTERNS #1 |
| 1.9 | Strings quemados → i18n | PATTERNS #11 |

**Entregable:** un paciente se crea y se corrige con las mismas reglas. Se acaba el dato imposible de arreglar.

---

### SESIÓN 2 — Lista de pacientes · esfuerzo S · Site

**Objetivo:** que la lista sirva para trabajar.

| # | Tarea | Detalle |
|---|---|---|
| 2.1 | Revisar columnas | ¿Están las que se usan al buscar un paciente? |
| 2.2 | Estado vacío y de error | Distinguir "sin pacientes" de "sin resultados de búsqueda" |
| 2.3 | Paginación consistente | Alinear con el resto (P2-11) |
| 2.4 | Indicador de paciente inactivo | Badge visible (P2-7) |

> ⚠️ **Pendiente de confirmar:** qué columnas necesitan Matthew y María al buscar. No asumir.

---

### SESIÓN 3 — P0 del expediente · esfuerzo S · Site + API

**Objetivo:** cerrar los agujeros antes de reestructurar.

| # | Tarea | Repo |
|---|---|---|
| 3.1 | **Quitar filtro por especialidad al leer** | Site + API |
| 3.2 | **Unificar forma del audiograma → arregla el PDF** | Site |
| 3.3 | **Permisos STAFF** | Site + API |
| 3.4 | **Upload documentos 500 + `GET`** | API |

**Entregable:** el expediente muestra todo lo del paciente y el PDF deja de salir con guiones.

---

### SESIÓN 4-5 — `Encuentro` + append-only · esfuerzo M · API + Site

**La pieza central.** Van juntas: append-only se define al crear el modelo, no después.

| # | Tarea | Repo |
|---|---|---|
| 4.1 | Modelo `Encounter` + migración | API |
| 4.2 | Endpoints `POST` / `GET by patient` / `PATCH close` | API |
| 4.3 | Append-only: quitar `UPDATE` destructivo, generalizar `correctionNotes` | API |
| 5.1 | Eliminar `ConsultaSessionStorage` | Site |
| 5.2 | Timeline agrupado por encuentro | Site |

**Entregable:** "¿qué se hizo el 3 de marzo?" tiene respuesta. Se acaba la pérdida al cerrar pestaña.

---

### SESIÓN 6 — `Estudio` · esfuerzo M · API + Site

| # | Tarea | Repo |
|---|---|---|
| 6.1 | Modelo `Study` + migración | API |
| 6.2 | Audiograma sale de `MedicalControl` | Site |
| 6.3 | Adjunto + pocos valores clave (PTA) | Site |
| 6.4 | PDF lee de `Study` | Site |

**Entregable:** el audiograma bien modelado. Habilita comparación longitudinal.

---

### SESIÓN 7 — Expediente en 3 niveles · esfuerzo M · Site

Solo UI. Ver §4.8 del análisis.

| # | Tarea |
|---|---|
| 7.1 | **Identidad** — siempre visible |
| 7.2 | **Estado clínico** — antecedentes + dispositivos como bloque de contexto |
| 7.3 | **Cronología** — timeline por encuentro, con mantenimientos integrados |
| 7.4 | Documentos suben de "apéndice final" a fuente principal |
| 7.5 | `/ficha` deja de ser página paralela → **modo impresión** |
| 7.6 | Ocultar módulos de audiología si el tenant es psicología |

**Entregable:** el expediente deja de sentirse mezclado.

---

## 3. Resumen

```
S1  Unificar formularios      S    Site         ← crear/editar coherentes
S2  Lista de pacientes        S    Site
S3  P0 del expediente         S    Site + API   ← arregla el PDF
S4  Encuentro + append-only   M    API
S5  Encuentro (site)          M    Site
S6  Estudio                   M    API + Site
S7  Expediente 3 niveles      M    Site
```

**S1–S3 son esfuerzo S** — cada una cabe en una sesión y deja algo visible.
**S4–S7 son el rediseño de fondo** — requieren migraciones.

---

## 4. Fuera de este plan

| Tema | Dónde |
|---|---|
| Agenda / citas | [PLAN_AGENDA.md](PLAN_AGENDA.md) |
| Sedes | Postergado por decisión del usuario — se ve al llegar a agenda |
| Psicología | Etapa 4 de [ROADMAP.md](ROADMAP.md) — requiere `clinical-templates` en API |
| Motor multi-especialidad | Etapa 5 de [ROADMAP.md](ROADMAP.md) |

---

## 5. Pendientes

| # | Tema | Bloquea |
|---|---|---|
| 1 | ¿`email` required al crear? Hoy sí; al editar no | S1.5 |
| 2 | ¿Qué columnas necesita la lista? | S2.1 |
| 3 | ¿STAFF ve la lista de pacientes? (D2) | S3.3 |
