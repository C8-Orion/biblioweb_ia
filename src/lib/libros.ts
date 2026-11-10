export type Libro = {
  id: string; titulo: string; autor: string; categoria: string; estado: string; portada: string;
  descripcion: string; isbn: string; anio: number | null; editorial: string; sinopsis: string;
};
const STORAGE_KEY = "biblioweb_libros";
export const STORAGE_EVENT = "biblioweb-libros-change";
export const PORTADA_POR_DEFECTO = "/img/libros/portada-generica.svg";
export const CATEGORIAS = ["Narrativa", "Tecnología", "Ciencia"];
export const ESTADOS = ["Disponible", "Último ejemplar", "Prestado"];

export const LIBROS_INICIALES: Libro[] = [
  { id: "lib-001", titulo: "Cien Años de Soledad", autor: "Gabriel García Márquez", categoria: "Narrativa", estado: "Disponible", portada: "/img/libros/cien-anos-de-soledad.svg", descripcion: "La obra cumbre del realismo mágico sobre la legendaria saga de la familia Buendía en el mítico pueblo de Macondo.", isbn: "9780307474728", anio: 1967, editorial: "Editorial Sudamericana", sinopsis: "Desde la fundación de Macondo por José Arcadio Buendía y Úrsula Iguarán hasta la desaparición del último de sus descendientes, la novela recorre siete generaciones de una familia marcada por la soledad, las guerras civiles, los amores imposibles y una profecía escrita en pergaminos. García Márquez funde lo cotidiano y lo prodigioso para construir una metáfora de la historia de América Latina." },
  { id: "lib-002", titulo: "El Nombre de la Rosa", autor: "Umberto Eco", categoria: "Narrativa", estado: "Disponible", portada: "/img/libros/el-nombre-de-la-rosa.svg", descripcion: "Un fascinante misterio detectivesco en una abadía benedictina medieval que custodia manuscritos prohibidos.", isbn: "9788497592437", anio: 1980, editorial: "Bompiani", sinopsis: "En 1327, el franciscano Guillermo de Baskerville y su joven discípulo Adso de Melk llegan a una abadía del norte de Italia donde una serie de muertes misteriosas amenaza con arruinar un encuentro teológico decisivo. Entre bibliotecas laberínticas, libros envenenados y debates sobre la risa y la herejía, Eco combina novela policíaca, erudición medieval y reflexión filosófica." },
  { id: "lib-003", titulo: "Diseño de Sistemas Distribuidos", autor: "Brendan Burns", categoria: "Tecnología", estado: "Disponible", portada: "/img/libros/sistemas-distribuidos.svg", descripcion: "Patrones y paradigmas esenciales para arquitecturas de software modernas, contenedores y microservicios escalables.", isbn: "9781491983645", anio: 2018, editorial: "O'Reilly Media", sinopsis: "Brendan Burns, cofundador de Kubernetes, presenta patrones reutilizables para construir sistemas distribuidos fiables: sidecars, embajadores, adaptadores, servicios replicados con balanceo de carga, fragmentación y procesamiento por lotes. Un libro práctico que traduce la experiencia de los grandes sistemas en contenedores a componentes que cualquier equipo puede aplicar." },
  { id: "lib-004", titulo: "Clean Code: Manual de Estilo Ágil", autor: "Robert C. Martin", categoria: "Tecnología", estado: "Último ejemplar", portada: "/img/libros/clean-code.svg", descripcion: "Guía canónica de buenas prácticas para desarrolladores que buscan escribir software legible, mantenible y robusto.", isbn: "9788441532106", anio: 2008, editorial: "Anaya Multimedia", sinopsis: "Robert C. Martin expone los principios, patrones y prácticas para escribir código limpio: nombres significativos, funciones pequeñas, comentarios útiles, manejo de errores y pruebas unitarias. A través de casos de estudio en los que se refactoriza código real, el libro enseña a distinguir el código bueno del malo y a transformar uno en otro." },
  { id: "lib-005", titulo: "Cosmos", autor: "Carl Sagan", categoria: "Ciencia", estado: "Disponible", portada: "/img/libros/cosmos.svg", descripcion: "Un viaje divulgativo magistral por quince mil millones de años de evolución cósmica, astronomía y civilización humana.", isbn: "9780345539434", anio: 1980, editorial: "Random House", sinopsis: "Basado en la célebre serie de televisión, Cosmos recorre la historia del universo y de la ciencia: el origen de las estrellas y las galaxias, la búsqueda de vida extraterrestre, la evolución de la vida en la Tierra y los grandes pensadores que, desde Alejandría hasta la era espacial, cambiaron nuestra forma de entender el lugar que ocupamos en el cosmos." },
  { id: "lib-006", titulo: "El Gen Egoísta", autor: "Richard Dawkins", categoria: "Ciencia", estado: "Disponible", portada: "/img/libros/el-gen-egoista.svg", descripcion: "Una perspectiva biológica revolucionaria sobre la evolución natural vista desde el prisma de la información genética.", isbn: "9780198788607", anio: 1976, editorial: "Oxford University Press", sinopsis: "Dawkins propone que la unidad fundamental de la selección natural no es la especie ni el individuo, sino el gen. Desde esa perspectiva explica el altruismo, la cooperación, la agresión y las relaciones entre padres e hijos, e introduce el concepto de meme como replicador cultural. Un clásico que transformó la divulgación de la biología evolutiva." },
];

