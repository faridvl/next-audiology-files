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
| POST | `/medical-controls` | `mutations/medical-control-mutation/medical-control-mutation.ts` | |
| GET | `/medical-controls/patient/:uuid` | `querys/get-medical-controls-query.ts` | Listado paginado |
| GET | `/medical-controls/:uuid` | `querys/medical-controls-query.ts` | Detail |
| GET | `/maintenance/patient/:uuid` | `querys/maintenance-query.ts` | Para `warrantyExpiration` en patient detail |
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
| GET | `/patient-background/:uuid` | Antecedentes clínicos del paciente | Query existe (`patient-background-query.ts`), sin UI conectada |

## Endpoints que el site necesita y NO existen en la API

| Endpoint | Needed for | Prioridad |
|----------|------------|-----------|
| `POST /patients/:uuid/documents` | Subir documento de paciente | P1-3 |
| `GET /patients/:uuid/documents` | Listar documentos del paciente | P1-3 |

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
