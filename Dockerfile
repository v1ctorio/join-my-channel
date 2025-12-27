FROM denoland/deno:2.6.3

EXPOSE 8000

WORKDIR /app

USER deno

COPY deno.json deno.lock .
RUN deno install

COPY . .
RUN deno cache deno.ts


CMD ["deno", "task", "start"]