import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Navbar } from "@/components/Layout";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "BiblioWeb - Biblioteca Cívica & Archivo Municipal" },
      { name: "description", content: "Espacios de lectura, más de 10,000 obras, talleres y horarios de la Biblioteca Central Municipal." },
      { property: "og:title", content: "BiblioWeb - Biblioteca Cívica & Archivo Municipal" },
      { property: "og:description", content: "Espacios de lectura, más de 10,000 obras, talleres y horarios de la Biblioteca Central Municipal." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Index,
});

const PLACEHOLDER = "https://www.gstatic.com/labs-code/stitch/stitch-placeholder-300x300.svg";
const imgStyle = { height: 480, objectFit: "cover" as const, filter: "brightness(0.65)" };

const servicios = [
  ["📖", "Préstamo Domiciliario", "Hasta 5 libros simultáneos por 15 días renovables mediante tu Carnet Cívico de lector."],
  ["💻", "Salas de Coworking", "Puestos electrificados individuales, conectividad por fibra óptica y cubículos silenciosos."],
  ["🎓", "Talleres Digitales", "Capacitación gratuita en programación, ofimática, seguridad informática y pensamiento crítico."],
  ["🏛️", "Hemeroteca & Archivo", "Custodia de prensa histórica, boletines municipales del siglo XX y actas digitalizadas."],
];

