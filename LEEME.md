# Centro UC3M

Esta es la aplicación JavaScript de [Centro UC3M](https://spotigetta.github.io/Centro-UC3M/). GitHub Pages entrega los archivos compilados; el navegador ejecuta `app.js`. El HTML de `src/index.html` es la entrada de la aplicación, no una copia estática de los datos.

## Código y datos

- `src/` contiene la interfaz, estilos, service worker y lógica académica compartida.
- `src/shared/academic-core.js` se usa tanto al compilar el plugin de Obsidian como en la web para fechas, recurrencias y formato de horas.
- `data/state.json` reúne el estado que se genera desde el panel Markdown, las fuentes académicas y el material local.
- `material/` contiene los archivos publicables de las asignaturas.
- `scripts/build.cjs` valida el estado y genera `dist/`, que no se guarda en Git.
- `scripts/deploy-branch.cjs` compila la aplicación y prepara la rama `gh-pages`.

## Del ordenador a la web

En este equipo, el repositorio tiene configurado `core.hooksPath=.githooks`. Al ejecutar `git commit` en `main`, el hook regenera `data/state.json` y la copia publicable del material desde Obsidian, comprueba los archivos y los añade al commit. No hace falta pulsar «Preparar web» antes de cada commit.

Para publicar cambios de interfaz ejecuta `npm.cmd run deploy` y sube la rama `gh-pages` con GitHub Desktop, o ejecuta `npm.cmd run deploy:push`. El comando construye `dist/` y actualiza el worktree local `.pages-worktree`. `main` mantiene el código fuente y los datos; `gh-pages` contiene la aplicación compilada.

En GitHub configura **Settings → Pages → Build and deployment → Source: Deploy from a branch**, selecciona la rama **gh-pages** y la carpeta **/(root)**. No se usa GitHub Actions. Un `git fetch` solo descarga cambios; no publica la web.

En otro ordenador hay que activar el hook una vez con `git config --local core.hooksPath .githooks` y tener la bóveda en la misma estructura de carpetas. También se puede ejecutar manualmente `node scripts/build.cjs --check` y `node scripts/build.cjs` para comprobar o compilar la web. `npm.cmd run check` funciona en PowerShell si `npm.ps1` está bloqueado.

La web carga una copia inicial incluida en `gh-pages` y, cuando hay token, consulta siempre `data/state.json` de `main` para obtener los datos actuales. Al guardar desde la web solo cambia `main`: tareas, grupos, horario y demás datos aparecen en otros dispositivos al sincronizar, sin redesplegar Pages. Los materiales nuevos o editados se abren desde `main` mediante la API de GitHub. `gh-pages` solo se actualiza cuando cambia la aplicación.

## Del móvil a Obsidian

En la web, **GitHub ⚙** permite introducir un token con permiso `Contents: read/write`. Se conserva en el almacenamiento local de ese navegador. **Sincronizar** guarda tareas, grupos, proyectos y otros datos editables en `data/state.json`; la carga de material e informes Markdown también escribe en `main`.

En Obsidian, usa **GitHub → Traer cambios del móvil** antes de volver a editar los mismos elementos localmente. Se ejecuta `git fetch origin main` y se importan los elementos modificados desde el commit remoto, incluso si hay archivos locales sin commit. Los adjuntos que difieran conservan una copia de seguridad. El siguiente commit local genera de nuevo el estado combinado.

Los dos PDF de más de 100 MB permanecen solo en Obsidian. El material publicado ocupa aproximadamente 914 MiB; el compilador comprueba el tamaño antes de publicar. Los archivos se descargan cuando se abren y el service worker solo guarda la interfaz.

## Asistente académico

La pestaña **Asistente IA** usa las fuentes académicas, horario, calendario y estado del panel. Solo adjunta apuntes, informes, JSON, CSV, TXT o TEX cuando se seleccionan expresamente; los PDF no se envían de forma automática. Los cambios propuestos se validan y se muestran antes de aplicarlos a la capa editable. La clave de Gemini se conserva solo durante la sesión web y no entra en Git.

## Correo académico

El [agente privado de correo](email-agent/README.md) prepara una revisión diaria de Gmail con Gemini y guarda las evidencias y propuestas en Drive privado. La pestaña **Correo académico** importa `propuestas.json` localmente, permite aceptar o descartar cada hecho y sincroniza los aceptados con el JSON académico del Centro. El correo completo, los identificadores de mensaje y la clave de Gemini no se publican en GitHub Pages.
