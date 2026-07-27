# SESIONES — Prompts de arranque y pruebas

> Cómo continuar el plan de pacientes/expediente en una sesión nueva.
> Plan completo: [PLAN_PACIENTES.md](PLAN_PACIENTES.md) · Contexto: [DOMAIN_ANALYSIS.md](DOMAIN_ANALYSIS.md)
> Fecha: 2026-07-26

---

## Cómo usar este archivo

1. Abrir sesión nueva (o `/clear`)
2. Copiar el **prompt** de la sesión que toca
3. Al terminar, correr la **checklist de pruebas**
4. Marcar la sesión como completada abajo (§ Progreso)

### Modelo recomendado

| Sesión | Modelo | Por qué |
|---|---|---|
| **S1, S2, S3** | **Sonnet medio** ✅ | Cambios acotados, criterios verificables |
| **S4–S7** | **Modelo fuerte** ⚠️ | Modelo de datos, migraciones Prisma, append-only. Decisiones irreversibles |

---

## SESIÓN 1 — Unificar formularios de paciente

**Esfuerzo:** S · **Repo:** solo Site · **Sin migraciones**

### Prompt

```
Lee .claude/PLAN_PACIENTES.md (sección "SESIÓN 1") y .claude/PATTERNS.md.

Implementa la Sesión 1: unificar los formularios de crear y editar paciente.

Contexto del problema (ya verificado — no re-investigar):
- Crear vive en src/components/containers/add-patient/ (fuera de patients/)
- Editar vive en src/components/containers/patients/patient-edit/
- Ambos tienen Yup, pero con esquemas SEPARADOS que divergieron

Divergencias a corregir:
- birthDate: existe al crear, AUSENTE al editar → agregarlo (alimenta la edad del expediente)
- documentId: máscara al crear, BLOQUEADO al editar → hacerlo editable con la misma máscara
- address: maxLength 240 al crear vs 120 al editar → unificar en 240
- email: required al crear, no required al editar → dejarlo OPCIONAL en ambos
  (decisión tomada: el canal real es el teléfono/WhatsApp; obligarlo hace que inventen correos)

Tareas:
1. Crear un esquema Yup compartido y que ambos formularios lo consuman
2. Aplicar las 4 correcciones de divergencia
3. Mover add-patient/ → containers/patients/patient-create/
4. Renombrar PatientForm → PatientCreateContainer (PATTERNS #10)
5. En pages/patients/create.tsx: cambiar router.push por useNavigation (PATTERNS #1)
6. Mover los strings quemados de create.tsx a es.json + i18n.ts (PATTERNS #11)

Reglas obligatorias de PATTERNS.md: sin `any`, sin abreviaciones, isLoading (no loading),
enums en vez de string literals, textos vía i18n, Typography en vez de <p>/<span>.

Al terminar: verifica que compila (yarn lint) y actualiza .claude/STATUS.md.
```

### Pruebas manuales

- [ ] **Crear paciente** con todos los campos → se guarda y aparece en la lista
- [ ] **Cédula:** cambiar tipo de documento → la máscara y el placeholder cambian
- [ ] **Teléfono:** teclear `88887777` → se formatea o exige `XXXX-XXXX`
- [ ] **Nombre:** teclear números → muestra error "Solo letras y espacios"
- [ ] **Email vacío:** debe permitir guardar (ahora es opcional)
- [ ] 🔑 **Editar paciente → cambiar fecha de nacimiento** → guarda, y la **edad del expediente cambia**
- [ ] 🔑 **Editar paciente → cambiar cédula** → el campo ya no está bloqueado
- [ ] **Dirección larga (>120 chars)** → editar no la trunca
- [ ] Crear paciente redirige a la lista con toast de éxito
- [ ] No hay errores en consola del navegador

---

## SESIÓN 2 — Lista de pacientes

**Esfuerzo:** S · **Repo:** solo Site

> ⚠️ **Antes de arrancar:** confirmar con Matthew/María qué columnas necesitan al buscar un paciente. No asumir.

### Prompt

