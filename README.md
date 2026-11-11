# BiblioWeb — Catálogo y administración de una biblioteca

Sitio web de una biblioteca con una parte pública (inicio, catálogo y ficha de cada libro) y un panel de administración.
Hecho para el **reto de Prompt Engineering** de Riwi (clan Orion, Cohorte 8). El prototipo con IA sirve además como **proyección visual y funcional** del proyecto que el grupo construirá a mano.

Este proyecto se construyó **con cuatro herramientas de IA, una tras otra**, y este README cuenta qué se hizo en cada una, con qué prompts y qué resultado salió:

| Orden | Herramienta | Para qué se usó |
| :--- | :--- | :--- |
| 1 | **Claude** | Estrategia, prompts, paletas de color, organización del código, HTML semántico, Git, revisión y documentación |
| 2 | **Google Stitch** | Diseño y primer prototipo, en tema claro y oscuro |
| 3 | **v0.app** | CRUD de libros, buscador, filtros y ficha de cada libro |
| 4 | **Lovable** | Migración a TanStack Start, base de datos, login real, préstamos reales y funciones de IA |

---

## 1. Qué es este proyecto y por qué existe

El reto pedía que cada célula creara una página web o aplicación **con ayuda de IA**, aprendiendo a comunicar ideas, definir funcionalidades, construir buenos prompts y mejorar los resultados.

La idea del grupo fue "matar dos pájaros de un tiro":

1. Cumplir el reto de Prompt Engineering llevando BiblioWeb tan lejos como sea posible con IA.
2. Usar ese prototipo como **mapa visual y funcional** (cómo se ve, qué secciones tiene, cómo se comporta) para que el equipo desarrolle después el proyecto real **a mano**, sin copiar y pegar lo que salga de la IA.

El prototipo de IA y el proyecto del equipo se mantienen **separados**, para que quede claro qué hizo la IA y qué hizo el equipo.

---

## 2. Dos versiones del proyecto

Por el camino el proyecto se bifurcó en dos versiones. Conviene tenerlo claro:

| | **Versión estática** (Stitch → Claude → v0) | **Versión Lovable** (etapa 4) |
| :--- | :--- | :--- |
| Tecnología | HTML5, CSS3, Bootstrap 5.3 (CDN) y JavaScript puro | TanStack Start con Bootstrap 5.3 y estilos originales |
| Datos | `localStorage` (por navegador) | Base de datos relacional en la nube |
| Acceso | Login simulado con cuenta de prueba | Registro e inicio de sesión reales de lectores; roles validados en servidor |
| Préstamos | Modal simulado | Préstamos reales con historial y fecha de entrega |
| IA | Ninguna | "Agregar con IA" y "Conversa con el libro" |
| Se despliega | Como sitio estático (GitHub Pages) | Con su backend (requiere el servicio en la nube) |

**Qué es lo que vive en este repositorio:** la versión estática (carpetas `css/`, `js/`, `pages/`, `img/`). La versión Lovable está documentada en la etapa 4; su código no forma parte de esta estructura.

> **Sobre el alcance de la actividad.** La actividad base del grupo pide un prototipo **estático**: JavaScript solo para login, sesión y tema; libros y solicitudes escritos a mano en HTML; sin `localStorage` para libros y sin buscadores ni filtros; y con HTML, CSS, Bootstrap y JS puro. Para el reto de IA se decidió **ir más allá a propósito**. Si el proyecto del grupo se evalúa con la actividad base, lo ampliado (v0 y Lovable) **no debe copiarse tal cual**: queda como referencia de lo que se puede lograr.

---

## 3. Línea de tiempo general

| Etapa | Qué pasó | Herramienta |
| :--- | :--- | :--- |
| 1 | Se entiende el reto y se define la estrategia | Claude |
| 2 | Se escribe el prompt base | Claude |
| 3 | Se proponen y comparan paletas de color | Claude |
| 4 | Preguntas de clarificación y requisitos | Stitch |
| 5 | Primera paleta (verde y terracota) y primeros prototipos | Stitch |
| 6 | Exploración de seis direcciones de estilo | Stitch |
| 7 | Paleta definitiva café, roble y almendra | Stitch |
| 8 | Modo oscuro "Café y roble" y pantallas oscuras | Stitch |
| 9 | Entrega del código fuente | Stitch |
| 10 | Reorganización del código en carpetas | Claude |
| 11 | HTML semántico | Claude |
| 12 | Guía de Git y commits (Conventional Commits) | Claude |
| 13 | CRUD, buscador, filtros y ficha de libro | v0.app |
| 14 | Revisión del código de v0 y pruebas de la lógica | Claude |
| 15 | Migración a TanStack Start, base de datos y login real | Lovable |
| 16 | Funciones de IA: "Agregar con IA" y "Conversa con el libro" | Lovable |
| 17 | Préstamos reales y panel de administración con roles | Lovable |

---

## 4. Etapa 1 — Claude: estrategia, prompts y paletas

### 4.1 Entender el reto y elegir la estrategia

