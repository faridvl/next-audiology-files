# API_CONTRACT.md

Full API contract: `C:\Users\Personal\Desktop\standard-saas-api\.claude\ENDPOINTS.md`

## How the site connects to the API

- **Base URLs:** set via env vars in `src/shared/api/config.ts`
  - `NEXT_PUBLIC_IDENTITY_API_URL` → Identity Service
  - `NEXT_PUBLIC_MEDICAL_RECORDS_API_URL` → Medical Records Service
- **HTTP client:** `src/shared/api/api-service-client.ts` — thin `fetch` wrapper, reads JWT from `SESSION_ACCESS_TOKEN` cookie, sets `Authorization: Bearer <token>` on every request
- **Data fetching library:** TanStack React Query 5.x
  - Queries: `src/shared/api/querys/` (useQuery wrappers)
  - Mutations: `src/shared/api/mutations/` (useMutation wrappers via `useApiMutation`)

## Auth flow

1. `POST /auth/login` → returns `{ access_token, user: { name, email, tenantUuid } }`
2. Site stores token in `SESSION_ACCESS_TOKEN` cookie (1-hour TTL, `sameSite: lax`, `secure` in prod) via `CookiesManager.setSession()`
3. Every subsequent request reads the cookie client-side and sets the Bearer header
4. `useSession()` calls `GET /auth/me` (staleTime: 30 min) to get full user + tenant data
5. `authorizeServerSidePage()` validates cookie presence server-side via `getServerSideProps`
6. No token refresh — session expires after 1 hour; user must re-login

## Endpoints consumed by the site

### Identity Service (`NEXT_PUBLIC_IDENTITY_API_URL`)

| Method | Endpoint | Archivo | Notas |
|--------|----------|---------|-------|
| POST | `/auth/login` | `mutations/auth/use-login-mutation.ts` | Devuelve `access_token` + `user` |
| POST | `/auth/register` | `mutations/auth/use-register-mutation.ts` | Crea Tenant + User (businessType, isSpecialist, specialty, phone) |
| GET | `/auth/me` | `hooks/use-session.ts` | Devuelve `user` + `tenant`. staleTime 30 min |
| POST | `/users` | `mutations/users/create-user-matation.ts` | Nota: typo en filename |
| GET | `/users` | `querys/user-query.ts` | `?page&limit&role&search` |
| GET | `/users/:uuid` | `querys/get-user-query.ts` | User detail |
| PATCH | `/users/:uuid` | `mutations/users/update-user-mutation.ts` | Actualiza `fullName`, `phoneNumber`, `specialty` |
| DELETE | `/users/:uuid` | `mutations/users/delete-user-mutation.ts` | |
| PATCH | `/tenants/:uuid` | `mutations/tenants/update-tenant-mutation.ts` | Actualiza `businessName`, `businessType` |

### Medical Records Service (`NEXT_PUBLIC_MEDICAL_RECORDS_API_URL`)