```
Lee .claude/PLAN_PACIENTES.md (sección "SESIÓN 2") y .claude/PATTERNS.md.

Implementa la Sesión 2: mejorar la lista de pacientes.
Archivo: src/components/containers/patients/patients-list/

Ya funciona (no romper): búsqueda con debounce 300ms, paginación, filtro de estado.

Tareas:
1. Estados vacíos diferenciados: distinguir "aún no hay pacientes" (lista vacía real)
   de "sin resultados para tu búsqueda" (búsqueda sin match). Hoy se ven igual.
2. Estado de error: si la query falla, mostrar mensaje claro + botón de reintentar
3. Badge de paciente inactivo: hoy no se distingue visualmente (P2-7)
4. Revisar que las columnas sirvan para identificar rápido a un paciente
   (nombre, cédula, teléfono como mínimo)

Reglas obligatorias de PATTERNS.md: sin `any`, sin abreviaciones, isLoading (no loading),
textos vía i18n, Typography en vez de <p>/<span>.

Al terminar: yarn lint y actualiza .claude/STATUS.md.
```

### Pruebas manuales

- [ ] Lista carga y pagina correctamente
- [ ] Buscar un nombre existente → filtra
- [ ] Buscar `zzzzz` → dice "sin resultados", **no** "no hay pacientes"
- [ ] Desactivar un paciente → aparece con badge de inactivo
- [ ] Con la API apagada → mensaje de error claro con reintentar
- [ ] Clic en un paciente → abre su expediente

---

## SESIÓN 3 — P0 del expediente

**Esfuerzo:** S · **Repo:** Site + API

> Es la sesión con **mayor impacto visible**: arregla el PDF y hace que el expediente muestre todo.

### Prompt

```
Lee .claude/PLAN_PACIENTES.md (sección "SESIÓN 3"), .claude/DOMAIN_ANALYSIS.md
(secciones 2.1 y 4.5) y .claude/PATTERNS.md.

Implementa la Sesión 3: los 4 P0 del expediente. Son bugs independientes entre sí.

--- 3.1 Filtro por especialidad (Site + API) ---
PROBLEMA: el expediente oculta los registros de otras especialidades.
Viola NOM-004 5.14 ("un solo expediente por paciente con TODOS los documentos")
y tiene riesgo clínico real (un audiólogo no vería ototóxicos registrados por otro).

- Site: src/components/containers/patients/patients-detail/use-patient-detail.ts línea ~73
  Quitar `matchesUserSpecialty`. El filtro `selectedSpec` SE QUEDA — pero como
  preferencia de vista que el usuario elige, no como restricción impuesta.
- API: packages/medical-records/.../find-all-medical-controls.use-case.ts
  Quitar el filtro por `speciality` del JWT al LEER.
REGLA: la especialidad determina qué se puede CREAR, nunca qué se puede VER.

--- 3.2 Forma del audiograma → PDF roto (Site) ---
PROBLEMA VERIFICADO: el audiograma se guarda con una forma y el PDF lo lee con otra,
por lo que la tabla del PDF sale SIEMPRE con guiones.

- Se guarda así (consulta-audiograma-container.tsx:51):
    findings.audiogram = { OD: {125: "20"}, OI: {...} }   ← anidado, claves=Hz, valores STRING
- Se lee así (use-pdf-report.ts:52-61):
    audiogramData[`right_${freq}`]  y exige typeof === 'number'   ← plano, prefijado, NUMBER

Unificar en la forma que YA se persiste (OD/OI anidado). Corregir use-pdf-report.ts
para que lea esa forma y convierta string→number.

--- 3.3 Permisos STAFF (Site + API) ---
PROBLEMA: STAFF (recepción) puede leer todas las notas clínicas.
Hoy solo se le oculta el botón "Iniciar consulta" (patient-detail-container.tsx:557).
Crítico con psicología entrando al MVP (leería evaluación de riesgo suicida).
Ley 8968: los datos de salud son datos sensibles.

- STAFF SÍ ve: agenda, datos de contacto del paciente, documentos administrativos
  (facturas, garantías)
- STAFF NO ve: notas clínicas, estudios, antecedentes
- Filtrar en API, no solo ocultar en el cliente (hoy el filtrado se hace en el
  navegador sobre datos ya descargados — eso no es control de acceso)

--- 3.4 Documentos (API) ---
- POST /patients/:uuid/documents devuelve 500 (probablemente credenciales R2)
- GET /patients/:uuid/documents no existe — el site ya lo llama y recibe 404

Reglas obligatorias de PATTERNS.md: sin `any`, sin abreviaciones, isLoading,
textos vía i18n, Typography.

Al terminar: yarn lint, y actualiza .claude/STATUS.md y .claude/API_CONTRACT.md.
```

