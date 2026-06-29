# PRODUCT_QA.md

Preguntas para hacerle al cliente (médico/dueño de la clínica) antes de construir o definir cada módulo.
Están redactadas en lenguaje simple, sin términos técnicos.
Las que ya tienen respuesta se marcan con ✅. Las pendientes con ❓.

---

## Pacientes

✅ **¿Qué datos básicos necesita tener un paciente?**
Nombre, teléfono, correo, dirección, fecha de nacimiento, cédula, ocupación, sede.

✅ **¿Hay pacientes que pertenecen a más de una sede o clínica?**
Un paciente pertenece a una clínica (tenant), pero puede atenderse en varias sedes de esa misma clínica.

✅ **¿Quién puede ver los pacientes — solo el médico que los atendió, o todos los usuarios de la clínica?**
Los médicos registrados pueden ver pacientes, pero solo acceden a expedientes y exámenes de su propia especialidad.

✅ **¿Se pueden eliminar pacientes o solo desactivarlos?**
Solo desactivar (soft delete). No se eliminan por integridad de datos.

---

## Consulta / Expediente

✅ **¿Qué se puede hacer en una consulta?**
Control clínico (preguntas + diagnóstico), audiograma, mantenimiento del audífono. No es obligatorio hacer todo en una misma visita.

✅ **¿Un control y un mantenimiento son lo mismo?**
No. El control es la evaluación médica. El mantenimiento es el servicio al audífono.

✅ **¿Una consulta siempre la hace un solo médico, o puede haber dos médicos en la misma visita?**
Un médico por consulta.

✅ **¿Se puede editar o corregir un control ya guardado, o queda bloqueado?**
Una vez cerrado queda bloqueado por integridad de datos. Si se necesita corregir algo, se agrega una nota de corrección sin editar el original (trazabilidad).

✅ **¿Se puede eliminar un registro del historial?**
No. Sin eliminación para garantizar integridad del expediente.

✅ **¿El paciente tiene acceso a su propio expediente de alguna forma (app, portal)?**
No en la versión inicial. Es parte del roadmap futuro — diseñar el modelo de datos pensando en que eventualmente existirá un rol "paciente".

---

## Historia Clínica (Plantillas)

✅ **¿Las preguntas del control las define el médico?**
Sí, se crean como plantillas reutilizables por especialidad.

✅ **¿Puede haber más de una plantilla activa al mismo tiempo para la misma especialidad?**
Sí. Ejemplo: una plantilla para adultos y otra para niños dentro de la misma especialidad.

✅ **¿Las preguntas siempre son Sí/No, o también hay preguntas de texto libre o numéricas?**
Sí/No más un campo de notas por pregunta.

✅ **¿Una plantilla se puede modificar después de haberla usado en controles pasados?**
Sí, mediante versionado. Al modificar una plantilla se crea una versión nueva. Los controles anteriores quedan ligados a la versión con la que fueron creados. Los controles nuevos usan la versión actual.

✅ **¿Las preguntas de las plantillas están categorizadas?**
Sí. El médico define categorías al crear la plantilla. Ejemplo: Antecedentes / Síntomas actuales / Examen físico / Diagnóstico.

---

## Audiograma

✅ **¿El audiograma es solo números (dB por frecuencia), sin gráfica obligatoria?**
Los números son obligatorios. La gráfica es opcional y se genera automáticamente.

❓ **¿Se hacen audiogramas de vía aérea y vía ósea, o solo vía aérea?**
Parece que ambos y tienen símbolos propios. Pendiente confirmar con el cliente si son exámenes separados o uno solo con ambas vías.

❓ **¿Las frecuencias siempre son las mismas (250, 500, 1000, 2000, 4000, 8000 Hz) o varían?**
Muy específico de audiología. Pendiente confirmar con el cliente.

✅ **¿El resultado del audiograma (normal, leve, moderado, severo) lo calcula el sistema o lo escribe el médico?**
El sistema solo almacena los datos. El médico hace el estudio con otra herramienta y registra el resultado aquí.

---

## Mantenimientos

✅ **¿El mantenimiento es texto libre de lo que se hizo más la fecha del próximo?**
Sí.

✅ **¿El sistema debe avisar al médico cuando se acerca la fecha de un mantenimiento programado?**
No es prioridad inicial pero agrega valor. Va al roadmap.

✅ **¿Un paciente puede tener más de un audífono (ej. OD y OI por separado)?**
Sí. Un paciente puede tener varios audífonos. El mantenimiento se registra por audífono, no por paciente. Cada audífono tiene su propio historial.

✅ **¿El paciente recibe algún aviso de que tiene mantenimiento próximo?**
No es prioridad inicial pero agrega valor. Va al roadmap.

