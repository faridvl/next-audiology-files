# PRODUCT_QA.md

Preguntas para hacerle al cliente (médico/dueño de la clínica) antes de construir o definir cada módulo.
Están redactadas en lenguaje simple, sin términos técnicos.
Las que ya tienen respuesta se marcan con ✅. Las pendientes con ❓.

---

## Pacientes

✅ **¿Qué datos básicos necesita tener un paciente?**
Nombre, teléfono, correo, dirección, fecha de nacimiento, cédula, ocupación, sede.

❓ **¿Hay pacientes que pertenecen a más de una sede o clínica?**
Esto define si un paciente puede aparecer en más de una cuenta del sistema.

❓ **¿Quién puede ver los pacientes — solo el médico que los atendió, o todos los usuarios de la clínica?**

❓ **¿Se pueden eliminar pacientes o solo desactivarlos?**

---

## Consulta / Expediente

✅ **¿Qué se puede hacer en una consulta?**
Control clínico (preguntas + diagnóstico), audiograma, mantenimiento del audífono. No es obligatorio hacer todo en una misma visita.

✅ **¿Un control y un mantenimiento son lo mismo?**
No. El control es la evaluación médica. El mantenimiento es el servicio al audífono.

❓ **¿Una consulta siempre la hace un solo médico, o puede haber dos médicos en la misma visita?**

❓ **¿Se puede editar o corregir un control ya guardado, o queda bloqueado?**
Esto es importante para la trazabilidad del expediente.

❓ **¿Se puede eliminar un registro del historial?**

❓ **¿El paciente tiene acceso a su propio expediente de alguna forma (app, portal)?**

---

## Historia Clínica (Plantillas)

✅ **¿Las preguntas del control las define el médico?**
Sí, se crean como plantillas reutilizables por especialidad.

❓ **¿Puede haber más de una plantilla activa al mismo tiempo para la misma especialidad?**
Por ejemplo, ¿una plantilla para adultos y otra para niños, ambas de audiología?

❓ **¿Las preguntas siempre son Sí/No, o también hay preguntas de texto libre o numéricas?**

❓ **¿Una plantilla se puede modificar después de haberla usado en controles pasados?**
Si se modifica, ¿los controles viejos deben mostrar las preguntas originales o las nuevas?

---

## Audiograma

✅ **¿El audiograma es solo números (dB por frecuencia), sin gráfica obligatoria?**
Los números son obligatorios. La gráfica es opcional y se genera automáticamente.

❓ **¿Se hacen audiogramas de vía aérea y vía ósea, o solo vía aérea?**

❓ **¿Las frecuencias siempre son las mismas (250, 500, 1000, 2000, 4000, 8000 Hz) o varían?**

❓ **¿El resultado del audiograma (normal, leve, moderado, severo) lo calcula el sistema o lo escribe el médico?**

---

## Mantenimientos

✅ **¿El mantenimiento es texto libre de lo que se hizo más la fecha del próximo?**
Sí.

❓ **¿El sistema debe avisar al médico cuando se acerca la fecha de un mantenimiento programado?**
Por correo, notificación en el sistema, o simplemente se ve en la vista de mantenimientos del mes.

❓ **¿Un paciente puede tener más de un audífono (ej. OD y OI por separado)?**
Esto afecta si el mantenimiento se registra por audífono o por paciente.

❓ **¿El paciente recibe algún aviso de que tiene mantenimiento próximo?**

---

## Documentos

❓ **¿Qué tipos de archivos sube el médico?**
Fotos, PDFs, resultados de otros centros, facturas, garantías... ¿hay algo más?

❓ **¿Los documentos los sube solo el médico o también el personal administrativo?**

❓ **¿Hay un límite de tamaño por archivo o de espacio total por paciente?**

❓ **¿Los documentos se pueden compartir con el paciente (enviar por correo, link)?**

❓ **¿Un documento puede estar vinculado a una consulta específica, o solo al paciente en general?**
Por ejemplo, una foto tomada durante una consulta — ¿debe aparecer ligada a ese día?

---

## PDF / Reporte de consulta

✅ **¿El PDF se genera al finalizar la consulta?**
Sí, desde la pantalla de resumen.

✅ **¿Se le entrega al paciente en papel?**
Generalmente sí, directo al imprimir.

❓ **¿También se envía por correo al paciente?**

❓ **¿Qué debe incluir el PDF?**
¿Solo lo de esa consulta, o también el historial completo, los antecedentes, el audiograma anterior para comparar?

❓ **¿El PDF lleva membrete o logo de la clínica?**

❓ **¿El PDF lo firma digitalmente el médico o solo lleva su nombre?**

---

## Citas / Agenda

❓ **¿Las citas se agendan desde Zynka o desde otro sistema (Google Calendar, etc.)?**

❓ **¿Hay recordatorios automáticos al paciente antes de su cita?**

❓ **¿Una cita cancelada se puede reagendar desde el sistema?**

❓ **¿Hay tipos de cita (primera consulta, control, mantenimiento, urgencia)?**

---

## Usuarios y permisos

❓ **¿Qué puede hacer un recepcionista que un médico no puede, o viceversa?**
Por ejemplo, ¿el recepcionista puede ver el expediente clínico o solo las citas?

❓ **¿Puede haber más de un médico en la misma clínica usando el sistema?**
Y si es así, ¿cada uno ve solo sus pacientes o todos los de la clínica?

❓ **¿El dueño de la clínica tiene un acceso diferente (reportes, estadísticas)?**

---

## Inventario / Audífonos

❓ **¿El inventario es solo audífonos o también accesorios, pilas, filtros?**

❓ **¿Cuando se vende un audífono, se descuenta del inventario automáticamente?**

❓ **¿Se necesita saber qué audífono tiene cada paciente (marca, modelo, serial)?**

---

## General

❓ **¿La clínica tiene más de una sede?**
Esto cambia bastante la estructura del sistema.

❓ **¿Hay horarios de atención configurables por sede o por médico?**

❓ **¿Se necesitan reportes o estadísticas? ¿De qué tipo?**
Pacientes atendidos por mes, ingresos, tipos de diagnóstico más frecuentes, etc.