### Pruebas manuales

**3.1 — Filtro de especialidad**
- [ ] 🔑 Paciente con registros de **dos especialidades** → el expediente los muestra **todos**
- [ ] El filtro de especialidad sigue existiendo como botón, y funciona al elegirlo

**3.2 — PDF** (la más importante)
- [ ] 🔑 Abrir un control **con audiograma** → descargar PDF
- [ ] 🔑 **La tabla del audiograma muestra NÚMEROS, no guiones** ← el bug
- [ ] Logo y firma aparecen si están configurados

**3.3 — STAFF**
- [ ] Crear un usuario STAFF e iniciar sesión con él
- [ ] 🔑 Abrir un expediente → **no** se ven notas clínicas ni estudios
- [ ] Sí se ven datos de contacto y se puede agendar
- [ ] Con DOCTOR/OWNER → se ve todo (no romper el caso normal)

**3.4 — Documentos**
- [ ] Subir un PDF a un paciente → sin error 500
- [ ] Recargar → el documento **sigue en la lista** (persiste)
- [ ] Eliminar un documento → desaparece

---

## SESIONES 4-7 — Rediseño de fondo

> ⚠️ **Usar modelo fuerte, no Sonnet medio.** Migraciones Prisma y decisiones
> de arquitectura irreversibles (append-only).
>
> ⚠️ **Antes de arrancar S4: reconfirmar la forma final del audiograma que quedó en S3.**
> El resto de estos prompts no depende de S1–S3.

| Sesión | Qué | Riesgo |
|---|---|---|
| **S4** | Modelo `Encounter` + append-only (API) | 🔴 Alto — migración + irreversible |
| **S5** | `Encounter` en site, matar `ConsultaSessionStorage` | 🟠 Medio |
| **S6** | Modelo `Study`, sacar el audiograma de `MedicalControl` | 🔴 Alto — migración |
| **S7** | Expediente en 3 niveles (solo UI) | 🟢 Bajo |

---

## SESIÓN 4 — `Encounter` + append-only (API)

**Esfuerzo:** M · **Repo:** solo API · **Con migración** · 🔴 **Modelo fuerte**

### Prompt

