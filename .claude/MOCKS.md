# MOCKS.md

Datos hardcodeados o no conectados al API. Todo lo que aparece aquí es un pendiente de integración.

> Última revisión: 2026-06-29 — verificado en código, no por suposición.

---

## Activos (bloqueo real)

### 1. Patient documents

**Archivo:** `src/components/containers/documents/use-documents.tsx`  
**Estado:** El site ya usa `usePatientDocumentsQuery`, `useUploadDocumentMutation`, `useDeleteDocumentMutation`. El bloqueo es el **backend** — no hay storage (S3/R2) ni endpoints `POST /patients/:uuid/documents` / `GET /patients/:uuid/documents` implementados.  
**Bloqueo:** API — feature sin diseñar.

---

### 2. Settings — campos sin DB

**Archivo:** `src/pages/settings/index.tsx`  
**Campos:** Razón Social, ID Fiscal, Ciudad, Teléfono, Dirección, Sitio Web, Registro Sanitario, Firma del Representante.  
**Estado:** UI scaffolding. `businessName` y `businessType` sí se guardan. El resto requiere columnas nuevas en `Tenant` + migración.  
**Bloqueo:** API — schema de DB.

---

### 3. Profile — campos sin DB

**Archivo:** `src/pages/profile/index.tsx`  
**Campos:** Cédula Profesional, Universidad, Sub-especialidad, Firma digitalizada.  
**Estado:** UI scaffolding. `fullName`, `phoneNumber`, `specialty` sí se guardan y pre-llenan. El resto requiere columnas nuevas en `User` + migración.  
**Bloqueo:** API — schema de DB.

---

### 4. Report template

**Archivo:** `src/pages/report-template/create.tsx` + `src/components/containers/report-template/form-report-template.tsx`  
**Estado:** Muestra "Esta funcionalidad está en desarrollo". No hay modelo en DB, endpoint, ni diseño definido.  
**Bloqueo:** Feature completa sin especificar (P3-4).

---

### 5. `warrantyExpiration` — mantenimientos sin datos

**Archivo:** `src/components/containers/patients/patients-detail/use-patient-detail.ts`  
**Estado:** Ya conectado a `GET /maintenance/patient/:uuid`. Muestra `'Sin programar'` cuando no hay mantenimientos registrados — comportamiento correcto, no un mock. Se llenará cuando se creen mantenimientos desde el sistema.

---

## ✅ Resueltos (ya conectados al API)

| # | Feature | Resolución |
|---|---------|-----------|
| AppointmentTypes list | `src/containers/appointment-types/` | `GET /appointment-types` conectado |
| AppointmentType create | `use-appointment-type-form.tsx` | `POST /appointment-types` conectado |
| Services catalog en create-appointment | `use-add-appointment.ts` | Usa UUIDs reales desde `GET /appointment-types` |
| Manage appointment | `use-manage-appointment.tsx` | `GET + PATCH /appointments/:uuid` conectados |
| User detail | `src/pages/users/[uuid]/` | `GET /users/:uuid` conectado |
| User edit | `src/pages/users/edit/[uuid]/` | `PATCH /users/:uuid` conectado |
| New medical control | `use-new-control.ts` | `POST /medical-controls` conectado |
| Control detail — gender/bloodType | `use-control-detail.ts` | Lee de `Patient.gender` / `Patient.bloodType` (ya en DB) |
| Patient summary — lastVisit/mainDiagnosis | `use-patient-summary-header.ts` | Desde `GET /medical-controls/patient/:uuid` |
| Settings — guardar | `settings/index.tsx` | `PATCH /tenants/:uuid` + `useUpdateTenantMutation` |
| Profile — guardar + pre-llenar | `profile/index.tsx` | `PATCH /users/:uuid` + `phoneNumber`/`specialty` desde sesión |
| Report template auth guard | `report-template/create.tsx` | `authorizeServerSidePage()` presente |
