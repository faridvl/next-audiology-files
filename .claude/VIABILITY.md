# VIABILITY.md
> Análisis de viabilidad del sistema para una clínica de audiología.  
> Fecha: 2026-06-24. Actualizar después de cada sprint importante.

---

## Veredicto general

**El proyecto es viable pero aún no es usable en producción.**

La arquitectura es sólida, el diseño de UI es profesional, y los módulos de inventario y autenticación están completos. Sin embargo, el flujo clínico central — la razón de ser del sistema — tiene bloqueantes críticos: el formulario de nueva consulta no guarda nada, los datos del audiograma se pierden, y el ciclo de citas no persiste cambios. Una clínica no puede trabajar con esto hoy.

Estimación de avance hacia MVP: **~40%** (funcionalidad real, no UI pintada).

---

## Lo que SÍ funciona de punta a punta hoy

| Módulo | Estado | Notas |
|--------|--------|-------|
| Login / Register / Sesión | ✅ Completo | Cookie JWT, guard SSR, `useSession` |
| Lista de pacientes | ✅ Completo | Datos reales del API |
| Detalle de paciente + historial de controles | ✅ ~85% | Historia real; `nextAppointment`, `warrantyExpiration`, `pendingMaintenance` hardcodeados en UI |
| Detalle de control médico | ✅ ~75% | Datos reales; `gender`, `bloodType`, `institution`, `specialistName` hardcodeados |
| Lista de usuarios + crear usuario | ✅ Completo | |
| Inventario (CRUD completo) | ✅ Completo | El módulo más completo del sistema |
| Dashboard (carga citas) | ⚠️ Parcial | Conectado al API, pero probablemente muestra `--:--` en tiempos y "Paciente no identificado" si el API no anida los campos bajo `schedule` |

---

## Lo que está roto o es completamente ficticio

### Críticos para el flujo clínico

**1. Guardar una consulta médica no funciona**
`new-control-container.tsx` tiene los textareas de otoscopia sin `value`/`onChange`. El diagnóstico tampoco tiene binding de estado. `handleSave` hace `console.log`. Aunque se conectara al API, se guardaría un control vacío. **Este es el bloqueante más grave — sin esto no hay expediente clínico.**

**2. Los datos del audiograma se pierden**
`useAudiometryData` vive dentro de `AudiometryCapture`, completamente aislado del `useNewControl` que maneja el formulario. No hay forma de que los datos del audiograma lleguen al `handleSave`. El audiograma captura datos localmente y los tira cuando el componente se desmonta.

**3. El ciclo de citas no persiste**
- `ManageAppointmentContainer` no carga los datos de la cita (query comentada, formData empieza vacío)
- `handleConfirm` y `handleNoAnswer` muestran toasts y redirigen pero no llaman al API
- El flujo TENTATIVA → CONFIRMED/PENDING que describió el cliente **no persiste en la DB**

**4. Las citas se crean con un UUID falso como tipo**
`servicesCatalog` en `use-add-appointment.ts` usa `'8e3677b3-b64c-4978-9271-26c15cb41988'` para todos los tipos de servicio. Ese UUID no existe en ningún tenant real. La cita se crea con un `typeUUID` inválido o nulo.

**5. `followUp` se envía pero la API lo descarta silenciosamente**
El formulario envía `followUp: { hasFollowUp, tentativeDate, notes }` pero en `POST /medical-controls` el bloque de storage está comentado en el controlador. El API acepta el dato y lo ignora. No hay error, no hay aviso.

### Mocks que el usuario ve como si fueran datos reales

