# PENDING.md
> Documento vivo. Actualizar cuando se complete o descubra algo nuevo.
> Esfuerzo: XS (<1h) · S (1-4h) · M (1-2d) · L (3-5d) · XL (1+ semana)
> Prioridad: P0 roto ahora · P1 MVP · P2 importante post-MVP · P3 nice-to-have

---

## 🔴 P0 — Roto en producción ahora mismo

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| ~~P0-1~~ | ~~**Bug: tiempos de citas muestran `--:--` y pacientes dicen "Paciente no identificado"**~~ | ~~XS–S~~ | ~~API + Site~~ | ✅ Resuelto en `fix/p0-1-appointment-times-patient-name`. 3 bugs: filtro date API → rango startTime; site accedía `raw.patient?.uuid` en vez de `raw.patientUUID`; `date` del create ahora es medianoche UTC. |
| ~~P0-2~~ | ~~**Bug: `GET /appointments` no envía `page`, `limit`, `date`**~~ | ~~XS~~ | ~~Site~~ | ✅ Resuelto en `fix/p0-sidebar-routing-auth-guards-query-params` |
| ~~P0-3~~ | ~~**Bug: "Tipos de Citas" en sidebar lleva a 404**~~ | ~~XS~~ | ~~Site~~ | ✅ Resuelto en `fix/p0-sidebar-routing-auth-guards-query-params` |
| ~~P0-4~~ | ~~**Seguridad: `report-template/create.tsx` sin auth guard**~~ | ~~XS~~ | ~~Site~~ | ✅ Resuelto en `fix/p0-sidebar-routing-auth-guards-query-params` |
| ~~P0-5~~ | ~~**Seguridad: `users/[id]/index.tsx` sin auth guard**~~ | ~~XS~~ | ~~Site~~ | ✅ Resuelto en `fix/p0-sidebar-routing-auth-guards-query-params` |
| ~~P0-6~~ | ~~**Bug: WhatsApp envía mensajes al número `88165808` en vez del paciente**~~ | ~~S~~ | ~~Site + API~~ | ✅ API ahora retorna `phone` y `email` del paciente en `GET /appointments/patient/:uuid`. |
| ~~P0-7~~ | ~~**Bug: form de nueva cita envía UUID falso `8e3677b3-...` como `typeUUID`**~~ | ~~—~~ | ~~Site~~ | ✅ Resuelto junto con P1-3. El selector de tipos ahora carga desde `GET /appointment-types`. |

---

## 🟠 P1 — MVP: flujo clínico completo

### Flujo de citas (prioridad máxima del cliente)

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| ~~P1-1~~ | ~~**Manage appointment: cargar datos reales + confirmar/reagendar**~~ | ~~M~~ | ~~Site~~ | ✅ Conectado a `GET /appointments/:uuid` y `PATCH /appointments/:uuid`. |
| ~~P1-2~~ | ~~**Flujo post-control: cita tentativa → llamada → confirmada/pendiente**~~ | ~~M~~ | ~~Site~~ | ✅ handleNoAnswer y handleConfirm conectados al PATCH real. |
| ~~P1-3~~ | ~~**AppointmentTypes CRUD: `GET/POST /appointment-types`**~~ | ~~L~~ | ~~API → Site~~ | ✅ Entity + storage + use cases + controlador en API. Query + mutation + listado + form conectados en site. UUID hardcodeado eliminado de nueva cita. |
| P1-4 | **Cambiar estado de citas en lote / filtrar por estado** | S | Site | El filtro por estado ya existe en la UI (`statusFilter`). Falta: acción de cambio masivo de estado. Puede ser solo front si se hace cita por cita. |
| ~~P1-5~~ | ~~**Registro de intentos de llamada en cita**~~ | ~~M~~ | ~~Site~~ | ✅ `handleNoAnswer` acumula `[YYYY-MM-DD HH:mm] Intento #N — No contestó`; historial parseado y mostrado en UI. |
| ~~P1-6~~ | ~~**Cambio automático de mes si no contesta**~~ | ~~S~~ | ~~Site~~ | ✅ Implementado en `handleNoAnswer`: suma 1 mes + PENDING + nota de sistema + PATCH real. |

### Controles médicos

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| ~~P1-7~~ | ~~**Conectar form de nuevo control (v2) al API**~~ | ~~M~~ | ~~Site~~ | ✅ `handleSave` conectado a mutation; todos los textareas vinculados; página usa v2. |
| ~~P1-8~~ | ~~**Ver última audiometría en detalle de paciente**~~ | ~~S~~ | ~~Site~~ | ✅ `use-patient-summary-header.ts` filtra el control más reciente AUDIOLOGY y expone `lastVisit`, `mainDiagnosis`. |
| ~~P1-9~~ | ~~**`followUp`: persistir en API**~~ | ~~XS~~ | ~~API~~ | ✅ Columna `followUp Json?` en schema + migración SQL creada. Storage y use case actualizados. Aplicar migración con `prisma migrate deploy`. |

