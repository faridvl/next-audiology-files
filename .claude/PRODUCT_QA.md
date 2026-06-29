# PRODUCT_QA.md

Preguntas y respuestas sobre cómo funciona Zynka desde el punto de vista clínico.  
Este documento es para el médico/cliente, no para el desarrollador.  
Cada decisión aquí tomada afecta cómo se construye el sistema.

---

## Expediente del paciente

**¿Qué es un expediente en Zynka?**  
Es todo lo que existe sobre un paciente: su ficha de identificación, sus antecedentes médicos, el historial de consultas y sus documentos adjuntos.

---

**¿Qué es una consulta?**  
Es todo lo que se le hace al paciente en un mismo día. Puede incluir una o varias de estas secciones:
- Control clínico (preguntas de la historia clínica + diagnóstico)
- Audiograma (valores numéricos por frecuencia OD/OI)
- Mantenimiento del audífono (texto libre + fecha del próximo)

No es obligatorio llenar todas las secciones. Si ese día solo se hace mantenimiento, solo se llena esa sección.

---

**¿Un control y un mantenimiento son lo mismo?**  
No. Son registros distintos:
- **Control clínico**: evaluación médica, responde preguntas de una historia clínica, tiene diagnóstico.
- **Mantenimiento**: servicio al audífono (limpieza, ajuste, cambio de filtros). Tiene descripción de lo que se hizo y fecha del próximo mantenimiento.

En una misma consulta puede haber los dos, o solo uno.

---

**¿El audiograma es parte del control o es independiente?**  
Es independiente dentro de la consulta. Se puede hacer audiograma sin hacer control clínico ese día, o hacerlo junto al control. Los valores se guardan con el registro del control para que queden en el historial.

---

**¿Qué son las preguntas del control clínico?**  
Son preguntas que el médico define previamente en "Plantillas de Historia Clínica". Por ejemplo, una plantilla "Audiología General" puede tener preguntas como "¿Usa audífonos?", "¿Tiene tinnitus?", etc. Cada pregunta se responde con Sí o No, y se puede agregar un apunte de texto.

---

**¿Quién aparece como autor de un control?**  
El médico que inició sesión al momento de guardar el control. Queda registrado con el perfil del usuario logueado.

---

**¿Qué pasa al finalizar una consulta?**  
Se muestra un resumen de todo lo que se guardó ese día y se puede descargar un PDF para entregar al paciente.

---

## Documentos

**¿Qué tipo de archivos se pueden subir?**  
Cualquier archivo relacionado al paciente: fotos, PDFs externos, resultados de otros centros, etc. Se organizan por categoría:
- **Recibos**: facturas de compra de audífonos u otros equipos
- **Garantías**: documentos de garantía del equipo
- **Pruebas Externas**: audiogramas o exámenes hechos en otra clínica

---

**¿Dónde aparecen los documentos?**  
Dentro del detalle del paciente, en una sección separada del historial de consultas. Los documentos son archivos adjuntos, no eventos clínicos.

> ⏳ **Pendiente**: la subida de archivos requiere configurar almacenamiento en la nube (Cloudflare R2 u otro). Por ahora esta sección muestra "Próximamente".

---

## Historial del paciente

**¿Qué aparece en el historial?**  
Los registros clínicos ordenados del más reciente al más antiguo: controles, audiogramas y mantenimientos. Se pueden filtrar por tipo.

**¿Los documentos aparecen en el historial?**  
No. Los documentos tienen su propia sección debajo del historial. Son cosas distintas: el historial son eventos médicos, los documentos son archivos.

---

## Mantenimientos

**¿Dónde se ven los mantenimientos pendientes?**  
Hay una vista global en el menú principal ("Mantenimientos") que muestra todos los pacientes con mantenimiento programado para un mes específico. Se puede navegar mes a mes.

---

## Antecedentes médicos

**¿Qué son los antecedentes?**  
Condiciones médicas previas del paciente: diabetes, alergias, cirugías de oído, etc. Se llenan una sola vez y quedan guardados en la ficha del paciente. Se pueden actualizar si algo cambia.

---

## Pendientes por definir

- [ ] ¿Los documentos van dentro del detalle del paciente o en una página propia `/patients/:uuid/documentos`?
- [ ] ¿El filtro del historial muestra especialidad (Audiología/Dental) o tipo de registro (Control/Audiograma/Mantenimiento)?
- [ ] ¿Se puede subir más de un archivo a la vez?
- [ ] ¿Los archivos tienen un límite de tamaño?
- [ ] ¿El PDF de la consulta lo recibe el paciente en papel o también por correo?
