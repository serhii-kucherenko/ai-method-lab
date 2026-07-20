import { createApp } from "./app.js";
import { createStore } from "./store.js";

const port = Number(process.env.PORT ?? 3865);
const { server } = createApp(
  createStore({ dbPath: process.env.DB_PATH ?? "data/schedgate.db" }),
);
server.listen(port, "127.0.0.1", () => {
  console.log(JSON.stringify({ event: "listen", port, service: "schedgate" }));
});
