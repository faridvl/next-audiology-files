# STATUS.md
> Documento vivo. Reemplaza CHANGES.md + PENDING.md.
> Actualizar al cierre de cada etapa (antes de `git push`).
> Esfuerzo: XS (<1h) · S (1-4h) · M (1-2d) · L (3-5d)
> Prioridad: P0 roto ahora · P1 MVP · P2 post-MVP · P3 nice-to-have

---

## 🎯 Próximo paso

**Branch activo:** `main`  
**Última etapa completada:** Settings/Profile/ReportTemplate: sección Legal oculta en Settings, specialty como Select en Profile, label "Nueva Contraseña", esqueleto profesional en `/report-template/create`.  
**Siguiente:** Investigar error 500 en upload de logo (`POST /upload/tenants/:uuid/logo`) — problema en StorageService/R2 en API, no en el site.

---

## 📋 Pendientes

### 🔴 P0 — Roto ahora
| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P0-1 | **Upload de documentos error 500** | XS | API | `POST /patients/:uuid/documents` devuelve 500. Probablemente StorageService R2 no configurado en producción o credenciales faltantes. El código del site es correcto. |

---

### 🟠 P1 — MVP

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| ~~P1-1~~ | ~~**Soft delete de pacientes**~~ | — | — | ✅ Completado. `isActive`/`deletedAt` en schema, `DELETE /patients/:uuid`, botón con confirmación en patient-detail. |
| ~~P1-5~~ | ~~**Patient documents: UI listado**~~ | — | — | ✅ `DocumentsContainer` conectado en patient-detail. Falta endpoint `GET /patients/:uuid/documents` en API para persistir URLs. |
| P1-6 | **Filtro/cambio de estado en citas en lote** | S | Site | UI de `statusFilter` existe. Falta acción de cambio por ítem desde la lista. |

---

### 🟡 P2 — Post-MVP importante

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| ~~P2-1~~ | ~~**UI múltiples audífonos (PatientDevice)**~~ | — | — | ✅ `DevicesPanel` colapsable en patient-detail. Lista, agrega y elimina audífonos por oído. |
| P2-4 | **Snapshot de plantilla al guardar control** | M | API | Al crear `MedicalControl`, copiar el contenido de las preguntas en `clinicalData` para que cambios futuros a la plantilla no alteren registros históricos. Sin nuevo modelo — solo guardar el snapshot en el JSON. |
| ~~P2-5~~ | ~~**Nota de corrección en controles**~~ | — | — | ✅ `PATCH /medical-controls/:uuid/correction-note`. UI inline amber en control-detail. |
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

- **Settings / Profile / Report Template:** Sección "Validación y Firmas" oculta en Settings (sin endpoint en API). Perfil: specialty cambiada a `<select>` con `UserSpecialty` enum (AUDIOLOGY/DENTAL/GENERAL), label "Contraseña Temporal" → "Nueva Contraseña". `/report-template/create`: esqueleto completo con secciones Datos Generales (título, categoría, descripción) y Contenido (textarea grande con hint de variables). Claves i18n agregadas en `es.json` e `i18n.ts`.

- **Módulo Usuarios — mejoras UX:** Listado sin InfoTooltip, búsqueda funcional (placeholder correcto), columna Teléfono agregada (`phoneNumber` en `User` type). Página de detalle renombrada a "Detalle de Usuario". Edición rediseñada con secciones separadas (Datos Personales / Acceso / Perfil Profesional), campo teléfono editable, especialidad como `<select>` usando `UserSpecialty` enum (AUDIOLOGY / DENTAL / GENERAL). TypeScript limpio. Claves i18n `users.detail.*` y `users.edit.*` en `es.json` + `i18n.ts`.

- **Refactor UI consulta médica:** Layout full-width (sin `max-w-2xl`) en Control, Audiograma, Mantenimiento y Resumen. `MedicalHistorySidebar` integrado en Control Clínico (columna lateral XL). Fix 400 en `POST /medical-controls`: `DENTAL` specialty mapeada a `GENERAL` (API no tiene schema DENTAL aún). `resize-none` en todos los textareas de la consulta. Audiograma rediseñado con frecuencia header compartido, inputs con color-coding por oído (rojo/azul), indicadores de valor lleno, footer con leyenda.
- **Edad del paciente en header:** Calculada desde `birthDate` con `calculateAge()`. Se muestra junto a cédula/teléfono/correo en el header de la ficha. Clave i18n `patients.detail.ageYears`.
- **Detalle expandible de mantenimientos:** Filas en `/maintenance` ahora son expandibles (click expande inline) mostrando fecha realizada, fecha próximo mantenimiento, descripción completa, realizado por, y botón "Ver ficha del paciente".

