# CHANGES.md

## 🎯 SESIÓN ACTIVA — retomar aquí

**Branch activo:** `main`
**Etapa actual:** Completada — P2-8 reporte PDF de control médico; P3-3 historial clínico configurable con localStorage.
**Próximo paso:** P2-6 (vencimiento garantía WARRANTY en ficha de paciente), conectar plantillas clínicas a API cuando esté disponible.

**Cola de esta etapa:**
1. ✅ P1-14 — User detail/edit conectados a `GET /users/:uuid` y `PATCH /users/:uuid` (Identity)
2. ✅ P2-13 — Profile: guardado real vía `PATCH /users/:uuid` con uuid del usuario logueado
3. ✅ P3-8 — Settings: campos editables + `PATCH /tenants/:uuid` conectado
4. ✅ P2-5 — Dashboard: 3 tarjetas de métricas médico (próxima cita, atendidos semana, por confirmar)
5. ✅ P2-12 — i18n en dashboard, appointment-list, manage-appointment, patient-list, new-control
6. ✅ P3-4 — pre-commit hook API corregido: shebang + script `precommit:check` agregado
7. ✅ P3-5 — AppointmentStatus ya consolidado en un solo archivo; pagination integrada en Table

**Cola anterior:**
1. ✅ P0-1 — corregidos los 3 bugs de display de citas
2. ✅ P0-6 — phone incluido en `GET /appointments/patient/:uuid` (API)
3. ✅ P1-1/P1-2/P1-6 — Manage appointment conectado a API real (GET + PATCH)
4. ✅ P1-7 — New control form conectado a `POST /medical-controls`; textareas vinculados al estado
5. ✅ P1-9 — followUp persiste en columna `followUp Json?` de MedicalControl (migración pendiente de aplicar)
6. ✅ P1-12 — `DELETE /appointments/:uuid` habilitado (use case creado + controlador + módulo)
7. ✅ P1-13 — Perfil pre-llena nombre/email/rol desde `GET /auth/me`
8. ✅ P1-3 — AppointmentTypes CRUD: `GET/POST /appointment-types` en API + listado y form conectados en site + UUID hardcodeado eliminado de nueva cita
9. ✅ MULTI-ESP — `businessType` expuesto en `GET /auth/me`; Settings lee nombre/tipo real del tenant; new-control arranca con especialidad del tenant; control-detail muestra institución y especialista reales desde sesión; renderiza findings por especialidad
10. ✅ P1-10 — Form de creación de paciente corregido: campos separados firstName/lastName/documentId/address/birthDate; Yup con validaciones de máscara, maxLength, no-futuro; onBlur error inline; navigation via hook
11. ✅ P1-8/P1-11 — Patient summary conectado a `GET /medical-controls/patient/:uuid`; lastVisit y mainDiagnosis vienen del control más reciente con speciality=AUDIOLOGY
12. ✅ P1-5 — handleNoAnswer acumula `[YYYY-MM-DD HH:mm] Intento #N — No contestó` en notes; historial de llamadas visible en UI de manage-appointment

**Cambios de esta etapa:**

