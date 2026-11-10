import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { FooterSimple, Navbar } from "@/components/Layout";
import { CRED_CLAVE, CRED_CORREO, estaAutenticado, login } from "@/lib/auth";

export const Route = createFileRoute("/login")({
  head: () => ({
    meta: [
      { title: "Acceso de Administrador - BiblioWeb" },
      { name: "description", content: "Portal restringido para archiveros y personal de gestión de sala de BiblioWeb." },
      { property: "og:title", content: "Acceso de Administrador - BiblioWeb" },
      { property: "og:description", content: "Portal restringido para archiveros y personal de gestión de sala de BiblioWeb." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Login,
});

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(false);
  useEffect(() => { if (estaAutenticado()) navigate({ to: "/admin", replace: true }); }, [navigate]);

  return (
    <div className="d-flex flex-column min-vh-100">
      <Navbar />
      <main className="container my-auto py-5">
        <div className="row justify-content-center">
          <div className="col-md-8 col-lg-5">
            <div className="card card-biblioweb p-4 p-md-5 shadow-sm">
              <div className="text-center mb-4">
                <div className="badge bg-secondary-subtle text-secondary px-3 py-1 mb-2">PORTAL RESTRINGIDO</div>
                <h2 className="font-serif fw-bold">Acceso de Administrador</h2>
                <p className="text-secondary small">Autenticación para archiveros y personal de gestión de sala</p>
              </div>
              {error && <div className="alert alert-danger py-2 px-3 small" role="alert">Correo o contraseña incorrectos</div>}
              <form onSubmit={(e) => {
                e.preventDefault();
                if (login(email.trim(), password)) { setError(false); navigate({ to: "/admin" }); } else setError(true);
              }}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-bold">Correo Electrónico Institucional</label>
                  <input type="email" className="form-control" id="email" placeholder="admin@biblioweb.test" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label small fw-bold">Contraseña de Seguridad</label>
                  <input type="password" className="form-control" id="password" placeholder="••••••••" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-verde w-100 py-2 mb-3">Ingresar al Sistema</button>
              </form>
              <div className="card-biblioweb-sec p-3 rounded-2 small mt-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <strong>Cuenta de prueba:</strong>
                  <button type="button" className="btn btn-sm btn-outline-dark py-0 px-2" style={{ fontSize: "0.75rem" }} onClick={() => { setEmail(CRED_CORREO); setPassword(CRED_CLAVE); }}>Cargar datos</button>
                </div>
                <div className="text-secondary">Usuario: <code>{CRED_CORREO}</code></div>
                <div className="text-secondary">Clave: <code>{CRED_CLAVE}</code></div>
              </div>
            </div>
          </div>
        </div>
      </main>
      <FooterSimple className="py-3 mt-auto">BiblioWeb · Sistema Cívico de Archivo Municipal · Acceso Autorizado</FooterSimple>
    </div>
  );
}
