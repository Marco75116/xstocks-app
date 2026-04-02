import { treaty } from "@elysiajs/eden";
import type { App } from "@/server/app";

const client = treaty<App>(
  typeof window === "undefined"
    ? `localhost:${process.env.PORT ?? 3000}`
    : window.location.origin,
);

export const api = client.api;
