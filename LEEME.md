# Centro UC3M

Esta es la aplicación JavaScript de [Centro UC3M](https://spotigetta.github.io/Centro-UC3M/). GitHub Pages entrega los archivos compilados; el navegador ejecuta `app.js`. El HTML de `src/index.html` es la entrada de la aplicación, no una copia estática de los datos.

## Código y datos

- `src/` contiene la interfaz, estilos, service worker y lógica académica compartida.
- `src/shared/academic-core.js` se usa tanto al compilar el plugin de Obsidian como en la web para fechas, recurrencias y formato de horas.
- `data/state.json` reúne el estado que se genera desde el panel Markdown, las fuentes académicas y el material local.
- `material/` contiene los archivos publicables de las asignaturas.
- `scripts/build.cjs` valida el estado y genera `dist/`, que no se guarda en Git.
- `.github/workflows/pages.yml` compila y publica `dist/` en cada push a `main`.

## Del ordenador a la web

En este equipo, el repositorio tiene configurado `core.hooksPath=.githooks`. Al ejecutar `git commit`, el hook regenera `data/state.json` y la copia publicable del material desde Obsidian, comprueba los archivos y los añade al commit. Después, `git push` activa la GitHub Action. No hace falta pulsar «Preparar web» antes de cada commit.

La primera vez que se publique con este flujo, configura **Settings → Pages → Build and deployment → Source: GitHub Actions** en el repositorio. La Action no hace commit ni modifica `main`: publica su compilación como artefacto de Pages. Un `git fetch` solo descarga cambios; la publicación se inicia con un push.

En otro ordenador hay que activar el hook una vez con `git config --local core.hooksPath .githooks` y tener la bóveda en la misma estructura de carpetas. También se puede ejecutar manualmente `node scripts/build.cjs --check` y `node scripts/build.cjs` para comprobar o compilar la web. `npm.cmd run check` funciona en PowerShell si `npm.ps1` está bloqueado.

La web y Obsidian leen los mismos datos académicos y comparten el núcleo de fechas. Obsidian conserva su integración nativa con el editor de Markdown, el sistema de archivos y los diálogos; la web usa el navegador y GitHub para esas operaciones. Los elementos que todavía dependan de esas APIs de Obsidian deben implementarse explícitamente en la interfaz web para que su interacción sea idéntica.

## Del móvil a Obsidian

En la web, **GitHub ⚙** permite introducir un token con permiso `Contents: read/write`. Se conserva solo en la sesión del navegador. **Sincronizar** guarda tareas, grupos, proyectos y otros datos editables en `data/state.json`; la carga de material e informes Markdown también escribe en el repositorio.

En Obsidian, usa **GitHub → Traer cambios del móvil** antes de volver a editar los mismos elementos localmente. Se ejecuta `git pull --ff-only`, se importan los elementos modificados y se conserva una copia de seguridad de los archivos que difieran. El siguiente commit local genera de nuevo el estado web combinado.

Los dos PDF de más de 100 MB permanecen solo en Obsidian. El material publicado ocupa aproximadamente 914 MiB; el compilador comprueba el tamaño antes de publicar. Los archivos se descargan cuando se abren y el service worker solo guarda la interfaz.

## Asistente académico

La pestaña **Asistente IA** usa las fuentes académicas, horario, calendario y estado del panel. Solo adjunta apuntes, informes, JSON, CSV, TXT o TEX cuando se seleccionan expresamente; los PDF no se envían de forma automática. Los cambios propuestos se validan y se muestran antes de aplicarlos a la capa editable. La clave de Gemini se conserva solo durante la sesión web y no entra en Git.