function Index() {
  const navigate = useNavigate();
  const [q, setQ] = useState("");
  return (
    <>
      <Navbar activo="inicio" />
      <header className="container my-4">
        <div className="carousel slide rounded-3 overflow-hidden shadow-sm" data-bs-ride="carousel" id="carouselBiblio">
          <div className="carousel-indicators">
            {[0, 1, 2].map((i) => (
              <button key={i} aria-label={`Slide ${i + 1}`} className={i === 0 ? "active" : undefined} aria-current={i === 0 ? "true" : undefined} data-bs-slide-to={i} data-bs-target="#carouselBiblio" type="button" />
            ))}
          </div>
          <div className="carousel-inner" style={{ maxHeight: 480 }}>
            <div className="carousel-item active">
              <img alt="Gran sala de lectura" className="d-block w-100" src={PLACEHOLDER} style={imgStyle} />
              <div className="carousel-caption text-start pb-5">
                <span className="badge bg-warning text-dark mb-2 px-3 py-1">PATRIMONIO CÍVICO</span>
                <h1 className="display-5 fw-bold text-white font-serif">Espacios de Lectura y Estudio Conectado</h1>
                <p className="lead text-light d-none d-md-block">Salas climatizadas con Wi-Fi de alta velocidad, colecciones digitalizadas y cubículos de concentración.</p>
                <Link className="btn btn-verde btn-lg me-2" to="/catalogo">Ver Catálogo de Libros</Link>
                <a className="btn btn-outline-light btn-lg" href="#horarios">Consultar Horarios</a>
              </div>
            </div>
            <div className="carousel-item">
              <img alt="Estanterías históricas de la biblioteca" className="d-block w-100" src={PLACEHOLDER} style={imgStyle} />
              <div className="carousel-caption text-start pb-5">
                <span className="badge bg-warning text-dark mb-2 px-3 py-1">COLECCIÓN 2024</span>
                <h2 className="display-5 fw-bold text-white font-serif">Más de 10,000 Obras a tu Alcance</h2>
                <p className="lead text-light d-none d-md-block">Narrativa canónica, últimas publicaciones de ciencia, ingeniería de software e investigación histórica.</p>
                <Link className="btn btn-terracota btn-lg" to="/catalogo">Solicitar Préstamo</Link>
              </div>
            </div>
            <div className="carousel-item">
              <img alt="Libros antiguos encuadernados" className="d-block w-100" src={PLACEHOLDER} style={imgStyle} />
              <div className="carousel-caption text-start pb-5">
                <span className="badge bg-warning text-dark mb-2 px-3 py-1">ACTIVIDADES Y TALLERES</span>
                <h2 className="display-5 fw-bold text-white font-serif">Archivo Histórico y Clubes de Lectura</h2>
                <p className="lead text-light d-none d-md-block">Encuentros culturales quincenales, talleres de alfabetización digital y consulta de manuscritos.</p>
                <a className="btn btn-verde btn-lg" href="#servicios">Explorar Servicios</a>
              </div>
            </div>
          </div>
          <button className="carousel-control-prev" data-bs-slide="prev" data-bs-target="#carouselBiblio" type="button">
            <span aria-label="Anterior" className="carousel-control-prev-icon" />
          </button>
          <button className="carousel-control-next" data-bs-slide="next" data-bs-target="#carouselBiblio" type="button">
            <span aria-label="Siguiente" className="carousel-control-next-icon" />
          </button>
        </div>
      </header>

      <section className="container my-5">
        <div className="card-biblioweb p-4">
          <form className="row align-items-center g-3" role="search" onSubmit={(e) => { e.preventDefault(); navigate({ to: "/catalogo", search: q.trim() ? { q: q.trim() } : {} }); }}>
            <div className="col-md-3">
              <h5 className="font-serif mb-0 text-primary">Búsqueda en Sala</h5>
              <small className="text-secondary">Consulta rápida del OPAC</small>
            </div>
            <div className="col-md-6">
              <div className="input-group">
                <label className="visually-hidden" htmlFor="buscar-inicio">Buscar libro</label>
                <input className="form-control" id="buscar-inicio" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Buscar por título, autor o materia (ej. García Márquez, Sagan...)" type="search" />
                <button className="btn btn-terracota" type="submit">Buscar</button>
              </div>
            </div>
            <div className="col-md-3 d-grid">
              <Link className="btn btn-verde" to="/catalogo">Explorar Todo</Link>
            </div>
          </form>
        </div>
      </section>

      <section className="container my-5 py-3" id="servicios">
        <div className="text-center mb-5">
          <span className="text-uppercase fw-bold text-secondary small">Infraestructura Cívica</span>
          <h2 className="font-serif display-6 fw-bold">Servicios para la Comunidad</h2>
          <p className="text-secondary">Acceso libre y universal a recursos analógicos y digitales de vanguardia.</p>
        </div>
        <div className="row g-4">
          {servicios.map(([icono, titulo, texto]) => (
            <div className="col-md-6 col-lg-3" key={titulo}>
              <div className="card card-biblioweb h-100 p-4 text-center">
                <div className="fs-1 mb-3">{icono}</div>
                <h5 className="font-serif fw-bold">{titulo}</h5>
                <p className="text-secondary small">{texto}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container my-5 py-4" id="horarios">
        <div className="card-biblioweb p-4 p-lg-5">
          <div className="row g-4 align-items-center">
            <div className="col-lg-6">
              <span className="badge bg-success-subtle text-success px-3 py-1 mb-2">ABIERTO HOY</span>
              <h3 className="font-serif fw-bold display-6 mb-3">Horarios de Atención</h3>
              <p className="text-secondary mb-4">La Biblioteca Central Municipal abre sus puertas de lunes a sábado con acceso libre y gratuito a todas las salas de lectura.</p>
              <ul className="list-group list-group-flush mb-4">
                {[
                  ["Lunes a Viernes", "Jornada continuada en todas las salas", "bg-primary", "08:30 – 20:30 h"],
                  ["Sábados", "Salas de lectura y préstamo express", "bg-secondary", "09:00 – 14:00 h"],
                  ["Domingos y Feriados", "Buzón de devoluciones 24h activo", "bg-danger", "Cerrado"],
                ].map(([dia, nota, clase, hora]) => (
                  <li key={dia} className="list-group-item d-flex justify-content-between align-items-center bg-transparent py-3">
                    <div><strong>{dia}</strong><div className="small text-secondary">{nota}</div></div>
                    <span className={`badge ${clase} fs-6 px-3 py-2`}>{hora}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="col-lg-6">
              <div className="card-biblioweb-sec p-4 h-100">
                <h5 className="font-serif fw-bold mb-3">Sede Institucional</h5>
                <p className="text-secondary mb-2">📍 <strong>Dirección:</strong> Av. de las Letras 1420, Barrio Cívico, CP 28001</p>
                <p className="text-secondary mb-2">📞 <strong>Teléfono de Referencia:</strong> +34 900 123 456</p>
                <p className="text-secondary mb-4">✉️ <strong>Correo Electrónico:</strong> consultas@biblioweb.org</p>
                <div className="alert alert-secondary d-flex align-items-center gap-2 mb-0" role="alert">
                  <span>🚌</span>
                  <small>Líneas de autobús: 12, 27, 45 y Metro L3 (Estación Cívica a 150m).</small>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="footer-biblioweb py-5 mt-5">
        <div className="container">
          <div className="row g-4">
            <div className="col-lg-4">
              <h4 className="font-serif fw-bold text-white mb-3">BiblioWeb</h4>
              <p className="text-white-50 small">Biblioteca pública y archivo histórico municipal. Fomentamos el libre acceso al conocimiento, la lectura crítica comunitaria y la preservación del patrimonio bibliográfico.</p>
              <div className="small text-white-50">© 2024 BiblioWeb. Red Cívica de Bibliotecas Públicas.</div>
            </div>
            <div className="col-md-4 col-lg-2 offset-lg-2">
              <h6 className="text-uppercase text-warning fw-bold mb-3">Enlaces</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><Link to="/">Inicio</Link></li>
                <li className="mb-2"><Link to="/catalogo">Catálogo de Libros</Link></li>
                <li className="mb-2"><a href="#servicios">Servicios</a></li>
                <li className="mb-2"><a href="#horarios">Horarios</a></li>
              </ul>
            </div>
            <div className="col-md-4 col-lg-2">
              <h6 className="text-uppercase text-warning fw-bold mb-3">Gestión</h6>
              <ul className="list-unstyled small">
                <li className="mb-2"><Link to="/login">Acceso Administrador</Link></li>
                <li className="mb-2"><a href="#">Reglamento de Sala</a></li>
                <li className="mb-2"><a href="#">Privacidad y Datos</a></li>
              </ul>
            </div>
            <div className="col-md-4 col-lg-2">
              <h6 className="text-uppercase text-warning fw-bold mb-3">Contacto</h6>
              <p className="small text-white-50 mb-1">Av. de las Letras 1420</p>
              <p className="small text-white-50 mb-1">consultas@biblioweb.org</p>
              <p className="small text-white-50">+34 900 123 456</p>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
