import { useEffect, useState } from "react";
import { listar, STORAGE_EVENT, type Libro } from "./libros";

/** Books from localStorage; null until mounted (avoids SSR mismatch). Syncs across tabs. */
export function useLibros(): Libro[] | null {
  const [libros, setLibros] = useState<Libro[] | null>(null);
  useEffect(() => {
    const cargar = () => setLibros(listar());
    cargar();
    const onStorage = (e: StorageEvent) => { if (e.key === "biblioweb_libros") cargar(); };
    window.addEventListener("storage", onStorage);
    window.addEventListener(STORAGE_EVENT, cargar);
    return () => { window.removeEventListener("storage", onStorage); window.removeEventListener(STORAGE_EVENT, cargar); };
  }, []);
  return libros;
}
