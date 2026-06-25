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
| P0-6 | **Bug: WhatsApp envía mensajes al número `88165808` en vez del paciente** | S | Site + API | `GET /appointments/patient/:uuid` solo retorna `{ uuid, name }` sin `phone`. Site usa número hardcodeado como fallback. Requiere que el API incluya `phone` en esa respuesta. |
| P0-7 | **Bug: form de nueva cita envía UUID falso `8e3677b3-...` como `typeUUID`** | — | Site | No tiene fix posible hasta que existan los endpoints de `AppointmentType` en el API. Documentado para no olvidar. Ver P1-3. |

---

## 🟠 P1 — MVP: flujo clínico completo

### Flujo de citas (prioridad máxima del cliente)

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P1-1 | **Manage appointment: cargar datos reales + confirmar/reagendar** | M | Site | Conectar `GET /appointments/:uuid` y `PATCH /appointments/:uuid`. Endpoints ya existen. Solo falta conexión en `use-manage-appointment.tsx`. |
| P1-2 | **Flujo post-control: cita tentativa → llamada → confirmada/pendiente** | M | Site | El flujo ya está diseñado en `use-manage-appointment.tsx` (handleNoAnswer, handleConfirm) pero sin API real. Depende de P1-1. |
| P1-3 | **AppointmentTypes CRUD: `GET/POST /appointment-types`** | L | API → Site | Tabla en DB ya existe. Implementar endpoints en API, luego conectar lista + form en site + selector en nueva cita. Desbloquea P0-7. |
| P1-4 | **Cambiar estado de citas en lote / filtrar por estado** | S | Site | El filtro por estado ya existe en la UI (`statusFilter`). Falta: acción de cambio masivo de estado. Puede ser solo front si se hace cita por cita. |
| P1-5 | **Registro de intentos de llamada en cita** | M | API + Site | Al hacer "No contestó" → guardar en `notes` con timestamp + contador. API: `PATCH /appointments/:uuid` ya acepta `notes`. Solo es convención de formato. |
| P1-6 | **Cambio automático de mes si no contesta** | S | Site | Lógica en `handleNoAnswer`: sumar 1 mes + status PENDING. Ya hay código esqueleto, solo falta conectar al PATCH real. Depende de P1-1. |

### Controles médicos

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P1-7 | **Conectar form de nuevo control (v2) al API** | M | Site | `use-new-control.ts handleSave` → solo `console.log`. Mutation `medical-control-mutation.ts` ya existe pero no está importada. Los textareas tampoco tienen `value`/`onChange` — hay que vincular estado del form. |
| P1-8 | **Ver última audiometría en detalle de paciente** | S | Site | Usar `GET /medical-controls/patient/:uuid` (existe) + filtrar el más reciente con `speciality = AUDIOLOGY`. Mostrar datos del audiograma. |
| P1-9 | **`followUp`: persistir en API** | XS | API | Solo descomentar el bloque de storage en el controlador de `POST /medical-controls`. El site ya lo envía. |

### Pacientes

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P1-10 | **Verificar y corregir form de creación de paciente** | S | Site | El form tiene campos `name`, `id`, `nationality`, `employmentArea`. API espera `firstName`, `lastName`, `birthDate`, `address`. Hay mismatch probable — verificar `use-patient-form.ts` y el payload real que se envía. |
| P1-11 | **Vista detalle de paciente completa** | M | Site | Completar `patient-detail-container.tsx`: mostrar datos reales, última visita, último diagnóstico (de `GET /medical-controls/patient/:uuid`). Hoy tiene datos hardcodeados en patient summary. |
| P1-12 | **`DELETE /appointments/:uuid` — descomentar en API** | XS | API | `DeleteAppointmentUseCase` ya existe importado. Solo descomentar la entrada en el constructor del controlador. Habilita cancelar citas. |

### Usuarios y perfil

| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P1-13 | **Perfil del médico: cargar datos reales** | S | Site | `GET /auth/me` ya existe y retorna datos del usuario. Conectar al form de perfil para pre-llenar. El guardado espera `PATCH /users/:uuid`. |
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
