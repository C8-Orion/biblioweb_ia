import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useRef, useState } from "react";
import { FooterSimple, Navbar } from "@/components/Layout";
import { PrestamoModal } from "@/components/PrestamoModal";
import { CATEGORIAS, claseCategoria, claseEstado, onPortadaError, portadaDe, type Libro } from "@/lib/libros";
import { useLibros } from "@/lib/use-libros";

type Busqueda = { q?: string | undefined; categoria?: string | undefined; estado?: string | undefined; orden?: string | undefined };

export const Route = createFileRoute("/catalogo")({
  validateSearch: (s: Record<string, unknown>): Busqueda => ({
    q: typeof s["q"] === "string" && s["q"] ? s["q"] : undefined,
    categoria: typeof s["categoria"] === "string" && CATEGORIAS.includes(s["categoria"]) ? s["categoria"] : undefined,
    estado: s["estado"] === "disponibles" || s["estado"] === "Prestado" ? s["estado"] : undefined,
    orden: s["orden"] === "autor" || s["orden"] === "recientes" ? s["orden"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Catálogo General de Libros - BiblioWeb" },
      { name: "description", content: "Busca y filtra las obras disponibles para consulta en sala y préstamo a domicilio." },
      { property: "og:title", content: "Catálogo General de Libros - BiblioWeb" },
      { property: "og:description", content: "Busca y filtra las obras disponibles para consulta en sala y préstamo a domicilio." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Catalogo,
});

const normalizarTexto = (t: unknown) => String(t ?? "").normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase();

function Catalogo() {
  const search = Route.useSearch();
  const navigate = useNavigate({ from: "/catalogo" });
  const todos = useLibros();
  const [texto, setTexto] = useState(search.q ?? "");
  const [q, setQ] = useState(search.q ?? "");
  const categoria = search.categoria ?? "";
  const estado = search.estado ?? "";
  const orden = search.orden ?? "titulo";
  const [libroModal, setLibroModal] = useState<Libro | null>(null);
  const buscadorRef = useRef<HTMLInputElement>(null);

  useEffect(() => { const t = setTimeout(() => setQ(texto), 150); return () => clearTimeout(t); }, [texto]);
  const setParams = (p: Partial<Busqueda>) => navigate({ search: (prev) => ({ ...prev, ...p }), replace: true });
  useEffect(() => { if ((search.q ?? "") !== q.trim()) setParams({ q: q.trim() || undefined }); }, [q]); // eslint-disable-line

  const lista = todos ?? [];
  const terminos = normalizarTexto(q).split(/\s+/).filter(Boolean);
  const base = useMemo(() => lista.filter((l) => {
    const campos = normalizarTexto([l.titulo, l.autor, l.categoria, l.descripcion, l.isbn, l.anio, l.editorial].join(" "));
    const okTexto = terminos.every((t) => campos.includes(t));
    const okEstado = !estado || (estado === "disponibles" ? l.estado !== "Prestado" : l.estado === estado);
    return okTexto && okEstado;
  }), [lista, q, estado]); // eslint-disable-line
  let visibles = base.filter((l) => !categoria || l.categoria === categoria);
  if (orden !== "recientes") {
    const campo = orden === "autor" ? "autor" : "titulo";
    visibles = visibles.slice().sort((a, b) => a[campo].localeCompare(b[campo], "es", { sensitivity: "base" }));
  }
  const hayFiltros = Boolean(texto.trim() || categoria || estado || orden !== "titulo");
  const limpiar = () => { setTexto(""); setQ(""); navigate({ search: {}, replace: true }); buscadorRef.current?.focus(); };

  return (
    <>
      <Navbar activo="catalogo" />
      <header className="container my-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-4">
          <div>
            <span className="text-uppercase fw-bold text-secondary small">Acervo Bibliográfico · Red Cívica</span>
            <h1 className="font-serif display-5 fw-bold mb-1">Catálogo General de Libros</h1>
            <p className="text-secondary mb-0">Descubre las {lista.length} obras disponibles para consulta en sala y préstamo a domicilio.</p>
          </div>
          <div className="card-biblioweb-sec px-3 py-2 text-center">
            <div className="fw-bold fs-4 text-primary">{lista.length}</div>
            <small className="text-secondary">Total de libros</small>
          </div>
        </div>
        <form className="card-biblioweb-sec p-3 mt-4" role="search" onSubmit={(e) => { e.preventDefault(); setQ(texto); }}>
          <div className="row g-3 align-items-end">
            <div className="col-lg-6">
              <label className="form-label small fw-bold" htmlFor="buscar-catalogo">Buscar libro</label>
              <input ref={buscadorRef} autoComplete="off" className="form-control" id="buscar-catalogo" value={texto}
                onChange={(e) => setTexto(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Escape" && texto) { setTexto(""); setQ(""); } }}
                placeholder="Título, autor o materia (ej. garcia marquez, sagan...)" type="search" />
            </div>
            <div className="col-sm-6 col-lg-3">
              <label className="form-label small fw-bold" htmlFor="filtro-estado">Disponibilidad</label>
              <select className="form-select" id="filtro-estado" value={estado} onChange={(e) => setParams({ estado: e.target.value || undefined })}>
                <option value="">Todos los estados</option>
                <option value="disponibles">Solo disponibles para préstamo</option>
                <option value="Prestado">Solo prestados</option>
              </select>
            </div>
            <div className="col-sm-6 col-lg-3">
              <label className="form-label small fw-bold" htmlFor="orden-catalogo">Ordenar por</label>
              <select className="form-select" id="orden-catalogo" value={orden} onChange={(e) => setParams({ orden: e.target.value === "titulo" ? undefined : e.target.value })}>
                <option value="titulo">Título (A-Z)</option>
                <option value="autor">Autor (A-Z)</option>
                <option value="recientes">Añadidos recientemente</option>
              </select>
            </div>
          </div>
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mt-3">
            <div aria-label="Filtrar por categoría" className="d-flex flex-wrap gap-2" role="group">
              {["", ...CATEGORIAS].map((cat) => {
                const activo = cat === categoria;
                return (
                  <button key={cat || "todas"} type="button" aria-pressed={activo}
                    className={"btn btn-sm btn-outline-secondary" + (activo ? " active" : "")}
                    onClick={() => setParams({ categoria: cat || undefined })}>
                    {cat || "Todas"} <span className="badge rounded-pill text-bg-light ms-1">{base.filter((l) => !cat || l.categoria === cat).length}</span>
                  </button>
                );
              })}
            </div>
            <div className="d-flex align-items-center gap-3">
              <span aria-live="polite" className="small text-secondary">Mostrando {visibles.length} de {lista.length} {lista.length === 1 ? "libro" : "libros"}</span>
              {hayFiltros && <button className="btn btn-sm btn-link text-secondary p-0" type="button" onClick={limpiar}>Limpiar filtros</button>}
            </div>
          </div>
        </form>
      </header>

      <main className="container mb-5">
        <div aria-live="polite" className="row g-4">
          {todos && visibles.length === 0 ? (
            <div className="col-12"><div className="card-biblioweb-sec text-center py-5">
              <p className="fw-semibold mb-1">No se encontraron libros con esos criterios.</p>
              <p className="text-secondary small mb-3">Prueba con otras palabras o quita algún filtro.</p>
              <button type="button" className="btn btn-sm btn-terracota" onClick={limpiar}>Limpiar filtros</button>
            </div></div>
          ) : visibles.map((l) => <Tarjeta key={l.id} libro={l} onPrestamo={setLibroModal} />)}
        </div>
      </main>
      <PrestamoModal libro={libroModal} />
      <FooterSimple>© 2024 BiblioWeb. Catálogo General de Fondos Bibliográficos. Todos los derechos reservados.</FooterSimple>
    </>
  );
}

function Tarjeta({ libro, onPrestamo }: { libro: Libro; onPrestamo: (libro: Libro) => void }) {
  const prestado = libro.estado === "Prestado";
  return (
    <div className="col-md-6 col-lg-4">
      <article className="card card-biblioweb card-libro h-100 p-3 d-flex flex-column">
        <Link to="/libro" search={{ id: libro.id }} tabIndex={-1} aria-hidden="true"><img alt="" className="book-cover mb-3" src={portadaDe(libro)} onError={onPortadaError} /></Link>
        <div className="mb-2"><span className={`badge ${claseCategoria(libro.categoria)} px-2 py-1`}>{libro.categoria}</span></div>
        <h2 className="h4 font-serif fw-bold mb-1"><Link className="link-libro" to="/libro" search={{ id: libro.id }}>{libro.titulo}</Link></h2>
        <p className="text-secondary mb-2 small fw-semibold">{libro.autor}{libro.anio ? " · " + libro.anio : ""}</p>
        <p className="text-secondary small flex-grow-1">{libro.descripcion || "Sin descripción disponible."}</p>
        <div className="border-top pt-3 mt-2 d-flex justify-content-between align-items-center gap-2 flex-wrap">
          <span className={`badge ${claseEstado(libro.estado)}`}>{libro.estado || "Disponible"}</span>
          <div className="d-flex gap-2">
            <Link className="btn btn-outline-secondary btn-sm" to="/libro" search={{ id: libro.id }}>Ver ficha<span className="visually-hidden"> de {libro.titulo}</span></Link>
            <button className="btn btn-terracota btn-sm" type="button" data-bs-target="#modalPrestamo" data-bs-toggle="modal" disabled={prestado} onClick={() => onPrestamo(libro)}>
              {prestado ? "No disponible" : "Solicitar préstamo"}
            </button>
          </div>
        </div>
      </article>
    </div>
  );
}
