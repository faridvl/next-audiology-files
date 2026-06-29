# STATUS.md
> Documento vivo. Reemplaza CHANGES.md + PENDING.md.
> Actualizar al cierre de cada etapa (antes de `git push`).
> Esfuerzo: XS (<1h) · S (1-4h) · M (1-2d) · L (3-5d)
> Prioridad: P0 roto ahora · P1 MVP · P2 post-MVP · P3 nice-to-have

---

## 🎯 Próximo paso

**Branch activo:** `main`  
**Última etapa completada:** Guards de especialidad en API, filtro timeline por tipo, selector de plantillas, signatureUrl + logoUrl en esquema Identity (migración aplicada), roles en sidebar/nav, typecheck limpio en ambos repos.  
**Siguiente:** Mejoras que requieren migraciones de Medical Records (soft delete pacientes, múltiples audífonos, notas de corrección) — confirmar con cliente antes de tocar esquema. O conectar PDF con logo + firma del médico.

---

## 📋 Pendientes

### 🔴 P0 — Roto ahora
_Ninguno conocido._

---

### 🟠 P1 — MVP

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P1-1 | **Soft delete de pacientes** | M | API+Site | `Patient` en Medical Records no tiene `isActive`/`deletedAt`. Agregar campos + migración + filtro en `GET /patients` + botón "Desactivar" en patient detail. |
| P1-5 | **Patient documents: diseño + infraestructura** | L | API+Site | `handleUpload`/`handleDelete` son console.log. Requiere storage (S3/R2) + endpoints `POST/GET /patients/:uuid/documents`. |
| P1-6 | **Filtro/cambio de estado en citas en lote** | S | Site | UI de `statusFilter` existe. Falta acción de cambio por ítem desde la lista. |

---

### 🟡 P2 — Post-MVP importante

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P2-1 | **Múltiples audífonos por paciente (PatientDevice)** | M | API+Site | `Patient.linkedProductUuid` es un solo string. Cliente confirmó que puede tener OD+OI por separado. Requiere modelo `PatientDevice` + historial de mantenimiento por dispositivo. |
| P2-2 | **Conectar logo y firma al PDF** | M | Site | `tenant.logoUrl` y `user.signatureUrl` ya existen en DB y se exponen en sesión. Falta leerlos desde el contexto del PDF (`MedicalControlReport`) e insertarlos en el template. |
| P2-4 | **Snapshot de plantilla al guardar control** | M | API | Al crear `MedicalControl`, copiar el contenido de las preguntas en `clinicalData` para que cambios futuros a la plantilla no alteren registros históricos. Sin nuevo modelo — solo guardar el snapshot en el JSON. |
| P2-5 | **Nota de corrección en controles** | M | API+Site | `MedicalControl` no tiene `correctionNotes`. Cliente dijo que los controles no se editan, se corrigen con una nota. Agregar campo + UI en control-detail. |
| P2-6 | **Vencimiento de garantía y próxima receta** | L | API+Site | Sin diseño. Requiere campos nuevos en `Patient` o modelo separado. |
| P2-7 | **Indicador de pacientes inactivos** | M | API+Site | Calcular desde último control/cita. Badge/filtro en lista de pacientes. |
| P2-8 | **Reporte de consulta PDF: contenido completo** | L | Site | `PdfDownloadButton` existe. Revisar que incluya: audiograma, mantenimiento, plantilla clínica, firma del médico. |
| P2-9 | **Calendar: Google / Apple** | S | Site | `generateCalendarLink()` existe en `use-appointment-detail-panel.ts`. Solo exponer desde UI. |
| P2-10 | **i18n: eliminar texto quemado restante** | L | Site | Tarea transversal. Por módulo gradualmente. |
| P2-11 | **Paginación global integrada** | M | Site | `pagination.tsx` tiene TODO. Listas inconsistentes. |

---

### ⚪ P3 — Nice-to-have

