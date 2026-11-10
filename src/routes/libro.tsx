import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FooterSimple, Navbar } from "@/components/Layout";
import { PrestamoModal } from "@/components/PrestamoModal";
import { ChatLibro } from "@/components/ChatLibro";
import { claseCategoria, claseEstado, formatearISBN, onPortadaError, portadaDe, relacionados } from "@/lib/libros";
import { useLibros } from "@/lib/use-libros";

export const Route = createFileRoute("/libro")({
  validateSearch: (s: Record<string, unknown>): { id?: string | undefined } => ({ id: typeof s["id"] === "string" ? s["id"] : undefined }),
  head: () => ({
    meta: [
      { title: "Ficha del libro - BiblioWeb" },
      { name: "description", content: "Sinopsis, datos bibliográficos y libros relacionados del catálogo BiblioWeb." },
      { property: "og:title", content: "Ficha del libro - BiblioWeb" },
      { property: "og:description", content: "Sinopsis, datos bibliográficos y libros relacionados del catálogo BiblioWeb." },
      { property: "og:type", content: "article" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Ficha,
});

function Dato({ etiqueta, valor }: { etiqueta: string; valor: unknown }) {
  return (
    <div className="col-6 col-md-4">
      <dt>{etiqueta}</dt>
      <dd>{valor ? String(valor) : <span className="text-secondary fw-normal">No registrado</span>}</dd>
    </div>
  );
}

function Ficha() {
  const { id } = Route.useSearch();
  const todos = useLibros();
  const [libroModal, setLibroModal] = useState("");
  const libro = todos && id ? todos.find((l) => l.id === id) ?? null : null;

  useEffect(() => {
    if (!todos) return;
    document.title = libro ? `${libro.titulo} - ${libro.autor} | BiblioWeb` : "Libro no encontrado - BiblioWeb";
  }, [todos, libro]);

  let contenido;
  if (!todos) contenido = <p className="text-secondary">Cargando ficha...</p>;
  else if (!libro) contenido = (
    <div className="card-biblioweb-sec text-center py-5 px-3">
      <h1 className="font-serif fw-bold h3 mb-2">No encontramos este libro</h1>
      <p className="text-secondary mb-4">Puede que se haya retirado del catálogo o que el enlace no sea correcto.</p>
      <Link className="btn btn-terracota" to="/catalogo">Ir al catálogo</Link>
    </div>
  );
  else {
    const prestado = libro.estado === "Prestado";
    const sinopsis = libro.sinopsis || libro.descripcion;
    contenido = (
      <>
        <nav aria-label="Ruta de navegación" className="mb-4">
          <ol className="breadcrumb small mb-0">
            <li className="breadcrumb-item"><Link to="/">Inicio</Link></li>
            <li className="breadcrumb-item"><Link to="/catalogo">Catálogo</Link></li>
            <li className="breadcrumb-item"><Link to="/catalogo" search={{ categoria: libro.categoria }}>{libro.categoria}</Link></li>
            <li aria-current="page" className="breadcrumb-item active text-truncate">{libro.titulo}</li>
          </ol>
        </nav>
        <article className="row g-5 align-items-start">
          <div className="col-md-5 col-lg-4 d-flex justify-content-center justify-content-md-start">
            <img alt={`Portada de ${libro.titulo} de ${libro.autor}`} className="ficha-portada" src={portadaDe(libro)} onError={onPortadaError} />
          </div>
          <div className="col-md-7 col-lg-8">
            <div className="d-flex flex-wrap gap-2 mb-3">
              <span className={`badge ${claseCategoria(libro.categoria)} px-2 py-1`}>{libro.categoria}</span>
              <span className={`badge ${claseEstado(libro.estado)} px-2 py-1`}>{libro.estado || "Disponible"}</span>
            </div>
            <h1 className="font-serif display-5 fw-bold mb-2 text-balance">{libro.titulo}</h1>
            <p className="fs-5 text-secondary mb-4">{libro.autor}{libro.anio ? <> <span aria-hidden="true">·</span> {libro.anio}</> : null}</p>
            <div className="card-biblioweb-sec p-4 mb-4">
              <h2 className="visually-hidden">Datos bibliográficos</h2>
              <dl className="row g-3 ficha-datos mb-0">
                <Dato etiqueta="ISBN" valor={libro.isbn ? formatearISBN(libro.isbn) : ""} />
                <Dato etiqueta="Año de publicación" valor={libro.anio} />
                <Dato etiqueta="Editorial" valor={libro.editorial} />
                <Dato etiqueta="Autor" valor={libro.autor} />
                <Dato etiqueta="Categoría" valor={libro.categoria} />
                <Dato etiqueta="Disponibilidad" valor={libro.estado || "Disponible"} />
              </dl>
            </div>
            <div className="d-flex flex-wrap gap-2 mb-5">
              <button className="btn btn-terracota px-4" type="button" data-bs-target="#modalPrestamo" data-bs-toggle="modal" disabled={prestado} onClick={() => setLibroModal(libro.titulo)}>
                {prestado ? "No disponible para préstamo" : "Solicitar préstamo"}
              </button>
              <Link className="btn btn-outline-secondary" to="/catalogo">Volver al catálogo</Link>
            </div>
            <section aria-labelledby="sinopsis-titulo">
              <h2 className="font-serif fw-bold h4 mb-3" id="sinopsis-titulo">Sinopsis</h2>
              <div className="ficha-sinopsis">
                {sinopsis
                  ? sinopsis.split(/\n{2,}|\r\n\r\n/).map((p) => p.trim()).filter(Boolean).map((p, i) => <p key={i}>{p}</p>)
                  : <p className="text-secondary">Este libro aún no tiene sinopsis registrada.</p>}
              </div>
            </section>
            <ChatLibro key={libro.id} libro={libro} />
          </div>
        </article>
      </>
    );
  }

  const rel = libro ? relacionados(libro.id, 4) : [];
  const autorBase = libro?.autor.toLowerCase();

  return (
    <>
      <Navbar activo="catalogo" />
      <main className="container my-5">{contenido}</main>
      {rel.length > 0 && (
        <section aria-labelledby="relacionados-titulo" className="container mb-5">
          <div className="border-top pt-5">
            <h2 className="font-serif fw-bold h3 mb-1" id="relacionados-titulo">Libros relacionados</h2>
            <p className="text-secondary small mb-4">Obras del mismo autor o de la misma categoría.</p>
            <div className="row g-4">
              {rel.map((l) => (
                <div className="col-6 col-md-4 col-lg-3" key={l.id}>
                  <article className="card card-biblioweb card-libro h-100 p-3">
                    <Link to="/libro" search={{ id: l.id }} tabIndex={-1} aria-hidden="true"><img alt="" className="relacionado-portada mb-3" src={portadaDe(l)} onError={onPortadaError} /></Link>
                    <span className="small text-secondary fw-semibold mb-1">{l.autor.toLowerCase() === autorBase ? "Mismo autor" : "Misma categoría"}</span>
                    <h3 className="h6 font-serif fw-bold mb-1"><Link className="link-libro stretched-link" to="/libro" search={{ id: l.id }}>{l.titulo}</Link></h3>
                    <p className="small text-secondary mb-0">{l.autor}{l.anio ? " · " + l.anio : ""}</p>
                  </article>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      <PrestamoModal libro={libroModal} />
      <FooterSimple>© 2024 BiblioWeb. Catálogo General de Fondos Bibliográficos. Todos los derechos reservados.</FooterSimple>
    </>
  );
}
