# Centro UC3M: una sola aplicación y un solo repositorio

Este directorio es el repositorio de GitHub Pages de `https://spotigetta.github.io/Centro-UC3M/`. La web usa `app.js`, `styles.css` y `data/state.json`. El botón **GitHub → Preparar web y archivos** del panel de Obsidian genera aquí el estado actual a partir de `Centro UC3M/Panel UC3M.md` y copia el material de las asignaturas. La carpeta antigua `Centro UC3M/movil` ya no interviene.

## Del ordenador al móvil

1. Edita el centro en Obsidian.
2. Abre **GitHub → Preparar web y archivos** dentro del panel UC3M.
3. En este directorio haz `git add -A`, `git commit -m "Actualizar Centro UC3M"` y `git push` cuando quieras publicar. El botón no hace commit ni push por ti.
4. Abre o recarga GitHub Pages. La PWA usa el mismo estado, asignaturas, tareas, grupos, horario, evaluación, prácticas, calendario, proyectos, apuntes, informes y enlaces del centro.

## Del móvil al ordenador

En la web, **GitHub ⚙** permite introducir un token de acceso a este repositorio con permiso `Contents: read/write`. Se guarda solo en la sesión del navegador. Edita y usa **Sincronizar** para guardar las tarjetas, grupos, horario, proyectos o apuntes. Los archivos subidos y los informes Markdown editados se guardan directamente en `material/` del repositorio y se marcan para la importación.

En Obsidian, usa **GitHub → Traer cambios del móvil**. Este paso hace `git pull --ff-only`, aplica únicamente los elementos modificados en la web al Markdown local y copia los archivos nuevos o editados. Si ya existía un archivo distinto, guarda una copia en `.obsidian/uc3m-backups`. Después pulsa **Preparar web y archivos** y haz tu commit y push para cerrar el ciclo. La importación requiere que no haya cambios Git sin commit en este directorio; los cambios del panel Markdown se conservan y se combinan por elemento.

El estado web incluye datos personales como los integrantes de grupos y se publica en GitHub Pages. Los dos PDF de más de 100 MB permanecen en Obsidian y aparecen como «solo en Obsidian», porque GitHub no acepta ese tamaño como archivo normal. El resto de los materiales ocupa cerca de 914 MiB: antes de añadir mucho material nuevo, comprueba el límite de 1 GB de GitHub Pages. Los archivos de material se descargan bajo demanda y el service worker no los almacena completos en el móvil.

## Asistente académico UC3M

La pestaña **Asistente IA** usa las siete fuentes académicas completas, el horario, el calendario y el estado actual del panel. Los apuntes, informes, JSON, CSV, TXT o TEX solo se incluyen cuando se añaden expresamente como contexto; los PDF no se envían automáticamente.

Gemini devuelve respuestas estructuradas con citas. Si se le pide modificar información, solo puede proponer tareas, eventos, progreso de prácticas o notas en la capa editable. La aplicación valida cada operación y muestra una vista previa antes de ejecutarla. Las fuentes aprobadas, ponderaciones y cronogramas originales son de solo lectura. En Obsidian la clave se guarda en los datos privados locales del plugin; en la web se conserva únicamente durante la sesión del navegador y nunca se escribe en GitHub.