| Archivo | Repo | Cambio |
|---------|------|--------|
| `packages/medical-records/src/infrastructure/adapters/appointmentsRepository/appointments.storage.ts` | API | Filtro `date` exacto → rango en `startTime` (`gte`/`lt`) |
| `src/components/containers/appointment/appointment-list/use-appointment-list-container.ts` | Site | `raw.patient?.uuid` → `raw.patientUUID`; `loading` → `isLoading` |
| `src/components/containers/appointment/appointment-list/appointment-list-container.tsx` | Site | `loading` → `isLoading` |
| `src/components/containers/appointment/add-appointment/use-add-appointment.ts` | Site | `date` ahora es medianoche UTC; `loading` → `isLoading` |
| `src/components/containers/appointment/add-appointment/add-appointment.tsx` | Site | `loading` → `isLoading` |
| `packages/medical-records/src/domain/use-cases/appointments/delete-appointment.use-case.ts` | API | Nuevo use case creado |
| `packages/medical-records/src/app/controllers/appointments.controllers.ts` | API | DELETE habilitado; `DeleteAppointmentUseCase` inyectado |
| `packages/medical-records/src/app/medical-records.module.ts` | API | `DeleteAppointmentUseCase` registrado |
| `packages/medical-records/src/domain/use-cases/appointments/find-byPatient-appointment.use-case.ts` | API | Retorna `phone` y `email` del paciente |
| `packages/medical-records/src/domain/entities/medical-control.entity.ts` | API | Agrega campo `followUp` opcional |
| `packages/medical-records/src/infrastructure/adapters/controlRepository/medical-control.storage.ts` | API | Persiste y mapea `followUp` |
| `packages/medical-records/src/domain/use-cases/medical-control/create-medical-control.use-case.ts` | API | Pasa `followUp` al storage |
| `packages/medical-records/prisma/schema.prisma` | API | `MedicalControl` + columna `followUp Json?` |
| `packages/medical-records/prisma/migrations/20260627000000_add_followup_to_medical_control/migration.sql` | API | Migración SQL (aplicar con `prisma migrate deploy`) |
| `src/shared/api/querys/get-appointment-query.ts` | Site | Nueva query `GET /appointments/:uuid` |
| `src/shared/api/mutations/appointments/update-appointment-mutation.ts` | Site | Nueva mutation `PATCH /appointments/:uuid` |
| `src/components/containers/appointment/manage-appointment/use-manage-appointment.tsx` | Site | Conectado a API real; handleNoAnswer y handleConfirm con PATCH |
| `src/components/containers/appointment/manage-appointment/manage-appointment.tsx` | Site | Skeleton loading; botones disabled durante isPending |
| `src/components/containers/controls/new-control/use-new-control.ts` | Site | Conectado a mutation; campos de form con estado real |
| `src/components/containers/controls/new-control/new-control-container.tsx` | Site | Textareas vinculados; botón con isPending |
| `src/pages/controls/[id]/index.tsx` | Site | Usa `NewControlContainer` (v2) en lugar de v1 |
| `src/pages/profile/index.tsx` | Site | Pre-llena nombre/email/rol desde `useSession()` |
| `packages/identity/src/domain/types/auth.types.ts` | API | `TenantDomain` incluye `businessType?: string` |
| `packages/identity/src/infrastructure/adapters/tenant.storage.ts` | API | `findByUuid` retorna `businessType` desde la DB |
| `src/types/auth/auth.ts` | Site | `TenantDomain` incluye `businessType?: string` |
| `src/pages/settings/index.tsx` | Site | Lee `businessName`, `businessType` y `plan` reales del tenant vía `useSession()` |
| `src/components/containers/controls/new-control/use-new-control.ts` | Site | Default de especialidad basado en `tenant.businessType`; `specialityMap` refactorizado |
| `src/components/containers/control-detail/use-control-detail.ts` | Site | Elimina campos institution/specialistName mocked; `findings` tipado como `Record<string,unknown>` |
| `src/components/containers/control-detail/control-detail.tsx` | Site | Conectado a `useControlDetail` + `useSession`; institución y especialista desde tenant/user; rendering condicional de findings por especialidad |
| `src/components/containers/add-patient/use-patient-form.ts` | Site | Campos firstName/lastName/documentId/address/birthDate separados; Yup: máscara teléfono, no-futuro, maxLength, NAME_REGEX |
| `src/components/containers/add-patient/add-patient.tsx` | Site | Form con campos corregidos; máscara teléfono vía onKeyDown; validateOnBlur; ErrorMessage inline |
| `src/shared/api/mutations/patients/create-patients-mutation.ts` | Site | `PatientApiPayload` incluye `address` |
| `src/components/containers/patient-summary/use-patient-summary-header.ts` | Site | `lastVisit` y `mainDiagnosis` desde `GET /medical-controls/patient/:uuid`; filtra control más reciente con AUDIOLOGY |
| `src/components/containers/appointment/manage-appointment/use-manage-appointment.tsx` | Site | `handleNoAnswer` acumula `[YYYY-MM-DD HH:mm] Intento #N — No contestó`; `callAttempts` parseado y expuesto |
| `src/components/containers/appointment/manage-appointment/manage-appointment.tsx` | Site | Muestra historial de intentos de llamada en UI |
| `src/components/containers/control-detail/control-detail-v1.tsx` | Site | **ELIMINADO** — página migrada a v2 (`control-detail.tsx`) |
| `src/pages/controls/detail/[patientUUID]/[controlUUID]/index.tsx` | Site | Importa `control-detail.tsx` en lugar de v1 |
| `src/components/containers/report-template/form-report-template.tsx` | Site | Reemplazado con placeholder compilable (feature sin diseñar) |
| `src/components/common/back-button/back-button.tsx` | Site | Nuevo componente compartido extraído de `users/create.tsx` |
| `src/types/appointments/appointment.ts` | Site | Agrega `CreateAppointmentPayload` |
| `src/types/appointments/appointment-ui.types.ts` | Site | **NUEVO** — `AppointmentUI` movido desde hook |
| `src/types/appointments/dashboard-appointment.types.ts` | Site | **NUEVO** — `DashboardAppointment` movido desde hook |
| `src/types/appointments/call-attempt.types.ts` | Site | **NUEVO** — `CallAttemptEntry` movido desde hook |
| `src/types/appointments/history-note.types.ts` | Site | **NUEVO** — `HistoryNote` movido desde hook |
| `src/types/documents/document.types.ts` | Site | **NUEVO** — `DocumentItem`, `DocumentCategory`, `DocumentFilterType` |
| `src/types/patients/patient.ts` | Site | Agrega `CreatePatientPayload`; `email` opcional en `Patient` |
| `src/components/containers/appointment/appointment-list/use-appointment-list-container.ts` | Site | Elimina enums duplicados; re-exporta `AppointmentUI` desde types; `rawAppointment` tipado |
| `src/components/containers/appointment/appointment-detail-panel/use-appointment-detail-panel.ts` | Site | Importa `AppointmentUI` y `HistoryNote` desde types; elimina `any` |
| `src/components/containers/appointment/appointment-detail-panel/appointment-detail-panel.tsx` | Site | Importa `AppointmentUI` desde types |
| `src/components/containers/dashboard/use-dashboard.ts` | Site | Elimina `AppointmentStatus` duplicado; `nav` → `navigation`; `app` → `rawAppointment`; `desc` → `description` |
| `src/components/containers/dashboard/dashboard.tsx` | Site | Importa `DashboardAppointment` desde types; `cita` → `appointment` |
| `src/components/containers/documents/use-documents.tsx` | Site | Tipos a `src/types/documents/`; `search` → `searchTerm`; `filteredDocs` → `filteredDocuments`; elimina código comentado |
| `src/components/containers/documents/documents-view.tsx` | Site | Importa tipos desde `src/types/`; `DocCategory` → `DocumentCategory`; `setSearch` → `setSearchTerm` |
| `src/components/containers/patients/patients-list/use-patient-list.ts` | Site | Elimina `nav` sin `()`; usa `useNavigation()` correctamente |
| `src/components/containers/patients/patients-list\patient-list-container.tsx` | Site | Elimina `console.log`; tipos explícitos en acciones |
| `src/components/containers/users/users-list/user-list-container.tsx` | Site | `nav` → `navigation`; `console.log` → TODO(!) |
| `src/components/containers/users-form/user-form.tsx` | Site | `nav` → `navigation` |
| `src/pages/users/create.tsx` | Site | `nav` → `navigation`; usa `BackButton` compartido |
| `src/pages/users/[id]/index.tsx` | Site | `nav` → `navigation` |
| `src/pages/users/edit/[id]/index.tsx` | Site | `nav` → `navigation`; `console.log` → TODO(!) con referencia a P1-14 |
| `src/components/containers/audiogram-capture/use-audiometry-data.ts` | Site | `(p)` → `(point)` tipado; `any[]` → `{ hz: number; db: number }[]` |
| `src/shared/api/mutations/appointments/create-appointment-mutation.ts` | Site | Payload movido a types; TODO(!) resuelto |
| `src/shared/api/mutations/patients/create-patients-mutation.ts` | Site | Payload movido a types; TODO(!) resuelto |

