# Análisis de dominio y replanteamiento — Expediente, Consulta y Estudios

> Documento de análisis. No es un plan de implementación aprobado.
> Fecha: 2026-07-26
> Origen: el flujo actual de pacientes/consulta no es replicable fuera de audiología.

---

## 0. Resumen ejecutivo

El sistema hoy modela **audiología** y llama a eso "medicina". El resultado es que:

1. No se puede replicar en psicología, nutrición, fisioterapia u odontología sin reescribir el flujo.
2. Dentro de la propia audiología, el modelo es incorrecto: el audiograma se guarda como si fuera un diagnóstico.
3. El PDF de audiograma **está roto en producción** (bug verificado, §2.1).

La causa raíz es **una sola**: se confundió *expediente*, *consulta*, *estudio* e *informe* — cuatro conceptos distintos — y se colapsaron en una tabla (`MedicalControl`) y un flujo de rutas fijas.

**La buena noticia:** ya existe `ClinicalTemplate` con campos dinámicos en DB. La solución correcta está a medio construir; el flujo simplemente no la usa.

---

## 1. Los cuatro conceptos que hoy están mezclados

Esta es la definición que resuelve la confusión de fondo. Fuente: **NOM-004-SSA3-2012** (México), la norma escrita más precisa de la región. No es vinculante en Costa Rica, pero es la referencia estructural más clara y coincide con la doctrina costarricense (Valerio/Ugalde, BINASSS).

> **Expediente clínico**: "al **conjunto único** de información y datos personales de un paciente, [...] el cual **consta de documentos** escritos, gráficos, imagenológicos, electrónicos [...] **y de cualquier otra índole**".

Tres palabras cargan todo:

- **"conjunto"** → es un agregado, una colección.
- **"único"** → exactamente **uno por paciente por clínica**.
- **"de cualquier otra índole"** → contenedor abierto y heterogéneo.

### La tabla que resuelve la duda

| Concepto | Qué es | Cardinalidad | Naturaleza |
|---|---|---|---|
| **Expediente** | Todo lo registrado sobre el paciente | **1 por paciente** | Contenedor / **vista agregada** |
| **Historia clínica** | Documento de ingreso: anamnesis, antecedentes | **1 por paciente** (se actualiza) | Documento fundacional |
| **Nota de evolución (consulta)** | Registro de **cada visita** | **N por paciente** | Evento clínico recurrente |
| **Informe / PDF** | Documento **derivado** para un tercero | **N, a demanda** | **Proyección**, no fuente de verdad |

**La respuesta a "¿qué es un expediente?":**

> El expediente **no es una pantalla ni un documento**. Es el resultado de consultar todo lo asociado a un paciente.
> No debe existir una tabla `expediente` con campos clínicos. Si la hay, el modelo está invertido.

```
Paciente (1) ──< Consulta (N)          ← notas de evolución
             ──< Estudio (N)            ← audiometrías, tests, mediciones
             ──< Documento (N)          ← PDFs, imágenes
             ──< Dispositivo (N)        ← audífonos, prótesis
             ──< Consentimiento (N)

Expediente = SELECT * FROM {todo lo anterior} WHERE pacienteUuid = X
```

Esto responde también a la pregunta de `/ficha`: **no debe ser una página con su propia lógica de queries**. Es un modo de presentación (export/impresión) de la misma fuente de datos.

### Consulta vs Estudio — por qué son tablas distintas

Esta es la **segunda decisión estructural**, y es la que hoy está mal:

| | **Consulta** (nota) | **Estudio** (prueba) |
|---|---|---|
| Naturaleza | Narrativa interpretativa | Datos estructurados / mediciones |
| Estructura | Texto en bloques (SOAP) | Matrices numéricas |
| Reproducibilidad | Irrepetible: un momento y un juicio | Repetible: se puede volver a medir |
| Ciclo de vida | Se firma y se congela | Se **compara longitudinalmente** |
| Pregunta típica | "¿Qué se dijo el 3 de marzo?" | "¿Cómo evolucionó 4 kHz en 3 años?" |

> **Regla:** una audiometría **no es** una nota de evolución. Es un `Estudio` con datos estructurados, **referenciado desde** la consulta.
> Guardarlo como una consulta destruye la comparación longitudinal — que es justamente el valor diferencial del producto.

### SOAP — la estructura universal de la consulta

Formato creado por Larry Weed (~1968); es el estándar universal y **es agnóstico de especialidad**:

| | | Sirve para |
|---|---|---|
| **S** — Subjetivo | Lo que el paciente **refiere** | audiología, psicología, nutrición, fisio… |
| **O** — Objetivo | Lo que el clínico **mide u observa** | ← aquí se enganchan los Estudios |
| **A** — Análisis | Diagnóstico / juicio clínico | |
| **P** — Plan | Tratamiento, seguimiento | |

**SOAP y NOM-004 son el mismo objeto**, mapean 1:1 con la nota de evolución (6.2.1–6.2.6). Una sola estructura satisface ambos.

> **Esta es la clave de la multi-especialidad:** SOAP es el esqueleto común. Lo que cambia entre especialidades es **qué se engancha en la O** — y eso es exactamente lo que `ClinicalTemplate` + `Estudio` deben resolver.

