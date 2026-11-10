import { useQueryClient } from "@tanstack/react-query";
import { useNavigate, useRouter } from "@tanstack/react-router";
import type { Session, User } from "@supabase/supabase-js";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";

export const AUTH_RETURN_KEY = "biblioweb_auth_return";

export function rutaRegresoSegura(valor: unknown): string {
  return typeof valor === "string" && valor.startsWith("/") && !valor.startsWith("//") && !valor.startsWith("/auth") ? valor : "/mis-prestamos";
}

type ReaderAuthValue = {
  user: User | null;
  nombre: string;
  listo: boolean;
  cerrarSesion: () => Promise<void>;
};

const ReaderAuthContext = createContext<ReaderAuthValue | null>(null);

export function ReaderAuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const navigate = useNavigate();
  const [session, setSession] = useState<Session | null>(null);
  const [nombre, setNombre] = useState("");
  const [listo, setListo] = useState(false);

  const cargarPerfil = useCallback(async (user: User | null) => {
    if (!user) { setNombre(""); return; }
    const { data } = await supabase.from("profiles").select("full_name").eq("id", user.id).maybeSingle();
    setNombre(data?.full_name || String(user.user_metadata["full_name"] || user.user_metadata["name"] || user.email || "Lector"));
  }, []);

  useEffect(() => {
    let activo = true;
    supabase.auth.getSession().then(({ data }) => {
      if (!activo) return;
      setSession(data.session);
      void cargarPerfil(data.session?.user ?? null).finally(() => { if (activo) setListo(true); });
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, nuevaSesion) => {
      if (event !== "SIGNED_IN" && event !== "SIGNED_OUT" && event !== "USER_UPDATED") return;
      setSession(nuevaSesion);
      void cargarPerfil(nuevaSesion?.user ?? null);
      setListo(true);
      router.invalidate();
      if (event === "SIGNED_OUT") return;
      queryClient.invalidateQueries();
      const regreso = sessionStorage.getItem(AUTH_RETURN_KEY);
      if (nuevaSesion && regreso) {
        sessionStorage.removeItem(AUTH_RETURN_KEY);
        navigate({ to: rutaRegresoSegura(regreso) });
      }
    });
    return () => { activo = false; subscription.unsubscribe(); };
  }, [cargarPerfil, navigate, queryClient, router]);

  const cerrarSesion = useCallback(async () => {
    await queryClient.cancelQueries();
    queryClient.clear();
    await supabase.auth.signOut();
    navigate({ to: "/auth", replace: true });
  }, [navigate, queryClient]);

  const value = useMemo(() => ({ user: session?.user ?? null, nombre, listo, cerrarSesion }), [session, nombre, listo, cerrarSesion]);
  return <ReaderAuthContext.Provider value={value}>{children}</ReaderAuthContext.Provider>;
}

export function useReaderAuth() {
  const value = useContext(ReaderAuthContext);
  if (!value) throw new Error("useReaderAuth debe usarse dentro de ReaderAuthProvider");
  return value;
}
