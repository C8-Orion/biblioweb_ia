import { createServerFn } from "@tanstack/react-start";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";
import { exigirPermisoAdmin } from "@/lib/admin";

export type SolicitudAdmin = {
  id: string;
  titulo: string;
  autor: string;
  solicitante: string;
  comentario: string;
  solicitado_en: string;
  fecha_devolucion: string;
  estado: string;
};

export const verificarAdminFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (error) throw new Error(error.message);
    return data === true;
  });

export const listarSolicitudesAdminFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }): Promise<SolicitudAdmin[]> => {
    const { data: esAdmin, error: errorRol } = await context.supabase.rpc("has_role", {
      _user_id: context.userId,
      _role: "admin",
    });
    if (errorRol) throw new Error(errorRol.message);
    exigirPermisoAdmin(esAdmin === true);

    const { data, error } = await context.supabase
      .from("prestamos")
      .select("id, titulo, autor, comentario, solicitado_en, fecha_devolucion, estado, profiles!inner(full_name)")
      .order("solicitado_en", { ascending: false });
    if (error) throw new Error(error.message);

    return data.map((row) => ({
      id: row.id,
      titulo: row.titulo,
      autor: row.autor,
      solicitante: row.profiles.full_name,
      comentario: row.comentario,
      solicitado_en: row.solicitado_en,
      fecha_devolucion: row.fecha_devolucion,
      estado: row.estado,
    }));
  });
