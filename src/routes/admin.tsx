import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useRef, useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { buscarLibrosIA } from "@/lib/ai/buscar-libros.functions";
import type { OpcionLibroIA } from "@/lib/ai/buscar-libros.server";
import { AdminNavbar, FooterSimple } from "@/components/Layout";
import { estaAutenticado, logout } from "@/lib/auth";
import { hideModal, showModal } from "@/lib/bootstrap";
import {
  actualizar, agregar, CATEGORIAS, claseCategoria, claseEstado, eliminar, ESTADOS, formatearISBN,
  isbnValido, obtener, onPortadaError, PORTADA_POR_DEFECTO, portadaDe, restablecer, type DatosLibro, type Libro,
} from "@/lib/libros";
import { useLibros } from "@/lib/use-libros";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Consola de Administración - BiblioWeb" },
      { name: "description", content: "Gestión del acervo bibliográfico, inventario y solicitudes de BiblioWeb." },
      { property: "og:title", content: "Consola de Administración - BiblioWeb" },
      { property: "og:description", content: "Gestión del acervo bibliográfico, inventario y solicitudes de BiblioWeb." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Admin,
});

const VACIO: DatosLibro = { titulo: "", autor: "", portada: "", categoria: "", estado: "Disponible", descripcion: "", isbn: "", anio: "", editorial: "", sinopsis: "" };
const SOLICITUDES = [
  ["SOL-001", "Cosmos", "Elena Valenzuela", "elena.v@correo.test", "Para tesis de grado en comunicación científica"],
  ["SOL-002", "Cien Años de Soledad", "Mateo Rivas", "m.rivas@lectores.org", "Lectura para club de libro municipal"],
  ["SOL-003", "Clean Code", "Sofía Navarro", "sofia.navarro@tech.es", "Lista de espera tras renovación"],
];

function Admin() {
  const navigate = useNavigate();
  const [listo, setListo] = useState(false);
  useEffect(() => { if (!estaAutenticado()) navigate({ to: "/login", replace: true }); else setListo(true); }, [navigate]);
  if (!listo) return null;
  return <Panel onLogout={() => { logout(); navigate({ to: "/" }); }} />;
}

