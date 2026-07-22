import { createApp } from "./app.js";

const port = Number(process.env.PORT ?? 8787);
const { server } = createApp({ dbPath: process.env.DB_PATH });
server.listen(port, () => {
  console.log(JSON.stringify({ event: "listen", product: "lesserof", port }));
});