| Method | Endpoint | Archivo | Notas |
|--------|----------|---------|-------|
| POST | `/patients` | `mutations/patients/create-patients-mutation.ts` | |
| GET | `/patients` | `querys/patients-query.ts` | `?page&limit&search` |
| GET | `/patients/:uuid` | `querys/get-patient-query.ts` | Incluye `gender`, `bloodType`, `documentId`, `occupation` |
| PATCH | `/patients/:uuid` | `mutations/patients/update-patient-mutation.ts` | |
| GET | `/appointment-types` | `querys/appointment-types-query.ts` | |
| POST | `/appointment-types` | `mutations/appointment-types/` | |
| POST | `/appointments` | `mutations/appointments/create-appointment-mutation.ts` | |
| GET | `/appointments` | `querys/appointments-query.ts` | **BUG: params no enviados (ver inconsistencias)** |
| GET | `/appointments/:uuid` | `querys/get-appointment-query.ts` | |
| GET | `/appointments/patient/:uuid` | `querys/get-appoinment-by-patient-query.ts` | |
| PATCH | `/appointments/:uuid` | `mutations/appointments/update-appointment-mutation.ts` | |
| DELETE | `/appointments/:uuid` | `mutations/appointments/delete-appointment-mutation.ts` | |
| POST | `/medical-controls` | `mutations/medical-control-mutation/medical-control-mutation.ts` | `header.encounterUuid` opcional/nullable — vincula el control al `Encounter` de la visita (S4) |
| GET | `/medical-controls/patient/:uuid` | `querys/get-medical-controls-query.ts` | Listado paginado. **No filtra por especialidad** (NOM-004 5.14 — un solo expediente). 403 si `user.role === STAFF` |
| GET | `/medical-controls/:uuid` | `querys/medical-controls-query.ts` | Detail. 403 si `user.role === STAFF` |
| GET | `/patients/:uuid/background` | `querys/patient-background-query.ts` | Antecedentes clínicos. 403 si `user.role === STAFF` |
| GET | `/patients/:uuid/documents` | `querys/patient-documents-query.ts` | Listado de documentos administrativos/clínicos. Visible para todos los roles incluido STAFF |
| POST | `/patients/:uuid/documents` | `mutations/documents/upload-document-mutation.ts` | Sube a R2. **Devuelve 500 en producción — ver Inconsistencias #7** |
| POST | `/maintenance` | `mutations/maintenance/create-maintenance-mutation.ts` | `encounterUuid` opcional/nullable — vincula el mantenimiento al `Encounter` de la visita (S4) |
| GET | `/maintenance/patient/:uuid` | `querys/maintenance-query.ts` | Para `warrantyExpiration` en patient detail |
| POST | `/encounters` | `mutations/encounters/create-encounter-mutation.ts` | Abre un `Encounter` (visita). 403 si `role === STAFF` |
| GET | `/encounters/patient/:uuid` | `querys/encounters-query.ts` | Lista para agrupar el timeline del expediente. Sin paginar |
| GET | `/encounters/:uuid` | `querys/encounters-query.ts` | Detalle con `medicalControls` + `maintenances` + `studies` anidados |
| PATCH | `/encounters/:uuid/close` | `mutations/encounters/close-encounter-mutation.ts` | Cierra el encuentro. Idempotente si ya está `CLOSED` |
| POST | `/studies` | `mutations/studies/create-study-mutation.ts` | Crea un `Study` (medición estructurada, ej. audiometría). Inmutable — sin `PATCH`/`PUT` |
| GET | `/studies/patient/:uuid` | `querys/studies-query.ts` | Lista todos los estudios del paciente, más reciente primero |
| GET | `/studies/:uuid` | `querys/studies-query.ts` | Detalle de un estudio |
| POST | `/products` | `mutations/inventory/inventory-mutation.ts` | Body incluye `brand` (opcional) |
| GET | `/products` | `querys/inventory/inventory-query.ts` | `?includeInactive` |
| GET | `/products/:uuid` | `querys/inventory/get-product-query.ts` | |
| PATCH | `/products/:uuid` | `mutations/inventory/inventory-mutation.ts` | Body incluye `brand` (opcional) |
| POST | `/products/:uuid/units/bulk` | `mutations/inventory/product-unit-mutation.ts` | Crea N unidades (seriales) de golpe |
| GET | `/products/:uuid/units` | `querys/inventory/product-units-query.ts` | `?status=AVAILABLE\|ASSIGNED\|DAMAGED\|RETIRED` |
| PATCH | `/product-units/:uuid` | `mutations/inventory/product-unit-mutation.ts` | status: AVAILABLE\|DAMAGED\|RETIRED |

## Endpoints disponibles en API que el site aún no consume

| Method | Endpoint | Needed for | Estado |
|--------|----------|------------|--------|
| GET | `/maintenance/upcoming` | Dashboard — próximos mantenimientos | Sin UI |
| PATCH | `/appointment-types/:uuid` | Editar tipo de cita | Sin UI |
| DELETE | `/appointment-types/:uuid` | Eliminar tipo de cita | Sin UI |