| Pantalla | Qué está hardcodeado | Impacto |
|----------|---------------------|---------|
| Dashboard | Muestra citas del día. Si el API no devuelve `schedule.date`, todos muestran `--:--` y "Paciente no identificado" | Alto |
| Detalle paciente | "Próxima cita: Sin programar", "Garantía: Consultar equipo", "Mantenimientos: 0 pendientes" | Medio |
| Panel de detalle de cita (WhatsApp) | Si el paciente no tiene phone en la respuesta, manda el mensaje al número `88165808` | Alto |
| Tipos de citas | Lista estática de 5 servicios (Consulta General, Audiometría Clínica...) | Alto |
| Usuario detalle | "Dr. Roberto Gómez" siempre | Medio |
| Control médico | "DR. SISTEMA GEMINI", "CENTRO DE SALUD DIGITAL", género y tipo de sangre hardcodeados | Medio |
| Settings | "Centro Auditivo Integral", "Plan Premium Pro" | Bajo |
| Historial en nueva consulta | 3 cards estáticas con texto inventado | Bajo (visual) |

---

## Qué le falta específicamente para audiología

Una clínica de audiología tiene flujos que no son comunes en sistemas médicos genéricos. Estos son los gaps específicos de la especialidad:

### Gap 1 — El audiograma no es un dato de primera clase (CRÍTICO)

El sistema trata el audiograma como un componente visual opcional dentro del formulario. En audiología, **el audiograma es el examen central**: sin él, la consulta no tiene sustento clínico.

Lo que hace falta:
- Que los valores de `auditData` (OD/OI por frecuencia) se guarden en el `findings` del control
- Poder comparar dos audiogramas del mismo paciente en el tiempo (progresión de pérdida auditiva)
- Imprimir/exportar el audiograma como imagen o parte del reporte

### Gap 2 — Sin reporte imprimible (CRÍTICO para práctica clínica)

En audiología, al final de cada consulta se le entrega al paciente un documento con:
- Datos del paciente
- Resultado del audiograma (gráfico)
- Diagnóstico y recomendaciones
- Firma del audiólogo

Esto no existe en el sistema. El cliente lo tiene en la lista como "Reportes / Reporte de consulta". Sin PDF/impresión, la clínica sigue usando papel para todo lo que el paciente se lleva.

### Gap 3 — Sin trazabilidad del audífono (importante para el modelo de negocio)

Las clínicas de audiología venden y adaptan audífonos. El sistema tiene inventario (bien implementado) pero no hay vínculo entre:
- Qué audífono se le vendió a qué paciente
- Cuándo vence la garantía
- Cuándo necesita calibración o mantenimiento
- Historial de adaptaciones del dispositivo

El cliente lo mencionó como "vista del médico: vencimiento de garantía, próxima receta". Esto es P2 pero es parte del diferenciador del sistema para audiología vs un sistema médico genérico.

### Gap 4 — El flujo de seguimiento post-consulta no está implementado

El cliente describió el flujo exacto:
1. Se inserta el control → se genera una cita **tentativa** para seguimiento
2. Se llama al paciente → si confirma: estado CONFIRMED
3. Si no contesta: estado PENDING + se mueve al mes siguiente
4. Registro de intentos de llamada

El UI para este flujo existe (`ManageAppointmentContainer`) pero no persiste nada. Este es el workflow operativo diario de la recepcionista.

### Gap 5 — Sin documentación del tipo de auxiliar auditivo

`AudiologyFindings` tiene `usesAuxiliaries: boolean` pero no captura:
- Marca del audífono
- Modelo
- Número de serie
- Oído(s) afectado(s)

Esto es clínicamente relevante y sería natural agregar al tipo de findings de audiología.

---

## Mocks en el API

| Endpoint / Feature | Estado real |
|-------------------|-------------|
| `GET /appointments` response shape | No documentado. El site espera `schedule.date/startTime` anidado; la DB guarda campos planos. Si no hay mapeo en el controlador, todo falla silenciosamente. |
| `GET /appointments` query params | `page`, `limit`, `date` documentados pero el site además tiene el bug de no enviarlos. Doble problema. |
| `GET /appointments/patient/:uuid` | Solo retorna `{ patient: { uuid, name } }`. Site espera también `phone`, `email`. |
| `GET /auth/me` | No tiene shape documentado. El site asume `tenant.plan` (FREE/PREMIUM/ENTERPRISE) pero esa columna no existe en la tabla `Tenant`. Siempre `undefined`. |
| `POST /medical-controls` → `followUp` | Acepta el campo pero no lo persiste (código comentado en controlador). |
| `DELETE /appointments/:uuid` | Importado pero comentado en constructor del controlador. No funcional. |
| `GET/POST /appointment-types` | Tabla en DB, sin endpoints. El sistema de tipos de cita no existe en el API. |
| `GET/PATCH /users/:uuid` | No existen. Las páginas de detalle y edición de usuario son mocks totales. |

