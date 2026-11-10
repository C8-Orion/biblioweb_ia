// Demo admin login carried over from the original site (browser-only, not real security).
const SESSION_KEY = "biblioweb_user_session";
export const CRED_CORREO = "admin@biblioweb.test";
export const CRED_CLAVE = "Admin123";
export const estaAutenticado = () => typeof window !== "undefined" && sessionStorage.getItem(SESSION_KEY) !== null;
export function login(email: string, password: string) {
  if (email === CRED_CORREO && password === CRED_CLAVE) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify({ email, rol: "Administrador General", loginTime: new Date().toISOString() }));
    return true;
  }
  return false;
}
export const logout = () => sessionStorage.removeItem(SESSION_KEY);
