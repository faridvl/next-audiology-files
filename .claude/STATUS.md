# STATUS.md
> Documento vivo. Reemplaza CHANGES.md + PENDING.md.
> Actualizar al cierre de cada etapa (antes de `git push`).
> Esfuerzo: XS (<1h) · S (1-4h) · M (1-2d) · L (3-5d)
> Prioridad: P0 roto ahora · P1 MVP · P2 post-MVP · P3 nice-to-have

---

## 🎯 Próximo paso

**Branch activo:** `main`

### 📌 EN CURSO — Reestructuración de Pacientes / Expediente

**S1 — Unificar formularios de paciente: ✅ Completada** (2026-07-26).
**S2 — Lista de pacientes: ✅ Completada** (2026-07-26).
**S3 — P0 del expediente: ✅ Completada** (2026-07-26).
**S7 — Expediente en 3 niveles (solo UI): ✅ Completada** (2026-07-27). Plan de sesiones S1–S7 **cerrado**.

| Doc | Qué contiene |
|---|---|
| [SESIONES.md](SESIONES.md) | **Prompts de arranque + checklist de pruebas por sesión** |
| [PLAN_PACIENTES.md](PLAN_PACIENTES.md) | Plan por sesiones S1–S7 |
| [DOMAIN_ANALYSIS.md](DOMAIN_ANALYSIS.md) | Qué es un expediente, bugs verificados, investigación clínica |
| [ROADMAP.md](ROADMAP.md) | Orden general de todo el sitio |
| [PLAN_AGENDA.md](PLAN_AGENDA.md) | Rediseño de citas (después del expediente) |

**S8 — Rediseño UX del expediente + audiograma profesional: ✅ Completada** (2026-07-28).

**Panel de visita — se acabó el wizard.** El flujo anterior (botón → hub `/consulta` → subpágina por paso → volver al hub → resumen) exigía **mínimo 7 navegaciones** y hacía perder de vista el expediente justo cuando se escribe la nota. Ahora "Registrar visita" abre un **drawer sobre el expediente** (`consulta/visit-panel.tsx`): las tres acciones (nota clínica / audiograma / mantenimiento) son opcionales y sin orden — que es lo que una visita realmente es (un contenedor, no una secuencia). Los tres contenedores de paso aceptan `isEmbedded` + `onSaved`/`onCancel`, así que **las páginas viejas siguen funcionando** como fallback y las URLs no se rompen. El `MedicalHistorySidebar` duplicado dentro del control ya no se monta en el drawer: el expediente está detrás. Ancho adaptativo (480px lista → 620/760px con formulario abierto), pantalla completa en móvil.

**Expediente reordenado por uso, no por taxonomía.** Los tres niveles de S7 eran el modelo de datos correcto, pero mala pantalla: había que scrollear stat cards y paneles antes de llegar a lo que pasó. Ahora: **Cronología primero** (es el 80% de las lecturas), **contexto clínico colapsado** al final (antecedentes/audífonos se consultan al atender, no en cada lectura), y las **3 stat cards eliminadas** → reemplazadas por una **línea de alertas** que solo aparece cuando hay algo accionable (sin cita próxima, mantenimiento vencido, antecedentes positivos). "Iniciar consulta" → "Registrar visita" (`Encounter` ya nombraba así el concepto).

**🔴 Audiograma reconstruido — el anterior estaba clínicamente mal y roto.** Bugs corregidos:
- **Clicks descolocados:** el SVG tenía `viewBox="0 0 100 100"` con `aspectRatio: 7/5` y `preserveAspectRatio="meet"` → el contenido quedaba *letterboxed* y las coordenadas del puntero (medidas sobre `getBoundingClientRect`) no correspondían a las del viewBox. Ahora el viewBox incluye los márgenes de ejes y la conversión puntero→dato usa `getScreenCTM().inverse()`, robusta ante cualquier escala.
- **Eje lineal → logarítmico:** en un audiograma la distancia 125→250 Hz (una octava) debe igualar 4000→8000. El eje lineal comprimía los graves y deformaba la curva.
- **Faltaban las interoctavas:** ahora 125–8000 Hz completas, incluidas 750, 1500, 3000 y 6000.
- **Símbolos ASHA 1990 reales:** dibujados como **formas SVG** (`audiogram-symbol.tsx`), no caracteres de texto (`○ × [ ]`) que dependían de la fuente y no centraban. O/X aéreo sin enmascarar, △/▢ enmascarado, `<`/`>` óseo, `[`/`]` óseo enmascarado, más flecha de "sin respuesta". La **forma basta sin color** (impresión b/n, deuteranopía ~8% de hombres — y rojo/azul es justo el par problemático).
- **Faltaban campos críticos:** `isMasked` y `isNoResponse` (DOMAIN_ANALYSIS §3.2: *"60 dB sin enmascarar y 60 dB enmascarado no son el mismo dato clínico"*), y vía ósea persistida — antes `ConductionType` existía pero nunca se guardaba.
- **Escala configurable:** `classifyHearingLoss` usa WHO 2021 (corte 20 dB) o BIAP, y el `Study` **guarda qué escala** produjo la clasificación — sin eso los datos históricos quedan irreinterpretables. Los "sin respuesta" se imputan a 120 dB en el PTA (criterio BIAP) en vez de descartarse.