function Panel({ onLogout }: { onLogout: () => void }) {
  const todos = useLibros() ?? [];
  const [datos, setDatos] = useState<DatosLibro>(VACIO);
  const [editId, setEditId] = useState<string | null>(null);
  const [validado, setValidado] = useState(false);
  const [buscar, setBuscar] = useState("");
  const [filtroCat, setFiltroCat] = useState("");
  const [eliminarLibro, setEliminarLibro] = useState<Libro | null>(null);
  const [toast, setToast] = useState<{ msg: string; tipo: string; n: number } | null>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const isbnRef = useRef<HTMLInputElement>(null);
  const tituloRef = useRef<HTMLInputElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const iaRef = useRef<HTMLDivElement>(null);

  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(null), 2800); return () => clearTimeout(t); }, [toast]);
  useEffect(() => {
    const v = datos.isbn.trim();
    isbnRef.current?.setCustomValidity(v && !isbnValido(v) ? "ISBN no válido" : "");
  }, [datos.isbn]);
  useEffect(() => {
    const el = modalRef.current; if (!el) return;
    const h = () => setEliminarLibro(null);
    el.addEventListener("hidden.bs.modal", h); return () => el.removeEventListener("hidden.bs.modal", h);
  }, []);

  const notificar = (msg: string, tipo = "ok") => setToast({ msg, tipo, n: Date.now() });
  const set = (k: keyof DatosLibro) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => setDatos((d) => ({ ...d, [k]: e.target.value }));
  const modoCrear = () => { setDatos(VACIO); setEditId(null); setValidado(false); };
  const modoEditar = (l: Libro) => {
    setValidado(false); setEditId(l.id);
    setDatos({ titulo: l.titulo, autor: l.autor, portada: l.portada || "", categoria: l.categoria, estado: l.estado || "Disponible", descripcion: l.descripcion || "", isbn: l.isbn ? formatearISBN(l.isbn) : "", anio: l.anio ? String(l.anio) : "", editorial: l.editorial || "", sinopsis: l.sinopsis || "" });
    formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    tituloRef.current?.focus({ preventScroll: true });
  };

  const texto = buscar.trim().toLowerCase();
  const visibles = todos.filter((l) => (!texto || l.titulo.toLowerCase().includes(texto) || l.autor.toLowerCase().includes(texto)) && (!filtroCat || l.categoria === filtroCat));
  const editTitulo = editId ? obtener(editId)?.titulo ?? datos.titulo : "";

  return (
    <>
      <AdminNavbar onLogout={onLogout} />
      <main className="container my-5">
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4">
          <div>
            <h1 className="font-serif fw-bold display-6 mb-1">Consola Central de Administración</h1>
            <p className="text-secondary mb-0">Gestión de acervo bibliográfico, inventario y solicitudes ciudadanas.</p>
          </div>
          <div className="badge bg-success-subtle text-success fs-6 px-3 py-2 border">● Sesión Activa: admin@biblioweb.test</div>
        </div>

        <section className="card card-biblioweb p-4 mb-5" aria-labelledby="form-libro-titulo">
          <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-start gap-2 mb-4">
            <div>
              <h2 className="h4 font-serif fw-bold text-primary mb-1" id="form-libro-titulo">{editId ? "Editando libro" : "Registrar nuevo libro"}</h2>
              <p className="text-secondary small mb-0">{editId ? `Modifica los datos de "${editTitulo}" y guarda los cambios.` : "Ingresa los datos del volumen para la catalogación oficial."}</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              {editId && <button className="btn btn-sm btn-outline-secondary" type="button" onClick={modoCrear}>Cancelar edición</button>}
              <button className="btn btn-sm btn-outline-secondary" type="button" onClick={() => { modoCrear(); tituloRef.current?.focus(); }}>+ Nuevo libro</button>
              <button className="btn btn-sm btn-terracota" type="button" onClick={() => showModal(iaRef.current)}>✨ Agregar con IA</button>
            </div>
          </div>
          <form ref={formRef} noValidate className={validado ? "was-validated" : ""} onReset={(e) => { e.preventDefault(); modoCrear(); }} onSubmit={(e) => {
            e.preventDefault();
            if (!e.currentTarget.checkValidity()) { setValidado(true); return; }
            if (editId) {
              const a = actualizar(editId, datos);
              if (a) notificar(`"${a.titulo}" se actualizó correctamente.`); else notificar("No se encontró el libro a editar.", "error");
            } else notificar(`"${agregar(datos).titulo}" se agregó al catálogo.`);
            modoCrear();
          }}>
            <div className="row g-4">
              <div className="col-md-3 col-lg-2 d-flex flex-column align-items-center">
                <img alt="Vista previa de la portada" className="rounded portada-preview mb-2" src={datos.portada.trim() || PORTADA_POR_DEFECTO} onError={onPortadaError} />
                <small className="text-secondary">Vista previa</small>
              </div>
              <div className="col-md-9 col-lg-10">
                <div className="row g-3">
                  <div className="col-md-6">
                    <label className="form-label small fw-bold" htmlFor="titulo">Título de la obra *</label>
                    <input ref={tituloRef} className="form-control" id="titulo" maxLength={120} placeholder="Ej. Ficciones" required type="text" value={datos.titulo} onChange={set("titulo")} />
                    <div className="invalid-feedback">El título es obligatorio.</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold" htmlFor="autor">Autor / Creador *</label>
                    <input className="form-control" id="autor" maxLength={100} placeholder="Ej. Jorge Luis Borges" required type="text" value={datos.autor} onChange={set("autor")} />
                    <div className="invalid-feedback">El autor es obligatorio.</div>
                  </div>
                  <div className="col-md-6">
                    <label className="form-label small fw-bold" htmlFor="portada">URL de portada</label>
                    <input className="form-control" id="portada" placeholder="https://... o /img/libros/archivo.svg" type="text" value={datos.portada} onChange={set("portada")} />
                    <div className="form-text">Opcional. Si se deja vacío se usa una portada genérica.</div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold" htmlFor="categoria">Categoría *</label>
                    <select className="form-select" id="categoria" required value={datos.categoria} onChange={set("categoria")}>
                      <option disabled value="">Seleccionar...</option>
                      {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                    <div className="invalid-feedback">Elige una categoría.</div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold" htmlFor="estado">Disponibilidad</label>
                    <select className="form-select" id="estado" value={datos.estado} onChange={set("estado")}>
                      {ESTADOS.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="col-md-4">
                    <label className="form-label small fw-bold" htmlFor="isbn">ISBN</label>
                    <input ref={isbnRef} autoComplete="off" className="form-control" id="isbn" inputMode="numeric" maxLength={17} placeholder="978-84-397-2077-4" type="text" value={datos.isbn} onChange={set("isbn")} />
                    <div className="invalid-feedback">Introduce un ISBN-10 o ISBN-13 válido.</div>
                  </div>
                  <div className="col-md-3">
                    <label className="form-label small fw-bold" htmlFor="anio">Año de publicación</label>
                    <input className="form-control" id="anio" min={1} max={new Date().getFullYear()} placeholder="1967" step={1} type="number" value={datos.anio} onChange={set("anio")} />
                    <div className="invalid-feedback">Introduce un año válido.</div>
                  </div>
                  <div className="col-md-5">
                    <label className="form-label small fw-bold" htmlFor="editorial">Editorial</label>
                    <input className="form-control" id="editorial" maxLength={80} placeholder="Ej. Editorial Sudamericana" type="text" value={datos.editorial} onChange={set("editorial")} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold" htmlFor="descripcion">Resumen breve</label>
                    <textarea className="form-control" id="descripcion" maxLength={200} placeholder="Una o dos frases que se muestran en la tarjeta del catálogo..." rows={2} value={datos.descripcion} onChange={set("descripcion")} />
                  </div>
                  <div className="col-12">
                    <label className="form-label small fw-bold" htmlFor="sinopsis">Sinopsis completa</label>
                    <textarea className="form-control" id="sinopsis" maxLength={2000} placeholder="Texto que aparece en la ficha del libro..." rows={4} value={datos.sinopsis} onChange={set("sinopsis")} />
                  </div>
                  <div className="col-12 d-flex justify-content-end gap-2 mt-3">
                    <button className="btn btn-outline-secondary" type="reset">Limpiar</button>
                    <button className="btn btn-verde px-4" type="submit">{editId ? "Guardar cambios" : "Guardar libro"}</button>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </section>

        <section className="card card-biblioweb p-4 mb-5" aria-labelledby="titulo-inventario">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3 mb-3">
            <div className="d-flex align-items-center gap-2">
              <h2 className="h4 font-serif fw-bold text-primary mb-0" id="titulo-inventario">Inventario de títulos</h2>
              <span className="badge bg-secondary-subtle text-secondary-emphasis">{todos.length === 1 ? "1 registro" : `${todos.length} registros`}</span>
            </div>
            <div className="d-flex flex-column flex-sm-row gap-2">
              <label className="visually-hidden" htmlFor="buscar-libro">Buscar por título o autor</label>
              <input className="form-control form-control-sm" id="buscar-libro" placeholder="Buscar por título o autor..." type="search" value={buscar} onChange={(e) => setBuscar(e.target.value)} />
              <label className="visually-hidden" htmlFor="filtro-categoria">Filtrar por categoría</label>
              <select className="form-select form-select-sm" id="filtro-categoria" value={filtroCat} onChange={(e) => setFiltroCat(e.target.value)}>
                <option value="">Todas las categorías</option>
                {CATEGORIAS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <button className="btn btn-sm btn-outline-secondary text-nowrap" type="button" onClick={() => {
                if (!window.confirm("¿Restaurar los 6 libros de ejemplo? Se perderán los cambios realizados.")) return;
                restablecer(); modoCrear(); setBuscar(""); setFiltroCat("");
                notificar("Se restauraron los libros de ejemplo.", "info");
              }}>Restaurar ejemplos</button>
            </div>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr>
                  <th scope="col" style={{ width: 70 }}>Portada</th><th scope="col">Título</th><th scope="col">Autor</th>
                  <th scope="col">Categoría</th><th scope="col">Estado</th><th className="text-end" scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {visibles.length === 0 ? (
                  <tr><td colSpan={6} className="text-center text-secondary py-5">{todos.length === 0 ? "No hay libros registrados. Agrega el primero con el formulario." : "Ningún libro coincide con la búsqueda."}</td></tr>
                ) : visibles.map((l) => (
                  <tr key={l.id} className={editId === l.id ? "table-active" : undefined}>
                    <td><img alt="" className="rounded portada-mini" height={55} width={45} src={portadaDe(l)} onError={onPortadaError} /></td>
                    <td className="fw-bold">{l.titulo}</td>
                    <td>{l.autor}</td>
                    <td><span className={`badge ${claseCategoria(l.categoria)}`}>{l.categoria}</span></td>
                    <td><span className={`badge ${claseEstado(l.estado)}`}>{l.estado || "Disponible"}</span></td>
                    <td className="text-end text-nowrap">
                      <button className="btn btn-sm btn-outline-secondary me-1" type="button" aria-label={`Editar ${l.titulo}`} onClick={() => modoEditar(l)}>Editar</button>
                      <button className="btn btn-sm btn-outline-danger" type="button" aria-label={`Eliminar ${l.titulo}`} onClick={() => { setEliminarLibro(l); showModal(modalRef.current); }}>Eliminar</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="card card-biblioweb p-4">
          <div className="d-flex justify-content-between align-items-center mb-3">
            <h4 className="font-serif fw-bold text-primary mb-0">Solicitudes Recibidas</h4>
            <span className="badge bg-warning-subtle text-warning-emphasis">3 Pendientes</span>
          </div>
          <div className="table-responsive">
            <table className="table table-hover align-middle mb-0">
              <thead className="table-light">
                <tr><th scope="col">ID</th><th scope="col">Libro Solicitado</th><th scope="col">Solicitante</th><th scope="col">Correo</th><th scope="col">Comentario</th><th scope="col">Estado</th></tr>
              </thead>
              <tbody>
                {SOLICITUDES.map(([id, libro, nombre, correo, com]) => (
                  <tr key={id}>
                    <td><code>{id}</code></td><td className="fw-bold">{libro}</td><td>{nombre}</td><td>{correo}</td>
                    <td><em>"{com}"</em></td><td><span className="badge bg-warning text-dark">Pendiente</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      </main>

      <div aria-hidden="true" aria-labelledby="modalEliminarLabel" className="modal fade" id="modalEliminar" tabIndex={-1} ref={modalRef}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content card-biblioweb">
            <div className="modal-header border-bottom">
              <h2 className="modal-title h5 font-serif fw-bold" id="modalEliminarLabel">Eliminar libro</h2>
              <button aria-label="Cerrar" className="btn-close" data-bs-dismiss="modal" type="button" />
            </div>
            <div className="modal-body">
              <p className="mb-1">¿Seguro que quieres eliminar <strong>{eliminarLibro?.titulo}</strong> del catálogo?</p>
              <p className="text-secondary small mb-0">Esta acción no se puede deshacer.</p>
            </div>
            <div className="modal-footer border-top">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
              <button className="btn btn-danger" type="button" onClick={() => {
                if (!eliminarLibro) return;
                eliminar(eliminarLibro.id);
                if (editId === eliminarLibro.id) modoCrear();
                notificar(`"${eliminarLibro.titulo}" se eliminó del catálogo.`, "error");
                hideModal(modalRef.current);
              }}>Sí, eliminar</button>
            </div>
          </div>
        </div>
      </div>

      <ModalIA modalRef={iaRef} onElegir={(o) => {
        modoCrear();
        setDatos({ ...VACIO, titulo: o.titulo, autor: o.autor, categoria: o.categoria, descripcion: o.descripcion, sinopsis: o.sinopsis,
          anio: o.anio ? String(o.anio) : "", editorial: o.editorial ?? "", isbn: o.isbn && isbnValido(o.isbn) ? formatearISBN(o.isbn) : "" });
        hideModal(iaRef.current);
        notificar(`Datos de "${o.titulo}" cargados. Revisa y pulsa Guardar libro.`, "info");
        setTimeout(() => formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" }), 300);
      }} />

      <div className="toast-container position-fixed bottom-0 end-0 p-3">
        {toast && (
          <div key={toast.n} aria-atomic="true" aria-live="polite" role="status"
            className={`toast show align-items-center border-0 ${toast.tipo === "error" ? "text-bg-danger" : toast.tipo === "info" ? "text-bg-primary" : "text-bg-success"}`}>
            <div className="d-flex">
              <div className="toast-body">{toast.msg}</div>
              <button aria-label="Cerrar" className="btn-close btn-close-white me-2 m-auto" type="button" onClick={() => setToast(null)} />
            </div>
          </div>
        )}
      </div>
      <FooterSimple>BiblioWeb · Sistema Cívico de Archivo Municipal · Acceso Autorizado</FooterSimple>
    </>
  );
}

function ModalIA({ modalRef, onElegir }: { modalRef: React.RefObject<HTMLDivElement | null>; onElegir: (o: OpcionLibroIA) => void }) {
  const buscar = useServerFn(buscarLibrosIA);
  const [consulta, setConsulta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [opciones, setOpciones] = useState<OpcionLibroIA[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  return (
    <div aria-hidden="true" aria-labelledby="modalIALabel" className="modal fade" id="modalIA" tabIndex={-1} ref={modalRef}>
      <div className="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
        <div className="modal-content card-biblioweb">
          <div className="modal-header border-bottom">
            <h2 className="modal-title h5 font-serif fw-bold" id="modalIALabel">✨ Agregar libro con IA</h2>
            <button aria-label="Cerrar" className="btn-close" data-bs-dismiss="modal" type="button" />
          </div>
          <div className="modal-body">
            <form className="input-group mb-3" onSubmit={async (e) => {
              e.preventDefault();
              if (consulta.trim().length < 2 || cargando) return;
              setCargando(true); setError(null); setOpciones(null);
              try {
                const r = await buscar({ data: { consulta } });
                setOpciones(r.opciones); setError(r.error);
              } catch { setError("No se pudo completar la búsqueda con IA."); }
              finally { setCargando(false); }
            }}>
              <input className="form-control" placeholder="Nombre del libro o autor (ej. Rayuela, Cortázar)" value={consulta} onChange={(e) => setConsulta(e.target.value)} aria-label="Buscar libro con IA" />
              <button className="btn btn-terracota" type="submit" disabled={cargando || consulta.trim().length < 2}>
                {cargando ? <><span className="spinner-border spinner-border-sm me-2" aria-hidden="true" />Buscando...</> : "Buscar"}
              </button>
            </form>
            {error && <div className="alert alert-danger py-2 small">{error}</div>}
            {opciones && opciones.length === 0 && !error && <p className="text-secondary small mb-0">No se encontraron libros. Prueba con otro nombre.</p>}
            {!opciones && !cargando && !error && <p className="text-secondary small mb-0">Escribe el nombre de un libro y la IA te mostrará opciones con sus datos para completar el formulario.</p>}
            <div className="d-flex flex-column gap-2">
              {opciones?.map((o, i) => (
                <div key={i} className="card-biblioweb-sec p-3 d-flex flex-column flex-md-row gap-3 justify-content-between align-items-md-center">
                  <div>
                    <div className="fw-bold font-serif">{o.titulo}</div>
                    <div className="small text-secondary fw-semibold">{o.autor}{o.anio ? " · " + o.anio : ""}{o.editorial ? " · " + o.editorial : ""}</div>
                    <div className="small text-secondary mt-1">{o.descripcion}</div>
                    <span className={`badge ${claseCategoria(o.categoria)} mt-2`}>{o.categoria}</span>
                  </div>
                  <button className="btn btn-sm btn-verde text-nowrap" type="button" onClick={() => onElegir(o)}>Usar estos datos</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
