import { join } from "node:path";
import { mkdirSync } from "node:fs";
import { createApp } from "./app.js";
import { createStore } from "./store.js";

const port = Number(process.env.PORT ?? 3000);
const dataDir = join(process.cwd(), "data");
mkdirSync(dataDir, { recursive: true });
const dbPath = process.env.LAUNDRYLOOP_DB ?? join(dataDir, "laundryloop.db");
const { server } = createApp(createStore({ dbPath }));
server.listen(port, "127.0.0.1", () => {
  console.log(JSON.stringify({ event: "listen", port, dbPath }));
});