- Se compartió el anuncio del reto de Prompt Engineering y el documento de la actividad de BiblioWeb.
- Se decidió usar el reto para producir un prototipo de referencia con IA y construir el proyecto real a mano.
- Recomendaciones acordadas:
  - Separar el prototipo de IA del repositorio real del equipo.
  - Pedirle a la IA **explícitamente** el mismo stack (HTML, CSS, Bootstrap 5.3 y JS puro), porque herramientas como Lovable o v0 tienden a generar React y Tailwind.
  - Dejar que el modelo haga preguntas antes de generar código (paso 3 del reto).
  - Elegir la paleta antes de generar, para que el diseño tenga identidad propia.
  - Guardar el prompt final, la página generada y un repositorio con commits, y anotar errores y correcciones del prompt.

### 4.2 Construir el prompt base

Se redactó un prompt que describe las 4 páginas, el JavaScript permitido, los archivos esperados y las restricciones. Ver la sección 8.1.

### 4.3 Primeras tres paletas y un prompt para cada una

| Opción | Colores clave |
| :--- | :--- |
| 1. Biblioteca clásica (la recomendada) | Verde bosque `#1F4E45`, dorado `#C8963E`, crema `#F6F1E7`, gris carbón `#22262A`, burdeos `#7A2E3A` |
| 2. Moderna y fresca | Azul marino `#1B2A49`, turquesa `#2A9D8F`, arena `#F4EFE6`, coral `#E76F51`, gris oscuro `#2B2D42` |
| 3. Tinta y papel (minimalista) | Azul tinta `#27374D`, azul grisáceo `#526D82`, gris perla `#DDE6ED`, naranja `#F2A65A`, casi negro `#14213D` |

Para cada una se escribió un prompt listo para pegar en la herramienta de IA, más un prompt de **tema oscuro** (sin negro puro) válido para las tres. Ver la sección 8.2.

### 4.4 Mezcla de paletas de Coolors: "Biblioteca de madera y hojas"

El grupo trajo dos paletas de Coolors (verde oliva y cobre). Se mezclaron en una sola, descartando `#D4A373` por parecerse demasiado a `#DDA15E`:

| Uso | Color | Hex |
| :--- | :--- | :--- |
| Principal (navbar, botones) | Olive leaf | `#606C38` |
| Texto y fondos oscuros | Black forest | `#283618` |
| Acento | Copperwood | `#BC6C25` |
| Acento suave | Sunlit clay | `#DDA15E` |
| Fondo claro | Cornsilk | `#FEFAE0` |
| Tarjetas y secciones | Beige | `#E9EDC9` |
| Bordes | Tea green | `#CCD5AE` |
| Detalles cálidos | Papaya whip | `#FAEDCD` |

Se acompañó de recomendaciones de contraste y de un prompt para el tema claro y otro para el oscuro (sección 8.2).

### 4.5 Paleta café y modo oscuro "Café y roble"

El grupo pidió probar otra paleta de tonos tierra. Como ninguno de sus colores era realmente oscuro, se **derivaron** fondos marrones muy oscuros a partir de `#7F5539`. El resultado se detalla en la etapa de Stitch (sección 5, fases 4 y 5), donde se implementó.

### 4.6 Reorganización del código exportado por Stitch

Se recibió el zip de Stitch y se reorganizó con la estructura de carpetas acordada:

- `auth.js` y `tema.js` venían dentro de archivos envoltorio; se extrajo solo el código real.
- Los CSS (en tres versiones: verde, café claro y café con modo oscuro) se unificaron con la paleta café y se repartieron en `base.css`, `componentes.css` y `estilos.css`.
- Se ajustaron las rutas de las páginas dentro de `pages/` y se corrigió el cierre de sesión (`../index.html`).
- Se crearon portadas locales en `img/libros/` y la carpeta `img/equipo/`.
- Se adaptaron las clases de la versión verde (`btn-verde`, `btn-terracota`, `badge-narrativa`…) a la paleta café.
- Las páginas dejaron de depender de imágenes remotas para las portadas.

### 4.7 HTML semántico

Las 4 páginas se reescribieron con `header`, `nav`, `main`, `section`, `article`, `aside`, `address` y `footer`; un solo `h1` por página; títulos enlazados con `aria-labelledby`; tablas con `caption` y `th scope`; y un enlace "saltar al contenido", **sin cambiar colores, clases ni aspecto**. Cambios técnicos que hubo que hacer por el camino:

- `sticky-top` pasó del `<nav>` al `<header>`, porque si no la barra dejaba de quedarse fija al hacer scroll.
- Un `<label>` del modal no estaba asociado a su campo; se añadió `for`.
- Los botones sin `type` ahora tienen `type="button"` y los emojis decorativos quedan ocultos para lectores de pantalla.

### 4.8 Git y commits

Se preparó una secuencia de commits con **Conventional Commits** (`tipo(alcance): descripción`), por ejemplo:

```
docs: add readme with project story and prompts used
feat(css): add color palette and light/dark theme tokens
feat(js): add admin login and session control
feat(catalog): add book grid and loan request modal
fix(auth): redirect logout to index from pages folder
```

Además se escribió una guía en texto (`guia-git-equipo.txt`) para trabajar en **PC compartidos con Ubuntu**: sin `--global`, con token de acceso en vez de contraseña, y con pasos para dejar el PC limpio al terminar.

### 4.9 Revisión del código de v0

