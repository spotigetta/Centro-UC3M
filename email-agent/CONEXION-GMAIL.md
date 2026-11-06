# Correo y tareas por asignatura

La pestaña Correo admite dos entradas. Ambas pasan por una vista previa y usan el mismo importador. Una actividad aceptada aparece en Tareas; si tiene fecha también se muestra en el calendario. Los avisos de material no se convierten en tareas. Una corrección de fecha se compara y se edita manualmente; no reemplaza el dato anterior automáticamente.

## Desde ChatGPT o Codex

1. En Correo, copia el encargo de revisión de los últimos 14 días.
2. Pégalo en un chat con Gmail conectado. El botón de la aplicación no ejecuta el conector dentro de ChatGPT.
3. Guarda el resultado JSON e impórtalo en Correo. Comprueba las actividades propuestas antes de aceptarlas.

El conector puede leer los mensajes dentro del chat, pero no comparte su autorización con la web. En Codex con acceso local se puede guardar el JSON privado fuera del repositorio de Pages y después importarlo en Obsidian. No se envían ni se marcan como leídos los mensajes durante esta revisión.

## Desde la aplicación web

Hace falta configurar una vez un cliente OAuth propio de Google y una clave de Gemini. El cliente OAuth no es una contraseña; no hace falta ningún secreto de cliente en la web.

1. En Google Cloud, selecciona tu proyecto y habilita Gmail API.
2. Configura Google Auth Platform: audiencia, pantalla de consentimiento y tu cuenta como usuario de prueba si la aplicación sigue en pruebas. Una cuenta universitaria puede estar sujeta a las restricciones de su administrador.
3. Crea un cliente OAuth de tipo Aplicación web. Añade como origen JavaScript autorizado `https://spotigetta.github.io`, sin la ruta `/Centro-UC3M/`. Para desarrollo añade el origen localhost con el puerto exacto que utilices.
4. En Correo de la aplicación pega el client ID, que termina en `.apps.googleusercontent.com`. Configura la clave de Gemini en la sesión del asistente.
5. Inicia la revisión y autoriza el permiso de lectura de Gmail. La aplicación lee el periodo indicado y envía los cuerpos relevantes a Gemini para extraer propuestas. Los adjuntos no se leen.
6. Revisa el resultado. Solo se incorporan los campos académicos confirmados. Los detalles privados de la extracción no se guardan en el estado público; una descripción que quieras conservar debe escribirse en la tarjeta.

El token de Google se mantiene en memoria. La clave de Gemini utiliza la configuración de sesión de la aplicación. Ninguno debe añadirse a GitHub. El client ID se puede conservar en el navegador. El acceso directo se ejecuta en la web HTTPS, no en el origen interno de Obsidian; desde Obsidian se abre la pestaña Correo de la web.

Documentación oficial: [modelo de token de Google](https://developers.google.com/identity/oauth2/web/guides/use-token-model), [lista de mensajes de Gmail](https://developers.google.com/workspace/gmail/api/reference/rest/v1/users.messages/list).

## Qué se sincroniza

Se conservan las tarjetas existentes y sus estados. Repetir una revisión no debe reabrir una tarea terminada. Los identificadores de importación son huellas opacas; los IDs de Gmail y los cuerpos no forman parte del estado publicable. Las tareas aceptadas usan la sincronización GitHub que ya tiene el Centro. Esta función no hace commit, push ni despliegue por sí misma.

La revisión funciona cuando la ejecutas. El Apps Script de esta carpeta es una vía distinta para programación diaria; añadir el kanban no instala sus disparadores ni activa envíos semanales.
