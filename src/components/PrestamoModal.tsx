import { useRef } from "react";
import { hideModal } from "@/lib/bootstrap";

/** Loan request modal; opened with data-bs-toggle="modal" data-bs-target="#modalPrestamo". */
export function PrestamoModal({ libro }: { libro: string }) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <div aria-hidden="true" aria-labelledby="modalPrestamoLabel" className="modal fade" id="modalPrestamo" tabIndex={-1} ref={ref}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content card-biblioweb">
          <div className="modal-header border-bottom">
            <h2 className="modal-title font-serif fw-bold h5" id="modalPrestamoLabel">Solicitud de Préstamo de Libro</h2>
            <button aria-label="Cerrar" className="btn-close" data-bs-dismiss="modal" type="button" />
          </div>
          <form onSubmit={(e) => {
            e.preventDefault();
            const f = e.currentTarget;
            if (!f.checkValidity()) { f.reportValidity(); return; }
            alert("¡Solicitud registrada correctamente! Recibirás la confirmación en tu correo.");
            hideModal(ref.current);
            f.reset();
          }}>
            <div className="modal-body">
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="modal-libro-titulo">Libro Seleccionado</label>
                <input className="form-control bg-body-secondary" id="modal-libro-titulo" readOnly type="text" value={libro} />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="nombre-solicitante">Nombre Completo *</label>
                <input className="form-control" id="nombre-solicitante" placeholder="Ej. Elena Valenzuela Torres" required type="text" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="correo-solicitante">Correo Electrónico Institucional / Personal *</label>
                <input className="form-control" id="correo-solicitante" placeholder="elena.v@correo.test" required type="email" />
              </div>
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="comentario-solicitante">Comentario u Observación (Opcional)</label>
                <textarea className="form-control" id="comentario-solicitante" placeholder="Motivo de la solicitud, plazo especial o consulta bibliográfica..." rows={3} />
              </div>
              <div className="form-check mb-2">
                <input className="form-check-input" id="terminos-prestamo" required type="checkbox" />
                <label className="form-check-label small text-secondary" htmlFor="terminos-prestamo">
                  Acepto el reglamento general de custodia y plazo de devolución de 15 días renovables de la Red Cívica. *
                </label>
              </div>
            </div>
            <div className="modal-footer border-top">
              <button className="btn btn-outline-secondary" data-bs-dismiss="modal" type="button">Cancelar</button>
              <button className="btn btn-terracota" type="submit">Confirmar Solicitud</button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
