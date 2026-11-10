import { useQueryClient } from "@tanstack/react-query";
import { Link, useLocation } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useEffect, useRef, useState, type FormEvent } from "react";
import { portadaDe, type Libro } from "@/lib/libros";
import { DIAS_PRESTAMO, formatearFecha, type Prestamo } from "@/lib/prestamos";
import { solicitarPrestamoFn } from "@/lib/prestamos.functions";
import { useReaderAuth } from "@/lib/reader-auth";

/** Loan request modal; opened with data-bs-toggle="modal" data-bs-target="#modalPrestamo". */
export function PrestamoModal({ libro }: { libro: Libro | null }) {
  const ref = useRef<HTMLDivElement>(null);
  const location = useLocation();
  const queryClient = useQueryClient();
  const solicitar = useServerFn(solicitarPrestamoFn);
  const { user, nombre, listo } = useReaderAuth();
  const [comentario, setComentario] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);
  const [creado, setCreado] = useState<Prestamo | null>(null);

  useEffect(() => { setComentario(""); setError(""); setCreado(null); }, [libro?.id]);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!libro) return;
    setError(""); setCargando(true);
    try {
      const prestamo = await solicitar({ data: {
        libroId: libro.id, titulo: libro.titulo, autor: libro.autor,
        portada: portadaDe(libro), comentario,
      } });
      setCreado(prestamo);
      await queryClient.invalidateQueries({ queryKey: ["mis-prestamos"] });
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos registrar el préstamo. Inténtalo de nuevo.");
    } finally { setCargando(false); }
  }

  return <div aria-hidden="true" aria-labelledby="modalPrestamoLabel" className="modal fade" id="modalPrestamo" tabIndex={-1} ref={ref}>
    <div className="modal-dialog modal-dialog-centered"><div className="modal-content card-biblioweb">
      <div className="modal-header border-bottom">
        <h2 className="modal-title font-serif fw-bold h5" id="modalPrestamoLabel">Solicitud de Préstamo de Libro</h2>
        <button aria-label="Cerrar" className="btn-close" data-bs-dismiss="modal" type="button" />
      </div>
      {!listo ? <div className="modal-body text-center py-5" role="status">Comprobando tu cuenta...</div>
        : !user ? <div className="modal-body text-center py-4">
          <div className="display-5 mb-3" aria-hidden="true">🔖</div>
          <h3 className="h5 font-serif fw-bold">Inicia sesión para solicitar este libro</h3>
          <p className="text-secondary small">Tu préstamo quedará guardado en tu historial con una devolución a {DIAS_PRESTAMO} días.</p>
          <Link className="btn btn-terracota" data-bs-dismiss="modal" to="/auth" search={{ redirect: location.href }}>Iniciar sesión o crear cuenta</Link>
        </div>
        : creado ? <div className="modal-body text-center py-4" role="status">
          <div className="display-5 mb-3" aria-hidden="true">✅</div>
          <h3 className="h5 font-serif fw-bold">¡Préstamo registrado!</h3>
          <p className="text-secondary">Guardamos <strong>{creado.titulo}</strong> en tu historial.</p>
          <div className="card-biblioweb-sec p-3 mb-4"><small className="text-secondary d-block">Fecha de devolución</small><strong className="text-primary">{formatearFecha(creado.fecha_devolucion)}</strong></div>
          <div className="d-flex flex-wrap justify-content-center gap-2">
            <Link className="btn btn-terracota" data-bs-dismiss="modal" to="/mis-prestamos">Ver mis préstamos</Link>
            <button className="btn btn-outline-secondary" data-bs-dismiss="modal" type="button">Cerrar</button>
          </div>
        </div>
        : <form onSubmit={enviar}>
          <div className="modal-body">
            {error && <div className="alert alert-danger py-2 px-3 small" role="alert">{error}</div>}
            <div className="mb-3">
              <label className="form-label small fw-bold" htmlFor="modal-libro-titulo">Libro Seleccionado</label>
              <input className="form-control bg-body-secondary" id="modal-libro-titulo" readOnly type="text" value={libro?.titulo ?? ""} />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-md-6"><label className="form-label small fw-bold" htmlFor="nombre-solicitante">Nombre</label><input className="form-control bg-body-secondary" id="nombre-solicitante" readOnly type="text" value={nombre} /></div>
              <div className="col-md-6"><label className="form-label small fw-bold" htmlFor="correo-solicitante">Correo</label><input className="form-control bg-body-secondary" id="correo-solicitante" readOnly type="email" value={user.email ?? ""} /></div>
            </div>
            <div className="mb-3">
              <label className="form-label small fw-bold" htmlFor="comentario-solicitante">Comentario u Observación (Opcional)</label>
              <textarea className="form-control" id="comentario-solicitante" maxLength={1000} onChange={(e) => setComentario(e.target.value)} placeholder="Motivo de la solicitud, plazo especial o consulta bibliográfica..." rows={3} value={comentario} />
            </div>
            <div className="form-check mb-2">
              <input className="form-check-input" id="terminos-prestamo" required type="checkbox" />
              <label className="form-check-label small text-secondary" htmlFor="terminos-prestamo">Acepto el reglamento general de custodia y plazo de devolución de {DIAS_PRESTAMO} días renovables de la Red Cívica. *</label>
            </div>
          </div>
          <div className="modal-footer border-top">
            <button className="btn btn-outline-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
            <button className="btn btn-terracota" disabled={cargando || !libro} type="submit">{cargando ? "Registrando..." : "Confirmar Solicitud"}</button>
          </div>
        </form>}
    </div></div>
  </div>;
}
