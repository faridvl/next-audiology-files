# Plan de Pruebas — Zynka

> Objetivo: mapear errores reales en producción antes de entregar a usuarios.  
> Entorno: Producción (Vercel + Railway).  
> Tener disponibles: cuenta OWNER y cuenta STAFF, al menos 1 paciente con controles, 1 cita y 1 mantenimiento cargados.

---

## 0. Pre-condiciones

- [ ] API Identity corriendo (Railway)
- [ ] API Medical Records corriendo (Railway)
- [ ] Variables de entorno en Vercel apuntan a Railway (no localhost)
- [ ] Hay al menos 1 paciente con controles, 1 cita y 1 mantenimiento cargados

---

## 1. Auth & Sesión

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 1.1 | Login con credenciales correctas | Redirige a `/dashboard` | ⬜ |
| 1.2 | Login con credenciales incorrectas | Error en español (no "Failed to fetch") | ⬜ |
| 1.3 | Login con campos vacíos | Validación de Formik visible | ⬜ |
| 1.4 | Acceder a `/dashboard` sin cookie | Redirige a `/login` | ⬜ |
| 1.5 | Sesión expirada (1h) — hacer acción | Redirige a `/login?expired=true` con alerta amber | ⬜ |
| 1.6 | Forgot password | Muestra aviso honesto (no promete email) | ⬜ |
| 1.7 | Logout | Limpia cookie y redirige a `/login` | ⬜ |
| 1.8 | Registro nuevo tenant (flujo completo) | Selección de tipo de clínica → formulario → dashboard | ⬜ |

---

## 2. Dashboard

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 2.1 | Cargar dashboard | 3 métricas reales (pacientes, citas hoy, controles) | ⬜ |
| 2.2 | Agenda del día | Lista citas del día actual | ⬜ |
| 2.3 | Dashboard sin citas hoy | Estado vacío visible, no crash | ⬜ |
| 2.4 | Dashboard como STAFF | Botón "Iniciar consulta" no visible | ⬜ |
| 2.5 | Dashboard como OWNER/ADMIN | Botón "Iniciar consulta" visible | ⬜ |

---

## 3. Pacientes

### 3.1 Listado

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 3.1.1 | Listar pacientes | Lista carga con datos reales | ⬜ |
| 3.1.2 | Buscar por nombre | Filtra resultados | ⬜ |
| 3.1.3 | Paginación | Navega entre páginas correctamente | ⬜ |
| 3.1.4 | Toggle "incluir inactivos" | Muestra/oculta pacientes con soft-delete | ⬜ |

### 3.2 Crear paciente

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 3.2.1 | Formulario completo y guardar | Redirige a ficha del paciente | ⬜ |
| 3.2.2 | Enviar sin campos obligatorios | Errores de validación visibles | ⬜ |
| 3.2.3 | Teléfono con formato inválido | Validación visible en campo | ⬜ |
| 3.2.4 | Género, tipo de sangre, ocupación | Campos seleccionables sin crash | ⬜ |

### 3.3 Ficha del paciente (`/patients/:uuid`)

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 3.3.1 | Cargar ficha | Header con nombre, edad, diagnóstico, última visita | ⬜ |
| 3.3.2 | Stat card "Próx. mantenimiento" | Dato real o "Sin programar" | ⬜ |
| 3.3.3 | Stat card "Mantenimientos" | Número real desde API | ⬜ |
| 3.3.4 | Timeline — pestaña "Todos" | Mezcla controles + audiogramas + mantenimientos | ⬜ |
| 3.3.5 | Timeline — filtro por tipo | Cada pestaña muestra solo su tipo | ⬜ |
| 3.3.6 | Timeline vacía | Estado vacío, no crash | ⬜ |
| 3.3.7 | Botón WhatsApp sin teléfono | Toast de error (no número hardcodeado) | ⬜ |
| 3.3.8 | Botón WhatsApp con teléfono | Abre wa.me con número correcto | ⬜ |
| 3.3.9 | Soft-delete (OWNER/ADMIN) | Modal de confirmación → paciente se desactiva | ⬜ |
| 3.3.10 | Botón soft-delete como STAFF | No aparece el botón | ⬜ |

