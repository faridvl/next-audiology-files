# Zynka — next-audiology-files

**SaaS frontend para gestión de clínicas médicas (caso de uso primario: audiología)**

Next.js 14 · TypeScript · Tailwind CSS · TanStack React Query · i18next

---

## Instalación

```bash
git clone https://github.com/faridvl/next-audiology-files
yarn
cp .env.local.example .env.local   # configurar URLs de la API
yarn dev                            # :3000
```

Variables requeridas en `.env.local`:

```env
NEXT_PUBLIC_IDENTITY_API_URL=http://localhost:7170
NEXT_PUBLIC_MEDICAL_RECORDS_API_URL=http://localhost:7071
```

---

## Roadmap

> Actualizado al cierre de cada etapa de desarrollo.  
> Detalle completo en [`.claude/PENDING.md`](.claude/PENDING.md) y [`.claude/CHANGES.md`](.claude/CHANGES.md).

### 🔴 P0 — Bugs críticos

| Estado | # | Descripción |
|--------|---|-------------|
| ✅ | P0-1 | Tiempos `--:--` y "Paciente no identificado" en agenda y dashboard |
| ✅ | P0-2 | `GET /appointments` no enviaba `page`, `limit`, `date` al API |
| ✅ | P0-3 | "Tipos de Citas" en sidebar llevaba a 404 |
| ✅ | P0-4 | `report-template/create` sin auth guard (página pública) |
| ✅ | P0-5 | `users/[id]` sin auth guard |
| ⬜ | P0-6 | WhatsApp abre con número hardcodeado `88165808` en vez del teléfono del paciente |
| 🔗 | P0-7 | Nueva cita envía UUID falso como `typeUUID` — bloqueado hasta P1-3 |

### 🟠 P1 — MVP (flujo clínico completo)

**Citas**

| Estado | # | Descripción |
|--------|---|-------------|
| ⬜ | P1-1 | Manage appointment: cargar datos reales y confirmar/reagendar |
| ⬜ | P1-2 | Flujo post-control: tentativa → llamada → confirmada/pendiente |
| ⬜ | P1-3 | AppointmentTypes CRUD (`GET/POST /appointment-types` en API + conexión en site) |
| ⬜ | P1-4 | Filtrar citas por estado + cambio de estado |
| ⬜ | P1-5 | Registro de intentos de llamada en notas de la cita |
| ⬜ | P1-6 | Reagendar automáticamente al siguiente mes si no contesta |

**Controles médicos**

| Estado | # | Descripción |
|--------|---|-------------|
| ⬜ | P1-7 | Conectar form de nuevo control al API (`POST /medical-controls`) |
| ⬜ | P1-8 | Ver última audiometría en detalle de paciente |
| ⬜ | P1-9 | Persistir campo `followUp` en API (solo descomentar bloque) |

**Pacientes**

| Estado | # | Descripción |
|--------|---|-------------|
| ⬜ | P1-10 | Verificar y corregir payload del form de creación de paciente |
| ⬜ | P1-11 | Vista detalle de paciente completa (última visita, diagnóstico) |
| ⬜ | P1-12 | Habilitar `DELETE /appointments/:uuid` en API (solo descomentar) |

**Usuarios y perfil**

| Estado | # | Descripción |
|--------|---|-------------|
| ⬜ | P1-13 | Perfil del médico: cargar datos reales desde `GET /auth/me` |
| ⬜ | P1-14 | `PATCH /users/:uuid` en API + conectar form de perfil y edición |

### 🟡 P2 — Post-MVP

- Archivos adjuntos (garantías, recibos, pruebas externas) — requiere infraestructura de storage
- Reportes PDF de consulta y ficha técnica del paciente
- Vista médico: próxima cita, vencimiento de garantía, pacientes inactivos
- Vincular citas a Google Calendar / Apple Calendar
- i18n completo (eliminar texto hardcodeado en JSX)
- Gestión de datos del tenant (settings)

### ⚪ P3 — Nice-to-have

- Consolidar `AppointmentStatus` enum (duplicado en 3 archivos)
- Paginación global integrada al contexto
- Fix pre-commit hook en API (shebang, `precommit:check`, 73 errores de lint)
- Historial clínico configurable por clínica
- Trabajo interdisciplinario entre especialidades
- Tenant initialization event (EventBridge)

---

## Estructura del proyecto

```
src/
├── pages/              # Next.js Pages Router
├── components/
│   ├── common/         # UI primitivos (Button, Table, Input, Sidebar…)
│   └── containers/     # Feature containers: {feature}.tsx + use-{feature}.ts
├── shared/
│   ├── api/            # ApiServiceClient, queries, mutations
│   ├── navigation/     # routes.ts + useNavigation()
│   └── i18n/           # setup de i18next
├── hooks/              # useSession, useNavigation, useLogout
├── types/              # Tipos por dominio (appointments, patients, users…)
└── static/texts/       # es.json (todas las traducciones)
```

Documentación interna detallada en [`.claude/`](.claude/).

---

## Licencia

MIT
