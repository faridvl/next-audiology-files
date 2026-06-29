# ARCHITECTURE.md

## Folder structure

```
src/
├── pages/              # Next.js Pages Router — each file = a route
├── components/
│   ├── common/         # Shared UI primitives (Button, Table, Typography, Input, Sidebar, etc.)
│   └── containers/     # Feature containers — one folder per feature, pattern: {container}.tsx + use-{container}.ts
├── shared/
│   ├── api/
│   │   ├── config.ts               # env vars (IDENTITY_URL, MEDICAL_RECORDS_URL)
│   │   ├── api-service-client.ts   # single fetch wrapper (get/post/patch/put/delete)
│   │   ├── mutations/              # useApiMutation wrappers per resource
│   │   └── querys/                 # useQuery wrappers per resource (note: typo "querys" is intentional in codebase)
│   ├── constants/
│   │   └── sidebar.ts              # NAVIGATION_PATHS array (menu items)
│   ├── navigation/
│   │   └── routes.ts               # routesPrivate / routesPublic — source of truth for all paths
│   ├── context/                    # NavigationContextProvider, DashboardContextProvider
│   ├── i18n/                       # i18next setup
│   └── utils/
│       └── cookies-manager.ts      # JWT cookie read/write (CookiesManager class)
├── hocs/
│   └── auth.tsx                    # authorizeServerSidePage / unauthorizeServerSidePage
├── hooks/
│   ├── use-navigation.ts           # All push() calls live here — import this instead of useRouter directly
│   ├── use-session.ts              # Fetches GET /auth/me, returns user + tenant
│   └── use-logout.ts
├── types/
│   ├── auth/                       # LoginResponse, UserSessionResponse, UserRole, BusinessType, RegisterPayload
│   ├── appointments/               # Appointment, AppointmentStatus, AppointmentType
│   ├── patients/                   # Patient (incluye gender, bloodType, documentId, occupation)
│   ├── medical-controls/           # MedicalControl, MedicalSpeciality (= ControlType), AudiologyFindings
│   ├── maintenance/                # MaintenanceEntity, CreateMaintenancePayload
│   ├── inventory/                  # Product, ProductStock
│   ├── pdf/                        # PdfReportProps
│   ├── otros/                      # ClinicalControl, ControlType (re-export), PaginatedResponse
│   └── users/                      # User (uuid, fullName, role, specialty, status)
└── static/texts/                   # i18n JSON files (es.json)
```

## Routing (Pages Router)

All routes use `getServerSideProps` with `authorizeServerSidePage()` for auth guarding — this checks for a JWT cookie server-side and redirects to `/login` if missing.

All pages including `src/pages/report-template/create.tsx` have `authorizeServerSidePage()` — no known exceptions.

Route definitions live in `src/shared/navigation/routes.ts`. All navigation calls go through `useNavigation()` hook — **never call `router.push()` directly in components**.

### Known routing behavior

`src/shared/constants/sidebar.ts` — el sidebar incluye una entrada que apunta a `routesPrivate.reportTemplate.create` (`/report-template/create`), que existe y tiene auth guard. No hay bug de routing activo conocido.

## State management

No global state store (no Redux, Zustand, or Context for app data). State is:
- **Server state:** TanStack React Query (query cache, mutations)
- **Auth state:** JWT cookie + `useSession()` hook (calls `GET /auth/me`, staleTime 30 min)
- **UI state:** local `useState` in container hooks

QueryClient is created once in `_app.tsx` with `refetchOnWindowFocus: false` and `retry: 1`.

## Styles

Tailwind CSS 3.4 is the primary styling system. Global SCSS lives in `src/styles/globals.scss` and is compiled separately via PostCSS. **No CSS Modules.**

Design tokens that matter:
- Primary brand color: `#1E3A8A` (used directly as inline Tailwind arbitrary values)
- Background: `#F8FAFC`
- Border radius convention: large rounded corners (`rounded-2xl`, `rounded-[2.5rem]`, `rounded-[40px]`)

## Auth guard pattern

```tsx
// Protected page
export const getServerSideProps = authorizeServerSidePage();

// Public page (redirect to dashboard if already logged in)
export const getServerSideProps = unauthorizeServerSidePage();
```

`authorizeServerSidePage` reads `SESSION_ACCESS_TOKEN` cookie server-side and injects `userName` from `SESSION_USER_NAME` cookie as a prop. Client-side auth data comes from `useSession()`.

## API client

`ApiServiceClient(baseUrl)` is a thin factory that reads the JWT from cookies and attaches it as `Authorization: Bearer <token>`. Returns typed responses via generic type params (though generics are currently not enforced — responses are cast as `any` in many places).

Two base URLs:
- `env.API.IDENTITY_URL` → Identity Service (users, auth)
- `env.API.MEDICAL_RECORDS_URL` → Medical Records Service (patients, appointments, controls, products)

## Component conventions

See `.claude/PATTERNS.md` for the full container/hook split convention.