## Endpoints que el site necesita y NO existen en la API

Ninguno pendiente. `GET/POST /patients/:uuid/documents` **ya existen** en `patient-document.controller.ts` — la entrada previa de este documento estaba desactualizada. El `POST` sí falla en runtime (ver Inconsistencia #7), pero es un problema de configuración, no de código faltante.

## Inconsistencias entre site y API

### 1. ~~Appointment response shape — `schedule` nesting~~ ✅ RESUELTO
`mapToDomain` en `appointments.storage.ts` nesta `date/startTime/endTime` bajo `schedule` y construye `patientName`. El site accede correctamente a `raw.schedule.startTime` y `raw.patientName`.

### 2. ~~Appointment `patientName` field~~ ✅ RESUELTO
`mapToDomain` incluye `patientName`. Fix en `use-appointment-list-container.ts`.

### 3. `GET /appointments` query params no enviados (BUG activo)

`src/shared/api/querys/appointments-query.ts` construye `URLSearchParams` con `page`, `limit`, `date` pero llama:
```ts
return await ApiServiceClient(APPOINTMENTS_URL).get<any>(`/appointments`);
// Debería ser: .get<any>(`/appointments?${params}`)
```
Resultado: devuelve TODAS las citas del tenant sin filtrar por fecha ni página.

### 4. `GET /appointments/patient/:uuid` — campos extras

Frontend espera `{ patient: { phone, email, idNumber }, appointments: [...] }`. La API documenta solo `{ patient: { uuid, name }, appointments: [...] }`. `phone`, `email`, `idNumber` pueden estar ausentes — el redirect a WhatsApp usa un número hardcodeado (`88165808`) como fallback.

### 5. `useSession` — nombre de campo `fullName`

`use-session.ts` espera `data.user.fullName`. El storage de Identity mapea `record.name → fullName` en `findByUuid`. Funciona, pero es frágil si se cambia el mapeo.

### 6. `AppointmentType` — `id` vs `uuid`

El tipo frontend `AppointmentType` usa `id: string` pero la DB usa `uuid` como identificador público. El payload de creación de citas envía `typeUUID` correctamente, pero la definición del tipo es inconsistente.

### 7. `POST /patients/:uuid/documents` — 500 en producción (config, no código)

`StorageService` (`packages/core/src/storage/storage.service.ts`) lee `process.env.CF_ACCOUNT_ID`, `R2_BUCKET_NAME`, `R2_PUBLIC_URL`, `R2_ACCESS_KEY_ID`, `R2_SECRET_ACCESS_KEY` directo, sin declararlas en `env.ts` ni tener fallback — si faltan, el `PutObjectCommand` contra R2 falla y el endpoint devuelve 500. No hay `.env` en el repo local del API. Verificar que estas 5 variables estén configuradas en el entorno donde corre el API (no es un bug de código — es un secreto/config faltante).

### 8. ~~Audiograma guardado como `MedicalControl` falso~~ ✅ RESUELTO (S6, 2026-07-27)

Antes: `consulta-audiograma-container.tsx` creaba un `MedicalControl` con `diagnosis: "Audiograma"` y `findings: { audiogram, type: 'audiogram-only' }` — un resultado de medición disfrazado de diagnóstico (DOMAIN_ANALYSIS.md §2.2).

Ahora: el audiograma se guarda como `Study` (`tipo: AUDIOMETRIA_TONAL`) vía `POST /studies`, con `payload: { OD, OI }` y `documentUuid` opcional si se adjuntó el archivo del equipo. `use-pdf-report.ts` busca el `Study` por `encounterUuid` compartido con el control; si no lo encuentra (registro anterior a esta migración), usa el fallback legacy `findings.audiogram`. Sin migración de datos existentes (decisión tomada) — los registros viejos conservan la forma anterior y siguen leyéndose vía fallback.