**Estándares activos (ver `.claude/PATTERNS.md` reglas 7-12):**
- Sin abreviaciones en variables
- `isLoading` no `loading`
- Sufijo `Container` en todos los componentes container
- Todo copy en `es.json` + `i18n.ts` vía `t()`
- Sin `any`
- Verificar imports/keys tras renombrar

---


## ✅ COMPLETADO

- **P0-1 — Tiempos `--:--` y "Paciente no identificado"**: Filtro de fecha en API cambiado a rango en `startTime`; `raw.patientUUID` corregido en site; `date` del create separado de `startTime` (ahora medianoche UTC).
- Auth (login, register, cookie session, `authorizeServerSidePage` guard)
- Patients CRUD: list, create, detail
- Medical controls: create (v1), list by patient, detail view (control-detail)
- Audiogram modal + audiometry data capture
- Users: list, create
- Appointments: list (`GET /appointments`), create (`POST /appointments`), appointment detail panel with patient history
- Inventory: list, create, detail, manage (PATCH)
- Dashboard con citas de hoy (conectado a API)
- `useSession()` → `GET /auth/me`
- `ApiServiceClient` con JWT automático
- `useNavigation()` centralizado
- i18n base (español)
- Sidebar con navegación principal
- React Query setup con devtools
- `report-template` routes, navegación y scaffold de página create (sin auth guard aún — P0-4)

---

## 🔄 EN PROGRESO

- **Appointment types feature:** UI completa pero sin backend. Lista mocked, form con `console.log`. Bloqueado en API.
- **New medical control (v2):** `new-control-container.tsx` tiene UI nueva pero `handleSave` solo hace `console.log`. La mutation `medical-control-mutation.ts` existe pero no está importada en el nuevo contenedor.
- **Manage appointment:** UI de confirmación/reagendamiento existe pero sin fetch ni PATCH real.

---

## 📋 PENDIENTE

### Alta prioridad