### 3.4 Audífonos (DevicesPanel)

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 3.4.1 | Ver audífonos cargados | Lista por oído (izquierdo/derecho) | ⬜ |
| 3.4.2 | Agregar audífono | Formulario → aparece en lista | ⬜ |
| 3.4.3 | Eliminar audífono | Confirmación → desaparece de lista | ⬜ |
| 3.4.4 | Panel colapsable | Toggle abre y cierra sin crash | ⬜ |

### 3.5 Antecedentes médicos

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 3.5.1 | Ver antecedentes | Datos desde API o vacío | ⬜ |
| 3.5.2 | Editar y guardar | Persistido correctamente | ⬜ |

### 3.6 Documentos del paciente

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 3.6.1 | Subir documento (PDF/imagen) | Sube a R2, aparece en lista | ⬜ |
| 3.6.2 | Listar documentos ⚠️ | **Esperado: 404 — endpoint no existe aún en API** | ⬜ |
| 3.6.3 | Eliminar documento | Desaparece de lista | ⬜ |

### 3.7 Editar paciente

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 3.7.1 | Pre-llenado del formulario | Todos los campos muestran datos actuales | ⬜ |
| 3.7.2 | Guardar cambios | Datos actualizados en ficha | ⬜ |

---

## 4. Citas (Appointments)

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 4.1 | Listar citas | Lista con filtro de estado visible | ⬜ |
| 4.2 | Filtro por estado | Filtra correctamente por activo/completado/cancelado | ⬜ |
| 4.3 | Crear cita | Selector de tipo de cita → cita guardada | ⬜ |
| 4.4 | Crear cita sin appointment-types en DB | Selector vacío, no crash | ⬜ |
| 4.5 | Manage appointment (editar) | Pre-llena datos, PATCH guarda | ⬜ |
| 4.6 | Cancelar/eliminar cita | Confirmación → desaparece de lista | ⬜ |
| 4.7 | Crear cita sin paciente asignado | Validación visible | ⬜ |

---

## 5. Tipos de Cita (Appointment Types)

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 5.1 | Listar tipos | Carga desde `GET /appointment-types` | ⬜ |
| 5.2 | Crear tipo | Formulario → aparece en lista | ⬜ |
| 5.3 | Listar vacío | Estado vacío, no crash | ⬜ |

---

## 6. Consulta (flujo multi-página)

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 6.1 | Entrar al hub de consulta | `/patients/:uuid/consulta` muestra opciones | ⬜ |
| 6.2 | Iniciar control clínico | Subpágina `control.tsx` carga plantilla | ⬜ |
| 6.3 | Selector de plantilla (>1 activa) | Dropdown visible y funcional | ⬜ |
| 6.4 | Guardar control con followUp | Persiste en API (no se descarta silenciosamente) | ⬜ |
| 6.5 | Iniciar audiograma | Subpágina `audiograma.tsx` carga | ⬜ |
| 6.6 | Capturar audiograma (modal) | Grid correcto, preserva aspecto de imagen | ⬜ |
| 6.7 | Iniciar mantenimiento | Subpágina `mantenimiento.tsx` carga | ⬜ |
| 6.8 | Resumen de consulta | Subpágina `resumen.tsx` muestra lo guardado | ⬜ |
| 6.9 | Navegar entre subpáginas | `ConsultaSessionStorage` preserva progreso | ⬜ |
| 6.10 | Acceso de STAFF al flujo | No puede llegar a `/consulta` (botón oculto) | ⬜ |

---

## 7. Controles Médicos

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 7.1 | Detalle de control | Carga datos del control completo | ⬜ |
| 7.2 | Nota de corrección (inline amber) | Editar, confirmar → persiste vía PATCH | ⬜ |
| 7.3 | Descargar PDF del control | Incluye logo + firma del médico | ⬜ |
| 7.4 | Filtro por especialidad | Solo muestra controles del usuario logueado | ⬜ |
| 7.5 | Control sin datos clínicos | No crash, muestra vacío | ⬜ |

