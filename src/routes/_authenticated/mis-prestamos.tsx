import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { FooterSimple, Navbar } from "@/components/Layout";
import { onPortadaError, portadaDe } from "@/lib/libros";
import { estadoVisiblePrestamo, formatearFecha, MAX_PRESTAMOS_ACTIVOS } from "@/lib/prestamos";
import { listarMisPrestamosFn } from "@/lib/prestamos.functions";
import { useReaderAuth } from "@/lib/reader-auth";

export const Route = createFileRoute("/_authenticated/mis-prestamos")({
  head: () => ({
    meta: [
      { title: "Mis Préstamos - BiblioWeb" },
      { name: "description", content: "Consulta tu historial de libros solicitados y las fechas de devolución de tus préstamos." },
      { property: "og:title", content: "Mis Préstamos - BiblioWeb" },
      { property: "og:description", content: "Consulta tu historial de libros solicitados y las fechas de devolución de tus préstamos." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: MisPrestamos,
});

function MisPrestamos() {
  const { nombre } = useReaderAuth();
  const listar = useServerFn(listarMisPrestamosFn);
  const { data: prestamos, isLoading, error, refetch, isRefetching } = useQuery({
    queryKey: ["mis-prestamos"],
    queryFn: () => listar(),
  });
  const activos = prestamos?.filter((p) => p.estado === "activo").length ?? 0;

  return <>
    <Navbar />
    <main className="container my-5">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 border-bottom pb-4 mb-4">
        <div>
          <span className="text-uppercase fw-bold text-secondary small">Cuenta de lector</span>
          <h1 className="font-serif display-5 fw-bold mb-1">Mis préstamos</h1>
          <p className="text-secondary mb-0">Hola{nombre ? `, ${nombre.split(" ")[0]}` : ""}. Aquí tienes tu historial y tus próximas devoluciones.</p>
        </div>
        <div className="card-biblioweb-sec px-3 py-2 text-center">
          <div className="fw-bold fs-4 text-primary">{activos} de {MAX_PRESTAMOS_ACTIVOS}</div>
          <small className="text-secondary">Préstamos activos</small>
        </div>
      </div>
      {isLoading ? <div className="card-biblioweb-sec text-center py-5" role="status">Cargando tus préstamos...</div>
        : error ? <div className="alert alert-danger d-flex flex-column flex-sm-row justify-content-between align-items-sm-center gap-3" role="alert">
          <span>No pudimos cargar tu historial. Inténtalo de nuevo.</span>
          <button className="btn btn-outline-danger btn-sm" disabled={isRefetching} onClick={() => void refetch()} type="button">Reintentar</button>
        </div>
        : !prestamos?.length ? <div className="card-biblioweb-sec text-center py-5 px-3">
          <div className="display-5 mb-3" aria-hidden="true">📚</div>
          <h2 className="h3 font-serif fw-bold">Aún no has solicitado libros</h2>
          <p className="text-secondary mb-4">Explora el catálogo y pulsa «Solicitar préstamo» en el libro que quieras.</p>
          <Link className="btn btn-terracota" to="/catalogo">Explorar catálogo</Link>
        </div>
        : <div className="row g-4">
          {prestamos.map((prestamo) => {
            const estado = estadoVisiblePrestamo(prestamo);
            return <article className="col-12" key={prestamo.id}>
              <div className="card card-biblioweb p-3 p-md-4">
                <div className="d-flex flex-column flex-sm-row gap-3 gap-md-4">
                  <Link to="/libro" search={{ id: prestamo.libro_id }}><img alt={`Portada de ${prestamo.titulo}`} className="prestamo-portada" onError={onPortadaError} src={portadaDe({ portada: prestamo.portada } as Parameters<typeof portadaDe>[0])} /></Link>
                  <div className="flex-grow-1">
                    <div className="d-flex flex-wrap justify-content-between align-items-start gap-2 mb-2">
                      <div><h2 className="h4 font-serif fw-bold mb-1"><Link className="link-libro" to="/libro" search={{ id: prestamo.libro_id }}>{prestamo.titulo}</Link></h2><p className="text-secondary mb-0">{prestamo.autor}</p></div>
                      <span className={"badge px-3 py-2 " + (estado === "Activo" ? "bg-success-subtle text-success-emphasis" : estado === "Vencido" ? "bg-danger-subtle text-danger-emphasis" : "bg-secondary-subtle text-secondary-emphasis")}>{estado}</span>
                    </div>
                    <div className="row g-3 mt-2">
                      <div className="col-sm-6"><small className="text-secondary d-block">Solicitado el</small><strong>{formatearFecha(prestamo.solicitado_en)}</strong></div>
                      <div className="col-sm-6"><small className="text-secondary d-block">Fecha de devolución</small><strong className={estado === "Vencido" ? "text-danger" : "text-primary"}>{formatearFecha(prestamo.fecha_devolucion)}</strong></div>
                    </div>
                    {prestamo.comentario && <p className="small text-secondary border-top mt-3 pt-3 mb-0"><strong>Tu comentario:</strong> {prestamo.comentario}</p>}
                  </div>
                </div>
              </div>
            </article>;
          })}
        </div>}
    </main>
    <FooterSimple>© 2024 BiblioWeb. Historial personal de préstamos.</FooterSimple>
  </>;
}
