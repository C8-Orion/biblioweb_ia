import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [tema, setTema] = useState<string>("light");
  useEffect(() => { setTema(document.documentElement.getAttribute("data-bs-theme") || "light"); }, []);
  const cambiar = () => {
    const next = tema === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-bs-theme", next);
    localStorage.setItem("biblioweb_theme", next);
    setTema(next);
  };
  const label = tema === "dark" ? "Cambiar a modo claro" : "Cambiar a modo oscuro";
  return (
    <button className="btn btn-outline-light rounded-circle p-2 lh-1" style={{ width: 38, height: 38 }} title={label} aria-label={label} onClick={cambiar} type="button">
      {tema === "dark" ? "🌙" : "☀️"}
    </button>
  );
}