---

## 2. Diagnóstico del código actual

### 2.1 🔴 BUG VERIFICADO — el audiograma nunca sale en el PDF

Dos formas de datos incompatibles:

**Se guarda así** ([consulta-audiograma-container.tsx:51](../src/components/containers/patients/consulta/consulta-audiograma-container.tsx#L51)):
```ts
findings: { audiogram: { OD: {125: "20", 250: "15"}, OI: {...} } }
//                        ^ anidado por oído, claves = frecuencia, valores = STRING
```

**Se lee así** ([use-pdf-report.ts:52-61](../src/components/pdf/use-pdf-report.ts#L52-L61)):
```ts
audiogramData[`right_${frequency}`]   // plano, prefijado
typeof audiogramData[rightKey] === 'number' ? ... : null   // exige NUMBER
```

Las formas **nunca coinciden**. `right_1000` no existe, y aunque existiera los valores son strings.

> **Consecuencia: la tabla de audiograma en TODO PDF generado sale llena de guiones (`—`).**
> No es un problema de estilos. Las dos mitades se escribieron contra modelos mentales distintos de qué *es* un audiograma.

### 2.2 `MedicalControl` es un cajón de sastre

Cuatro eventos clínicos distintos forzados en una tabla:

| Evento real | Cómo se guarda hoy |
|---|---|
| Una consulta | `MedicalControl` ✅ |
| Un audiograma (*un estudio*) | `MedicalControl` **falso** con `diagnosis: "Audiograma"` ❌ |
| Un mantenimiento | Tabla `Maintenance` aparte, fuera del timeline ⚠️ |
| Una adaptación de audífono | `PatientDevice`, sin nota clínica ⚠️ |

El caso del audiograma lo delata: [consulta-audiograma-container.tsx:53](../src/components/containers/patients/consulta/consulta-audiograma-container.tsx#L53) **escribe un string traducido de UI dentro del campo `diagnosis`** como relleno:

```ts
diagnosis: t(TEXT.CONSULTA.AUDIOGRAM.BREADCRUMB)   // "Audiograma"
findings: { audiogram: ..., type: 'audiogram-only' }  // discriminador improvisado
```

Un **resultado de medición** se disfraza de **diagnóstico** porque no hay dónde ponerlo.

### 2.3 La "consulta" no existe como entidad

Vive en `sessionStorage` ([consulta-session.ts](../src/shared/utils/consulta-session.ts)):

```ts
{ savedControlUuid, savedMaintenanceUuid, savedAudiogram }
```

Consecuencias:
- **Cierras la pestaña y la visita como unidad desaparece.** Solo quedan fragmentos sueltos.
- Guardar un audiograma **sobrescribe** `savedControlUuid` ([línea 60](../src/components/containers/patients/consulta/consulta-audiograma-container.tsx#L60)) → si haces control *y* audiograma en la misma visita, el control queda huérfano.
- No hay forma de responder "¿qué se hizo en la visita del 3 de marzo?".

### 2.4 🔴 El acoplamiento a audiología está en la infraestructura

**43 archivos** contienen `AUDIOLOGY` / `audiogram` / `'OD'` / `'OI'`. Lo grave no es la cantidad, es *dónde*:

```ts
// src/shared/navigation/routes.ts  ← EL ROUTING MISMO
consultaAudiograma:   (uuid) => `/patients/${uuid}/consulta/audiograma`,
consultaMantenimiento:(uuid) => `/patients/${uuid}/consulta/mantenimiento`,
```

> **Una clínica de psicología tendría que navegar a `/consulta/audiograma`.**

El flujo de consulta no es configurable: son **rutas fijas** con pasos fijos. Añadir una especialidad hoy significa tocar `routes.ts`, `use-navigation.ts`, `consulta-session.ts`, `consulta-container.tsx` y crear páginas nuevas. **Eso no escala.**

Además, `ConsultaSession` tiene el campo `savedAudiogram: boolean` cableado — la sesión de consulta genérica sabe qué es un audiograma.

### 2.5 Deuda estructural adicional

| Problema | Ubicación |
|---|---|
| Dos vistas de expediente en paralelo, con queries duplicadas | `/patients/[uuid]` y `/patients/[uuid]/ficha` |
| Dos implementaciones de nuevo control conviviendo | `new-control/` y `new-control-v1/` |
| `DENTAL` se mapea a `GENERAL` porque la API no lo soporta | `consulta-audiograma-container.tsx:24` |
| Especialidad como `string` libre en DB | `MedicalControl.speciality` |
| `ClinicalTemplate` existe con campos dinámicos pero el flujo lo ignora | `clinical-template.types.ts` |

---

## 3. Lo que la investigación clínica aporta al modelo

### 3.1 Reglas legales que son restricciones de arquitectura

De NOM-004, sección 5 — **no son recomendaciones**:

| Cláusula | Regla | Implicación técnica |
|---|---|---|
| **5.10** | Toda nota lleva **fecha, hora, autor y firma** | `createdAt` con hora + `autorUuid` + firma. **No opcional** |
| **5.11** | **Sin enmendaduras ni tachaduras** | 🔴 **Append-only. Prohibido el UPDATE destructivo sobre nota firmada** |
| 5.4 | Conservación **mínimo 5 años** | El borrado no puede ser operación normal |
| 5.14 | **Un solo expediente** aunque haya varios servicios | Confirma: expediente = vista, no tabla |
| 5.13 | Se permiten formatos propios respetando mínimos | ✅ **Habilita plantillas por especialidad** |

> **5.11 es la decisión de arquitectura más urgente.** Convertir un modelo mutable en auditable después es una migración cara.
> El sistema ya tiene `correctionNotes` — esa es la dirección correcta (corregir por adición, no por sobrescritura). Falta generalizarla.

**Costa Rica — Ley 8239 art. 2.k:** el paciente tiene derecho a **acceder a su expediente y recibir copia**, y aplica a clínicas privadas.
→ **La exportación completa del expediente es obligación legal, no feature premium.**

**Ley 8968:** los datos de salud son **datos sensibles**. Tratamiento ilícito = falta **gravísima** (art. 31). Exige consentimiento expreso registrado, cifrado, control por rol y bitácora de accesos.

> ⚠️ **Pendiente de validación legal en CR:** las fuentes discrepan sobre la *propiedad* del expediente (institución vs. paciente con custodia del profesional). El Reglamento del EDUS y el de la CCSS no fueron accesibles (HTTP 403). **Consultar abogado local antes de redactar términos de servicio.**

### 3.2 Lo que el modelo de audiograma necesita (y hoy no tiene)

Si se va a rehacer, hay que hacerlo bien. Un umbral audiométrico **no es** `(frecuencia → string)`:

```ts
Umbral = {
  frecuencia: number      // 125…8000 Hz
  oido: 'OD' | 'OI'
  via: 'AEREA' | 'OSEA'   // ← FALTA HOY (ConductionType existe pero nunca se persiste)
  db: number | null
  enmascarado: boolean    // ← FALTA HOY — CRÍTICO
  sinRespuesta: boolean   // ← FALTA HOY
}
```

**Por qué `enmascarado` es crítico:** al estimular un oído con intensidad alta, el sonido **cruza** al otro y da un umbral falso. Se introduce ruido para aislar.
> Un umbral de 60 dB **sin** enmascarar y uno de 60 dB **con** enmascaramiento **no son el mismo dato clínico**. Sin ese campo el audiograma no es reproducible ni interpretable legalmente.

**Otros huecos verificados:**
- Falta **vía ósea** → sin ella no se puede distinguir hipoacusia conductiva de neurosensorial. Es el diagnóstico diferencial básico.
- Falta **logoaudiometría** (SRT + % discriminación) → es el mejor predictor del beneficio con audífono; dato de negocio, previene devoluciones.
- Falta **timpanometría** (clasificación Jerger A/As/Ad/B/C).

**PTA — el cálculo actual es una de varias convenciones:**
[audiogram-chart.tsx:20](../src/components/common/audiogram-chart/audiogram-chart.tsx#L20) usa `[500, 1000, 2000] / 3`.
- BIAP y **WHO** usan `[500, 1000, 2000, **4000**] / 4`
- BIAP además imputa los "sin respuesta" como **120 dB** (no los descarta) y pondera asimetrías >15 dB

**Las escalas de clasificación no son intercambiables:** la escala actual (corte de normalidad en 25 dB) es la **antigua**. WHO 2021 bajó el corte a **20 dB** y el de moderada de 40 a **35 dB**.
> Un PTA de 38 dB es **"leve"** en la escala actual pero **"moderada"** en WHO 2021.
> → Guardar siempre los **umbrales crudos**, hacer la escala configurable, y registrar qué escala produjo cada clasificación. Clasificar destructivamente contra una escala hardcodeada hace los datos históricos irreinterpretables.

**Símbolos (ASHA 1990):** O/X aéreo sin enmascarar (der/izq), △/▢ enmascarado, `<`/`>` óseo, `[`/`]` óseo enmascarado.
> ASHA **no exige color**. Rojo/azul es convención universal en pantalla, pero **la forma debe bastar por sí sola** — sobrevive al blanco y negro y es accesible para daltonismo (~8% de hombres; rojo/azul es justo el par problemático en deuteranopía).

### 3.3 Ciclo de vida del dispositivo — donde está el ingreso recurrente

Un expediente médico genérico no modela esto, y es el negocio de la clínica:

Candidatura → impresión/molde → **fitting** (con verificación REM) → **período de prueba** → ajustes → **garantía** → mantenimiento → recontrol

Notas de modelado verificadas contra el schema actual:
- ✅ El schema **ya acierta**: `ProductUnit` con `serialNumber` por unidad y `PatientDevice.side`. Una adaptación binaural son **dos dispositivos** con series y garantías distintas.
- ❌ **Falta el período de prueba** — es un reloj **independiente** de la garantía (inicia en la entrega, no en la compra). Ambos necesitan alertas *antes* del vencimiento.
- ❌ **Los ajustes no guardan parámetros** — sin ellos no se puede revertir cuando el paciente dice "antes se oía mejor".
- ❌ **El dispositivo no se vincula al audiograma que lo originó** — al llegar un recontrol no se sabe contra qué umbrales se programó.

---

## 4. Hacia dónde debería ir — modelo genérico

### Principio rector

> **El núcleo es agnóstico de especialidad. Lo específico vive en datos (plantillas), no en código (rutas).**

### 4.1 Entidades del núcleo (iguales para toda clínica)

```
Paciente
  └── Encuentro (visita)         ← reemplaza la sesión en sessionStorage
        ├── Nota SOAP            ← estructura universal
        ├── Estudio (N)          ← tipado, con payload por tipo
        ├── Documento (N)
        └── Procedimiento (N)    ← mantenimiento, fitting, aplicación de test…
```

**`Encuentro`** es la pieza que falta hoy. Es la visita como unidad persistente: agrupa todo lo que pasó ese día. Responde "¿qué se hizo el 3 de marzo?" — hoy imposible.

**`Nota`** con estructura SOAP + un bloque `datosPlantilla: Json` para los campos configurables de la especialidad.

**`Estudio`** con discriminador de tipo y payload estructurado:

| `tipo` | Payload | Especialidad |
|---|---|---|
| `AUDIOMETRIA_TONAL` | umbrales tipados (§3.2) | audiología |
| `LOGOAUDIOMETRIA` | SRT, % discriminación | audiología |
| `TIMPANOMETRIA` | curva Jerger, reflejos | audiología |
| `TEST_PSICOMETRICO` | ítems + puntaje + baremo | psicología |
| `ANTROPOMETRIA` | peso, talla, IMC, pliegues | nutrición |
| `ODONTOGRAMA` | estado por pieza | odontología |

> Cada tipo nuevo se añade **sin migración** y **sin tocar el routing**.

### 4.2 Lo específico vive en configuración

`ClinicalTemplate` (**ya existe en DB**) define qué captura cada especialidad. Falta extenderlo para que declare también **qué pasos tiene la consulta**:

```ts
ClinicalTemplate {
  especialidad: string
  camposNota: ClinicalFieldDefinition[]      // ya existe
  pasosConsulta: PasoDefinition[]            // ← FALTA: hoy son rutas fijas
  estudiosDisponibles: TipoEstudio[]         // ← FALTA
}
```

**El flujo de consulta se vuelve data-driven:**

```
HOY:    /consulta/audiograma  (ruta fija, hardcodeada)
FUTURO: /consulta/[pasoId]    (resuelto desde la plantilla del tenant)
```

Una clínica de psicología configura pasos `[Entrevista, Test, Plan]`. Una de audiología `[Anamnesis, Otoscopia, Audiometría, Diagnóstico]`. **Mismo código.**

### 4.3 Correspondencia con lo que ya existe

| Concepto nuevo | Estado actual | Acción |
|---|---|---|
| `Encuentro` | ❌ `sessionStorage` | **Crear** — es la pieza central que falta |
| `Nota` (SOAP) | ⚠️ `MedicalControl` | Refactor: sacarle los estudios |
| `Estudio` | ❌ dentro de `findings` | **Crear** — separar del control |
| `ClinicalTemplate` | ✅ **existe** | Extender con `pasosConsulta` |
| `Documento` | ✅ `PatientDocument` | OK |
| `Dispositivo` | ✅ `ProductUnit` + `PatientDevice` | Añadir período de prueba y ajustes |
| Expediente | ❌ dos vistas duplicadas | Convertir en **vista agregada única** |
| Informe/PDF | ⚠️ roto (§2.1) | Reconstruir como **proyección** |

> **Nota:** una clínica no audiológica hoy no tiene `ClinicalTemplate` propia y el sistema haría fallback a `GENERAL`. La configuración inicial por tenant al crear la clínica es un prerequisito (relacionado con P3-5, *tenant initialization event*).

---

## 4.5 Multi-especialidad y permisos

### La regla que lo ordena todo

| | Depende de | Fundamento |
|---|---|---|
| **Consulta** (escritura) | **Médico logueado** | Un psicólogo no captura un audiograma |
| **Expediente** (lectura) | **Paciente** | NOM-004 **5.14** |

> NOM-004 5.14: *"Cuando en un mismo establecimiento se proporcionen varios servicios, deberá integrarse **un solo expediente clínico por cada paciente**, en donde consten **todos y cada uno** de los documentos generados por el personal que intervenga en su atención."*

**El expediente es del paciente, no del médico.** Aunque haya varias especialidades en la clínica, hay **un solo expediente** y contiene **todo**.

### 🔴 P0 — El filtro por especialidad fragmenta el expediente

[use-patient-detail.ts:73](../src/components/containers/patients/patients-detail/use-patient-detail.ts#L73):

```ts
const matchesUserSpecialty =
  userSpecialty === undefined || item.header.speciality === userSpecialty;
```

Dos problemas graves:

1. **Viola NOM-004 5.14.** Si el usuario tiene especialidad, se le ocultan los registros de las demás. El expediente deja de ser único.
2. **Un OWNER ve todo por accidente**, no por diseño: pasa porque `userSpecialty === undefined`, no porque se haya decidido que deba verlo.

**Riesgo clínico real:** si medicina general registró ototóxicos, el audiólogo **necesita verlos**. Ocultarlos puede causar daño.

**Además, el filtro se aplica en cliente** — sobre datos ya descargados. Para datos sensibles (Ley 8968) eso no es control de acceso, es una cortina visual.

**Y la API refuerza el error:** `find-all-medical-controls.use-case.ts` filtra por el `speciality` del JWT al **leer**.

> **Corrección:** la especialidad determina **qué se puede crear**, nunca **qué se puede ver**.
> El filtro por especialidad debe ser una **preferencia de vista** que el usuario elige (`selectedSpec`, ya existe), no una restricción impuesta.

### Especialidad y rol son ejes independientes

Hoy están confundidos. Son cosas distintas:

| Eje | Controla | Ejemplo |
|---|---|---|
| **Especialidad** | Qué **escribes** | Audiólogo → notas de audiología |
| **Rol** | Qué **puedes hacer** | OWNER administra; STAFF no escribe clínica |

Un **OWNER audiólogo** existe: rol `OWNER` + especialidad `AUDIOLOGY`. Son ortogonales.

| Rol | Lee expediente | Escribe nota clínica |
|---|---|---|
| OWNER / ADMIN | ✅ completo | Solo si tiene especialidad |
| Profesional (con especialidad) | ✅ completo | ✅ en su especialidad |
| STAFF | ⚠️ limitado — solo administrativo | ❌ |

> STAFF requiere decisión: recepción necesita agendar, pero probablemente **no** leer notas clínicas. Ley 8968 clasifica salud como dato **sensible** → conviene ser restrictivo y registrar accesos (bitácora).

---

## 4.6 Registro de componentes por especialidad — paso ejecutable ya

Resuelve el acoplamiento del routing (§2.4) **sin tocar DB ni API**. Es la parte de la Opción B que se puede hacer de inmediato.

### Hallazgo que lo hace barato

Las 3 páginas de pasos (`control.tsx`, `audiograma.tsx`, `mantenimiento.tsx`) son **idénticas** salvo el container que montan y el título. Colapsan en **una sola ruta dinámica**.

### Diseño

**1. Enum de pasos** (regla PATTERNS #13 — enums, nunca string literals):

```ts
// src/types/consulta/consulta-step.types.ts
export enum ConsultaStep {
  CLINICAL_CONTROL = 'control',
  AUDIOGRAM        = 'audiograma',
  MAINTENANCE      = 'mantenimiento',
  // psicología: INTERVIEW = 'entrevista', PSYCHOMETRIC_TEST = 'test'
  // nutrición:  ANTHROPOMETRY = 'antropometria'
}
```

El valor del enum **es** el segmento de URL → las URLs actuales siguen funcionando.

**2. Registro especialidad → pasos:**

```ts
export const SPECIALTY_STEPS: Record<UserSpecialty, ConsultaStep[]> = {
  [UserSpecialty.AUDIOLOGY]: [
    ConsultaStep.CLINICAL_CONTROL,
    ConsultaStep.AUDIOGRAM,
    ConsultaStep.MAINTENANCE,
  ],
  [UserSpecialty.DENTAL]:  [ConsultaStep.CLINICAL_CONTROL],
  [UserSpecialty.GENERAL]: [ConsultaStep.CLINICAL_CONTROL],
};
```

**3. Registro paso → componente** (lazy, para no cargar el audiograma en una clínica de psicología):

```ts
export const STEP_REGISTRY: Record<ConsultaStep, StepDefinition> = {
  [ConsultaStep.AUDIOGRAM]: {
    titleKey: TEXT.CONSULTA.SECTIONS.AUDIOGRAM,
    icon: Activity,
    Component: dynamic(() => import('.../consulta-audiograma-container')),
  },
  // …
};
```

**4. Una sola ruta dinámica** — `/patients/[uuid]/consulta/[step].tsx` sustituye las 3 páginas:

```tsx
const step = router.query.step as ConsultaStep;
const definition = STEP_REGISTRY[step];
if (!definition) return <NotFound />;                    // paso inexistente
if (!allowedSteps.includes(step)) return <NotAllowed />; // paso no permitido a esa especialidad
return <definition.Component patientUuid={uuid} />;
```

### Qué se gana

- `routes.ts` pierde `consultaAudiograma` / `consultaMantenimiento` → **una sola** `consultaStep(uuid, step)`
- `consulta-container.tsx` deja de hardcodear `isAudiology` — itera `SPECIALTY_STEPS[especialidad]`
- `ConsultaSession.savedAudiogram: boolean` → `pasosCompletados: Record<ConsultaStep, string | null>`
- Añadir especialidad = **una entrada en dos registros**, cero cambios de routing

### Límite honesto de este paso

Esto resuelve el **acoplamiento del routing**, no el **modelo de datos**. Después de hacerlo:

- ✅ Las rutas dejan de ser específicas de audiología
- ❌ El audiograma **sigue** guardándose como `MedicalControl` falso (§2.2)
- ❌ El PDF **sigue** roto (§2.1)
- ❌ `Encuentro` **sigue** sin existir

Es un paso real y ejecutable, pero **intermedio**. El registro en código es además el precursor natural de `ClinicalTemplate.pasosConsulta` (§4.2): cuando la plantilla lo defina en DB, el registro pasa de constante a dato — la forma no cambia.

---

## 4.7 Usuarios reales — contexto que corrige supuestos

### Las dos clínicas

| Tenant | Perfil | Uso |
|---|---|---|
| **AudioColors** — audiología | **Matthew** (owner + audiólogo): **itinerante**, varias sedes, vende audífonos, controles y seguimientos | Móvil, con el paciente delante |
| | **María** (audióloga): sede central, fija | Escritorio |
| **Clínica de psicología** | Pacientes, expediente, agenda | Sin dispositivos, sin inventario, sin estudios de equipo |

### 🔴 Dos supuestos del análisis que este contexto corrige

**1. El audiograma es un ADJUNTO, no captura primaria.**

Matthew **ya tiene equipo** que produce el audiograma. No va a re-teclear 14 umbrales.

> Esto reordena §3.2: el formulario de captura manual deja de ser el flujo central.
> Vía ósea / enmascaramiento siguen siendo correctos clínicamente, pero **bajan de prioridad** si el dato entra como archivo.

**2. El núcleo común es más chico de lo que el sistema asume.**

Común a ambas clínicas: **Paciente + Citas + Expediente + Documentos adjuntos.**
Todo lo demás (audífonos, inventario, mantenimientos, audiograma) es **módulo de audiología**.

> Buena noticia: el núcleo genérico es pequeño y **ya existe casi todo**.

### Decisiones tomadas

| Tema | Decisión |
|---|---|
| **Módulos de audiología en psicología** | **No se muestran.** Son tenants distintos con especialidad distinta; no hay caso mixto. La especialidad del tenant decide qué existe — sin configuración manual |
| **Gráfico de audiograma** | **Ambos usos**: mostrar al paciente **y** comparar evolución → **adjuntar archivo + capturar pocos valores clave** (PTA / umbrales principales). Habilita la gráfica sin obligar a teclear todo |
| **Uso en sede** | **Mixto**: a veces en vivo, a veces diferido → el expediente debe soportar **lectura rápida** y **captura diferida** sin penalizar ninguna |

> ⚠️ Hoy el detalle de paciente le mostraría a la psicóloga "Próx. mantenimiento" y "Vincular audífono". **Ruido puro.**

---

## 4.8 El detalle de paciente ES el expediente

**Sí — `/patients/[uuid]` es el expediente.** El propio código ya lo sabe: [patients/[uuid]/index.tsx:22](../src/pages/patients/[uuid]/index.tsx#L22) tiene `title="Expediente del Paciente"`. Falta que la estructura lo acompañe.

### Por qué hoy no lo es

1. **Está partido en dos** — `/patients/[uuid]` y `/ficha` son expedientes paralelos con queries duplicadas. Pero el expediente es **uno** (NOM-004 5.14). `/ficha` debe ser el **modo impresión**, no otra página.
2. **Muestra solo una parte** — el filtro por especialidad oculta lo de otros profesionales (§4.5 P0).
3. **Mezcla niveles** — identidad, estado y cronología conviven planos, al mismo peso visual.

### Los tres niveles del expediente

El punto 3 es el origen de la sensación de "mezclado". El expediente tiene **tres niveles con cardinalidad distinta**, hoy aplanados:

| Nivel | Qué es | Cardinalidad | Comportamiento |
|---|---|---|---|
| **Identidad** | Quién es el paciente | 1, estable | Siempre visible |
| **Estado clínico** | Historia clínica, antecedentes, dispositivos activos | 1, se actualiza | Contexto permanente |
| **Cronología** | Encuentros, estudios, documentos | N, crece | Lo que pasó, en el tiempo |

> No es criterio estético: sale de NOM-004. La *historia clínica* (1, se actualiza) y las *notas de evolución* (N, una por visita) tienen cardinalidad distinta. La pantalla debe reflejarlo.
> El sistema hoy no distingue **lo que el paciente *es*** de **lo que le *pasó***.

### Correcciones concretas sobre lo que ya existe

| Elemento actual | Problema | Corrección |
|---|---|---|
| `BackgroundPanel`, `DevicesPanel` | Paneles sueltos entre medio | Son **estado**, no eventos → bloque de contexto permanente |
| Timeline de controles | Lista controles sueltos | Agrupar por **Encuentro**: hoy un audiograma y su consulta del mismo día son 2 filas sin relación |
| Mantenimientos | Viven fuera del timeline | Son parte de lo que le pasó → integrar |
| Documentos | Al final, desconectados | Ver §4.9 — el vínculo al encuentro es **opcional** |
| StatCards con acciones | Compiten con el timeline | Revisar jerarquía |

### Módulos por especialidad

Dado que la especialidad del tenant decide qué existe:

| Bloque | Audiología | Psicología |
|---|---|---|
| Identidad | ✅ | ✅ |
| Antecedentes | ✅ | ✅ (otros campos, vía plantilla) |
| Cronología de encuentros | ✅ | ✅ |
| Documentos | ✅ | ✅ |
| **Dispositivos / audífonos** | ✅ | ❌ |
| **Mantenimientos** | ✅ | ❌ |
| **Audiograma** | ✅ | ❌ |

---

## 4.9 Documentos adjuntos — corrección al modelo

### ⚠️ Corrección a §4.8

En §4.8 se propuso *"vincular el documento al encuentro que lo originó"*. **Eso es incorrecto** y el usuario lo corrigió:

> *"Subir archivos son muchas veces facturas, garantías, cosas como esas, alguna foto de algún documento. **No está amarrado a algo en específico**, algún mantenimiento."*

El modelo actual ya acierta: `PatientDocument` **no** tiene relación con `Maintenance` ni con `MedicalControl` — cuelga directo del paciente.

> **Regla:** el vínculo a un encuentro debe ser **opcional** (`encuentroUuid` nullable).
> Un documento **sin** encuentro es el caso **normal**, no la excepción.
> Obligar a elegir "¿a qué visita pertenece esta factura?" al subir sería fricción absurda.

### Dos naturalezas mezcladas en una sola lista

Las categorías actuales (`RECEIPT | WARRANTY | EXTERNAL_TEST | OTHER`) ya insinúan la división:

| Naturaleza | Ejemplos | Se relaciona con | ¿Común a ambas clínicas? |
|---|---|---|---|
| **Administrativo** | Factura, garantía, cédula, consentimiento | Paciente (o una compra) | ✅ **Sí** — núcleo genérico |
| **Clínico** | Audiograma, informe externo, resultado de test | Paciente; **a veces** un encuentro | ✅ **Sí** — núcleo genérico |

Por qué importa la distinción:
- Los **administrativos** son idénticos en audiología y psicología → núcleo.
- Los **clínicos** son los que a veces se quieren ver en el timeline, y en audiología alimentan la gráfica de evolución.

> `RECEIPT` y `WARRANTY` **no son clínicos** — son administrativos. Hoy conviven en la misma lista plana que los resultados de exámenes.

### Implicación para el expediente

Los documentos **no** son un apéndice al final de la pantalla. Son una de las fuentes principales del expediente — y en el caso de Matthew, **la vía principal por la que entra el audiograma** (§4.7).

---

## 4.10 Psicología — lo que cambia el modelo

Investigación acotada. Confirma que el núcleo genérico sirve, **con tres excepciones que no son cosméticas**.

### 🔴 1. Notas de proceso — separación de almacenamiento, no un flag

En psicología existen **dos registros distintos**, no dos vistas del mismo:

| | Qué contiene | Acceso del paciente |
|---|---|---|
| **Nota de sesión** (progress note) | Diagnóstico, plan, intervenciones, progreso. **Parte del expediente** | ✅ Sí |
| **Nota de proceso** (psychotherapy note) | Hipótesis, contratransferencia, conjeturas. **Ayuda de memoria del clínico** | ❌ No (bajo HIPAA) |

> **HIPAA §164.501:** la protección está **condicionada a la separación física**.
> *"Si se almacenan junto al expediente clínico, o son accesibles a otros clínicos o personal más allá del autor, **pierden el estatus protegido**."*

**Implicación de arquitectura:** `ProcessNote` debe ser **tabla separada**, no `isPrivate: boolean` en la nota. Un flag en la misma tabla anula la protección y además filtra en exports, búsquedas y requerimientos judiciales.

> ⚠️ **Costa Rica — no prometer lo que la ley no da.** El [Código de Ética del CPPCR](https://uccap.net/wp-content/uploads/2024/10/CRI-CED-del-CPPCR.pdf) (vigente 2019) **no tiene figura equivalente**. No existe categoría legal de nota privada con protección diferenciada.
> Separarlas sigue siendo correcto (soporta HIPAA si el SaaS se expande, reduce daño ante divulgación), pero **hay que asumir que todo lo registrado es potencialmente accesible al titular**.

### 🔴 2. Retención: 10 años — más estricto que audiología

**Art. 22 CPPCR:** conservar documentos físicos y digitales **mínimo 10 años** tras finalizar la contratación. Vencido el plazo, conservar el material relevante en formato digital.

> Contra los 5 años de NOM-004. **Implica soft-delete obligatorio y bloqueo de borrado duro.**
> Refuerza la decisión de append-only (§3.1) — ya no es solo audiología.

### 🔴 3. El formato de nota no es universal

SOAP viene de medicina y **en psicología compite con alternativas que ajustan mejor** (la distinción subjetivo/objetivo es incómoda cuando casi todo es relato del paciente):

| Formato | Bloques | Uso |
|---|---|---|
| **SOAP** | Subjetivo, Objetivo, Análisis, Plan | Entornos médicos, psiquiatría |
| **DAP** | Datos, Análisis, Plan | Consulta privada — el más simple |
| **BIRP** | Conducta, Intervención, Respuesta, Plan | Salud conductual |
| **GIRP** | Objetivo, Intervención, Respuesta, Plan | Terapia orientada a objetivos |

> **Corrige §1:** SOAP **no** es el esqueleto universal que asumí. Modelar como `formatoNota` + bloques tipados, **no** como columnas fijas `subjetivo/objetivo/…`.
> Audiología no tiene este problema — la audiometría tiene estructura única.

### Test psicológico ≠ audiometría

El resultado es **multicapa**, no un número:

```ts
ResultadoTest {
  puntajeBruto: number
  puntajeTransformado: number      // percentil, T, eneatipo
  baremoUsado: string              // ← CRÍTICO, sin equivalente en audiología
  categoriaInterpretativa: string  // mínima/leve/moderada/grave
  narrativa: string
}
```

> **`baremoUsado` es indispensable:** el mismo puntaje bruto cambia de categoría según la adaptación (española, peruana, costarricense). **Art. 30 CPPCR** exige instrumentos adaptados a población de CR o similar.

**Restricciones deontológicas con lectura informática directa:**

- **Art. 28** — en clínica **no se puede diagnosticar solo con un instrumento**. El test es auxiliar.
- **Art. 20** — prohibido suministrar material de test a personas no habilitadas → **los protocolos no deben ser visibles a roles administrativos**. El modelo actual de `PatientDocument` asume visibilidad uniforme.
- **Copyright** — el SaaS **no debe reproducir los ítems** de BDI-II/BAI. Sí puede almacenar resultados y adjuntar el protocolo escaneado.

### Historia clínica psicológica

~13 bloques, mayormente **narrativos** (vs. audiología, centrada en valores numéricos): identificación, motivo de consulta (textual), historia del problema, antecedentes psicológicos y médicos, historia del desarrollo, historia familiar, escolar/laboral, social y afectiva, **examen del estado mental**, **evaluación de riesgo** (suicida/homicida — alta criticidad), impresión diagnóstica, plan, consentimiento informado.

> Encaja con `ClinicalTemplate` (§4.2). Modelar como **secciones actualizables**, no captura única inmutable.

---

## 5. Preguntas abiertas — requieren decisión

| # | Pregunta | Por qué importa |
|---|---|---|
| 1 | ¿Migrar los `MedicalControl` existentes o empezar limpio? | Si hay datos reales en producción, la migración de `findings.audiogram` a `Estudio` necesita script |
| 2 | ¿Append-only desde ya? | Decisión de arquitectura. Barato ahora, caro después |
| 3 | ¿Escala WHO 2021 o BIAP? | Afecta clasificaciones ya mostradas al usuario |
| 4 | ¿Alcance del MVP multi-especialidad? | ¿Se generaliza el motor ahora, o primero se arregla audiología y se generaliza después? |
| 5 | Propiedad del expediente en CR | Requiere abogado local (§3.1) |

---

## 6. Fuentes

**Normativa**
- [NOM-004-SSA3-2012 — Del expediente clínico (texto íntegro)](https://www.farmacopea.org.mx/Repositorio/LegislacionFiles/NOM-004-SSA3-2012_15oct12.pdf)
- [Valerio Monge & Ugalde Lobo — "El derecho del paciente al uso correcto del expediente clínico" (BINASSS, CR)](https://www.binasss.sa.cr/revistas/rldmml/v2-3n2-1/art3.pdf)
- [Ley N° 8239 — Derechos y deberes de personas usuarias de servicios de salud (CR)](https://iafa.go.cr/wp-content/uploads/2025/01/Derechos-y-deberes-de-las-personas-usuarias-de-los-servicios-de-salud-publicos-y-privados.pdf)
- [Ley N° 8968 — Protección de datos personales (CR)](https://micitt.go.cr/node/370)
- [Código de Ética Médica 2016 — Colegio de Médicos y Cirujanos de CR](https://www.medicos.cr/website/documentos/NormativaLegal/NormasFundamentales/Co%CC%81digo%20de%20E%CC%81tica%20Me%CC%81dica%202016.pdf)

**Clasificación audiométrica**
- [BIAP Rec. 02/1 — Audiometric Classification of Hearing Impairments](https://www.biap.org/es/recommandations/recommendations/tc-02-classification/213-rec-02-1-en-audiometric-classification-of-hearing-impairments/file)
- [WHO — World Report on Hearing (2021)](https://www.efhoh.org/wp-content/uploads/2021/03/World-Hearing-Report.pdf)

**Procedimientos y símbolos**
- [ASHA — Guidelines for Audiometric Symbols (1990)](https://www.asha.org/policy/gl1990-00006/)
- [NTP 285: Audiometría tonal liminar — vía ósea y enmascaramiento (INSST)](https://www.insst.es/documentacion/colecciones-tecnicas/ntp-notas-tecnicas-de-prevencion/8-serie-ntp-numeros-261-a-295-ano-1992/ntp-285-audiometria-tonal-liminar-via-osea-y-enmascaramiento)
- [Logoaudiometría — Revista Auditio](https://journal.auditio.com/auditio/article/download/15/116)
- [Timpanometría en Atención Primaria — Rev Pediatr Aten Primaria (SciELO)](https://scielo.isciii.es/scielo.php?script=sci_arttext&pid=S1139-76322016000100018)

**SOAP**
- [Elaboración de nota SOAP — UNAM FES Iztacala](https://www.medicinaconductual-unam-fesi.org/uploads/1/0/3/4/103420148/elaboraci%C3%B3n_de_nota_soap_y_examen_mental.pdf)

**Ciclo de vida del audífono**
- [American Academy of Audiology — Improving the Patient Experience](https://www.audiology.org/clinical-resources/improving-the-patient-experience/)
- [Post-Fitting Needs for New Hearing Aid Users (PMC)](https://pmc.ncbi.nlm.nih.gov/articles/PMC9325088/)
