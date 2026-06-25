# CHANGES.md

## 🎯 SESIÓN ACTIVA — retomar aquí

**Branch activo:** `fix/p0-sidebar-routing-auth-guards-query-params`  
**Etapa actual:** ✅ Todos los P0 site-only completados — listo para PR.  
**Próximo paso:** Revisar lint, hacer commit y abrir PR a `main`.

**Cola de esta etapa (P0 site-only, sin necesidad de API):**
1. ✅ P0-3 — `sidebar.ts` "Tipos de Citas" corregido a `routesPrivate.appointmentType.index`
2. ✅ P0-4 — `report-template/create.tsx` auth guard descomentado
3. ✅ P0-5 — `users/[id]/index.tsx` auth guard agregado
4. ✅ P0-2 — `appointments-query.ts` ahora envía `?page&limit&date` correctamente

**Estándares activos (ver `.claude/PATTERNS.md` reglas 7-12):**
- Sin abreviaciones en variables
- `isLoading` no `loading`
- Sufijo `Container` en todos los componentes container
- Todo copy en `es.json` + `i18n.ts` vía `t()`
- Sin `any`
- Verificar imports/keys tras renombrar

---


## ✅ COMPLETADO

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
| `use-new-control.ts` | `handleSave` → solo `console.log` |
| `use-appointment-type-form.tsx` | `handleSubmit` → `console.log` + setTimeout |
| `use-manage-appointment.tsx` | `handleConfirm`/`handleNoAnswer` → no llaman API |
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
