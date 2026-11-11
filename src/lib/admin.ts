export function exigirPermisoAdmin(esAdmin: boolean): void {
  if (!esAdmin) throw new Error("Esta cuenta no tiene permisos de administración.");
}