- **[MOCK] Manage appointment** — conectar `GET /appointments/:uuid` para cargar datos y `PATCH /appointments/:uuid` para confirmar/reagendar.  
  Archivo: `src/components/containers/appointment/manage-appointment/use-manage-appointment.tsx`  
  APIs: disponibles en API, solo falta conexión.

- ~~**[BUG] Appointments query params no enviados**~~ — ✅ Corregido en `fix/p0-sidebar-routing-auth-guards-query-params`

- **[MOCK] New medical control form** — conectar `handleSave` en `use-new-control.ts` a `POST /medical-controls` usando `medical-control-mutation.ts`.

- ~~**[BUG] Sidebar "Tipos de Citas"**~~ — ✅ Corregido en `fix/p0-sidebar-routing-auth-guards-query-params`

- ~~**[SEGURIDAD] Report template sin auth**~~ — ✅ Corregido en `fix/p0-sidebar-routing-auth-guards-query-params`

### Media prioridad

- **[MOCK] Appointment types list y form** — requieren `GET /appointment-types` y `POST /appointment-types` en API primero.
- **[MOCK] Services catalog en create appointment** — usa UUID falso `8e3677b3-...`. Debe consumir `GET /appointment-types`.
- **[MOCK] User detail** — completamente mocked. Requiere `GET /users/:uuid` en API.
- **[MOCK] User edit** — setTimeout + console.log. Requiere `GET /users/:uuid` + `PATCH /users/:uuid` en API.
- **[MOCK] Profile page** — form estático. Puede cargar datos con `GET /auth/me` (ya disponible); guardar requiere `PATCH /users/:uuid`.
- **Consolidar AppointmentStatus enum** — está duplicado en 3 archivos; centralizar en `src/types/appointments/appointment.ts`.

---

## 🔍 DESCUBIERTO EN COMMITS

- `cfdb64d add audiogram` — audiogram modal e `use-audiometry-data.ts` añadidos pero `src/components/containers/audiogram-capture/audiogram-capture.tsx` UI no está conectada a ningún endpoint
- `a97025d / 605728d add inventory` — inventario fue añadido en dos commits, módulo completo integrado con API
- `e5abd77 hotfix: appointmentType` — hubo un intento de arreglar los tipos de cita; el campo `typeUUID` ahora es opcional en el payload de create appointment
- `7eb7fef remove tests` — los tests fueron eliminados del proyecto; no hay cobertura de pruebas actualmente

---

## ❌ INCOMPLETO EN CÓDIGO

| Archivo | Problema |
|---------|----------|
| ~~`use-new-control.ts`~~ | ✅ Conectado a mutation; textareas vinculados |
| `use-appointment-type-form.tsx` | `handleSubmit` → `console.log` + setTimeout |
| ~~`use-manage-appointment.tsx`~~ | ✅ handleConfirm/handleNoAnswer con PATCH real |
| `users/edit/[id]/index.tsx` | `handleSubmit` → `console.log` + redirect |
| `use-user-form.ts` | TODO en comentario: cambiar alerta por `showSuccess` |
| `user-list-container.tsx:124` | `onClick: (row) => console.log('Eliminar:', row.uuid)` — delete no implementado |
| `patients-list-container.tsx:44` | `console.log('Editar', row.uuid)` — edit no implementado |
| `use-documents.tsx` | `handleUpload` / `handleDelete` → solo `console.log` |
| `pagination.tsx` | TODO: integrar paginación al contexto global |
| ~~`new-control-container.tsx`~~ | ✅ Conectado |
| ~~`use-appointment-type-form.tsx`~~ | ✅ `handleSubmit` → mutation real |
| ~~`appointment-types-container.tsx`~~ | ✅ Datos reales desde `GET /appointment-types` |
| ~~`use-add-appointment.ts`~~ | ✅ UUID hardcodeado reemplazado con `useAppointmentTypesQuery` |

---

## 🔗 BLOQUEADO (esperando cambios en API)

| Feature | Endpoint requerido | Estado en API |
|---------|--------------------|--------------|
| AppointmentTypes list | `GET /appointment-types` | No existe |
| AppointmentTypes create | `POST /appointment-types` | No existe |
| AppointmentTypes edit | `PATCH /appointment-types/:uuid` | No existe |
| Services catalog en citas | `GET /appointment-types` | No existe |
| User detail | `GET /users/:uuid` | No existe |
| User edit | `PATCH /users/:uuid` | No existe |
| Settings / tenant edit | `PATCH /tenants/:uuid` | No existe |
| Profile save | `PATCH /users/:uuid` | No existe |
| Patient documents | Endpoint de storage completo | No existe |
| Delete appointment | `DELETE /appointments/:uuid` | Comentado en API |
| followUp en medical control | Campo `followUp` en POST | Acepta pero no persiste |
| gender/bloodType en Patient | Campos en modelo Patient | No existen en DB |