### Pacientes

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| ~~P1-10~~ | ~~**Verificar y corregir form de creación de paciente**~~ | ~~S~~ | ~~Site~~ | ✅ Campos corregidos a firstName/lastName/documentId/birthDate/address/phone/email/gender; Yup con NAME_REGEX, PHONE_REGEX, max fechas futuras, maxLength. |
| ~~P1-11~~ | ~~**Vista detalle de paciente completa**~~ | ~~M~~ | ~~Site~~ | ✅ `use-patient-summary-header.ts` conectado a controles reales; `lastVisit` y `mainDiagnosis` desde API. |
| ~~P1-12~~ | ~~**`DELETE /appointments/:uuid` — descomentar en API**~~ | ~~XS~~ | ~~API~~ | ✅ Use case creado, controlador y módulo actualizados. |

### Usuarios y perfil

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| ~~P1-13~~ | ~~**Perfil del médico: cargar datos reales**~~ | ~~S~~ | ~~Site~~ | ✅ `useSession()` pre-llena nombre, email y rol. Guardado sigue pendiente hasta P1-14. |
| P1-14 | **`PATCH /users/:uuid` — nuevo endpoint** | M | API → Site | Permite que el médico edite sus datos desde el perfil. Luego conectar form de perfil y user edit page. |

---

## 🟡 P2 — Post-MVP importante

### Archivos adjuntos (garantías, recibos, pruebas externas)

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P2-1 | **Infraestructura de storage para archivos** | XL | API | Definir si se usa S3/R2/otro. Crear endpoints `POST /patients/:uuid/documents`, `GET /patients/:uuid/documents`. Sin esto nada de archivos funciona. |
| P2-2 | **Sección de garantías y recibos por paciente** | L | Site | Tab en detalle de paciente. Adjuntar PDF/imagen. Hoy tiene datos mock (`MOCK_DOCUMENTS`). Depende de P2-1. |
| P2-3 | **Adjuntar pruebas externas (PDF/img) a un control** | M | Site + API | Vincular archivos a un `MedicalControl` específico. Depende de P2-1. |
| P2-4 | **Filtro de tipo de prueba / historial clínico** | S | Site | Filtrar controles por especialidad o tipo. La UI de tabs por especialidad ya existe en patient detail. |

### Vista del médico

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P2-5 | **Vista médico: próxima cita, última cita, mantenimientos pendientes** | L | API + Site | Requiere query agregada en API. Nuevo endpoint o composición de los existentes. |
| P2-6 | **Vencimiento de garantía y próxima receta de audífonos** | L | API + Site | Campos nuevos en Patient o en un modelo separado. Requiere diseño. |
| P2-7 | **Indicador de pacientes inactivos ("hace cuánto no viene")** | M | API + Site | Estrategia de negocio: identificar pacientes que llevan N meses sin cita ni control para proactivamente rellamarlos. No requiere campos nuevos — calcular desde `MedicalControl.createdAt` o `Appointment.date` más reciente por paciente. Mostrar como badge/filtro en la lista de pacientes o sección en dashboard ("Pacientes que no vienen hace +6 meses"). Necesita un query eficiente en API para no calcular en el front. |

### Reportes

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P2-8 | **Reporte de consulta (PDF)** | XL | Site | Generar PDF del control médico. La UI de `report-template/create.tsx` existe pero es estática y sin auth. Requiere librería de generación de PDF (react-pdf o similar). |
| P2-9 | **Ficha técnica del paciente** | L | Site | Historial completo: datos del paciente + todos sus controles + audiogramas. Vista de impresión o PDF. |

### Calendario

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P2-10 | **POC: vincular cita agendada a Google Calendar / Apple Calendar** | S | Site | El link de Google Calendar ya está implementado en `generateCalendarLink()` en `use-appointment-detail-panel.ts`. Apple Calendar usa el formato `.ics`. Completar y exponer desde la UI. |

