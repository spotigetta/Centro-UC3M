# Agente privado de correo UC3M

`Code.gs` está preparado para un proyecto de Google Apps Script de la cuenta universitaria. Revisa el correo a diario, extrae hechos con Gemini y crea una revisión semanal. Guarda `estado.json`, `evidencias.json` y `propuestas.json` en una carpeta privada de Google Drive. Ni los mensajes ni las propuestas se añaden al repositorio.

## Activación una vez

1. Crea un proyecto en [script.google.com](https://script.google.com/) con tu cuenta de correo universitario y copia `Code.gs` y `appsscript.json`.
2. En **Configuración del proyecto → Propiedades del script**, crea `GEMINI_API_KEY` con una clave activa. No la pegues en el código, en el panel ni en GitHub.
3. Ejecuta `instalarAgente` y concede los permisos solicitados de Gmail, Drive, llamadas externas y activadores. El registro de ejecución muestra la carpeta privada creada.
4. Ejecuta `revisarCorreoDiario` para la primera revisión y `prepararRevisionSemanal` para generar las primeras propuestas. Después se ejecutan solos por la noche y los domingos.
5. Descarga `propuestas.json` de la carpeta privada de Drive. En Centro UC3M abre **Correo académico → Importar propuestas privadas**. Revisa cada hecho antes de incorporarlo.

Las horas de los activadores son aproximadas. El cursor de mensajes evita duplicados al reintentar y la extracción no aplica cambios directamente. El agente solo identifica asignaturas por alias explícitos del asunto o remitente; los correos ambiguos quedan sin clasificar. No abre PDFs adjuntos.

Por ahora la descarga del JSON de propuestas es manual: GitHub Pages no dispone de un inicio de sesión OAuth de Google que le permita consultar tu Drive privado. La revisión nocturna y la generación de propuestas sí son automáticas una vez instalado el script. Los hechos aceptados se guardan en el JSON editable del Centro y aparecen en el calendario sin otro despliegue de Pages.