---

## 8. Mantenimientos

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 8.1 | `/maintenance` — lista global | Carga mantenimientos | ⬜ |
| 8.2 | Mantenimientos desde ficha de paciente | Navega a `/maintenance` filtrado | ⬜ |
| 8.3 | Crear mantenimiento (desde consulta) | Persiste en API | ⬜ |
| 8.4 | Sin mantenimientos | "Sin programar" en stat card, no crash | ⬜ |

---

## 9. Inventario

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 9.1 | Listar productos | Carga lista | ⬜ |
| 9.2 | Ver detalle producto | `/inventory/:id` carga sin crash | ⬜ |
| 9.3 | Crear producto | Formulario → aparece en lista | ⬜ |
| 9.4 | Manage (editar) producto | Pre-llena → PATCH guarda | ⬜ |

---

## 10. Usuarios

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 10.1 | Listar usuarios | Carga desde `GET /users` | ⬜ |
| 10.2 | Ver detalle usuario | `/users/:id` carga datos | ⬜ |
| 10.3 | Crear usuario | Formulario → aparece en lista | ⬜ |
| 10.4 | Editar usuario | Pre-llena → PATCH guarda | ⬜ |
| 10.5 | Eliminar usuario | Confirmación → desaparece | ⬜ |
| 10.6 | Sidebar filtrado por rol | STAFF no ve ítems de admin | ⬜ |

---

## 11. Plantillas Clínicas

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 11.1 | Listar plantillas | `/clinical-templates` carga | ⬜ |
| 11.2 | Ver detalle plantilla | `/clinical-templates/:id` carga | ⬜ |
| 11.3 | Selector en consulta | Dropdown aparece si hay >1 plantilla activa | ⬜ |

---

## 12. Settings

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 12.1 | Cargar settings | Pre-llena `businessName`, `businessType` | ⬜ |
| 12.2 | Subir logo | Sube a R2, preview se actualiza | ⬜ |
| 12.3 | Guardar businessName | PATCH persiste en API | ⬜ |
| 12.4 | Campos sin DB (Razón Social, Ciudad, etc.) ⚠️ | **Esperado: UI visible pero no persiste — bloqueado por API** | ⬜ |

---

## 13. Profile

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 13.1 | Cargar profile | Pre-llena `fullName`, `phoneNumber`, `specialty` | ⬜ |
| 13.2 | Subir firma | Sube a R2, URL guardada | ⬜ |
| 13.3 | Subir avatar | Sube a R2, preview actualizado | ⬜ |
| 13.4 | Guardar cambios | PATCH persiste datos conectados | ⬜ |
| 13.5 | Campos sin DB (Cédula, Universidad) ⚠️ | **Esperado: UI visible pero no persiste — bloqueado por API** | ⬜ |

---

## 14. Report Template

| # | Prueba | Esperado | Estado |
|---|--------|----------|--------|
| 14.1 | Acceder a `/report-template/create` | Muestra "funcionalidad en desarrollo", no crash ni 404 | ⬜ |

---

## Comportamientos conocidos (no son bugs)

| Ítem | Comportamiento esperado |
|------|------------------------|
| `GET /patients/:uuid/documents` | Devuelve 404 — endpoint pendiente en API |
| `bloodType` en summary de paciente | Muestra `O+` hardcodeado — campo existe en DB, pendiente conectar |
| Settings — campos adicionales | No persisten — sin columnas en DB todavía |
| Profile — cédula/universidad | No persisten — sin columnas en DB todavía |

---

## Leyenda de estado

| Símbolo | Significado |
|---------|------------|
| ⬜ | Sin probar |
| ✅ | Pasa |
| ❌ | Error encontrado |
| ⚠️ | Comportamiento esperado (limitación conocida) |
| 🔁 | Intermitente |
