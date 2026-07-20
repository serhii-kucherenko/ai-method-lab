import { join } from "node:path";
import { createApp } from "./app.js";
import { createStore } from "./store.js";

const port = Number(process.env.PORT ?? 3000);
const dbPath = process.env.CLEARPATH_DB ?? join(process.cwd(), "data", "clearpath.db");
const { server } = createApp(createStore({ dbPath }));
server.listen(port, () => {
  console.log(`Clearpath listening on http://127.0.0.1:${port}`);
});