**Compatibilidad sin migración de datos:** `parseAudiometryPayload` (`shared/utils/audiometry.ts`) lee tanto los umbrales tipados nuevos como la forma legacy `{OD:{'1000':'20'}, OI:{}}` — los registros viejos se muestran como vía aérea sin enmascarar. Consumidores actualizados: tarjeta del expediente, `use-pdf-report.ts` y `control-detail.tsx`.

**Código muerto eliminado:** `common/audiogram-chart/`, `containers/audiogram-modal/` y `containers/audiogram-capture/` — reemplazados por `common/audiogram/` (chart + símbolos) y `containers/audiogram-editor/`. Las páginas huérfanas `new-control`/`new-control-v1` (`/controls/[id]`, sin ruta de navegación activa) se migraron al editor nuevo en vez de mantener un segundo componente en paralelo. `yarn lint` y `tsc --noEmit` limpios.

**S7 — Expediente en 3 niveles (solo UI, sin migraciones): ✅ Completada** (2026-07-27). `/patients/[uuid]` (`patient-detail-container.tsx`) reestructurado en los tres niveles de cardinalidad distinta de NOM-004 (DOMAIN_ANALYSIS.md §4.8): **Identidad** (header del paciente, siempre visible), **Estado clínico** (`BackgroundPanel` + `DevicesPanel` agrupados bajo un encabezado "Estado clínico" — antes paneles sueltos entre medio), **Cronología** (timeline por encuentro + Documentos bajo un encabezado "Cronología" — Documentos deja de ser apéndice al final, pasa a ser sección principal junto al timeline, sin exigir elegir un encuentro al subir, ya lo hacía bien `DocumentsContainer`). **Multi-especialidad (§7.5):** nuevo `isAudiologyTenant` (`tenant.businessType === BusinessType.AUDIOLOGY`) oculta `DevicesPanel`, los StatCards de mantenimiento, y el filtro/card de audiograma para tenants no-audiología — antes una clínica de psicología vería "Vincular audífono" sin sentido. **`/ficha` (§7.4) reescrita:** dejó de tener sus propias queries duplicadas (`useMedicalControlsQuery`, `usePatientBackgroundQuery` sueltas) — ahora consume `usePatientDetail` (mismo hook que el expediente en pantalla), agregando solo `loadMore()` en bucle para traer el historial completo (la ficha es copia íntegra del expediente, Ley 8239 art. 2.k — a diferencia de la vista en pantalla, que pagina). Se agregó sección de Documentos a la ficha (antes ausente) y la tabla de controles pasó a listar la cronología agrupada (incluye audiogramas y mantenimientos, antes solo `MedicalControl`). Migrados los `<p>`/`<h2>`/`<span>` de `ficha.tsx` a `Typography` (PATTERNS #14, archivo reescrito por completo). `yarn lint` y `tsc --noEmit` limpios — solo warnings preexistentes no relacionados.

**S6 — Modelo `Study` (API + site): ✅ Completada** (2026-07-27). Modelo `Study` nuevo en `standard-saas-api` (`packages/medical-records`) — `uuid`, `encounterUuid`, `patientUuid`, `tenantUuid`, `autorUuid`, `tipo` (`AUDIOMETRIA_TONAL` | `TEST_PSICOMETRICO`), `payload: Json`, `documentUuid?`. Migración `20260727180000_add_study` aplicada (tabla nueva, aditiva — no toca `MedicalControl`). Endpoints: `POST /studies`, `GET /studies/patient/:uuid`, `GET /studies/:uuid`. Mismo gate STAFF 403 que `encounters`/`medical-controls`. **Inmutable por diseño**: `StudyStorage` no tiene método `update` — repetir una medición crea un `Study` nuevo (append-only, NOM-004 5.11). `GET /encounters/:uuid` ahora también devuelve `studies: Study[]` anidados.

**Site — el audiograma deja de ser un `MedicalControl` falso:** `consulta-audiograma-container.tsx` reescrito — ya no envía `diagnosis: "Audiograma"` ni `findings: { audiogram, type: 'audiogram-only' }`. Ahora llama `POST /studies` con `tipo: AUDIOMETRIA_TONAL` y `payload: { OD, OI }`. Se agregó **adjuntar archivo** (PDF/imagen, opcional) — si Matthew ya tiene el audiograma del equipo, lo sube como `PatientDocument` (categoría `EXTERNAL_TEST`) y el `Study` queda con `documentUuid` apuntando a ese archivo; los valores clave (PTA/umbrales) siguen siendo capturables a mano en el mismo formulario. Nuevos archivos: `types/studies/study.types.ts`, `querys/studies-query.ts`, `mutations/studies/create-study-mutation.ts`.

**Site — consumidores de `findings.audiogram` migrados a `Study`:** `consulta-container.tsx` y `consulta-resumen-container.tsx` detectan el audiograma guardado vía `encounterDetail.studies` (antes: `medicalControls[].findings.audiogram`). `use-patient-detail.ts` construye `latestAudiogram` y el filtro de timeline `AUDIOGRAM` desde `GET /studies/patient/:uuid`, no desde controles — un audiograma es ahora un ítem de timeline propio (tipo `'AUDIOGRAM'`) que se agrupa por encuentro igual que controles y mantenimientos, pero no navega a un detalle de control (no es un `MedicalControl`). `use-pdf-report.ts` busca el `Study` cuyo `encounterUuid` coincide con el del control impreso y lee el audiograma de ahí; si no hay `Study` (registro creado antes de esta migración), cae al fallback legacy `findings.audiogram` — **sin migración de datos existentes** (decisión tomada).

**⚠️ Deuda identificada, no resuelta en esta etapa:** `control-detail.tsx`/`use-control-detail.ts` (la página de detalle de un `MedicalControl`) sigue leyendo `findings.audiogram` — correcto únicamente como fallback para registros anteriores a S6, ya que los controles nuevos nunca vuelven a llevar audiograma. `new-control/` y `new-control-v1/` (`/controls/[id]`, sin ruta de navegación activa — huérfanos, DOMAIN_ANALYSIS.md §2.5) tampoco se tocaron: siguen creando el `MedicalControl` con `findings.audiogram` si se usan, pero no son alcanzables desde la navegación actual.

**S4 — `Encuentro` + append-only (API + site): ✅ Completada** (2026-07-27). Modelo `Encounter` en `standard-saas-api` (`packages/medical-records`), migración `20260727120000_add_encounter` aplicada. Endpoints: `POST /encounters`, `GET /encounters/patient/:uuid`, `GET /encounters/:uuid` (con `medicalControls` + `maintenances` anidados), `PATCH /encounters/:uuid/close`. Mismo gate STAFF 403 que `medical-controls`. Append-only verificado: `MedicalControlStorage` solo tiene el `update` de `addCorrectionNote` (nunca reescribe `findings`/`diagnosis`) y `MaintenanceStorage` es create-only.

**API — `encounterUuid` expuesto en creación (gap encontrado y cerrado en esta etapa):** la columna `encounterUuid` existía en DB desde la migración anterior, pero ningún DTO/use-case/storage la aceptaba en create — quedaba siempre `null`. Se agregó a `create-medical-control.dto.ts` (`header.encounterUuid`, ambos schemas AUDIOLOGY/GENERAL), `maintenance.dto.ts` (`encounterUuid` top-level), sus use-cases, storages (`MedicalControlStorage.save`, `MaintenanceStorage.save`) y entities. `tsc --noEmit` limpio en `packages/medical-records`.

**Site — consumo de `Encounter`, reemplazo de `sessionStorage`:** `consulta-session.ts` **eliminado**. Nuevo `useActiveEncounter` (`consulta/use-active-encounter.ts`) resuelve el encuentro activo del paciente: reanuda uno `OPEN` existente o crea uno nuevo vía `POST /encounters` — nunca duplica. `encounterUuid` viaja como query param entre las páginas de consulta (`routes.ts`/`use-navigation.ts` actualizados: `consultaControl`/`consultaAudiograma`/`consultaMantenimiento`/`consultaResumen` ahora requieren `encounterUuid`). Los tres pasos (`control`, `audiograma`, `mantenimiento`) envían `encounterUuid` en el payload de creación. "Finalizar" (`consulta-resumen-container.tsx`) ahora llama `PATCH /encounters/:uuid/close` en vez de limpiar `sessionStorage`. Nuevos archivos: `querys/encounters-query.ts`, `mutations/encounters/create-encounter-mutation.ts`, `mutations/encounters/close-encounter-mutation.ts`.

**BUG QUE ESTO ARREGLA:** guardar un audiograma ya no sobrescribe el control de la misma visita — antes vivían como banderas sueltas en `sessionStorage` (`savedControlUuid`, `savedAudiogram`) que se pisaban entre sí; ahora ambos cuelgan del mismo `encounterUuid` en DB y se leen desde `GET /encounters/:uuid`.

**Site — timeline agrupado por encuentro:** `use-patient-detail.ts` agrega `groupedHistory` (nuevo tipo `EncounterGroup`), construido cruzando `GET /encounters/patient/:uuid` con los controles/mantenimientos ya cargados por `encounterUuid`. `patient-detail-container.tsx` reemplaza el listado plano por `EncounterGroupRow`: una fila por visita si contiene más de un registro (expandible), o la fila simple de siempre si el encuentro tiene un solo registro. Registros anteriores a esta migración (`encounterUuid: null`) se muestran sueltos, sin agrupar — no hay encuentro real al que asociarlos retroactivamente.

**Siguiente:** Plan S1–S7 + rediseño UX (S8) **completo**. Pendiente de verificar en uso real: precisión del audiograma en iPad con lápiz/dedo, y si Matthew prefiere adjuntar archivo antes que marcar umbrales (§4.7 — el adjunto es el flujo principal, la captura es complemento). Revisar [ROADMAP.md](ROADMAP.md) para la próxima etapa del sitio (agenda — ver [PLAN_AGENDA.md](PLAN_AGENDA.md) — o psicología, Etapa 4 del roadmap). Deuda conocida sin resolver: `control-detail.tsx` (detalle de un `MedicalControl`) sigue sin gate STAFF explícito en `/ficha`, igual que antes de S6/S7 — no es una regresión de estas sesiones, ver `use-patient-detail.ts` / `canReadClinicalData` si se aborda.

**Decisiones tomadas:** append-only sí · psicología en el MVP · sin offline · sin producción (sin migración de datos) · el expediente es del paciente, no del médico · email opcional

**Bugs P0 verificados en S3:**
- ✅ El audiograma del PDF **ya no sale con guiones** — `use-pdf-report.ts` ahora lee la forma `{ OD: {freq: string}, OI: {freq: string} }` que realmente se persiste
- ✅ El filtro por especialidad **ya no fragmenta el expediente** — quitado en site (`use-patient-detail.ts`) y API (`find-all-medical-controls.use-case.ts`, `medical-control.controller.ts` `findOne`). `selectedSpec` sigue existiendo como preferencia de vista, no como restricción
- ✅ STAFF (recepción) **ya no puede leer notas clínicas ni antecedentes** — API devuelve 403 en `GET /medical-controls/patient/:uuid`, `GET /medical-controls/:uuid`, `GET/PUT /patients/:uuid/background`; site oculta esas secciones y no dispara esas queries para STAFF (`canReadClinicalData` en `patient-detail-container.tsx`). STAFF sigue viendo agenda, contacto y documentos
- 🟡 Documentos: `POST /patients/:uuid/documents` sigue devolviendo 500 — **no es código faltante, son credenciales R2 no configuradas** (ver API_CONTRACT.md #7). `GET /patients/:uuid/documents` ya existe y funciona — la entrada previa que lo daba como faltante estaba desactualizada
- 🔴 `clinical-templates` usa **localStorage**, no persiste — bloquea psicología

**Etapa previa completada:** Rediseño de inventario por número de serie — Fases 3–6 en site. Tipos, queries, mutations y UI de seriales y asignación de audífonos. TypeScript limpio. Pendiente de verificar en integración:
- `POST /products/:uuid/units/bulk` persiste los seriales al crear producto
- Modal de asignación: producto → unidad disponible → oído → confirmar
- "Devolver": `DELETE /patients/:uuid/devices/:uuid` + `PATCH /product-units/:uuid`

---

## 📋 Pendientes

### 🔴 P0 — Roto ahora
| # | Tarea | Esfuerzo | Repo | Notas |
|---|-------|----------|------|-------|
| P0-1 | **Upload de documentos error 500** | XS | Infra | `POST /patients/:uuid/documents` devuelve 500. Confirmado: `StorageService` no tiene fallback y las 5 env vars de R2 (`CF_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY`) no están declaradas ni presentes — no hay `.env` en el repo local del API. No es un bug de código: falta configurar credenciales en el entorno donde corre el API. |

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
| ~~P2-7~~ | ~~**Indicador de pacientes inactivos**~~ | — | — | ✅ Badge "Inactivo" en columna Estado de la lista de pacientes, usando `Patient.isActive` (ya existía en API vía soft delete, faltaba el tipo en site). |
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

- **S4 — `Encuentro` + append-only (API + site):** Modelo `Encounter` nuevo en `standard-saas-api/packages/medical-records` — `uuid`, `patientUuid`, `tenantUuid`, `autorUuid` (NOM-004 5.10), `especialidad`, `appointmentUuid` nullable (walk-in vs. cita sin encuentro), `startedAt`, `closedAt`, `status` (OPEN/CLOSED). Migración `20260727120000_add_encounter` aplicada. Endpoints: `POST /encounters`, `GET /encounters/patient/:uuid`, `GET /encounters/:uuid` (con `medicalControls`+`maintenances` anidados), `PATCH /encounters/:uuid/close` (idempotente). Mismo guard STAFF→403 que `medical-controls`. Verificado el requisito append-only: `MedicalControlStorage` solo actualiza `correctionNotes` (adición, nunca reescribe `findings`/`diagnosis`) y `MaintenanceStorage` nunca tuvo `update`. **Gap encontrado al integrar el site:** `encounterUuid` existía como columna en DB pero ningún DTO/use-case/storage la aceptaba en create — se agregó a `create-medical-control.dto.ts`, `maintenance.dto.ts`, sus use-cases, storages y entities. **Site:** `consulta-session.ts` (sessionStorage) eliminado. Nuevo `useActiveEncounter` reanuda un `Encounter` `OPEN` existente o crea uno nuevo — nunca duplica. `encounterUuid` viaja por query param entre páginas de consulta; los tres pasos (control/audiograma/mantenimiento) lo envían en el payload; "Finalizar" cierra el encuentro vía `PATCH`. Bug corregido: guardar un audiograma ya no sobrescribe el control de la misma visita (antes ambos vivían como banderas sueltas en sessionStorage que se pisaban). Timeline de `patient-detail` agrupado por encuentro (`groupedHistory`/`EncounterGroupRow`): una fila por visita, expandible si tiene más de un registro; registros previos a esta migración (`encounterUuid: null`) se muestran sueltos. `tsc --noEmit` limpio en ambos repos; `yarn lint` limpio en site (solo warnings preexistentes no relacionados).

- **S3 — P0 del expediente:** Cuatro bugs P0 independientes, verificados y corregidos. **(1) Filtro por especialidad:** quitado `matchesUserSpecialty` en `use-patient-detail.ts` y el filtro `speciality` del JWT en `find-all-medical-controls.use-case.ts` / `medical-control.controller.ts` (`findByPatient` y `findOne` — este último además tenía un `ForbiddenException` incorrecto que bloqueaba ver un control individual de otra especialidad). `selectedSpec` se mantiene como preferencia de vista del usuario, ya no como restricción de lectura — regla: la especialidad determina qué se crea, nunca qué se ve (NOM-004 5.14). **(2) Audiograma → PDF:** `use-pdf-report.ts` leía `audiogramData['right_1000']` con `typeof === 'number'`, pero se persiste como `{ OD: {'1000': '20'}, OI: {...} }` (anidado por oído, claves string, valores string) — unificado para leer esa forma real y convertir string→number con `parseThreshold`. **(3) Permisos STAFF:** antes solo se ocultaba el botón "Iniciar consulta"; ahora la API devuelve 403 en `GET /medical-controls/patient/:uuid`, `GET /medical-controls/:uuid` y `GET/PUT /patients/:uuid/background` cuando `user.role === 'STAFF'`, y el site no dispara esas queries para STAFF (`canReadClinicalData`, gate agregado a `useMedicalControlsQuery`/`usePatientBackgroundQuery` vía parámetro `enabled`) ni renderiza esas secciones — Documentos queda visible para STAFF por ser administrativo. **(4) Documentos:** investigado — `GET/POST /patients/:uuid/documents` **ya existen** en el API (la entrada previa que los daba como faltantes estaba desactualizada); el 500 en `POST` es config faltante (5 env vars de R2 sin declarar ni presentes), documentado en API_CONTRACT.md, no requiere cambio de código. `yarn lint` y `tsc --noEmit` limpios en site; `tsc --noEmit` limpio en `packages/medical-records` del API.

- **S2 — Lista de pacientes:** Estados vacíos diferenciados — "aún no hay pacientes registrados" (sin filtros activos) vs "sin resultados para tu búsqueda" (con búsqueda o filtro de estado aplicado), vía `hasActiveFilters` en `use-patient-list.ts`. Estado de error dedicado con botón "Reintentar" (`refetch` del query) en vez de caer en el empty state genérico. `Table` (`common/table/table.tsx`) ahora acepta `isError`, `errorState` y `emptyState` opcionales — retrocompatible para `users-list` y `appointment-list`, que siguen usando el empty state por defecto. Badge "Inactivo" en nueva columna Estado, usando `Patient.isActive` (campo agregado al tipo — ya lo devolvía la API). Columnas confirmadas: nombre, cédula, teléfono, fecha de registro, estado — suficientes para identificar un paciente. Textos vía i18n (`patients.list.empty.*`, `patients.list.error.*`, `patients.list.statusInactive`). `yarn lint` y `tsc --noEmit` limpios.

- **S1 — Unificar formularios de paciente crear/editar:** Esquema Yup compartido en `patients/patient-validation.ts` (`patientCreateValidationSchema` + `patientEditValidationSchema`, ambos derivados de campos base comunes; el teléfono se mantiene separado porque crear y editar guardan formatos distintos — `XXXX-XXXX` vs `+506 XXXX-XXXX` ya persistido). Correcciones de divergencia: `birthDate` ahora editable (antes ausente en editar); `documentId` editable con selector de tipo de documento + máscara (antes bloqueado — la API nunca almacenó `documentType`, así que editar ahora deja elegirlo igual que crear); `address` unificado a `maxLength 240` en ambos; `email` opcional en ambos (antes requerido solo al crear — decisión: el canal real es teléfono/WhatsApp). Carpeta `add-patient/` movida a `containers/patients/patient-create/`, `PatientForm` renombrado a `PatientCreateContainer`. `pages/patients/create.tsx` usa `useNavigation` en vez de `router.push` directo, y sus strings van por i18n (`patients.create.*` en `es.json` + `TEXT.PATIENTS.CREATE` en `i18n.ts`). `UpdatePatientPayload` ahora acepta `documentId` y `birthDate`. `yarn lint` y `tsc --noEmit` limpios.

- **Inventario por número de serie — Fases 3–6 (site):** Tipos `ProductUnit` + `ProductUnitStatus` enum. Query `useProductUnitsQuery`. Mutations `useCreateProductUnitsBulkMutation` + `useUpdateProductUnitMutation`. Formulario `/inventory/create` con campo `brand` y tabla dinámica de seriales (bulk al guardar). Detalle `/inventory/:uuid` con tabla de unidades (serial, estado badge, garantía, paciente asignado). Modal `AssignDeviceUnitModal` de 3 pasos (producto → unidad AVAILABLE → oído). `DevicesPanel` usa el nuevo modal; tarjeta enriquecida con foto, serial, garantía con color vencida/vigente, botón "Devolver" que libera la unidad en inventario.

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
- ~~**Guard de especialidad en listado**~~ — ❌ Revertido en S3: filtrar por `user.specialty` violaba NOM-004 5.14 (un solo expediente con todos los registros). Ver S3 arriba.
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
| Report template | `src/pages/report-template/create.tsx` | Feature sin diseñar, P3. |
| Patient bloodType en summary | `use-patient-summary-header.ts` | Hardcodeado como 'O+'. Campo existe en DB. |
