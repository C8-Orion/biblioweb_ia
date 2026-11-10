import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { useEffect, useMemo, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import type { Libro } from "@/lib/libros";

// Bootstrap-styled chat (the project doesn't load Tailwind, so AI Elements components don't fit here).
// One conversation per book, not saved: it resets when the page reloads.
export function ChatLibro({ libro }: { libro: Libro }) {
  const transport = useMemo(() => new DefaultChatTransport({
    api: "/api/chat-libro",
    body: { libro: { titulo: libro.titulo, autor: libro.autor, anio: libro.anio, editorial: libro.editorial, categoria: libro.categoria, sinopsis: libro.sinopsis || libro.descripcion } },
  }), [libro]);
  const [error, setError] = useState<string | null>(null);
  const { messages, sendMessage, status, stop, setMessages } = useChat({
    id: `libro-${libro.id}`,
    transport,
    onError: (e) => {
      const m = e.message || "";
      setError(m.includes("429") ? "Demasiadas preguntas seguidas. Espera un momento." : m.includes("402") ? "Se agotaron los créditos de IA." : "No se pudo obtener respuesta. Inténtalo de nuevo.");
    },
  });
  const [texto, setTexto] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const ocupado = status === "submitted" || status === "streaming";

  useEffect(() => { scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }); }, [messages, status]);
  useEffect(() => { if (!ocupado) inputRef.current?.focus({ preventScroll: true }); }, [ocupado]);

  const enviar = (t: string) => {
    const q = t.trim(); if (!q || ocupado) return;
    setError(null); setTexto(""); sendMessage({ text: q });
  };
  const sugerencias = ["Hazme un resumen breve", "¿Quiénes son los personajes principales?", "¿Cuáles son tus temas centrales?"];

  return (
    <section aria-labelledby="chat-libro-titulo" className="mt-5">
      <div className="d-flex justify-content-between align-items-center mb-2">
        <h2 className="font-serif fw-bold h4 mb-0" id="chat-libro-titulo">💬 Conversa con el libro</h2>
        {messages.length > 0 && <button className="btn btn-sm btn-link text-secondary p-0" type="button" onClick={() => { stop(); setMessages([]); setError(null); }}>Nueva conversación</button>}
      </div>
      <p className="text-secondary small mb-3">Pregúntale a <em>{libro.titulo}</em> por un resumen, sus personajes, temas o lo que quieras saber.</p>
      <div className="card-biblioweb-sec p-3 chat-libro">
        <div ref={scrollRef} className="chat-libro-mensajes" aria-live="polite">
          {messages.length === 0 && (
            <div className="d-flex flex-wrap gap-2">
              {sugerencias.map((s) => <button key={s} type="button" className="btn btn-sm btn-outline-secondary" onClick={() => enviar(s)}>{s}</button>)}
            </div>
          )}
          {messages.map((m) => (
            <div key={m.id} className={m.role === "user" ? "chat-msg chat-msg-usuario" : "chat-msg chat-msg-libro"}>
              {m.role !== "user" && <div className="chat-msg-autor">📖 {libro.titulo}</div>}
              {m.parts.map((p, i) => p.type === "text"
                ? (m.role === "user" ? <span key={i}>{p.text}</span> : <div key={i} className="chat-markdown"><ReactMarkdown>{p.text}</ReactMarkdown></div>)
                : null)}
            </div>
          ))}
          {status === "submitted" && (
            <div className="chat-msg chat-msg-libro text-secondary small"><span className="spinner-grow spinner-grow-sm me-2" aria-hidden="true" />El libro está pensando...</div>
          )}
        </div>
        {error && <div className="alert alert-danger py-2 small mt-2 mb-0">{error}</div>}
        <form className="d-flex gap-2 mt-3" onSubmit={(e) => { e.preventDefault(); enviar(texto); }}>
          <textarea ref={inputRef} className="form-control" rows={1} maxLength={1000} placeholder="Escribe tu pregunta..." aria-label="Pregunta para el libro"
            value={texto} onChange={(e) => setTexto(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); enviar(texto); } }} />
          {ocupado
            ? <button className="btn btn-outline-secondary text-nowrap" type="button" onClick={() => stop()}>Detener</button>
            : <button className="btn btn-terracota text-nowrap" type="submit" disabled={!texto.trim()}>Enviar</button>}
        </form>
      </div>
    </section>
  );
}
