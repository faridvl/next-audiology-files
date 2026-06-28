# MOCKS.md

Pages and components with hardcoded/mocked data. Every item here is a pending integration task.

---

## 1. Appointment Types list

**Archivo:** `src/components/containers/appointment-types/appointment-types-container.tsx:39-45`
**Datos hardcodeados:**
```ts
const serviceTypes = [
  { id: '1', name: 'Consulta General', duration: '30 min', price: '50.00', speciality: 'GENERAL', color: 'blue' },
  { id: '2', name: 'Seguimiento Crónico', ... },
  { id: '3', name: 'Calibración de Audífonos', ... },
  { id: '4', name: 'Audiometría Clínica', ... },
  { id: '5', name: 'Limpieza Dental', ... },
]
```
**Endpoint que debería consumir:** `GET /appointment-types` — **endpoint faltante en API**
**Estado:** 🔗 bloqueado — endpoint no existe aún

---

## 2. Appointment Type create form

**Archivo:** `src/components/containers/appointment-types/add-appointment-type/use-appointment-type-form.tsx:48-58`
**Datos hardcodeados:** `handleSubmit` hace `console.log` + `setTimeout(1000ms)` simulando carga. No llama al API.
**Endpoint que debería consumir:** `POST /appointment-types` — **endpoint faltante en API**
**Estado:** 🔗 bloqueado — endpoint no existe aún

---

## 3. Appointment services catalog (create appointment form)

**Archivo:** `src/components/containers/appointment/add-appointment/use-add-appointment.ts:26-37`
**Datos hardcodeados:**
```ts
const servicesCatalog = {
  AUDIOLOGY: [{ id: '8e3677b3-b64c-4978-9271-26c15cb41988', label: 'Audiometría Tonal' }],
  DENTAL: [{ id: '8e3677b3-b64c-4978-9271-26c15cb41988', label: 'Limpieza / Profilaxis' }, ...],
  GENERAL: [{ id: '8e3677b3-b64c-4978-9271-26c15cb41988', label: 'Consulta General' }],
}
// All services share the SAME fake UUID
```
**Endpoint que debería consumir:** `GET /appointment-types` — **endpoint faltante en API**
**Estado:** 🔗 bloqueado — esto envía UUIDs falsos al crear citas

---

## 4. Manage Appointment page

**Archivo:** `src/components/containers/appointment/manage-appointment/use-manage-appointment.tsx`
**Datos hardcodeados:** No fetching del appointment (query comentada). `formData` empieza vacío. `handleConfirm` y `handleNoAnswer` no llaman al API (PATCH comentado).
**Endpoint que debería consumir:**
- `GET /appointments/:uuid` — para cargar datos actuales
- `PATCH /appointments/:uuid` — para confirmar/reagendar
**Estado:** pendiente — endpoints existen en la API pero no están conectados

---

## 5. User detail page

**Archivo:** `src/pages/users/[id]/index.tsx:20-37`
**Datos hardcodeados:**
```ts
const user = {
  name: 'Dr. Roberto Gómez',
  role: 'Médico Especialista',
  email: 'roberto.g@clinica.com',
  phone: '+52 55 1234 5678',
  patientHistory: [{ id: 'p1', name: 'Juan Pérez', ... }, ...]
  // "Total: 142" hardcoded
}
```
**Endpoint que debería consumir:** `GET /users/:uuid` — **endpoint faltante en API**
**Estado:** 🔗 bloqueado — endpoint no existe aún

---

## 6. User edit page

**Archivo:** `src/pages/users/edit/[id]/index.tsx:24-36`
**Datos hardcodeados:** `setTimeout(800ms)` rellena el form con "Dr. Roberto Gómez". `handleSubmit` hace `console.log` y redirige.
**Endpoint que debería consumir:** `GET /users/:uuid` + `PATCH /users/:uuid` — **endpoints faltantes en API**
**Estado:** 🔗 bloqueado — endpoints no existen aún

---

## 7. Documents view (patient documents tab)

**Archivo:** `src/components/containers/documents/use-documents.tsx:23-28`
**Datos hardcodeados:**
```ts
const MOCK_DOCUMENTS: DocumentItem[] = [
  { id: '1', patientId: 'MS-9920', name: 'Factura_Phonak_Audeo.pdf', ... },
  { id: '2', patientId: 'MS-9920', name: 'Garantia_Limitada_3Anos.png', ... },
  ...
]
// belongsToPatient is hardcoded to `true` (line 49), so ALL mock docs show for ALL patients
```
**Endpoint que debería consumir:** No existe un endpoint de documentos en la API. Requiere diseño completo (storage + endpoint).
**Estado:** 🔗 bloqueado — endpoint faltante en API (feature sin diseñar)

