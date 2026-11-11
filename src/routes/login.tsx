import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { useServerFn } from "@tanstack/react-start";
import { FooterSimple, Navbar } from "@/components/Layout";
import { verificarAdminFn } from "@/lib/admin.functions";
import { supabase } from "@/integrations/supabase/client";

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
  const verificarAdmin = useServerFn(verificarAdminFn);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [cargando, setCargando] = useState(false);

  async function ingresar(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setCargando(true);
    const { error: errorAcceso } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (errorAcceso) {
      setError("Correo o contraseña incorrectos.");
      setCargando(false);
      return;
    }
    try {
      if (await verificarAdmin()) navigate({ to: "/admin" });
      else {
        await supabase.auth.signOut();
        setError("Esta cuenta no tiene permisos de administración.");
      }
    } catch {
      setError("No pudimos comprobar los permisos. Inténtalo de nuevo.");
    } finally { setCargando(false); }
  }

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
              {error && <div className="alert alert-danger py-2 px-3 small" role="alert">{error}</div>}
              <form onSubmit={ingresar}>
                <div className="mb-3">
                  <label htmlFor="email" className="form-label small fw-bold">Correo Electrónico Institucional</label>
                  <input type="email" className="form-control" id="email" placeholder="admin@biblioweb.test" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                </div>
                <div className="mb-4">
                  <label htmlFor="password" className="form-label small fw-bold">Contraseña de Seguridad</label>
                  <input type="password" className="form-control" id="password" placeholder="••••••••" required autoComplete="current-password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-verde w-100 py-2 mb-3" disabled={cargando}>{cargando ? "Comprobando acceso..." : "Ingresar al Sistema"}</button>
              </form>
              <p className="text-secondary small text-center mb-0">Usa la cuenta de lector que tenga permisos de administración.</p>
            </div>
          </div>
        </div>
      </main>
      <FooterSimple className="py-3 mt-auto">BiblioWeb · Sistema Cívico de Archivo Municipal · Acceso Autorizado</FooterSimple>
    </div>
  );
}
