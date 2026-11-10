import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";
import { ThemeToggle } from "./ThemeToggle";

const Logo = () => (
  <svg fill="none" height="28" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24" width="28">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
    <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
  </svg>
);

export function Navbar({ activo }: { activo?: "inicio" | "catalogo" }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-biblioweb sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/"><Logo />BiblioWeb</Link>
        <button aria-controls="navMenu" aria-expanded="false" aria-label="Navegación" className="navbar-toggler" data-bs-target="#navMenu" data-bs-toggle="collapse" type="button">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navMenu">
          <ul className="navbar-nav me-auto mb-2 mb-lg-0">
            <li className="nav-item"><Link className={"nav-link" + (activo === "inicio" ? " active" : "")} to="/">Inicio</Link></li>
            <li className="nav-item"><Link className={"nav-link" + (activo === "catalogo" ? " active" : "")} to="/catalogo">Catálogo de Libros</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/" hash="servicios">Servicios</Link></li>
            <li className="nav-item"><Link className="nav-link" to="/" hash="horarios">Horarios &amp; Contacto</Link></li>
          </ul>
          <div className="d-flex align-items-center gap-3">
            <ThemeToggle />
            <Link className="btn btn-terracota px-3 py-1" to="/login">Acceso Admin</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}

export function AdminNavbar({ onLogout }: { onLogout: () => void }) {
  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-biblioweb sticky-top py-2">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2 fw-bold text-white fs-4" to="/admin"><Logo />BiblioWeb · Admin</Link>
        <div className="d-flex align-items-center gap-3 ms-auto">
          <ThemeToggle />
          <button className="btn btn-terracota btn-sm px-3" onClick={onLogout} type="button">Cerrar sesión</button>
        </div>
      </div>
    </nav>
  );
}

export function FooterSimple({ children, className = "py-4 mt-5" }: { children: ReactNode; className?: string }) {
  return (
    <footer className={"footer-biblioweb " + className}>
      <div className="container text-center small text-white-50">{children}</div>
    </footer>
  );
}
