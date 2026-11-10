import { createServerFn } from "@tanstack/react-start";
import { getRequest } from "@tanstack/react-start/server";
import { z } from "zod";
import { buscarLibrosConIA } from "./buscar-libros.server";

export const buscarLibrosIA = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => z.object({ consulta: z.string().trim().min(2).max(200) }).parse(input))
  .handler(async ({ data }) => buscarLibrosConIA(data.consulta, getRequest().signal));
