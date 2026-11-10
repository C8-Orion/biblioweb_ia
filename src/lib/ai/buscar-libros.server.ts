import { createOpenAI } from "@ai-sdk/openai";
import { NoObjectGeneratedError, Output, streamText } from "ai";
import { z } from "zod";
import { createLovableAiGatewayRunIdFetch } from "./run-id.server";

const libroSchema = z.object({
  titulo: z.string(),
  autor: z.string(),
  descripcion: z.string(),
  sinopsis: z.string(),
  anio: z.number().nullable(),
  editorial: z.string().nullable(),
  isbn: z.string().nullable(),
  categoria: z.enum(["Narrativa", "Tecnología", "Ciencia"]),
});
const schema = z.object({ opciones: z.array(libroSchema) });
export type OpcionLibroIA = z.infer<typeof libroSchema>;

export type ResultadoBusquedaIA = { opciones: OpcionLibroIA[]; error: string | null };

export async function buscarLibrosConIA(consulta: string, signal?: AbortSignal): Promise<ResultadoBusquedaIA> {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return { opciones: [], error: "La búsqueda con IA no está configurada." };
  const runIdFetch = createLovableAiGatewayRunIdFetch();
  const provider = createOpenAI({
    baseURL: "https://ai.gateway.lovable.dev/v1",
    apiKey,
    headers: { "Lovable-API-Key": apiKey, "X-Lovable-AIG-SDK": "vercel-ai-sdk" },
    fetch: runIdFetch.fetch,
  });
  try {
    const result = streamText({
      model: provider.responses("openai/gpt-6-astra"),
      instructions:
        "Eres un bibliotecario experto. Dado el texto de búsqueda, devuelve hasta 5 libros reales que mejor coincidan (distintas obras o ediciones relevantes). " +
        "Escribe en español. 'descripcion': 1-2 frases, máximo 200 caracteres. 'sinopsis': 2-4 frases. " +
        "Usa el año de la primera publicación. Da el ISBN-13 solo si estás seguro, si no null. " +
        "Categoría: Narrativa (ficción/literatura), Tecnología (informática/ingeniería) o Ciencia (resto de no ficción científica). " +
        "Si no existe ningún libro que coincida, devuelve una lista vacía. Nunca inventes libros.",
      messages: [{ role: "user", content: `Búsqueda: ${consulta}` }],
      output: Output.object({ schema }),
      ...(signal ? { abortSignal: signal } : {}),
      providerOptions: {
        openai: {
          forceReasoning: true,
          reasoningEffort: "low",
          reasoningSummary: "auto",
          store: false,
          include: ["reasoning.encrypted_content"],
        },
      },
    });
    const out = await result.output;
    const opciones = out.opciones.slice(0, 5).map((o) => ({ ...o, descripcion: o.descripcion.slice(0, 200) }));
    return { opciones, error: null };
  } catch (e) {
    if (NoObjectGeneratedError.isInstance(e)) return { opciones: [], error: "La IA no devolvió resultados válidos. Prueba otra búsqueda." };
    const status = (e as { statusCode?: number }).statusCode;
    console.error("buscarLibrosConIA", status, e);
    if (status === 429) return { opciones: [], error: "Demasiadas búsquedas seguidas. Espera un momento e inténtalo de nuevo." };
    if (status === 402) return { opciones: [], error: "Se agotaron los créditos de IA del espacio de trabajo." };
    return { opciones: [], error: "No se pudo completar la búsqueda con IA." };
  }
}