```
Repo: C:\Users\Personal\Desktop\standard-saas-api (packages/medical-records)
Lee .claude/DOMAIN_ANALYSIS.md del repo del site (secciones 1, 2.2, 2.3 y 3.1)
antes de empezar. Contexto imprescindible.

Implementa el modelo Encounter (Encuentro) + append-only.

--- POR QUÉ ---
Hoy la "visita" NO existe como entidad: vive en sessionStorage del navegador
(consulta-session.ts). Al cerrar la pestaña se pierde. No se puede responder
"¿qué se hizo el 3 de marzo?".
Además, guardar un audiograma SOBRESCRIBE savedControlUuid, dejando el control
huérfano si se hacen ambos en la misma visita.

CONCEPTO CLAVE (NOM-004): el Expediente es la ACUMULACIÓN de todo lo del paciente
(no una tabla). El Encuentro es UNA visita. Cita ≠ Encuentro: la cita es una
intención (puede no cumplirse); el encuentro es la atención que ocurrió.
Hay citas sin encuentro (no asistió) y encuentros sin cita (walk-in — caso de
Matthew en sedes). Por eso appointmentUuid es NULLABLE.

--- 4.1 Modelo Encounter ---
model Encounter {
  uuid            String    @unique @default(uuid())
  patientUuid     String
  tenantUuid      String
  autorUuid       String     // NOM-004 5.10: toda nota lleva autor
  especialidad    String
  appointmentUuid String?    // NULLABLE — walk-in
  startedAt       DateTime   @default(now())
  closedAt        DateTime?  // null = abierto
  status          String     // OPEN | CLOSED
  ...índices por patientUuid y tenantUuid
}

- MedicalControl y Maintenance pasan a colgar de Encounter
- encounterUuid NULLABLE en ambos durante la transición (no romper lo existente)

--- 4.2 Endpoints ---
POST   /encounters                    → abre encuentro
GET    /encounters/patient/:uuid      → lista por paciente (para el timeline)
GET    /encounters/:uuid              → detalle con sus notas/estudios
PATCH  /encounters/:uuid/close        → cierra (setea closedAt)

--- 4.3 Append-only (DECISIÓN TOMADA, no re-discutir) ---
Fundamento: NOM-004 5.11 exige el expediente "sin enmendaduras ni tachaduras".
CPPCR art. 22: retención 10 años en psicología.
Un expediente reescribible sin rastro no sirve como prueba legal.

Reglas:
- Nota firmada    → SIN update. Corrección por ADICIÓN (patrón correctionNotes, ya existe)
- Encounter cerrado → SIN update. Reabrir = nuevo encuentro vinculado
- Estudio         → inmutable. Repetir medición = estudio nuevo
- Datos demográficos del paciente → SÍ editables (no son registro clínico)
- Borrado         → solo soft delete. Bloquear DELETE duro

Ya existe el precedente: PATCH /medical-controls/:uuid/correction-note.
Generalizar ese patrón y QUITAR los UPDATE destructivos sobre registros clínicos.

Al terminar: actualiza .claude/ENDPOINTS.md (repo API) con el contrato exacto
de los endpoints nuevos, y .claude/STATUS.md.
```

### Pruebas (API — Bruno/Postman)

- [ ] `POST /encounters` **sin** `appointmentUuid` → crea (walk-in)
- [ ] `POST /encounters` **con** `appointmentUuid` → crea vinculado a la cita
- [ ] `GET /encounters/patient/:uuid` → devuelve los del paciente, más reciente primero
- [ ] `PATCH /encounters/:uuid/close` → setea `closedAt` y `status: CLOSED`
- [ ] 🔑 Intentar editar un encuentro **cerrado** → **rechazado**
- [ ] 🔑 Intentar editar una nota firmada → **rechazado**; la corrección se agrega aparte
- [ ] `DELETE` duro sobre registro clínico → **bloqueado**
- [ ] Editar nombre/teléfono del paciente → **sí funciona** (no es registro clínico)
- [ ] `npx prisma migrate` corre limpio
- [ ] Lo existente sigue funcionando (`encounterUuid` nullable)

---

## SESIÓN 5 — `Encounter` en el site

**Esfuerzo:** M · **Repo:** solo Site · **Requiere S4**

### Prompt

```
Lee .claude/DOMAIN_ANALYSIS.md (secciones 2.3 y 4.8) y .claude/PATTERNS.md.
Requiere la Sesión 4 terminada (endpoints /encounters ya disponibles).

Conecta el site al modelo Encounter y elimina el sessionStorage.

--- 5.1 Matar ConsultaSessionStorage ---
Archivo: src/shared/utils/consulta-session.ts → SE ELIMINA.
Hoy guarda { savedControlUuid, savedMaintenanceUuid, savedAudiogram } en
sessionStorage y se pierde al cerrar la pestaña.
El encuentro ahora vive en la base de datos.

- Al entrar a /patients/[uuid]/consulta → POST /encounters (o retomar el abierto)
- Cada paso guarda contra ese encounterUuid
- "Finalizar" → PATCH /encounters/:uuid/close

BUG QUE ESTO ARREGLA: hoy guardar un audiograma sobrescribe savedControlUuid
(consulta-audiograma-container.tsx:60), dejando el control huérfano.

--- 5.2 Timeline agrupado por encuentro ---
Archivo: src/components/containers/patients/patients-detail/use-patient-detail.ts

Hoy el timeline lista controles sueltos: un audiograma y su consulta del mismo
día aparecen como DOS filas sin relación.
Ahora: UNA entrada por encuentro, mostrando qué contuvo (nota, estudios,
mantenimientos). Los mantenimientos entran al timeline (hoy están fuera).

Crear queries/mutations siguiendo PATTERNS.md:
- src/shared/api/querys/encounters-query.ts
- src/shared/api/mutations/encounters/

Reglas obligatorias: sin `any`, sin abreviaciones, isLoading, enums,
i18n, Typography.

Al terminar: yarn lint y actualiza .claude/STATUS.md + .claude/API_CONTRACT.md.
```

