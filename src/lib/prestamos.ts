import type { Tables } from "@/integrations/supabase/types";

export type Prestamo = Tables<"prestamos">;
export const DIAS_PRESTAMO = 15;
export const MAX_PRESTAMOS_ACTIVOS = 5;

export function calcularFechaDevolucion(desde: Date | string): Date {
  const inicio = desde instanceof Date ? desde.getTime() : new Date(desde).getTime();
  if (!Number.isFinite(inicio)) throw new Error("Fecha de inicio no válida");
  return new Date(inicio + DIAS_PRESTAMO * 24 * 60 * 60 * 1000);
}

export function formatearFecha(fecha: string | Date): string {
  return new Intl.DateTimeFormat("es", { day: "numeric", month: "long", year: "numeric" }).format(new Date(fecha));
}

export function estadoVisiblePrestamo(prestamo: Pick<Prestamo, "estado" | "fecha_devolucion">, ahora = new Date()) {
  if (prestamo.estado === "devuelto") return "Devuelto";
  if (prestamo.estado === "cancelado") return "Cancelado";
  return new Date(prestamo.fecha_devolucion).getTime() < ahora.getTime() ? "Vencido" : "Activo";
}