---

## Porcentaje de avance hacia MVP

| Área | % real | Peso en MVP | Contribución |
|------|--------|-------------|--------------|
| Auth y multi-tenancy | 95% | 8% | 7.6% |
| Pacientes (CRUD) | 75% | 10% | 7.5% |
| Nueva consulta médica | 10% | 20% | 2.0% |
| Historial de controles | 85% | 10% | 8.5% |
| Ciclo de citas (agenda + gestión) | 20% | 18% | 3.6% |
| Tipos de cita / servicios | 5% | 10% | 0.5% |
| Usuarios | 65% | 5% | 3.25% |
| Inventario | 95% | 5% | 4.75% |
| Dashboard funcional | 45% | 5% | 2.25% |
| Perfil / settings | 10% | 4% | 0.4% |
| Seguimiento post-consulta | 5% | 5% | 0.25% |
| **TOTAL** | | **100%** | **~40.6%** |

> El módulo más crítico (nueva consulta con audiometría, peso 20%) tiene 10% de avance real. Ahí está el mayor delta.

---

## Qué debería tener el MVP (y qué puede quedar fuera)

### Dentro del MVP — sin negociación

1. **Consulta médica que guarde datos reales** — otoscopia, diagnóstico, plan de tratamiento
2. **Audiograma guardado como parte de la consulta** — los valores por frecuencia en el `findings`
3. **Ciclo de cita completo** — crear → gestionar → confirmar/reagendar con persistencia real
4. **Tipos de servicio** — sin esto el formulario de nueva cita no funciona
5. **Seguimiento post-consulta** — flujo tentativa → llamada → confirmada/pendiente con log
6. **Perfil del médico** — ver y editar sus propios datos (básico, no avanzado)
7. **Vista de paciente completa** — próxima cita real, último control real

### Puede entrar en MVP v1.1 (después del lanzamiento inicial)

- Indicador de pacientes inactivos ("no viene hace X meses")
- Google Calendar / Apple Calendar link
- Primer borrador de reporte imprimible (aunque sea HTML para imprimir)
- Vínculo audífono-paciente desde inventario

### Fuera del MVP — post-lanzamiento

- PDF con generación profesional y firma
- Sistema de documentos adjuntos (garantías, recibos) — requiere infraestructura de storage
- Historial clínico configurable por clínica
- Trabajo interdisciplinario
- Comparación de audiogramas en el tiempo
- Tenant event initialization (EventBridge)
- Settings de tenant completo

---

## Consideraciones finales

**Lo que tiene bien:**
- Arquitectura limpia, fácil de extender
- UI polida y bien pensada para el flujo del médico
- Inventario completo (el más sólido del sistema)
- Multi-tenancy correctamente implementado en el API
- El modelo de datos del audiograma (`AudiologyFindings`) está bien estructurado — solo falta conectarlo

**Lo que preocupa más:**
- El audiograma captura datos localmente pero los descarta. Esto no es un bug menor — es la feature core para audiología
- El flujo de citas tiene múltiples capas de problemas (UUID falso, params no enviados, manage sin persistencia). Hay que atacarlos en orden o se van a mezclar
- Cuando se conecte el form de nueva consulta al API, va a haber que hacer refactor de cómo fluye el estado del audiograma hacia el `handleSave`. Mejor planear eso antes de conectar

**El riesgo principal:**
Si se muestra el sistema a un cliente de audiología en el estado actual, puede verse bonito en demo pero colapsar en el primer uso real. Los bugs de `--:--` en citas y el formulario que no guarda serían inmediatamente visibles. **Recomiendo atacar los P0 y luego la consulta médica antes de cualquier demo con cliente real.**
