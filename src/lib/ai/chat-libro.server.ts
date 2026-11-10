import { convertToModelMessages, type UIMessage } from "ai";
import { z } from "zod";
import { createResponsesCall } from "./responses.server";

const bodySchema = z.object({
  messages: z.array(z.any()).min(1).max(60),
  libro: z.object({
    titulo: z.string().max(200),
    autor: z.string().max(200),
    anio: z.union([z.number(), z.string(), z.null()]).optional(),
    editorial: z.string().max(200).optional(),
    categoria: z.string().max(50).optional(),
    sinopsis: z.string().max(4000).optional(),
  }),
});

export async function handleChatLibro(request: Request) {
  const apiKey = process.env["LOVABLE_API_KEY"];
  if (!apiKey) return Response.json({ error: "El chat con IA no está configurado." }, { status: 500 });
  const parsed = bodySchema.safeParse(await request.json().catch(() => null));
  if (!parsed.success) return Response.json({ error: "Solicitud no válida." }, { status: 400 });
  const { messages, libro } = parsed.data;

  const instructions =
    `Eres "${libro.titulo}", el libro de ${libro.autor}${libro.anio ? ` (${libro.anio})` : ""}, conversando con un lector de la biblioteca BiblioWeb. ` +
    `Habla en primera persona como si fueras el libro, con un tono cálido y culto, en el idioma del lector (por defecto español). ` +
    `Ayuda con resúmenes, personajes, temas, contexto histórico, estilo y preguntas de estudio. Usa tu conocimiento real de la obra; ` +
    `si no la conoces bien, apóyate en la sinopsis y dilo con honestidad, sin inventar detalles. ` +
    `Avisa antes de revelar giros importantes del final si el lector no los ha pedido. Respuestas breves y claras, con markdown cuando ayude. ` +
    `Si te preguntan algo ajeno al libro, redirige amablemente la conversación a la obra.\n\n` +
    `Datos del catálogo — Editorial: ${libro.editorial || "desconocida"}. Categoría: ${libro.categoria || "-"}. Sinopsis: ${libro.sinopsis || "no registrada"}`;

  const call = createResponsesCall(
    request,
    { baseURL: "https://ai.gateway.lovable.dev/v1", apiKey, model: "openai/gpt-6-astra" },
    await convertToModelMessages(messages as UIMessage[]),
    instructions,
  );
  return call.response();
}
