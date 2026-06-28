# CHANGES.md

## 🎯 SESIÓN ACTIVA — retomar aquí

**Branch activo:** `fix/p0-1-appointment-times-patient-name`  
**Etapa actual:** Completada — P0-6, P1-1/2/6, P1-7, P1-9, P1-12, P1-13 resueltos en ambos repos.  
**Próximo paso:** Aplicar migración SQL en Neon (`add_followup_to_medical_control`), luego crear PRs y planificar AppointmentTypes (P1-3, bloqueante principal restante).

**Cola de esta etapa:**
1. ✅ P0-1 — corregidos los 3 bugs de display de citas
2. ✅ P0-6 — phone incluido en `GET /appointments/patient/:uuid` (API)
3. ✅ P1-1/P1-2/P1-6 — Manage appointment conectado a API real (GET + PATCH)
4. ✅ P1-7 — New control form conectado a `POST /medical-controls`; textareas vinculados al estado
5. ✅ P1-9 — followUp persiste en columna `followUp Json?` de MedicalControl (migración pendiente de aplicar)
6. ✅ P1-12 — `DELETE /appointments/:uuid` habilitado (use case creado + controlador + módulo)
7. ✅ P1-13 — Perfil pre-llena nombre/email/rol desde `GET /auth/me`

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
| `new-control-container.tsx` | textareas del form no tienen `name`/`value`/`onChange` — datos no capturados |

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
