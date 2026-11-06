# Estudiar con PDF en Edge

Esta extensión conserva una biblioteca por asignatura en el panel lateral derecho. El chat de ChatGPT se abre en la pestaña principal, a la izquierda. Los PDF se dibujan con una copia local de PDF.js: no dependen de una web externa ni del visor integrado del navegador.

## Instalación local

1. Abre `edge://extensions` y activa el modo de desarrollador.
2. Pulsa «Cargar descomprimida» y elige esta carpeta `edge-extension`, que contiene `manifest.json`.
3. En el menú de extensiones de Edge fija «Centro UC3M: estudio con PDF» para tenerlo accesible.
4. Pulsa la extensión. Elige una asignatura y pulsa «Abrir chat de la asignatura». El proyecto de ChatGPT requiere tu sesión habitual.
5. Usa «Añadir PDF», «Añadir carpeta» o arrastra varios PDF desde el explorador al panel. Se ordenan por nombre y numeración. Cambia entre ellos con la lista; el chat permanece abierto. Puedes ampliar el panel arrastrando su borde izquierdo.

Si abres material desde la pestaña Estudio del Centro, pulsa «Abrir en Edge» para enviar la selección a la extensión. Si Edge impide abrir automáticamente el panel por las reglas de gesto de usuario, la selección queda preparada: pulsa la extensión para recuperarla. Tras instalar o actualizar la extensión, recarga el Centro antes de usar la conexión.

## Lectura y contexto para ChatGPT

El visor permite cambiar de página o ajustar el zoom. «Copiar página para ChatGPT» copia el texto extraíble de la página junto al nombre del documento, asignatura y número de página. Después lo pegas en el chat y escribes tu pregunta. Si una página está escaneada y no contiene texto, adjunta el PDF o una captura en ChatGPT.

ChatGPT no ve automáticamente lo que muestra el panel. La extensión no lee tu conversación ni envía mensajes. Para que ChatGPT consulte todo un tema, adjunta su PDF en el chat. El apartado «Preparar una pregunta con contexto» permite copiar un fragmento o una pregunta propia.

## Dónde se guardan los archivos

Los PDF elegidos se copian al almacenamiento local de la extensión, separados por asignatura. Permanecen al cerrar y abrir el panel. No se suben a GitHub ni a ChatGPT. «Quitar de esta biblioteca» elimina la copia del navegador, conservando el archivo original de Windows. Al desinstalar la extensión o borrar sus datos se pierde la biblioteca del navegador; los archivos originales permanecen en sus carpetas.

La selección de carpeta es explícita: la extensión no vigila el explorador ni lee documentos nuevos sin que los elijas. Si modificas un PDF, vuelve a añadirlo. Para evitar copias repetidas se compara nombre, tamaño y fecha del archivo local, no una huella de todo su contenido; si sustituyes un archivo manteniendo esos datos, quita su copia antigua antes de añadirlo de nuevo.

Se admiten PDF locales de hasta 512 MB; el espacio real depende de la cuota del navegador y de la memoria disponible. Los documentos grandes pueden tardar en abrirse. La selección publicada del Centro se limita a 100 MB por archivo; para materiales marcados «solo en Obsidian», selecciona el original desde el explorador. Si un PDF no se puede dibujar, usa «Abrir PDF en pestaña». Algunos formatos de imagen internos, por ejemplo JPEG 2000, pueden requerir ese visor alternativo.

## Permisos y límites

Se solicitan únicamente panel lateral, almacenamiento y acceso al sitio `https://spotigetta.github.io/Centro-UC3M/` para recuperar el material seleccionado. No se solicita acceso al contenido de ChatGPT, al historial general ni a todas las webs. Los enlaces de asignatura se limitan a los proyectos de ChatGPT incluidos en `courses.json`; la descarga de material se limita a las carpetas o rutas explícitas de cada curso.

Esta carpeta es una extensión local preparada para instalar sin publicar en una tienda. El archivo ZIP se distribuye como paquete de instalación manual; primero hay que descomprimirlo y después seleccionar su carpeta con «Cargar descomprimida».

Documentación oficial: [panel lateral de Microsoft Edge](https://learn.microsoft.com/en-us/microsoft-edge/extensions/developer-guide/sidebar) y [API sidePanel](https://developer.chrome.com/docs/extensions/reference/api/sidePanel).

## Verificación

`node scripts/test-edge-study.cjs` desde la raíz del repositorio comprueba validaciones, biblioteca local y flujo del panel mediante APIs simuladas. Estas pruebas no sustituyen abrir una sesión real de Edge e instalar la extensión.