### Mejoras de UX

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P2-11 | **Notas en agenda** | XS | Site | Campo `notes` ya existe en `Appointment`. Solo asegurarse de que se muestre en la vista de agenda. |
| P2-12 | **i18n: eliminar todo texto quemado y usar `es.json` completo** | L | Site | Todo el texto hardcodeado en JSX debe ir a `es.json`. Aplica a todos los containers. Tarea transversal — hacer gradualmente por módulo. |
| P2-13 | **`GET /users/:uuid` — nuevo endpoint** | S | API → Site | Para user detail page y edit. Hoy completamente mocked con "Dr. Roberto Gómez". |
| P2-14 | **`search` en `GET /patients` — verificar si API lo soporta** | XS | API | Si no está implementado, el buscador de pacientes no filtra. Agregar o confirmar. |
| P2-15 | **`role` filter en `GET /users` — verificar si API lo soporta** | XS | API | Igual que el punto anterior para usuarios. |

---

## ⚪ P3 — Nice-to-have / post-lanzamiento

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P3-1 | **Tenant initialization event (EventBridge / llamada interna)** | XL | API | Cuando Identity crea un Tenant, emitir evento para que Medical Records inicialice datos por defecto (AppointmentTypes base, etc.). Arquitectura event-driven. |
| P3-2 | **Trabajo interdisciplinario** | XL | API + Site | Paciente compartido entre doctores de diferentes especialidades. Requiere diseño de permisos y modelo de datos. |
| P3-3 | **Historial clínico configurable por clínica** | XL | API + Site | La clínica define su propia plantilla de historia clínica. "TBD" según el cliente. Muy complejo — evaluar si entra en el producto. |
| P3-4 | **Fix pre-commit hook en API** | XS | API | Hook `.husky/pre-commit` no tiene shebang (falla en Windows). `precommit:check` no existe en `package.json`. ESLint tiene 73 errores pre-existentes (`no-explicit-any`, `explicit-module-boundary-types`). Solución: añadir shebang al hook, agregar script `precommit:check` o eliminarlo, y resolver errores de lint en toda la codebase. Por ahora se commitea con `--no-verify`. |
| P3-5 | **Consolidar `AppointmentStatus` enum** | XS | Site | Está duplicado en 3 archivos. Centralizar en `src/types/appointments/appointment.ts`. |
| P3-5 | **Paginación global integrada al contexto** | M | Site | `pagination.tsx` tiene TODO. Cada lista maneja su propia paginación de forma inconsistente. |
| P3-6 | **`tenant.plan` en `GET /auth/me`** | S | API | El type `TenantDomain` del site define `plan: FREE\|PREMIUM\|ENTERPRISE` pero la tabla `Tenant` no tiene esa columna. Siempre es `undefined`. |
| P3-7 | **`gender` y `bloodType` en modelo Patient** | M | API | Requiere migración de DB. El site los necesita en control-detail y patient summary. |
| P3-8 | **Settings: editar datos del tenant** | L | API + Site | Nuevo `PATCH /tenants/:uuid`. Hoy la página de settings es 100% estática con "Centro Auditivo Integral" hardcodeado. |

---

## 🏁 Definición de MVP

**El MVP es funcional cuando un médico puede:**

1. ✅ Registrar y buscar pacientes
2. ⬜ Agendar una cita con tipo de servicio real (no UUID falso)
3. ⬜ Gestionar el ciclo completo: tentativa → llamada → confirmar o reagendar
4. ⬜ Crear un control médico y que se guarde realmente en la DB
5. ✅ Ver el historial de controles de un paciente
6. ⬜ Ver la última audiometría del paciente
7. ✅ Gestionar inventario (completo)
8. ⬜ El médico puede ver y editar su propio perfil

**Items del cliente que quedan fuera del MVP:**
- Archivos adjuntos (garantías, recibos, pruebas externas) → P2, requiere infraestructura de storage
- Reportes PDF → P2, complejidad alta
- Vista médico con vencimiento de garantía / próxima receta → P2
- Calendar integration → P2 (POC rápido pero no crítico)
- Historial clínico configurable → P3, TBD con cliente
- Trabajo interdisciplinario → P3
- Tenant event initialization → P3, arquitectura

**Criterio:** si el flujo "agendar → atender → registrar control → historial" funciona de punta a punta sin datos mocked ni UUIDs falsos, es MVP.

---

## 📊 Resumen ejecutivo

| Categoría | Cantidad | Esfuerzo total estimado |
|-----------|----------|------------------------|
| P0 bugs críticos | 7 | ~1 día (6 son XS/S) |
| P1 MVP | 14 | ~2-3 semanas |
| P2 post-MVP | 15 | ~4-6 semanas |
| P3 nice-to-have | 8 | indefinido |

**Orden recomendado para las primeras 2 semanas:**
P0-1 → P0-2 → P0-3 → P0-4 → P0-5 (una tarde) → P1-12 (API, 30 min) → P1-9 (API, 30 min) → P1-3 (API + site, bloqueante de todo el módulo de citas) → P1-1 → P1-2 → P1-6 → P1-7 → P1-10 → P1-11