| # | Tarea | Esfuerzo | Notas |
|---|-------|----------|-------|
| P3-1 | **Enums tipados en DB** | M | Convertir `User.specialty`, `User.role`, `Tenant.businessType` a enums Prisma. Pre-condición: prod real con datos. |
| P3-2 | **`tenant.plan` en `GET /auth/me`** | S | `TenantDomain.plan` siempre es `undefined`. La tabla no tiene columna `plan`. |
| P3-3 | **Trabajo interdisciplinario** | XL | Paciente compartido entre especialidades. Requiere diseño de permisos. |
| P3-4 | **Report template: diseño completo** | XL | `src/pages/report-template/create.tsx` es UI estática sin endpoint. |
| P3-5 | **Tenant initialization event** | XL | Cuando Identity crea Tenant, emitir evento para inicializar datos por defecto en Medical Records. |
| P3-6 | **Sedes como modelo real** | XL | `sede` en Patient es string libre. Un modelo `Sede` con relaciones permitiría multi-sede real. Diseño mayor para después de MVP. |

---

## ✅ Completado (últimas etapas)

- **Guard de especialidad en listado:** `GET /medical-controls/patient/:uuid` ahora filtra por `user.specialty` del JWT. Antes devolvía todos sin filtrar.
- **Filtro de timeline por tipo:** patient-detail ahora muestra Todos / Controles / Audiogramas / Mantenimientos. Los mantenimientos se mezclan en el mismo timeline.
- **Selector de plantilla en consulta:** nuevo endpoint `GET /clinical-templates/speciality/:s/all` devuelve array. Site muestra dropdown cuando hay >1 plantilla activa.
- **signatureUrl en User:** campo agregado a schema Identity, migración aplicada, expuesto en `GET /auth/me`, enviado en `PATCH /users/:uuid`, con URL text input en Profile.
- **logoUrl en Tenant:** campo agregado a schema Identity, migración aplicada, expuesto en `GET /auth/me`, enviado en `PATCH /tenants/:uuid`, con preview en Settings.
- **Roles en sidebar:** `NAVIGATION_PATHS` tiene `allowedRoles`. Sidebar y MobileBottomNav filtran por `user.role`. Botón "Iniciar consulta" oculto para STAFF.
- **Consulta multi-página:** Hub de consulta (index.tsx) + subpáginas control/audiograma/mantenimiento/resumen. `ConsultaSessionStorage` para progreso cross-page.
- **PRODUCT_QA.md actualizado:** Respuestas del cliente documentadas para todos los módulos.
- **Registro multi-especialidad (Opción B):** `RegisterTenantDto` con `businessType`, `isSpecialist`, `specialty`, `phone`. Cards de tipo de clínica.
- **Fix PDF `useSyncExternalStore`:** `PdfDownloadButton` solo via `dynamic({ ssr: false })`.
- **Audiograma captura:** `grid-cols-7`, modal con `preserveAspectRatio`.
- **Tipos `Patient`:** `gender`, `bloodType`, `documentId`, `occupation` integrados.
- **Settings:** `useUpdateTenantMutation` conectada — botón "Actualizar Clínica" funcional. ✅
- **AppointmentTypes CRUD:** `GET/POST /appointment-types` + listado y form en site.
- **Manage appointment:** `GET + PATCH /appointments/:uuid` conectados.
- **New control (v2):** Conectado a `POST /medical-controls`. Badge especialidad.
- **Patient detail:** `lastVisit` y `mainDiagnosis` desde controles reales.
- **Delete appointment:** `DELETE /appointments/:uuid` habilitado.
- **followUp:** Persiste en `MedicalControl.followUp Json?`.
- **Multi-especialidad:** `businessType` en `GET /auth/me`.
- **Users CRUD:** `GET/PATCH/DELETE /users/:uuid` en API y site.
- **Dashboard:** 3 métricas reales + agenda conectada.
- **Login error handling:** "Failed to fetch" → mensaje amigable en español.
- **PatientBackground + Maintenance:** Modelos, endpoints, mutations y queries completos.

---

## 🔍 Mocks conocidos pendientes de integración

| Feature | Archivo | Bloqueo |
|---------|---------|---------|
| Patient documents | `src/components/containers/documents/use-documents.tsx` | Sin endpoint ni storage definido |
| Report template | `src/pages/report-template/create.tsx` | Feature sin diseñar |
| Logo/firma upload real | Settings + Profile | `logoUrl` y `signatureUrl` se guardan como URL texto. Upload real a archivo requiere S3/R2 — pendiente de configurar. |
| Patient bloodType en summary | `use-patient-summary-header.ts` | Campo existe en DB, falta leerlo del query |