### Pruebas manuales

- [ ] Iniciar consulta → se crea el encuentro
- [ ] 🔑 Guardar control, **cerrar la pestaña**, volver a entrar → **el progreso sigue ahí**
- [ ] 🔑 Guardar control **y** audiograma en la misma visita → **ambos quedan**, el control no se pierde
- [ ] Finalizar consulta → el encuentro queda cerrado
- [ ] 🔑 Timeline: control + audiograma del mismo día → **UNA entrada**, no dos
- [ ] Los mantenimientos aparecen en el timeline
- [ ] Sin `sessionStorage` en DevTools → Application

---

## SESIÓN 6 — Modelo `Study`

**Esfuerzo:** M · **Repo:** API + Site · **Con migración** · 🔴 **Modelo fuerte**

### Prompt

```
Lee .claude/DOMAIN_ANALYSIS.md (secciones 2.1, 2.2 y 4.2) y .claude/PATTERNS.md.
Requiere Sesiones 4 y 5 terminadas.

Saca las mediciones de MedicalControl.findings a una entidad Study propia.

--- POR QUÉ ---
Hoy un audiograma se guarda como un MedicalControl FALSO:
  diagnosis: t(TEXT.CONSULTA.AUDIOGRAM.BREADCRUMB)   ← string de UI dentro de "diagnóstico"
  findings: { audiogram: ..., type: 'audiogram-only' } ← discriminador improvisado
Un RESULTADO DE MEDICIÓN se está disfrazando de DIAGNÓSTICO porque no hay dónde ponerlo.

CONCEPTO: una consulta es una NARRATIVA (se firma y se congela). Un estudio es una
MEDICIÓN (repetible, comparable en el tiempo). No son la misma tabla.

--- 6.1 API: modelo Study ---
model Study {
  uuid           String   @unique @default(uuid())
  encounterUuid  String
  patientUuid    String
  tenantUuid     String
  autorUuid      String
  tipo           String   // AUDIOMETRIA_TONAL | TEST_PSICOMETRICO
  payload        Json     // estructura según tipo
  documentUuid   String?  // archivo del equipo, si lo hay
  createdAt      DateTime @default(now())
}
Endpoints: POST /studies, GET /studies/patient/:uuid, GET /studies/:uuid
Study es INMUTABLE (append-only, S4). Repetir medición = estudio nuevo.

--- 6.2 Site ---
CONTEXTO DE NEGOCIO: Matthew YA TIENE equipo que produce el audiograma. No va a
teclear 14 umbrales. El flujo principal es ADJUNTAR el archivo.
Decisión tomada: adjuntar archivo + capturar POCOS valores clave (PTA o umbrales
principales) — sirve para mostrar al paciente Y para comparar evolución después.

- El audiograma deja de ser MedicalControl falso → pasa a Study
- El PDF lee de Study, no de findings
- ⚠️ RECONFIRMAR la forma de datos que quedó tras la Sesión 3 antes de migrar

Reglas obligatorias: sin `any`, sin abreviaciones, isLoading, enums, i18n, Typography.

Al terminar: yarn lint, .claude/ENDPOINTS.md (API), .claude/STATUS.md,
.claude/API_CONTRACT.md.
```

### Pruebas

- [ ] `POST /studies` con `tipo: AUDIOMETRIA_TONAL` → crea
- [ ] 🔑 Intentar editar un estudio → **rechazado** (inmutable)
- [ ] Guardar audiograma desde la consulta → se crea `Study`, **no** un `MedicalControl` falso
- [ ] 🔑 Ya **no** aparece `diagnosis: "Audiograma"` en ningún registro nuevo
- [ ] 🔑 PDF del control con audiograma → **la tabla sigue mostrando números**
- [ ] Adjuntar el archivo del equipo → queda vinculado al estudio
- [ ] El estudio aparece dentro de su encuentro en el timeline
- [ ] `npx prisma migrate` corre limpio

