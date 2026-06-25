# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Inicio de sesión — OBLIGATORIO

**Antes de responder cualquier tarea, leer `.claude/CHANGES.md`.**  
Contiene el branch activo, el próximo paso y la cola de trabajo pendiente.  
Sin leerlo, es imposible saber dónde se quedó la sesión anterior.

## What is this project

**Zynka** — Next.js SaaS frontend for a multi-tenant medical management system (primary use case: audiology clinics). Connects to a NestJS API monorepo (`standard-saas-api`) that provides two services: Identity (port 7170) and Medical Records (port 7071).

## Stack & exact versions

- **Framework:** Next.js 14.2.4 (Pages Router — NOT App Router)
- **Language:** TypeScript 5.x
- **Styling:** Tailwind CSS 3.4 + SCSS (`styles/globals.scss`)
- **Data fetching:** TanStack React Query 5.x
- **Forms:** Formik 2.x + Yup (some pages use react-hook-form)
- **Auth:** Cookie-based JWT stored in `SESSION_ACCESS_TOKEN` cookie (1 hour TTL)
- **i18n:** i18next + react-i18next (locale: `es`, translations in `src/static/texts/es.json`)
- **UI components:** Lucide React icons, Headless UI, Sonner (toasts)
- **Package manager:** Yarn

## Running locally

```bash
yarn          # install deps
yarn dev      # dev server on :3000
yarn lint     # ESLint
```

No build scripts for the frontend itself; styles are compiled separately via PostCSS:
```bash
yarn build:styles   # one-time compile
yarn watch:styles   # watch mode
```

## Environment variables

Create `.env.local` at the project root:

```env
NEXT_PUBLIC_IDENTITY_API_URL=http://localhost:7170
NEXT_PUBLIC_MEDICAL_RECORDS_API_URL=http://localhost:7071
```

Both vars are consumed in `src/shared/api/config.ts`. There is no fallback — missing vars make all API calls fail silently.

## .claude/ index

| File | Purpose |
|------|---------|
| [ARCHITECTURE.md](.claude/ARCHITECTURE.md) | Folder structure, routing, state, auth guard pattern |
| [API_CONTRACT.md](.claude/API_CONTRACT.md) | How the site connects to the API, endpoints consumed, inconsistencies |
| [MOCKS.md](.claude/MOCKS.md) | Pages/components with hardcoded data, per-item integration status |
| [PATTERNS.md](.claude/PATTERNS.md) | Component conventions, data fetching patterns, typing rules |
| [CHANGES.md](.claude/CHANGES.md) | Completed / in-progress / pending / blocked work |
| [PENDING.md](.claude/PENDING.md) | Lista unificada de pendientes con prioridad, esfuerzo y definición de MVP |

## Related repos

| Repo | Location |
|------|----------|
| API (local) | `C:\Users\Personal\Desktop\standard-saas-api` |
| API (GitHub) | https://github.com/faridvl/standard-saas-api.git |
| Site (local) | `D:\Documentos\Proyectos\React\next-audiology-files` |
| Site (GitHub) | https://github.com/faridvl/next-audiology-files.git |

## Mandatory cross-repo rule

**Any feature that requires data from the API must be implemented in the API first, then here.**  
Read `.claude/API_CONTRACT.md` before consuming any endpoint.  
Do not implement anything in the site that depends on an endpoint that does not yet exist in the API.

## Regla de features cross-repo

Cuando implementes un endpoint nuevo o lo modifiques:
1. Actualiza `.claude/ENDPOINTS.md` con el contrato exacto antes de terminar
2. El site leerá ese contrato — incluir tipos de request/response precisos
3. Marcar en `.claude/CHANGES.md` qué cambió

Los incompletos que más afectan al site:
- `DELETE /appointments/:uuid` — site lo necesita para cancelar citas
- `followUp` — formulario en site lo envía pero API lo descarta silenciosamente
- `AppointmentType` endpoints (`GET/POST`) — sin estos el form de nueva cita no puede poblar el selector de tipos