---

## 8. New medical control form

**Archivo:** `src/components/containers/controls/new-control/use-new-control.ts:33-35`
**Datos hardcodeados:** `handleSave` solo hace `console.log('Guardando...', formData)`. El formulario nuevo (`new-control-container.tsx`) no está conectado a `POST /medical-controls`.
**Endpoint que debería consumir:** `POST /medical-controls`
**Estado:** pendiente — el endpoint existe y tiene mutation implementada (`medical-control-mutation.ts`), pero el nuevo contenedor no la importa

---

## 9. Medical control detail — campos del paciente

**Archivo:** `src/components/containers/control-detail/use-control-detail.ts`
**Datos hardcodeados:**
```ts
gender: 'NO REGISTRADO',   // API Patient aún no retorna gender
bloodType: 'NO REGISTRADO', // API Patient aún no retorna bloodType
```
**Estado:** ✅ `institution` ahora viene de `tenant.businessName` (useSession). `specialistName` viene de `user.fullName`. Solo `gender`/`bloodType` siguen como placeholder — requieren migración de DB (P3-7).

---

## 10. Patient summary header

**Archivo:** `src/components/containers/patient-summary/use-patient-summary-header.ts:30-36`
**Datos hardcodeados:**
```ts
bloodType: 'O+',
lastVisit: 'TODO(!): pendiente de agregar',
mainDiagnosis: 'TODO(!): pendiente de agregar',
observations: 'TODO(!): pendiente de agregar',
```
**Endpoint que debería consumir:** `GET /patients/:uuid` (para bloodType) + `GET /medical-controls/patient/:uuid` (para lastVisit, mainDiagnosis)
**Estado:** 🔗 parcialmente bloqueado — `bloodType` requiere campo nuevo en DB

---

## 11. Settings page (business configuration)

**Archivo:** `src/pages/settings/index.tsx`
**Estado:** ✅ `businessName`, `businessType` y `plan` ahora se cargan desde `useSession()` → `GET /auth/me`. El botón "Actualizar Clínica" sigue sin conectar (requiere `PATCH /tenants/:uuid` — P3-8).

---

## 12. Profile page

**Archivo:** `src/pages/profile/index.tsx`
**Datos hardcodeados:** Formulario estático vacío. No carga datos del usuario actual. No guarda.
**Endpoint que debería consumir:** `GET /auth/me` (para cargar datos) + `PATCH /users/:uuid` (para guardar)
**Estado:** 🔗 parcialmente bloqueado — carga posible con `GET /auth/me`; guardado requiere `PATCH /users/:uuid` (no existe en API)

---

## 13. Report Template page

**Archivo:** `src/pages/report-template/create.tsx`
**Datos hardcodeados:** UI completamente estática. `getServerSideProps` comentado = sin auth guard.
**Endpoint que debería consumir:** No definido. Feature sin diseñar.
**Estado:** 🔗 bloqueado — feature sin diseño ni endpoint en API. Además, la página es públicamente accesible (bug de seguridad).

---

## Resumen

| # | Feature | Endpoint faltante en API | Pendiente solo de conexión |
|---|---------|--------------------------|---------------------------|
| 1 | Appointment Types list | ✅ `GET /appointment-types` | |
| 2 | Appointment Type create | ✅ `POST /appointment-types` | |
| 3 | Services in create appointment | ✅ `GET /appointment-types` | |
| 4 | Manage appointment | | ✅ (`GET /appointments/:uuid` + `PATCH /appointments/:uuid` existen) |
| 5 | User detail | ✅ `GET /users/:uuid` | |
| 6 | User edit | ✅ `PATCH /users/:uuid` | |
| 7 | Patient documents | ✅ (storage + endpoint sin diseñar) | |
| 8 | New medical control | | ✅ (mutation existe, no conectada) |
| 9 | Control detail patient fields | ✅ (gender/bloodType en DB) | parcial |
| 10 | Patient summary header | ✅ (bloodType en DB) | parcial |
| 11 | Settings / tenant edit | ✅ `PATCH /tenants/:uuid` | |
| 12 | Profile page | ✅ `PATCH /users/:uuid` | parcial |
| 13 | Report template | ✅ (feature completa sin diseñar) | |