- **Ficha del paciente — mejoras UX:** Header muestra `documentId` (cédula) en lugar de UUID corto. Cards de stats tienen botones de acción rápida: "Agendar cita" y "Programar mantenimiento" (este último solo si no hay mantenimientos).
- **Fix LinkDevice:** Protegido `product.sku ?? ''` en el filtro (prevenía TypeError si sku era null). El modal ahora invalida `getPatientDetail` al confirmar para que el botón se actualice de "Vincular" → "Cambiar".
- **Editar Paciente:** Bug de género corregido (`gender: patient?.gender ?? ''`). Campo de cédula visible pero bloqueado/disabled en el formulario.
- **Mantenimientos:** Filas ahora son `<button>` clicables que navegan al detalle del paciente. Botón "Volver al paciente" aparece cuando se llega desde la ficha (`?fromPatient=:uuid`). StatCard de mantenimientos usa `navigation.maintenance.listFromPatient(id)`.
- **Documentos:** Fix en `mapApiDocumentToItem` — usa `document.uuid` (no `document.id` que es int) para que el delete funcione contra el endpoint `/documents/:documentUuid`. El tipo `PatientDocument` ahora incluye `uuid: string`.

- **StorageModule en @project/core:** `StorageService` con Cloudflare R2 (S3-compatible). Acepta imágenes y PDFs, incluye timestamp en filename. `@Global()` — importado por identity y medical-records.
- **Upload endpoints — identity:** `POST /upload/tenants/:uuid/logo`, `/upload/users/:uuid/signature`, `/upload/users/:uuid/avatar`. Sube a R2 y actualiza el campo en DB.
- **Upload endpoints — medical-records:** `POST /upload/patients/:uuid/audiometrias|imagenes|informes`. Solo sube, no persiste URL (documentos aún sin listado).
- **Upload real en site:** Settings sube logo a R2 directo. Profile sube firma a R2. Ambas páginas actualizadas.
- **Soft delete de pacientes:** `DELETE /patients/:uuid` (204). `GET /patients?includeInactive=true` muestra activos+inactivos. UI en patient-detail con confirmación (solo OWNER/ADMIN).
- **PatientDevice (múltiples audífonos):** Modelo migrado con `side`, `brand`, `model`, `serialNumber`, `warrantyUntil`. Endpoints `GET/POST /patients/:uuid/devices` + `DELETE /patients/:uuid/devices/:deviceUuid`.
- **correctionNotes en controles:** `PATCH /medical-controls/:uuid/correction-note`. UI inline en control-detail con confirmación tipo amber.
- **Logo y firma en PDF:** `MedicalControlReport` muestra `<Image>` con logo en header y firma encima de la línea de firma en footer. Props `logoUrl` y `signatureUrl` inyectados desde sesión.

- **Auditoría pre-producción:** Login sin credenciales hardcodeadas, forgot-password con aviso honesto, registro flujo directo (sin PaymentStep falso), tablas responsive en ficha, validación de teléfono ampliada.
- **Bug sesión expirada:** `ApiServiceClient` intercepta 401, limpia cookies y redirige a `/login?expired=true` con alerta amber.
- **Bug WhatsApp:** Quitar número hardcodeado `88165808`. Si paciente no tiene teléfono muestra toast de error.
- **StatCards patient-detail:** "Próx. mantenimiento" y "Mantenimientos" con datos reales de API y navegación a `/maintenance`.
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

## 🔍 Pendientes menores conocidos

| Feature | Archivo | Notas |
|---------|---------|-------|
| `GET /patients/:uuid/documents` | API (medical-records) | Endpoint no existe aún. El site llama a este endpoint — devolverá 404 hasta que se implemente. La subida de documentos sí funciona. |
| Report template | `src/pages/report-template/create.tsx` | Feature sin diseñar, P3. |
| Patient bloodType en summary | `use-patient-summary-header.ts` | Hardcodeado como 'O+'. Campo existe en DB. |
