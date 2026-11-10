import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { requireSupabaseAuth } from "@/integrations/supabase/auth-middleware";

const datosPrestamo = z.object({
  libroId: z.string().trim().min(1).max(120),
  titulo: z.string().trim().min(1).max(240),
  autor: z.string().trim().min(1).max(240),
  portada: z.string().max(1000).optional().default(""),
  comentario: z.string().trim().max(1000).optional().default(""),
});

export const solicitarPrestamoFn = createServerFn({ method: "POST" })
  .middleware([requireSupabaseAuth])
  .inputValidator((input: unknown) => datosPrestamo.parse(input))
  .handler(async ({ data, context }) => {
    const { data: prestamo, error } = await context.supabase.rpc("solicitar_prestamo", {
      p_libro_id: data.libroId,
      p_titulo: data.titulo,
      p_autor: data.autor,
      p_portada: data.portada,
      p_comentario: data.comentario,
    });
    if (error) throw new Error(error.message);
    return prestamo;
  });

export const listarMisPrestamosFn = createServerFn({ method: "GET" })
  .middleware([requireSupabaseAuth])
  .handler(async ({ context }) => {
    const { data, error } = await context.supabase
      .from("prestamos")
      .select("id, libro_id, titulo, autor, portada, comentario, solicitado_en, fecha_devolucion, estado")
      .order("solicitado_en", { ascending: false });
    if (error) throw new Error(error.message);
    return data;
  });
