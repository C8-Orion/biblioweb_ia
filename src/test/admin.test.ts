import { describe, expect, it } from "vitest";
import { exigirPermisoAdmin } from "@/lib/admin";

describe("permisos del panel de administración", () => {
  it("rechaza una cuenta sin el rol de administrador", () => {
    expect(() => exigirPermisoAdmin(false)).toThrow("Esta cuenta no tiene permisos de administración.");
  });

  it("permite una cuenta con el rol de administrador", () => {
    expect(() => exigirPermisoAdmin(true)).not.toThrow();
  });
});
