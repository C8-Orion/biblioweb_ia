import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";
import { FooterSimple, Navbar } from "@/components/Layout";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";
import { AUTH_RETURN_KEY, rutaRegresoSegura, useReaderAuth } from "@/lib/reader-auth";
import "@lovable.dev/cloud-auth-js/styles.css";

export const Route = createFileRoute("/auth")({
  validateSearch: (search: Record<string, unknown>): { redirect?: string | undefined } => ({
    redirect: typeof search["redirect"] === "string" ? search["redirect"] : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Acceso de Lectores - BiblioWeb" },
      { name: "description", content: "Crea tu cuenta de lector, solicita préstamos y consulta tus fechas de devolución." },
      { property: "og:title", content: "Acceso de Lectores - BiblioWeb" },
      { property: "og:description", content: "Crea tu cuenta de lector, solicita préstamos y consulta tus fechas de devolución." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AccesoLectores,
});

function GoogleIcon() {
  return <svg aria-hidden="true" className="google-auth-icon" viewBox="0 0 24 24"><path fill="#4285F4" d="M23.49 12.27c0-.79-.07-1.54-.19-2.27H12v4.51h6.47c-.29 1.48-1.14 2.73-2.4 3.58v3h3.86c2.26-2.09 3.56-5.17 3.56-8.82z"/><path fill="#34A853" d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.86-3c-1.08.72-2.45 1.16-4.07 1.16-3.13 0-5.78-2.11-6.73-4.96H1.29v3.09C3.26 21.3 7.31 24 12 24z"/><path fill="#FBBC05" d="M5.27 14.29c-.25-.72-.38-1.49-.38-2.29s.14-1.57.38-2.29V6.62H1.29C.47 8.24 0 10.06 0 12s.47 3.76 1.29 5.38l3.98-3.09z"/><path fill="#EA4335" d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.7 1.29 6.62l3.98 3.09c.95-2.85 3.6-4.96 6.73-4.96z"/></svg>;
}

function AccesoLectores() {
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const { user, listo } = useReaderAuth();
  const [modo, setModo] = useState<"entrar" | "registro">("entrar");
  const [nombre, setNombre] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [confirmacion, setConfirmacion] = useState(false);
  const [cargando, setCargando] = useState(false);
  const destino = rutaRegresoSegura(redirect);

  useEffect(() => { if (listo && user) navigate({ to: destino, replace: true }); }, [listo, user, destino, navigate]);

  async function enviar(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(""); setCargando(true);
    if (modo === "registro") {
      const { data, error: authError } = await supabase.auth.signUp({
        email: email.trim(), password,
        options: { data: { full_name: nombre.trim() }, emailRedirectTo: window.location.origin },
      });
      if (authError) setError(authError.message === "User already registered" ? "Ya existe una cuenta con este correo. Prueba a iniciar sesión." : authError.message);
      else if (!data.session) setConfirmacion(true);
      else navigate({ to: destino });
    } else {
      const { error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
      if (authError) setError(authError.message === "Invalid login credentials" ? "Correo o contraseña incorrectos, o la cuenta aún no está confirmada." : authError.message);
      else navigate({ to: destino });
    }
    setCargando(false);
  }

  async function accesoSocial(provider: "google" | "lovable") {
    setError(""); setCargando(true);
    sessionStorage.setItem(AUTH_RETURN_KEY, destino);
    const result = await lovable.auth.signInWithOAuth(provider, { redirect_uri: window.location.origin });
    if (result.error) {
      sessionStorage.removeItem(AUTH_RETURN_KEY);
      setError(result.error.message);
      setCargando(false);
    } else if (!result.redirected) {
      sessionStorage.removeItem(AUTH_RETURN_KEY);
      navigate({ to: destino });
    }
  }

  return <div className="d-flex flex-column min-vh-100">
    <Navbar />
    <main className="container my-auto py-5">
      <div className="row justify-content-center"><div className="col-md-8 col-lg-6 col-xl-5">
        <div className="card card-biblioweb p-4 p-md-5 shadow-sm">
          <div className="text-center mb-4">
            <div className="badge bg-secondary-subtle text-secondary px-3 py-1 mb-2">CUENTA DE LECTOR</div>
            <h1 className="font-serif fw-bold h2">Tus libros, siempre contigo</h1>
            <p className="text-secondary small mb-0">Solicita préstamos y consulta tus fechas de devolución.</p>
          </div>
          {confirmacion ? <div className="text-center py-3" role="status">
            <div className="display-5 mb-3" aria-hidden="true">✉️</div>
            <h2 className="h4 font-serif fw-bold">Revisa tu correo</h2>
            <p className="text-secondary">Enviamos un enlace de confirmación a <strong>{email}</strong>. Después de confirmarlo, podrás iniciar sesión.</p>
            <button className="btn btn-terracota" type="button" onClick={() => { setConfirmacion(false); setModo("entrar"); setPassword(""); }}>Volver a iniciar sesión</button>
          </div> : <>
            <div className="btn-group w-100 mb-4" role="group" aria-label="Acceso o registro">
              <button className={"btn " + (modo === "entrar" ? "btn-verde" : "btn-outline-secondary")} type="button" onClick={() => { setModo("entrar"); setError(""); }}>Iniciar sesión</button>
              <button className={"btn " + (modo === "registro" ? "btn-verde" : "btn-outline-secondary")} type="button" onClick={() => { setModo("registro"); setError(""); }}>Crear cuenta</button>
            </div>
            {error && <div className="alert alert-danger py-2 px-3 small" role="alert">{error}</div>}
            <form onSubmit={enviar}>
              {modo === "registro" && <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="reader-name">Nombre completo</label>
                <input autoComplete="name" className="form-control" id="reader-name" maxLength={120} minLength={2} onChange={(e) => setNombre(e.target.value)} required value={nombre} />
              </div>}
              <div className="mb-3">
                <label className="form-label small fw-bold" htmlFor="reader-email">Correo electrónico</label>
                <input autoComplete="email" className="form-control" id="reader-email" onChange={(e) => setEmail(e.target.value)} required type="email" value={email} />
              </div>
              <div className="mb-4">
                <label className="form-label small fw-bold" htmlFor="reader-password">Contraseña</label>
                <input autoComplete={modo === "registro" ? "new-password" : "current-password"} className="form-control" id="reader-password" minLength={8} onChange={(e) => setPassword(e.target.value)} required type="password" value={password} />
                {modo === "registro" && <div className="form-text">Usa al menos 8 caracteres.</div>}
              </div>
              <button className="btn btn-verde w-100 py-2" disabled={cargando} type="submit">{cargando ? "Un momento..." : modo === "entrar" ? "Entrar a mi cuenta" : "Crear mi cuenta"}</button>
            </form>
            <div className="d-flex align-items-center gap-3 my-4"><hr className="flex-grow-1" /><span className="small text-secondary">o continúa con</span><hr className="flex-grow-1" /></div>
            <div className="d-grid gap-2">
              <button className="google-auth-button" disabled={cargando} onClick={() => void accesoSocial("google")} type="button"><GoogleIcon />Continuar con Google</button>
              <button className="lovable-auth-button w-100" disabled={cargando} onClick={() => void accesoSocial("lovable")} type="button">Continuar con Lovable</button>
            </div>
          </>}
          <p className="small text-secondary text-center mt-4 mb-0">¿Eres administrador? <Link to="/login">Usa el acceso de administración</Link>.</p>
        </div>
      </div></div>
    </main>
    <FooterSimple className="py-3 mt-auto">BiblioWeb · Préstamos personales · Historial y fechas de devolución</FooterSimple>
  </div>;
}