---

## SESIÓN 7 — Expediente en 3 niveles

**Esfuerzo:** M · **Repo:** solo Site · **Sin migraciones** · 🟢 Riesgo bajo

### Prompt

```
Lee .claude/DOMAIN_ANALYSIS.md (secciones 4.8 y 4.9) y .claude/PATTERNS.md.
Requiere Sesiones 4-6. Es SOLO UI — no toca el modelo de datos.

Reestructura /patients/[uuid] — que ES el expediente.

--- EL PROBLEMA ---
Hoy conviven planos, al mismo peso visual: datos del paciente, antecedentes,
audífonos, timeline, documentos y botones de acción.
El sistema no distingue lo que el paciente ES de lo que le PASÓ.

--- LOS TRES NIVELES (tienen cardinalidad distinta — NOM-004) ---
1. IDENTIDAD      (1, estable)      → quién es. Siempre visible
2. ESTADO CLÍNICO (1, se actualiza) → antecedentes + dispositivos activos.
                                       Contexto permanente
3. CRONOLOGÍA     (N, crece)        → encuentros, estudios, documentos

--- TAREAS ---
7.1 BackgroundPanel y DevicesPanel son ESTADO, no eventos → agruparlos como
    bloque de contexto permanente (hoy son paneles sueltos entre medio)
7.2 Timeline por encuentro, con mantenimientos integrados
7.3 Documentos: hoy están al final como apéndice. Son fuente PRINCIPAL del
    expediente — y la vía por la que entra el audiograma de Matthew.
    OJO: el vínculo a un encuentro es OPCIONAL. La mayoría (facturas, garantías)
    no nace de una visita. NO obligar a elegir encuentro al subir.
7.4 /patients/[uuid]/ficha deja de ser página paralela con queries duplicadas
    → pasa a ser MODO IMPRESIÓN del mismo expediente (una sola fuente de datos)
7.5 Ocultar módulos de audiología (dispositivos, mantenimientos, audiograma)
    si el tenant es de psicología. Hoy la psicóloga vería "Vincular audífono".

Reglas obligatorias: sin `any`, sin abreviaciones, isLoading, enums, i18n, Typography.

Al terminar: yarn lint y actualiza .claude/STATUS.md.
```

### Pruebas manuales

- [ ] Expediente: se distingue identidad / estado / cronología
- [ ] Antecedentes y audífonos agrupados como contexto, no sueltos
- [ ] Timeline agrupa por encuentro, con mantenimientos incluidos
- [ ] 🔑 Subir una factura **sin** elegir encuentro → **funciona** (es el caso normal)
- [ ] 🔑 `/ficha` muestra **los mismos datos** que el expediente (sin duplicar queries)
- [ ] Imprimir `/ficha` → sale limpio
- [ ] 🔑 Con tenant de **psicología** → **no** aparecen audífonos, mantenimientos ni audiograma
- [ ] Con tenant de audiología → todo visible
- [ ] Responsive en móvil (Matthew trabaja en sedes)

---

## Progreso

- [ ] **S1** — Unificar formularios
- [ ] **S2** — Lista de pacientes
- [ ] **S3** — P0 del expediente
- [x] **S4** — `Encounter` + append-only (API)
- [x] **S5** — `Encounter` (site)
- [x] **S6** — `Study`
- [x] **S7** — Expediente 3 niveles

---

## Reglas de cierre (aplican a toda sesión)

De `CLAUDE.md`:

1. **Antes de push:** actualizar `.claude/STATUS.md` y el Roadmap de `README.md`
2. **Pre-commit:** si el hook falla, **corregir** — nunca `--no-verify`
3. **Cross-repo:** si cambia un endpoint, actualizar `.claude/API_CONTRACT.md` y
   `ENDPOINTS.md` del repo de la API
4. **Branch descriptivo**, no trabajar directo en `main`
