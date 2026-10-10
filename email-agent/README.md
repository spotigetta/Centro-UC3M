# Agente privado de correo UC3M

`Code.gs` y `Weekly.gs` están preparados para un proyecto de Google Apps Script de la cuenta universitaria. Revisan el correo a diario, extraen hechos con Gemini y crean una revisión semanal. Los domingos envían a la propia cuenta un plan de tres semanas basado en el estado actual de Centro UC3M: prácticas, exámenes, entregas, tareas y proyectos; omiten las clases de teoría habituales. `estado.json`, `evidencias.json` y `propuestas.json` se guardan en una carpeta privada de Google Drive. Ni los mensajes ni las propuestas se añaden al repositorio.

## Activación una vez

1. Crea un proyecto en [script.google.com](https://script.google.com/) con tu cuenta de correo universitario y copia `Code.gs`, `Weekly.gs` y `appsscript.json`.
2. En **Configuración del proyecto → Propiedades del script**, crea `GEMINI_API_KEY` con una clave activa y `GITHUB_TOKEN` con acceso **Contents: read** al repositorio. Puedes añadir `NOTIFY_EMAIL` si quieres recibir el plan en otra dirección; por defecto se envía a la cuenta propietaria del script. No pegues claves ni tokens en el código, en el panel ni en GitHub.
3. Ejecuta `instalarAgente` y concede los permisos solicitados de Gmail, Drive, envío de correo, llamadas externas y activadores. El registro de ejecución muestra la carpeta privada creada.
4. Ejecuta `revisarCorreoDiario` para la primera revisión y `prepararRevisionSemanal` para generar las primeras propuestas. `enviarResumenSemanal` permite probar el correo una vez; el activador real lo envía los domingos por la tarde, después de preparar la revisión.
5. Descarga `propuestas.json` de la carpeta privada de Drive. En Centro UC3M abre **Correo académico → Importar propuestas privadas**. Revisa cada hecho antes de incorporarlo.

Las horas de los activadores son aproximadas. El cursor de mensajes evita duplicados al reintentar y la extracción no aplica cambios directamente. El agente solo identifica asignaturas por alias explícitos del asunto o remitente; los correos ambiguos quedan sin clasificar. No abre PDFs adjuntos.

Por ahora la descarga del JSON de propuestas es manual: GitHub Pages no dispone de un inicio de sesión OAuth de Google que le permita consultar tu Drive privado. La revisión nocturna, la generación de propuestas y el correo dominical sí son automáticos una vez instalado el script. Los hechos aceptados se guardan en el JSON editable del Centro y aparecen en el calendario sin otro despliegue de Pages.
