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

## Endpoints currently consumed by the site

### Identity Service (`NEXT_PUBLIC_IDENTITY_API_URL`)

| Method | Endpoint | File | Notes |
|--------|----------|------|-------|
| POST | `/auth/login` | `mutations/auth/use-login-mutation.ts` | Returns `access_token` + `user` |
| POST | `/auth/register` | `mutations/auth/use-register-mutation.ts` | Creates Tenant + User |
| GET | `/auth/me` | `hooks/use-session.ts` | Used everywhere for user context |
| POST | `/users` | `mutations/users/create-user-matation.ts` | Note typo in filename |
| GET | `/users` | `querys/user-query.ts` | `?page&limit&role` filter |

### Medical Records Service (`NEXT_PUBLIC_MEDICAL_RECORDS_API_URL`)

| Method | Endpoint | File | Notes |
|--------|----------|------|-------|
| POST | `/patients` | `mutations/patients/create-patients-mutation.ts` | |
| GET | `/patients` | `querys/patients-query.ts` | `?page&limit&search` |
| GET | `/patients/:uuid` | `querys/get-patient-query.ts` | |
| POST | `/appointments` | `mutations/appointments/create-appointment-mutation.ts` | |
| GET | `/appointments` | `querys/appointments-query.ts` | **BUG: params not sent** (see below) |
| GET | `/appointments/patient/:uuid` | `querys/get-appoinment-by-patient-query.ts` | |
| POST | `/medical-controls` | `mutations/medical-control-mutation/medical-control-mutation.ts` | **NOT connected to form** (see MOCKS.md) |
| GET | `/medical-controls/patient/:uuid` | `querys/get-medical-controls-query.ts` | |
| GET | `/medical-controls/:uuid` | `querys/medical-controls-query.ts` | |
| POST | `/products` | `mutations/inventory/inventory-mutation.ts` | |
| GET | `/products` | `querys/inventory/inventory-query.ts` | `?includeInactive` |
| GET | `/products/:uuid` | `querys/inventory/get-product-query.ts` | |
| PATCH | `/products/:uuid` | `mutations/inventory/inventory-mutation.ts` | |

## Endpoints from the API that the site does NOT yet consume

| Method | Endpoint | Needed for | Status |
|--------|----------|------------|--------|
| GET | `/appointments/:uuid` | `ManageAppointmentContainer` — to load the appointment being edited | Not connected |
| PATCH | `/appointments/:uuid` | `ManageAppointmentContainer` — confirm/reschedule logic | Not connected; code is dead (no mutation called) |
| DELETE | `/appointments/:uuid` | Appointment deletion | Commented out in API — not functional |
| GET | `/users/:uuid` | `UserDetailPage` — currently fully mocked | Endpoint does not exist in API |
| PATCH | `/users/:uuid` | `EditUserPage` — currently fully mocked | Endpoint does not exist in API |

## Endpoints the site needs that do NOT exist in the API yet

These must be implemented in the API before connecting the site:

| Endpoint | Needed for | Priority |
|----------|------------|----------|
| `GET /appointment-types` | `AppointmentTypesContainer` list (currently hardcoded array) | HIGH |
| `POST /appointment-types` | `AppointmentTypeForm` create (currently console.log + fake delay) | HIGH |
| `PATCH /appointment-types/:uuid` | Edit appointment type | MEDIUM |
| `DELETE /appointment-types/:uuid` | Delete appointment type | MEDIUM |
| `GET /users/:uuid` | User detail page | MEDIUM |
| `PATCH /users/:uuid` | User edit page | MEDIUM |
| `GET /auth/me` extended | Profile page (currently static form) | LOW |

Note: `AppointmentType` table exists in the DB schema (`DATABASE.md`) but has no API endpoints exposed yet.

## Inconsistencies between site expectations and API reality

### 1. ~~Appointment response shape — `schedule` nesting~~ ✅ RESUELTO
`mapToDomain` en `appointments.storage.ts` ya nesta `date/startTime/endTime` bajo `schedule` y construye `patientName` desde `patient.firstName + lastName`. El site accede correctamente `raw.schedule.startTime` y `raw.patientName`.

**Problema real descubierto (fix/p0-1):** El filtro de fecha usaba igualdad exacta (`date: new Date(date)`) pero las citas se almacenan con hora en el campo `date`. Fix: filtrar por rango en `startTime` (`gte`/`lt`). El campo `date` en el create del site ahora se envía como medianoche UTC separado de `startTime`.

### 2. ~~Appointment `patientName` field~~ ✅ RESUELTO
`mapToDomain` incluye `patientName`. El site accedía `raw.patient?.uuid` para el patientUUID pero la API devuelve `raw.patientUUID` (campo plano). Fix en `use-appointment-list-container.ts`.

### 3. `GET /appointments` query params not sent (BUG)
`src/shared/api/querys/appointments-query.ts` line 17 builds `URLSearchParams` with `page`, `limit`, `date` but then calls:
```ts
return await ApiServiceClient(APPOINTMENTS_URL).get<any>(`/appointments`);
// Should be: .get<any>(`/appointments?${params}`)
```
Result: every appointment fetch returns ALL appointments for the tenant with no date/page filtering.

### 4. `GET /appointments/patient/:uuid` response shape
Frontend (`get-appoinment-by-patient-query.ts`) expects `{ patient: { phone, email, idNumber }, appointments: [...] }`. API docs document only `{ patient: { uuid, name }, appointments: [...] }`. Fields `phone`, `email`, `idNumber` may be missing, causing WhatsApp redirect to fail or use a fallback hardcoded number (`88165808`).

### 5. `useSession` user field name
`use-session.ts` expects `data.user.fullName`. The API's `User` DB column is `name` but the domain layer maps it to `fullName`. This should work, but must be verified when adding user management features.

### 6. `AppointmentType` type mismatch
Frontend type `AppointmentType` has `id: string` but DB uses `uuid` as public identifier. The `typeUUID` field in appointment payload sends the UUID correctly, but the type definition uses `id` instead of `uuid` as the field name.
