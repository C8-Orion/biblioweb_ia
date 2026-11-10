import { createFileRoute } from "@tanstack/react-router";
import { handleChatLibro } from "@/lib/ai/chat-libro.server";

export const Route = createFileRoute("/api/chat-libro")({
  server: { handlers: { POST: ({ request }) => handleChatLibro(request) } },
});
