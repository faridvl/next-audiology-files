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

## Estado actual del proyecto

> Actualizado: 2026-06-28

### Métricas de progreso

| Dimensión | Progreso | Detalle |
|-----------|----------|---------|
| **MVP completado** | **85%** | 12 de 14 ítems P1 resueltos + todos los P0 |
| **App funcional hoy** | **70%** | Flujo principal funciona; faltan P1-4 y P1-14 |
| **Completado del total** | **50%** | P0 ✅ + P1 casi completo; P2 y P3 intactos |

### ¿Qué funciona hoy de punta a punta?

| Módulo | Estado | Notas |
|--------|--------|-------|
| Login / auth | ✅ Completo | JWT en cookie, guard en todas las páginas |
| Dashboard | ✅ Funcional | Citas reales del día, acciones rápidas |
| Pacientes — lista | ✅ Funcional | Búsqueda, paginación conectadas al API |
| Pacientes — detalle | ✅ Funcional | Última visita y diagnóstico desde controles reales |
| Pacientes — crear | ✅ Funcional | Payload correcto, validaciones Yup |
| Citas — agenda | ✅ Funcional | Tiempos y nombre de paciente reales |
| Citas — gestionar | ✅ Funcional | Confirmar, reagendar, no contesta (acumula intentos) |
| Citas — nueva cita | ✅ Funcional | Tipos de cita desde API, sin UUID hardcodeado |
| Controles médicos — nuevo | ✅ Funcional | Se guarda en DB (POST real), followUp persistido |
| Controles médicos — detalle | ✅ Funcional | Datos reales, audiograma, findings |
| Tipos de cita | ✅ Funcional | CRUD conectado al API |
| WhatsApp paciente | ✅ Funcional | Número real del paciente desde API |
| Inventario | ✅ Funcional | Completo (no requería API nuevo) |
| Usuarios — lista | ⚠️ Parcial | Lista ok; edición y eliminación sin endpoint |
| Perfil médico | ⚠️ Parcial | Carga datos reales; guardar cambios bloqueado (P1-14) |
| Documentos / archivos | ⚠️ Mock | UI lista; sin storage backend (P2-1) |
| Filtro/lote de citas | ⬜ Pendiente | P1-4 — solo front, ~1 día |
| Settings del tenant | ⬜ Pendiente | P3-8 — 100% estático |
| Reportes PDF | ⬜ Pendiente | P2-8 — UI estática, sin generación |

---

## Roadmap

> Detalle completo en [`.claude/PENDING.md`](.claude/PENDING.md) y [`.claude/CHANGES.md`](.claude/CHANGES.md).

### 🔴 P0 — Bugs críticos — 7/7 ✅ (100%)

| Estado | # | Descripción |
|--------|---|-------------|
| ✅ | P0-1 | Tiempos `--:--` y "Paciente no identificado" en agenda y dashboard |
| ✅ | P0-2 | `GET /appointments` no enviaba `page`, `limit`, `date` al API |
| ✅ | P0-3 | "Tipos de Citas" en sidebar llevaba a 404 |
| ✅ | P0-4 | `report-template/create` sin auth guard (página pública) |
| ✅ | P0-5 | `users/[id]` sin auth guard |
| ✅ | P0-6 | WhatsApp abría con número hardcodeado en vez del teléfono del paciente |
| ✅ | P0-7 | Nueva cita enviaba UUID falso como `typeUUID` |

### 🟠 P1 — MVP — 13/14 ✅ (93%)

**Citas**

| Estado | # | Descripción |
|--------|---|-------------|
| ✅ | P1-1 | Manage appointment: cargar datos reales y confirmar/reagendar |
| ✅ | P1-2 | Flujo post-control: tentativa → llamada → confirmada/pendiente |
| ✅ | P1-3 | AppointmentTypes CRUD (`GET/POST /appointment-types` en API + site) |
| ⬜ | P1-4 | Filtrar citas por estado + cambio de estado en lote |
| ✅ | P1-5 | Registro de intentos de llamada en notas de la cita |
| ✅ | P1-6 | Reagendar automáticamente al siguiente mes si no contesta |

**Controles médicos**

| Estado | # | Descripción |
|--------|---|-------------|
| ✅ | P1-7 | Conectar form de nuevo control al API (`POST /medical-controls`) |
| ✅ | P1-8 | Ver última audiometría en detalle de paciente |
| ✅ | P1-9 | Persistir campo `followUp` en API |

**Pacientes**

| Estado | # | Descripción |
|--------|---|-------------|
| ✅ | P1-10 | Verificar y corregir payload del form de creación de paciente |
| ✅ | P1-11 | Vista detalle de paciente completa (última visita, diagnóstico) |
| ✅ | P1-12 | Habilitar `DELETE /appointments/:uuid` en API |

**Usuarios y perfil**

| Estado | # | Descripción |
|--------|---|-------------|
| ✅ | P1-13 | Perfil del médico: cargar datos reales desde `GET /auth/me` |
| ⬜ | P1-14 | `PATCH /users/:uuid` en API + conectar form de perfil y edición |

### 🟡 P2 — Post-MVP — 0/15 (0%)

- Archivos adjuntos (garantías, recibos, pruebas externas) — requiere infraestructura de storage
- Reportes PDF de consulta y ficha técnica del paciente
- Vista médico: próxima cita, vencimiento de garantía, pacientes inactivos
- Vincular citas a Google Calendar / Apple Calendar
- i18n completo (eliminar texto hardcodeado en JSX)
- Gestión de datos del tenant (settings)
- `GET /users/:uuid` para user detail y edit
- `search` en `GET /patients` y `role` filter en `GET /users`

### ⚪ P3 — Nice-to-have — 0/8 (0%)

- Consolidar `AppointmentStatus` enum a una sola fuente
- Paginación global integrada al contexto
- Fix pre-commit hook en API (shebang, 73 errores de lint)
- Historial clínico configurable por clínica
- Trabajo interdisciplinario entre especialidades
- Tenant initialization event (EventBridge)
- `gender` y `bloodType` en modelo Patient (requiere migración)
- `tenant.plan` en `GET /auth/me`

---

## ¿Qué falta para llamarlo MVP?

Solo **2 ítems pendientes** de P1:

1. **P1-4** — Filtro/cambio de estado en lote de citas · ~S · solo site
2. **P1-14** — `PATCH /users/:uuid` en API + conectar perfil · ~M · API → site

Con esos dos resueltos el flujo core `agendar → atender → registrar control → historial` funciona de punta a punta sin datos mocked ni UUIDs falsos.

---

## Definición de MVP

**El MVP es funcional cuando un médico puede:**

1. ✅ Registrar y buscar pacientes
2. ✅ Agendar una cita con tipo de servicio real
3. ✅ Gestionar el ciclo completo: tentativa → llamada → confirmar o reagendar
4. ✅ Crear un control médico y que se guarde en la DB
5. ✅ Ver el historial de controles de un paciente
6. ✅ Ver la última audiometría del paciente
7. ✅ Gestionar inventario
8. ⬜ Ver y editar su propio perfil (bloqueado por P1-14)

**Criterio:** si el flujo "agendar → atender → registrar control → historial" funciona de punta a punta sin datos mocked ni UUIDs falsos, es MVP.

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