Ver etapa 3, sección 6.2.

---

## 5. Etapa 2 — Google Stitch: diseño y primer prototipo

Registro de la conversación con Stitch, en orden.

### Fase 1 — Planteamiento inicial y requisitos

**Prompt del grupo:**

> Actúa como un desarrollador web front-end. Antes de generar código, hazme las preguntas que necesites para entender mejor el proyecto. Queremos hacer BiblioWeb con HTML5, Bootstrap 5.3 CDN, vanilla JS, y páginas como index.html, catalogo.html, login.html, admin.html, css/base.css, js/auth.js y js/tema.js.

**Respuesta de Stitch:** planteó preguntas de clarificación sobre:

1. Arquitectura de vistas públicas (`index.html` con OPAC y `catalogo.html` con 6 obras y modal).
2. Seguridad y autenticación administrativa (`login.html` con credenciales demo y `admin.html` protegido con `sessionStorage`).
3. Alternancia de tema claro/oscuro con `data-bs-theme` de Bootstrap 5.3 y almacenamiento en `localStorage`.
4. Identidad visual institucional y accesibilidad WCAG AAA.

### Fase 2 — Primera paleta: verde biblioteca y terracota

**Prompt del grupo:**

> Definamos los colores base:
> - Verde biblioteca (#1F4D3A) para navbar y botones principales.
> - Terracota (#B85C38) para acentos y destacados.
> - Fondo claro pergamino (#F7F3E8).
> - Burdeos (#A83232) para error o acciones críticas.

**Resultado:** Stitch configuró la primera versión de los tokens en `css/base.css` y generó los prototipos iniciales: `index.html` (portal de inicio con localizador OPAC y horarios), `catalogo.html` (grid de libros con modal de solicitud), `login.html` y `admin.html`.

### Fase 3 — Exploración cromática y pruebas comparativas

Durante varias sesiones se pidió a Stitch validar distintas direcciones de estilo (las paletas habían sido propuestas por Claude o traídas de Coolors):

| # | Dirección | Solicitud | Resultado |
| :--- | :--- | :--- | :--- |
| 1 | Celadon y Stone Brown | Celadon `#AFD5AA`, White Smoke `#F0F2EF`, Stone Brown `#5C5346`, Silver `#A69F98`, Smoky Rose `#8C6057` | Estilo editorial suave y contemporáneo |
| 2 | Escala monocromática | Grises de Bright Snow `#F8F9FA` a Carbon Black `#212529` | Enfoque sobrio, minimalista y de alto contraste |
| 3 | Verde bosque y dorado | Verde bosque `#1F4E45` primario, dorado `#C8963E` acento, texto oscuro forzado sobre el dorado | Variación clásica y solemne |
| 4 | Azul marino y turquesa | Azul marino `#1B2A49`, turquesa `#2A9D8F`, arena `#F4EFE6`, coral `#E76F51` | Atmósfera institucional moderna y cívica |
| 5 | Olive Leaf y Copperwood | Olive Leaf `#606C38`, Copperwood `#BC6C25`, Cornsilk `#FEFAE0` | Estilo botánico y orgánico, de archivo patrimonial |
| 6 | Maderas nobles y salvia | Dark Walnut `#582F0E`, Saddle Brown `#7F4F24`, Salvia `#C2C5AA` | Tono señorial, de maderas clásicas y lectura sosegada |

### Fase 4 — Paleta definitiva: café, roble y almendra

**Prompt del grupo:**

> Probemos con esta paleta:
> - Almond Cream (#EDE0D4)
> - Pale Oak (#E6CCB2)
> - Tan (#DDB892)
> - Faded Copper (#B08968)
> - Coffee Bean (#7F5539)
> - Toffee Brown (#9C6644)

**Resultado:** Stitch implementó la paleta en `css/base.css` y generó la pantalla de inicio:

| Uso | Color | Hex |
| :--- | :--- | :--- |
| Fondo claro | Almond Cream | `#EDE0D4` |
| Superficies | Pale Oak | `#E6CCB2` |
| Bordes y acento | Tan | `#DDB892` |
| Acento suave | Faded Copper | `#B08968` |
| Primario (navbar, pie y botones) | Coffee Bean | `#7F5539` |
| Acción secundaria y badges | Toffee Brown | `#9C6644` |
| Texto principal (alto contraste) | Deep Espresso | `#382417` |
| Eliminar / alerta | Burdeos | `#7A2E3A` |

### Fase 5 — Modo oscuro estricto, sin negro puro

**Prompt del grupo:**

> Tema oscuro: usa data-bs-theme='dark' de Bootstrap 5.3 y alterna con data-bs-theme='light' desde js/tema.js. No uses negro puro (#000000). Fondo de la página #1E1510, tarjetas, navbar y modales #2B1E16, bordes #7F5539, texto principal almond cream #EDE0D4 y texto secundario pale oak #E6CCB2. Color principal toffee brown #9C6644, acento tan #DDB892 con texto oscuro (#1E1510) encima, faded copper #B08968 de acento suave, y burdeos #A8454F para el botón de eliminar. Define estos colores como variables CSS en css/base.css y sobrescribe las variables de Bootstrap. Guarda la preferencia en localStorage.

**Resultado:** Stitch implementó:

1. Sin negro puro: fondo `#1E1510` y tarjetas `#2B1E16`.
2. Texto Almond Cream `#EDE0D4` y secundario Pale Oak `#E6CCB2`.
3. Botones y acentos: Toffee Brown `#9C6644` y Tan `#DDB892` con texto oscuro `#1E1510`.
4. Botón "Eliminar" en burdeos `#A8454F` en las tablas de gestión.
5. `js/tema.js`: alternancia sin destellos (FOUC) y persistencia en `localStorage` (clave `biblioweb_theme_preference`).
6. Las cuatro pantallas completas en modo oscuro: Inicio, Catálogo, Acceso Admin y Panel Admin.

### Fase 6 — Empaquetado y entrega del código

Stitch entregó el código fuente listo para usar sin herramientas de compilación: `css/base.css`, `js/tema.js`, `js/auth.js`, `index.html`, `catalogo.html`, `login.html` y `admin.html`.

> Nota de revisión: el resumen de Stitch menciona "filtros" en el catálogo y un "localizador OPAC" en el inicio, que la actividad base no incluye. El buscador del inicio, además, no hace nada todavía (ver limitaciones).

### Fase 7 — Síntesis de la conversación

Se le pidió a Stitch una bitácora ordenada de lo hablado y lo entregado, que dio origen a este historial.

---

## 6. Etapa 3 — v0.app: CRUD, buscador y ficha de libro

Se llevó el proyecto más allá de la actividad base:

1. **CRUD de libros** en el panel de administración, con `localStorage`.
2. **Catálogo dinámico** con buscador, filtros y ordenamiento.
3. **Ficha de cada libro** (`pages/libro.html`): ISBN, año, editorial, sinopsis y libros relacionados. Se añadieron los campos al formulario del admin y se migraron los libros ya guardados.

### 6.1 Qué hace

**Catálogo público**

- **Buscador** por título, autor, categoría, descripción, ISBN, año y editorial. Ignora mayúsculas y tildes y acepta varias palabras.
- **Filtros** por categoría (con contador) y por disponibilidad, y **ordenamiento** por título, autor o más recientes.
- Los filtros quedan en la URL (`?q=...&categoria=...&estado=...&orden=...`), así que una búsqueda se puede compartir.
- Botón para limpiar filtros y mensaje amable cuando no hay resultados.
- Los libros "Prestados" no permiten solicitar préstamo.

**Ficha de cada libro**

- Portada, categoría, disponibilidad, datos bibliográficos (**ISBN, año, editorial**) y **sinopsis completa**. El "resumen breve" queda para la tarjeta del catálogo.
- **Hasta 4 libros relacionados**: primero los del mismo autor y después los de la misma categoría.
- Ruta de navegación y aviso con botón de regreso si el libro no existe.
- Los ISBN se muestran con guion tras el prefijo y antes del dígito de control; el resto de guiones depende de cada país y editorial.

**Panel de administración (CRUD)**

- Crear, editar y eliminar libros, con confirmación antes de borrar y avisos de éxito.
- Campos: título, autor, portada (URL con vista previa), categoría, estado, descripción breve, ISBN, año, editorial y sinopsis.
- **Validaciones:** campos obligatorios, **ISBN-10 e ISBN-13 verificados con su dígito de control** y año que no puede ser futuro.
- Buscador y filtro dentro de la tabla, y botón "Restaurar ejemplos".

**Datos**

- Los libros se guardan en `localStorage` (clave `biblioweb_libros`) mediante un módulo compartido (`js/libros.js`).
- Los libros guardados antes de la ficha se **actualizan solos** con ISBN, año, editorial y sinopsis.
- Los cambios en una pestaña se reflejan en las demás, y todo texto pintado con JavaScript se **escapa** antes de insertarlo.

### 6.2 Revisión del código (Claude)

- Los 6 libros de ejemplo tienen **ISBN con dígito de control válido**.
- Se probó la lógica de `libros.js` con **23 pruebas automáticas** (agregar, editar, eliminar, ISBN-10 e ISBN-13, relacionados, migración de datos antiguos, JSON corrupto y escape de HTML). Todas pasaron. Son pruebas de la lógica, no sustituyen probar el sitio en el navegador.
- Los 6 archivos JS tienen sintaxis válida, no hay IDs duplicados ni archivos enlazados que no existan, y `libros.js` se carga antes de los scripts que lo usan.
- Se detectó que las páginas de v0 partieron del HTML anterior al semántico, así que **faltan por aplicar esos cambios** (ver limitaciones).

---

## 7. Etapa 4 — Lovable: base de datos, login real, préstamos e IA

Historial de desarrollo en Lovable, a partir del código original del repositorio (`reto_prompt_engineering-main.zip`). El código de esta etapa **no fue revisado aquí**: lo que sigue es lo que reporta su propio historial.

### 7.1 Migración inicial del proyecto

- Migración de la maqueta estática HTML/CSS/JS a **TanStack Start**, manteniendo Bootstrap 5.3 y los estilos originales.
- Páginas principales: Inicio, Catálogo con filtros por categoría y búsqueda en tiempo real, Vista de detalle del libro, Formulario de solicitud de préstamo (modal), Login simulado y Panel de administración básico.
- Persistencia inicial de libros y solicitudes en `localStorage`, con los 6 libros base y las portadas SVG originales.

### 7.2 Gestión de libros e integración de IA

- **Solicitud:** poder agregar libros y automatizar la búsqueda con IA.
- Botón **"+ Nuevo libro"** para limpiar el formulario en el panel de administración.
- Botón **"✨ Agregar con IA"**, que consulta un modelo de IA mediante una *server function*. Al escribir el nombre de una obra (por ejemplo "Rayuela"), la IA extrae título, autor, año, editorial, categoría, descripción corta y sinopsis, y autocompleta el formulario para guardarlo después.
- En el catálogo, el contador pasó a llamarse **"Total de libros"**.

### 7.3 Asistente de IA en cada libro: "Conversa con el libro"

- **Solicitud:** un chat en la ficha de cada obra para preguntar por el resumen, los personajes y la temática.
- **Decisión:** el chat **no recuerda conversaciones** entre visitas; se reinicia al recargar la página.
- Ruta de backend con *streaming* (`/api/chat-libro`) y un componente de chat debajo de la sinopsis, con interfaz en Bootstrap.
- Las respuestas van en primera persona ("habla el libro"), con **advertencias antes de revelar spoilers** y botones de preguntas rápidas.

### 7.4 Autenticación y sistema real de préstamos (Lovable Cloud)

- **Solicitud:** registro e inicio de sesión de clientes, reserva de libros con "Solicitar préstamo", historial de préstamos y fecha de entrega.
- **Decisiones:** los perfiles de lector guardan el nombre completo además del correo, y el plazo estándar de préstamo es de **15 días calendario**.
- Base de datos relacional y autenticación en la nube.
- Pantalla `/auth` con registro e inicio de sesión por correo y contraseña, Google y Lovable.
- Tablas seguras con políticas **RLS** para perfiles y préstamos.
- El modal de solicitud queda conectado al usuario autenticado, con **límite de 5 préstamos activos** y prevención de duplicados.
- Sección privada `/mis-prestamos` con estado y fechas de devolución.

### 7.5 Correcciones técnicas y de diseño

- Se corrigió una **pantalla en blanco en `/auth`**, causada por la resolución tardía de dependencias en Vite (se optimizaron antes los módulos de autenticación).
- El botón "Iniciar sesión con Google" se ajustó a **44 px de alto con icono de 18 px**, para que se vea bien en móvil y escritorio.

### 7.6 Panel de administración y gestión de roles

- **Solicitud:** ver en el panel de administración las solicitudes reales de los clientes.
- El panel `/admin` se conectó a las solicitudes reales de la base de datos (lector, libro, comentario, fechas y estado), **sustituyendo las maquetas de ejemplo**.
- Se **eliminó el acceso de demostración** con credenciales fijas y se implementó la **validación de roles en el servidor** (tabla `user_roles`).
- La cuenta registrada del propietario recibió el rol de administrador.
- Para nuevos administradores: registro normal en `/auth` y asignación posterior del rol `admin` en la base de datos (o, más adelante, desde una sección de gestión interna).

---

## 8. Prompts utilizados

### 8.1 Prompt base del proyecto (Claude)

```
Actúa como un desarrollador web front-end. Antes de generar código,
hazme las preguntas que necesites para entender mejor el proyecto.

Proyecto: BiblioWeb, un sitio para una biblioteca con una parte pública
y un panel de administración.

Tecnologías obligatorias: HTML5, CSS, Bootstrap 5.3 (por CDN) y
JavaScript puro. No uses React, Tailwind, backend ni base de datos.

Páginas:
1. index.html: landing con carrusel de imágenes, servicios, horarios
   ficticios, y enlaces al catálogo y al login.
2. catalogo.html: cuadrícula de 6 tarjetas de libros (categorías
   Narrativa, Tecnología y Ciencia, con badge), cada una con portada y
   alt, título, autor, descripción y botón "Solicitar préstamo" que abre
   un modal con: nombre, correo, comentario opcional y checkbox de
   términos.
3. login.html: título "Acceso de administrador", correo, contraseña y
   botón "Ingresar". Cuenta de prueba: admin@biblioweb.test / Admin123.
   Si es incorrecta, mostrar "Correo o contraseña incorrectos".
4. admin.html: formulario (título, autor, portada URL, descripción,
   categoría en select, botones Guardar y Cancelar), tabla estática de
   libros con botones Editar y Eliminar visuales, y tabla de "Solicitudes
   recibidas" (ID, libro, solicitante, correo, comentario, estado
   Pendiente).

JavaScript solo para:
- Login con sessionStorage y redirección a admin.html.
- Protección de admin.html (si no hay sesión, redirige a login.html).
- Botón "Cerrar sesión" que borra la sesión y lleva a index.html.
- Selector de tema claro/oscuro con data-bs-theme de Bootstrap 5.3,
  presente en la navbar de todas las páginas.

Todo lo demás (libros, solicitudes, botones de editar/eliminar) debe ser
HTML estático, sin arreglos de JS ni localStorage.

Diseño: responsivo, limpio, con esta paleta: [paleta elegida].
Estructura de archivos: index.html, catalogo.html, login.html,
admin.html, css/base.css, js/auth.js, js/tema.js.
```

### 8.2 Prompts de paleta y de tema (Claude)

**Opción 1 — Biblioteca clásica**

```
Paleta: verde bosque #1F4E45 como color principal (navbar y botones),
dorado #C8963E como acento, crema #F6F1E7 como fondo claro, gris carbón
#22262A para el texto y burdeos #7A2E3A para acciones de eliminar.
Define estos colores como variables CSS en css/base.css y sobrescribe
las variables de Bootstrap (--bs-primary). El texto sobre el dorado
debe ser oscuro para mantener el contraste.
```

**Opción 2 — Moderna y fresca**

```
Paleta: azul marino #1B2A49 como color principal (navbar y botones),
turquesa #2A9D8F como acento, arena #F4EFE6 como fondo claro, coral
#E76F51 para elementos destacados y acciones de eliminar, y gris oscuro
#2B2D42 para el texto. Define estos colores como variables CSS en
css/base.css y sobrescribe las variables de Bootstrap (--bs-primary).
```

**Opción 3 — Tinta y papel**

```
Paleta: azul tinta #27374D como color principal (navbar y botones),
azul grisáceo #526D82 como color secundario, gris perla #DDE6ED como
fondo claro, naranja suave #F2A65A como acento y casi negro #14213D
para el texto. Define estos colores como variables CSS en css/base.css
y sobrescribe las variables de Bootstrap (--bs-primary). Estilo
minimalista, con mucho espacio en blanco.
```

**Tema oscuro genérico (para las tres opciones)**

```
Tema oscuro: usa el atributo data-bs-theme="dark" de Bootstrap 5.3 y
alterna con data-bs-theme="light" desde js/tema.js. No uses negro puro.
Define en css/base.css los fondos oscuros según la paleta elegida:
- Opción 1: fondo #121816, tarjetas #1B2421, texto #EDE8DC.
- Opción 2: fondo #0F1626, tarjetas #18223A, texto #F1ECE2.
- Opción 3: fondo #0F1A26, tarjetas #1A2736, texto #E6EDF3.
Mantén el color principal y el acento de la paleta, aclarándolos un
poco si hace falta para que se lean bien. El cambio debe afectar fondo,
textos, navbar, tarjetas, tablas, formularios y modales, con buen
contraste y estados de foco visibles en ambos temas. Guarda la
preferencia del tema para que se mantenga entre las páginas.
```

**Mezcla "Biblioteca de madera y hojas" — tema claro**

```
Paleta: olive leaf #606C38 como color principal (navbar y botones),
copperwood #BC6C25 como color de acento para acciones importantes,
sunlit clay #DDA15E para hover y badges, cornsilk #FEFAE0 como fondo
claro, beige #E9EDC9 para tarjetas y secciones alternas, tea green
#CCD5AE para bordes, papaya whip #FAEDCD para detalles cálidos y black
forest #283618 para el texto. Para el botón de eliminar usa burdeos
#7A2E3A. Define estos colores como variables CSS en css/base.css y
sobrescribe las variables de Bootstrap (--bs-primary). El texto sobre
sunlit clay debe ser oscuro (#283618) y sobre copperwood debe ser
cornsilk, para mantener el contraste.
```

**Mezcla "Biblioteca de madera y hojas" — tema oscuro**

```
Tema oscuro: usa data-bs-theme="dark" de Bootstrap 5.3 y alterna con
data-bs-theme="light" desde js/tema.js. No uses negro puro. Fondo
#1A2210 (derivado de black forest), tarjetas y navbar #283618, bordes
#3B4A24, texto #FEFAE0 y texto secundario #CCD5AE. Mantén olive leaf
aclarado a #7A8A48 como color principal y sunlit clay #DDA15E como
acento, porque el copperwood se pierde sobre fondos oscuros. El cambio
debe afectar fondo, textos, navbar, tarjetas, tablas, formularios y
modales, con buen contraste y estados de foco visibles en ambos temas.
Guarda la preferencia del tema para que se mantenga entre las páginas.
```

**Tema oscuro "Café y roble" (el definitivo)**

```
Tema oscuro: usa data-bs-theme="dark" de Bootstrap 5.3 y alterna con
data-bs-theme="light" desde js/tema.js. No uses negro puro. Fondo de la
página #1E1510, tarjetas, navbar y modales #2B1E16, bordes #7F5539,
texto principal almond cream #EDE0D4 y texto secundario pale oak
#E6CCB2. Color principal para botones y elementos activos toffee brown
#9C6644, acento para hover, badges y enlaces tan #DDB892 con texto
oscuro (#1E1510) encima, y faded copper #B08968 como acento suave. Para
el botón de eliminar usa burdeos #A8454F. Define estos colores como
variables CSS en css/base.css y sobrescribe las variables de Bootstrap
dentro de [data-bs-theme="dark"]. El cambio debe afectar fondo, textos,
navbar, tarjetas, tablas, formularios y modales, con buen contraste y
estados de foco visibles. Guarda la preferencia del tema para que se
mantenga entre las páginas.
```

### 8.3 Prompts del grupo en Google Stitch

Están transcritos tal cual en la sección 5 (fases 1, 2, 4 y 5): el prompt inicial con preguntas previas, la paleta verde y terracota, la paleta café y el modo oscuro estricto. Las solicitudes de la fase 3 (exploración de paletas) se resumen en su tabla.

### 8.4 Prompts de v0.app

Prompt de la ficha del libro:

```
Ficha de cada libro con sinopsis, ISBN, año y libros relacionados.
```

> **Pendiente de completar:** pega aquí, en orden, los prompts anteriores del chat de v0 (CRUD de libros, buscador y filtros). El reto evalúa el prompt, así que conviene dejarlos todos documentados.

### 8.5 Solicitudes del grupo en Lovable

Resumidas a partir de su historial (sección 7):

1. Migrar el proyecto a TanStack Start manteniendo Bootstrap 5.3 y los estilos originales.
2. Poder agregar libros y automatizar la búsqueda con IA.
3. Un chat en la ficha de cada libro para preguntar por el resumen, los personajes y la temática.
4. Registro e inicio de sesión de clientes, reserva de libros con "Solicitar préstamo", historial de préstamos y fecha de entrega.
5. Mostrar en el panel de administración las solicitudes reales de préstamo de los clientes.

> **Pendiente de completar:** si conservas el texto exacto de cada prompt en Lovable, pégalo aquí.

---

## 9. Estructura de la versión estática

```
.
├── index.html                 # Inicio público / landing
├── pages/
│   ├── catalogo.html          # Catálogo con buscador, filtros y modal de solicitud
│   ├── libro.html             # Ficha de cada libro (?id=...)
│   ├── login.html             # Acceso educativo del administrador
│   └── admin.html             # Panel protegido: CRUD de libros y solicitudes
├── css/
│   ├── base.css               # Paleta, variables de tema y tipografía
│   ├── componentes.css        # Navbar, footer, tarjetas, botones, tablas, modales
│   └── estilos.css            # Portadas, ficha, enlaces de libro y ajustes propios
├── js/
│   ├── libros.js              # Módulo de datos: CRUD, ISBN, relacionados y localStorage
│   ├── catalogo.js            # Catálogo: buscador, filtros, orden y modal de préstamo
│   ├── ficha.js               # Ficha del libro y libros relacionados
│   ├── admin-libros.js        # Formulario, tabla y confirmaciones del panel
│   ├── auth.js                # Login, control de sesión y cierre
│   └── tema.js                # Selector claro/oscuro
└── img/
    ├── equipo/                # Imágenes del equipo (si se usan)
    └── libros/                # Portadas del catálogo y portada genérica
```

Orden de carga del CSS: Bootstrap → `base.css` → `componentes.css` → `estilos.css`. `tema.js` se carga en el `<head>` para evitar el parpadeo. En las páginas con libros, `libros.js` se carga **antes** que `catalogo.js`, `ficha.js` o `admin-libros.js`, porque todos dependen de él.

---

## 10. Errores encontrados y cómo se corrigieron

Parte importante de practicar Prompt Engineering es revisar lo que genera la IA y ajustar las instrucciones.

| Herramienta | Problema | Corrección |
| :--- | :--- | :--- |
| Claude | Las herramientas de IA tienden a generar React o Tailwind | El prompt exige HTML, CSS, Bootstrap 5.3 y JS puro |
| Claude | La paleta café no tenía tonos oscuros para el modo oscuro | Se derivaron fondos `#1E1510` y `#2B1E16` a partir de `#7F5539` |
| Claude | Contraste bajo de texto blanco sobre algunos tonos | Se usa texto oscuro sobre Tan y Faded Copper |
| Claude | El CSS exportado venía en tres versiones distintas | Se unificó con la paleta café y se dividió en tres archivos |
| Claude | Las páginas usaban clases de la versión verde (`btn-verde`, `btn-terracota`) | Se crearon equivalentes en la paleta café |
| Claude | `auth.js` y `tema.js` venían dentro de archivos envoltorio | Se extrajo solo el código real |
| Claude | Tras mover las páginas a `pages/`, el cierre de sesión llevaba a una ruta rota | Se cambió a `../index.html` |
| Claude | El tema parpadeaba al cargar | `tema.js` se carga en el `<head>` |
| Claude | Con `sticky-top` en el `<nav>` dentro de un `<header>`, la barra dejaba de quedarse fija | `sticky-top` pasó al `<header>` |
| Claude | Un `<label>` no estaba asociado a su campo en el modal | Se añadió el atributo `for` |
| v0 | Libros guardados antes de la ficha no tenían ISBN, año ni sinopsis | Migración automática al cargar, sin pisar lo editado |
| v0 | Un ISBN mal escrito se podía guardar | Validación de ISBN-10 e ISBN-13 con dígito de control |
| v0 | `form.reset()` dentro del evento `reset` creaba un ciclo infinito | Se separó en una función que no vuelve a llamar a `reset()` |
| v0 | Una URL de portada rota dejaba un hueco | Imagen de respaldo con `portada-generica.svg` |
| v0 | Texto con HTML (`<`, `&`) podía romper las tarjetas | Función `escaparHTML` en todo lo que se pinta con JS |
| Lovable | Pantalla en blanco en `/auth` por la resolución tardía de dependencias en Vite | Optimización previa de los módulos de autenticación |
| Lovable | El botón de Google se veía mal en móvil y escritorio | Se ajustó a 44 px de alto con icono de 18 px |
| Lovable | El panel de admin usaba credenciales fijas de demostración | Validación de roles en el servidor y eliminación de la cuenta demo |

---

## 11. Limitaciones y pendientes

**Versión estática (este repositorio)**

- **Los datos viven en el navegador.** `localStorage` es por navegador y por equipo: si el administrador agrega un libro, solo él lo ve, también en GitHub Pages.
- **El login es una simulación.** La cuenta de prueba está escrita en `js/auth.js`, a la vista de cualquiera, y la sesión se valida en el navegador. Sirve para practicar, no es seguridad real.
- **Las solicitudes no llegan al admin.** El modal solo muestra un aviso y la tabla "Solicitudes recibidas" es de ejemplo. (La versión Lovable ya lo resuelve.)
- **El HTML semántico no está aplicado en las páginas de v0.** Falta llevarlo a las 5 páginas y adaptar las plantillas que pinta JavaScript (`catalogo.js`, `ficha.js`, `admin-libros.js`).
- **El carrusel de inicio** sigue con imágenes de relleno de Stitch.
- **El buscador de la portada** (`index.html`) todavía no hace nada; conviene conectarlo con `catalogo.html?q=...` o quitarlo.
- Las pruebas realizadas son de la lógica de `libros.js`; falta probar el sitio completo en navegador y en celular.

**Versión Lovable**

- **El stack ya no es el de la actividad base.** TanStack Start y la base de datos en la nube se salen del HTML, CSS, Bootstrap y JS puro que pide la actividad. Es una referencia de lo posible, no la entrega de la actividad.
- **Depende de un servicio externo** (la nube de Lovable): no se publica como sitio estático.
- **Su código no se revisó** para este documento; conviene probar el flujo completo (registro, préstamo, panel de admin) antes de presentarlo.
- **Las funciones de IA** corren en el servidor, de modo que la clave de la API no queda expuesta en el navegador. Aun así conviene revisar su costo y límites de uso antes de abrirlas al público.
- **Alta de nuevos administradores:** hoy requiere asignar el rol `admin` en la base de datos; falta la sección de gestión interna.

---

## 12. Próximos pasos

1. Aplicar el HTML semántico a todas las páginas y a las plantillas de JavaScript.
2. Conectar el buscador del inicio con el catálogo.
3. Dashboard del admin con gráficos (libros por categoría, solicitudes por estado).
4. Favoritos y "mi próxima lectura".
5. PWA: instalable en el celular y con modo básico sin conexión.
6. Sección interna para gestionar administradores en la versión Lovable.
7. Decidir qué parte de lo logrado con IA entra al proyecto del grupo, construido a mano.

---

## 13. Cómo usar el proyecto (versión estática)

1. Abre `index.html` en el navegador (o con la extensión Live Server de VS Code).
2. Entra al catálogo; prueba el buscador, los filtros y el orden.
3. Abre la ficha de un libro y revisa sus libros relacionados.
4. Entra a "Acceso Admin" con la cuenta de prueba: `admin@biblioweb.test` / `Admin123`.
5. Agrega, edita y elimina un libro; verifica que aparece (o desaparece) en el catálogo.
6. Prueba el botón de tema claro/oscuro en cualquier página.
7. Cierra sesión y verifica que `pages/admin.html` redirige al login.

Para volver a los datos iniciales, usa **"Restaurar ejemplos"** en el panel de administración.

---

## 14. Criterios de aceptación

**Actividad base**

1. **Protección de ruta:** entrar a `admin.html` sin sesión redirige a `login.html`.
2. **Autenticación:** `admin@biblioweb.test` y `Admin123` dan acceso; cualquier otro dato muestra un error.
3. **Selector de tema:** funciona en todas las páginas.
4. **Navegación fluida:** todos los enlaces del menú llevan a la página correcta.
5. **Maquetación limpia:** tablas, formularios, tarjetas y modales con componentes de Bootstrap 5.3, adaptables a móvil y escritorio.

**Ampliación con IA (v0)**

6. **CRUD:** un libro agregado, editado o eliminado en el admin se refleja en el catálogo.
7. **Persistencia:** los libros siguen ahí después de recargar la página.
8. **Búsqueda y filtros:** el catálogo encuentra libros por título, autor o ISBN y filtra por categoría y disponibilidad.
9. **Ficha:** cada libro abre su ficha con datos, sinopsis y relacionados; un enlace inválido muestra un aviso.
10. **ISBN:** un ISBN con dígito de control incorrecto no se puede guardar.

---

## 15. Equipo

- Clan: **Orion**, Cohorte 8, Riwi
- Integrantes: _(completar con los nombres del equipo)_

## 16. Entregables del reto

- [ ] El prompt utilizado para construir el proyecto (sección 8, completando los de v0 y Lovable)
- [ ] La página generada con ayuda de IA (este prototipo)
- [ ] El repositorio con sus commits correspondientes
- **Fecha límite:** martes 10 de noviembre de 2026