const clonar = <T,>(d: T): T => JSON.parse(JSON.stringify(d));

// Old saved covers used "../img/..." paths from the static site.
function arreglarPortada(p: string) { return p && p.startsWith("../img/") ? p.slice(2) : p; }

function completar(libro: Libro): Libro {
  const c = { ...libro, portada: arreglarPortada(libro.portada) };
  const o = LIBROS_INICIALES.find((l) => l.id === libro.id);
  if (o) (["isbn", "anio", "editorial", "sinopsis"] as const).forEach((k) => { if (c[k] === undefined) (c as any)[k] = o[k]; });
  return c;
}

function guardar(libros: Libro[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(libros));
  window.dispatchEvent(new Event(STORAGE_EVENT));
}

function leer(): Libro[] {
  if (typeof window === "undefined") return clonar(LIBROS_INICIALES);
  try {
    const g = localStorage.getItem(STORAGE_KEY);
    if (g === null) { localStorage.setItem(STORAGE_KEY, JSON.stringify(LIBROS_INICIALES)); return clonar(LIBROS_INICIALES); }
    const l = JSON.parse(g);
    return Array.isArray(l) ? l.map(completar) : clonar(LIBROS_INICIALES);
  } catch { return clonar(LIBROS_INICIALES); }
}

const generarId = () => "lib-" + Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
export const limpiarISBN = (isbn: unknown) => String(isbn || "").replace(/[\s-]/g, "").toUpperCase();

export function isbnValido(isbn: string) {
  const l = limpiarISBN(isbn);
  if (/^\d{13}$/.test(l)) return l.split("").reduce((a, d, i) => a + Number(d) * (i % 2 === 0 ? 1 : 3), 0) % 10 === 0;
  if (/^\d{9}[\dX]$/.test(l)) return l.split("").reduce((a, d, i) => a + (d === "X" ? 10 : Number(d)) * (10 - i), 0) % 11 === 0;
  return false;
}

export function formatearISBN(isbn: string) {
  const l = limpiarISBN(isbn);
  return l.length === 13 ? l.slice(0, 3) + "-" + l.slice(3, 12) + "-" + l.slice(12) : l;
}

function normalizarAnio(anio: unknown) {
  const n = parseInt(String(anio), 10);
  return Number.isInteger(n) && n > 0 && n <= new Date().getFullYear() ? n : null;
}

export type DatosLibro = Record<keyof Omit<Libro, "id">, string>;
function normalizar(d: Partial<DatosLibro>): Omit<Libro, "id"> {
  return {
    titulo: String(d.titulo || "").trim(), autor: String(d.autor || "").trim(),
    categoria: CATEGORIAS.includes(d.categoria || "") ? d.categoria! : "Narrativa",
    estado: ESTADOS.includes(d.estado || "") ? d.estado! : "Disponible",
    portada: String(d.portada || "").trim(), descripcion: String(d.descripcion || "").trim(),
    isbn: limpiarISBN(d.isbn), anio: normalizarAnio(d.anio),
    editorial: String(d.editorial || "").trim(), sinopsis: String(d.sinopsis || "").trim(),
  };
}

export function relacionados(id: string, limite = 4) {
  const todos = leer();
  const base = todos.find((l) => l.id === id);
  if (!base) return [];
  const ab = base.autor.toLowerCase();
  return todos.filter((l) => l.id !== id)
    .map((l) => ({ libro: l, puntos: (l.autor.toLowerCase() === ab ? 3 : 0) + (l.categoria === base.categoria ? 2 : 0) }))
    .filter((r) => r.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos || a.libro.titulo.localeCompare(b.libro.titulo, "es"))
    .slice(0, limite).map((r) => r.libro);
}

export const listar = () => leer();
export const obtener = (id: string) => leer().find((l) => l.id === id) || null;
export function agregar(d: Partial<DatosLibro>) { const l = leer(); const n = { id: generarId(), ...normalizar(d) }; l.unshift(n); guardar(l); return n; }
export function actualizar(id: string, d: Partial<DatosLibro>) {
  const l = leer(); const i = l.findIndex((x) => x.id === id); if (i === -1) return null;
  l[i] = { id, ...normalizar(d) }; guardar(l); return l[i];
}
export function eliminar(id: string) { const l = leer(); const r = l.filter((x) => x.id !== id); guardar(r); return r.length !== l.length; }
export function restablecer() { guardar(LIBROS_INICIALES); return clonar(LIBROS_INICIALES); }
export const portadaDe = (l: Libro) => l.portada || PORTADA_POR_DEFECTO;
export const claseCategoria = (c: string) => ({ Narrativa: "badge-narrativa", "Tecnología": "badge-tecnologia", Ciencia: "badge-ciencia" } as Record<string, string>)[c] || "bg-secondary";
export const claseEstado = (e: string) => ({
  Disponible: "bg-success-subtle text-success-emphasis",
  "Último ejemplar": "bg-warning-subtle text-warning-emphasis",
  Prestado: "bg-danger-subtle text-danger-emphasis",
} as Record<string, string>)[e] || "bg-secondary-subtle text-secondary";

export function onPortadaError(e: React.SyntheticEvent<HTMLImageElement>) {
  const img = e.currentTarget;
  if (!img.src.endsWith("portada-generica.svg")) img.src = PORTADA_POR_DEFECTO;
}