---

## Documentos

✅ **¿Qué tipos de archivos sube el médico?**
PDFs e imágenes principalmente. Archivos de estudios hechos con otras apps, fotos de controles anteriores, audiogramas escaneados, facturas, garantías.

✅ **¿Los documentos los sube solo el médico o también el personal administrativo?**
Por ahora solo médicos. Cuando se agreguen roles administrativos se revisa.

✅ **¿Hay un límite de tamaño por archivo o de espacio total por paciente?**
Decisión técnica del equipo. Referencia razonable: 10 MB por archivo, límite total por clínica configurable según plan.

✅ **¿Los documentos se pueden compartir con el paciente (enviar por correo, link)?**
No en la versión inicial. Va al roadmap junto con el portal del paciente.

✅ **¿Un documento puede estar vinculado a una consulta específica, o solo al paciente en general?**
Un documento siempre pertenece al paciente. Opcionalmente puede estar ligado a una consulta específica. Si no se liga a ninguna consulta, vive en el expediente general del paciente.

---

## PDF / Reporte de consulta

✅ **¿El PDF se genera al finalizar la consulta?**
Sí, desde la pantalla de resumen.

✅ **¿Se le entrega al paciente en papel?**
Generalmente sí, directo al imprimir.

✅ **¿También se envía por correo al paciente?**
No en la versión inicial. Va al roadmap.

✅ **¿Qué debe incluir el PDF?**
Datos del paciente, datos del médico, fecha y sede, respuestas de la plantilla clínica, diagnóstico/notas, audiograma si hubo, mantenimiento si hubo, próxima cita si hay.

✅ **¿El PDF lleva membrete o logo de la clínica?**
Sí, si la clínica tiene logo configurado se muestra. Si no, se omite. Es configuración del tenant.

✅ **¿El PDF lo firma digitalmente el médico o solo lleva su nombre?**
El médico puede subir una imagen de su firma en su perfil. Se inserta automáticamente en el PDF. Es opcional. Firma electrónica legal va al roadmap.

---

## Citas / Agenda

✅ **¿Las citas se agendan desde Zynka o desde otro sistema (Google Calendar, etc.)?**
El sistema maneja sus propias citas. Integración con Google Calendar va al roadmap.

✅ **¿Hay recordatorios automáticos al paciente antes de su cita?**
No en la versión inicial. Agrega valor. Va al roadmap.

✅ **¿Una cita cancelada se puede reagendar desde el sistema?**
Sí.

✅ **¿Hay tipos de cita (primera consulta, control, mantenimiento, urgencia)?**
Sí. Los tipos de cita los configura la clínica, no están hardcodeados. Cada especialidad define los suyos.

---

## Usuarios y permisos

✅ **¿Qué puede hacer un recepcionista que un médico no puede, o viceversa?**
- **Médico** — expedientes, consultas, documentos, agenda. Solo su especialidad.
- **Recepcionista** — datos básicos del paciente, agenda, inventario. Sin acceso a expediente clínico.
- **Admin/Dueño** — todo lo anterior + configuración del sistema, reportes, gestión de usuarios.

✅ **¿Puede haber más de un médico en la misma clínica usando el sistema?**
Sí. Múltiples médicos por clínica.

❓ **¿El dueño de la clínica tiene un acceso diferente (reportes, estadísticas)?**
Pendiente definir y revisar regulaciones de expediente clínico electrónico en Costa Rica. El dueño es un super usuario administrativo. Si además es médico, se le asigna una especialidad encima. La duda es si un dueño sin especialidad puede ver expedientes clínicos en modo solo lectura.

---

## Inventario / Audífonos

✅ **¿El inventario es solo audífonos o también accesorios, pilas, filtros?**
Hay audífonos, baterías y estuches confirmados. Genéricamente son productos organizados en categorías configurables por el admin.

✅ **¿Cuando se vende un audífono, se descuenta del inventario automáticamente?**
No hay proceso de facturación por ahora. La asignación del audífono a un paciente descuenta del inventario automáticamente.

✅ **¿Se necesita saber qué audífono tiene cada paciente (marca, modelo, serial)?**
Sí. El audífono se registra con número de serie y se vincula al paciente. La factura puede importarse como documento del paciente.

---

## General

✅ **¿La clínica tiene más de una sede?**
El sistema es multi-sede desde el diseño. Una clínica (tenant) puede tener varias sedes. Cada paciente, médico y cita está asociado a una sede.

✅ **¿Hay horarios de atención configurables por sede o por médico?**
Sí. Un médico puede tener horarios distintos en cada sede donde atiende.

✅ **¿Se necesitan reportes o estadísticas? ¿De qué tipo?**
No en la versión inicial. Va al roadmap.
